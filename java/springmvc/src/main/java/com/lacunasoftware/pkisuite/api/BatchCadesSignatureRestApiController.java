package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureStartRequest;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureStartResponse;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/batch-cades-signature-rest")
public class BatchCadesSignatureRestApiController {
    /**
     * POST /api/batch-cades-signature-rest/start/{fileId}
     *
     * This action is called asynchronously from the batch signature page in order to initiate the
     * signature of each document in the batch.
     */
    @PostMapping("/start/{fileId:.+}")
    public String start(
            @PathVariable int fileId
    ) throws IOException {

        // Get an instance of the CadesSignatureStarter2 class, responsible for receiving the
        // signature elements and start the signature process.
        CadesSignatureStarter2 signatureStarter = new CadesSignatureStarter2(Util.getRestPkiClient());

        // Set the signature policy.
        signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilAdrBasica);

        // Set the security context to be used to determine trust in the certificate chain. We have
        // encapsulated the security context choice on Util.java.
        signatureStarter.setSecurityContext(Util.getSecurityContextId());

        // Optionally, set whether the content should be encapsulated in the resulting CMS. If this
        // parameter is omitted or set to null, the following rules apply:
        // - If no CmsToCoSign is given, the resulting CMS will include the content;
        // - If a CmsToCoSign is given, the resulting CMS will include the content if and only if
        //   the CmsToCoSign also includes the content.
        signatureStarter.setEncapsulateContent(true);

        // Verify if the fileId exists and get the absolute path of the fileId.
        Path filePath = StorageMock.getBatchDocPath(fileId);

        // If the URL argument "userfile" is filled, it means the user was redirected here by
        // UploadController (signature with file uploaded by user). We'll set the path of the file
        // to be signed, which was saved in the temporary folder by UploadController (such a file
        // would normally come from your application's database).
        signatureStarter.setFileToSign(filePath);

        // If the URL argument "userfile" is filled, it means the user was redirected here by
        // UploadController (signature with file uploaded by user). We'll set the path of the file
        // to be signed, which was saved in the temporary folder by UploadController (such a file
        // would normally come from your application's database).
        ///signatureStarter.setFileToSign(filePath);
        // Call the startWithWebPki() method, which initiates the signature. This yields a
        // SignatureStartWithWebPkiResult object containing the signer certificate and the token,
        // a 43-character case-sensitive URL-safe string, which identifies this signature process.
        // We'll use this value to call the signWithRestPki() method on the Web PKI component
        // (see file signature-form.js) and also to complete the signature after the form is
        // submitted (see method complete() below). This should not be mistaken with the API access
        // token.
        SignatureStartWithWebPkiResult result;

        try{
            result = signatureStarter.startWithWebPki();
            return result.getToken();
        }catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }

    }

    /**
     * POST /cades-signature-rest
     *
     * This action receives the form submission from the signature page. We'll call REST PKI to
     * complete the signature.
     */
    @PostMapping("/complete/{token:.+}")
    public String complete(@PathVariable String token)
            throws IOException, RestException {

        // Get an instance the CadesSignatureFinisher2 class, responsible for completing the
        // signature process.
        CadesSignatureFinisher2 signatureFinisher = new CadesSignatureFinisher2(Util.getRestPkiClient());

        // Set the token for this signature (rendered in a hidden input field, see file
        // templates/cades-signature.html).
        signatureFinisher.setToken(token);

        // Call the finish() method, which finalizes the signature process and returns a
        // SignatureResult object.
        SignatureResult signatureResult = signatureFinisher.finish();

        // The "certificate" field of the SignatureResult object contains information about the
        // certificate used by the user to sign the file.
        PKCertificate signerCert = signatureResult.getCertificate();

        // At this point, you'd typically store the CMS on your database. For demonstration purposes,
        // we'll store the CMS on our StorageMock class.

        // The SignatureResult object has various methods for writing the signature file to a stream
        // (writeTo()), local file (writeToFile()), open a stream to read the content (openRead())
        // and get its contents (getContent()). For large files, avoid the method GetContent() to
        // avoid memory allocation issues.
        String cmsFile;
        try (InputStream resultStream = signatureResult.openRead()) {
            cmsFile = StorageMock.store(resultStream, "p7s");
        }

        return cmsFile;
    }

}
