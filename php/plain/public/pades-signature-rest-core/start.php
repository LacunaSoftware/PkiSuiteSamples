<?php

/**
 * This file is called when the user presses the "Sign File" button on index.php, after Web PKI has
 * read the chosen certificate (see method startSignature() on scripts/signature-start-form.js). It
 * asks REST PKI Core to prepare the signature and renders a page that signs the resulting hash with
 * Web PKI.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\ApiRoutes;

try {
    // Only accepts POST requests.
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Get URL parameter "fileId" and verify that it corresponds to an existing file.
    $fileToSign = !empty($_GET['fileId']) ? $_GET['fileId'] : null;
    if (!StorageMock::exists($fileToSign)) {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Recover variables from the POST arguments to be used on this step.
    $certThumb = !empty($_POST['certThumb']) ? $_POST['certThumb'] : null;
    $certContent = !empty($_POST['certContent']) ? $_POST['certContent'] : null;

    // Build the request to prepare the signature. Its fields follow the PrepareSignatureRequest
    // model of the REST PKI Core API (see https://core.pki.rest/swagger).
    $request = [

        // The PDF to be signed, Base64-encoded.
        'file' => [
            'content' => base64_encode(StorageMock::read($fileToSign)),
            'contentType' => 'application/pdf',
            'name' => StorageMock::retrieveFilename($fileToSign),
        ],

        // The signer's certificate, Base64-encoded, as read by Web PKI on the previous page.
        'certificate' => [
            'content' => $certContent,
        ],

        'signatureType' => 'Pdf',

        // The security context determines which root certification authorities are trusted when
        // REST PKI Core validates the signer's certificate (see Util.php).
        'securityContextId' => Util::getSecurityContextId(),

        'pdfSignatureOptions' => [
            'visualRepresentation' => [
                'text' => [
                    // For a full list of the supported tags, see:
                    // https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
                    'text' => 'Signed by {{name}} ({{national_id}})',
                    'fontSize' => 13.0,
                    // Specify that the signing time should also be rendered.
                    'includeSigningTime' => true,
                    // Optionally set the horizontal alignment of the text ('Left' or 'Right'), if
                    // not set the default is Left.
                    'horizontalAlign' => 'Left',
                    // Optionally set the container within the signature rectangle on which to
                    // place the text. By default, the text can occupy the entire rectangle.
                    'container' => [
                        'left' => 0.2,
                        'top' => 0.2,
                        'right' => 0.2,
                        'bottom' => 0.2,
                    ],
                ],
                'image' => [
                    // We'll use as background the image resources/PdfStamp.png.
                    'resource' => [
                        'content' => base64_encode(StorageMock::getPdfStampContent()),
                        'mimeType' => 'image/png',
                    ],
                    // Align the image to the right.
                    'horizontalAlign' => 'Right',
                    // Align the image to the center.
                    'verticalAlign' => 'Center',
                ],
                // Position the signatures side by side at the bottom of the last page. These are
                // the values of REST PKI Core's "footnote" preset, with a larger rectangle to fit
                // the background image.
                'position' => [
                    'pageNumber' => -1,
                    'measurementUnits' => 'Centimeters',
                    'auto' => [
                        'container' => [
                            'left' => 1.0,
                            'right' => 1.0,
                            'bottom' => 1.0,
                            'height' => 4.94,
                        ],
                        'signatureRectangleSize' => [
                            'width' => 8.0,
                            'height' => 4.94,
                        ],
                        'rowSpacing' => 0.3,
                    ],
                ],
            ],
        ],
    ];

    // Call REST PKI Core to prepare the signature. The PHP client library has no method for this
    // call, so we make it with the library's REST client, which sends the API key, encodes the
    // request as JSON and throws an exception if REST PKI Core returns an error.
    $client = Util::getRestPkiCoreClient();
    $response = $client->getRestClient()->post(ApiRoutes::SIGNATURE, $request)->getBodyAsJson();

    // REST PKI Core validates the signer's certificate before preparing the signature. If the
    // certificate is not valid or not trusted, "success" is false and "validationResults" says
    // why.
    if (!$response->success) {
        $details = '';
        if (!empty($response->validationResults->errors)) {
            $details = ': ' . implode('; ', array_map(function ($item) {
                return $item->message;
            }, $response->validationResults->errors));
        }
        throw new \Exception("The signature could not be prepared ({$response->failure}){$details}");
    }

    // Render the fields below as hidden fields, to be used on the javascript or on the "complete"
    // step:
    // - $toSignHash: the hash to be signed by Web PKI, Base64-encoded.
    // - $digestAlgorithm: the OID of the digest algorithm, which Web PKI needs to sign the hash.
    // - $state: data that REST PKI Core needs to complete the signature, which we pass back to it
    //   on the "complete" step.
    $toSignHash = $response->toSign->hash;
    $digestAlgorithm = $response->toSign->signatureAlgorithm->digestAlgorithmOid;
    $state = $response->state;

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <div id="messagesPanel"></div>

        <h2 class="ls-title">PAdES Signature with REST PKI Core</h2>

        <div class="ls-content">
            <form id="signForm" action="pades-signature-rest-core/complete.php?fileId=<?= $fileToSign ?>" method="POST">

                <?php
                // Hidden fields used to pass data from the server-side to the
                // javascript and vice-versa.
                ?>
                <input type="hidden" id="certThumbField" name="certThumb" value="<?= $certThumb ?>">
                <input type="hidden" id="toSignHashField" name="toSignHash" value="<?= $toSignHash ?>">
                <input type="hidden" id="digestAlgorithmField" name="digestAlgorithm" value="<?= $digestAlgorithm ?>">
                <input type="hidden" id="stateField" name="state" value="<?= $state ?>">
                <input type="hidden" id="signatureField" name="signature">

                <a id="tryAgainButton" class="btn btn-primary" href="/pades-signature-rest-core?fileId=<?= $fileToSign ?>">Try Again</a>
            </form>
        </div>
    </div>

    <?php include '../shared/scripts.php' ?>

    <?php
    // The file below contains the JS lib for accessing the Web PKI component. For
    // more information, see: https://webpki.lacunasoftware.com/#/Documentation
    ?>
    <script type="text/javascript" src="https://cdn.lacunasoftware.com/libs/web-pki/lacuna-web-pki-2.14.0.min.js"
            integrity="sha256-m0Wlj4Pp61wsYSB4ROM/W5RMnDyTpqXTJCOYPBNm300="
            crossorigin="anonymous"></script>

    <?php
    // The file below contains the logic for calling the Web PKI component. It is
    // only an example, feel, free to alter it to meet your application's needs. You
    // can also bring the code into the javascript block below if you prefer.
    ?>
    <script src="scripts/signature-complete-form.js"></script>

    <script>
        $(document).ready(function () {
            // Once the page is ready, we call the init() function on the javascript
            // code (see signature-complete-form.js).
            signatureCompleteForm.init({
                form: $('#signForm'),                              // The form that should be submitted when the operation is complete.
                certThumbField: $('#certThumbField'),              // The "certThumb" field.
                toSignHashField: $('#toSignHashField'),            // The "toSignHash" field.
                digestAlgorithmField: $('#digestAlgorithmField'),  // The "digestAlgorithm" field.
                signatureField: $('#signatureField')               // The "signature" field.
            });
        });
    </script>

    </body>
    </html>
<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>
