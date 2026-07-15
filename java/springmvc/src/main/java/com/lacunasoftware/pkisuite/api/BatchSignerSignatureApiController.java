package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCreateRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchStartRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchStartResponse;
import com.lacunasoftware.pkisuite.util.SampleDocs;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.signer.FileUploadModel;
import com.lacunasoftware.signer.FlowActionType;
import com.lacunasoftware.signer.documents.ActionUrlRequest;
import com.lacunasoftware.signer.documents.ActionUrlResponse;
import com.lacunasoftware.signer.documents.CreateDocumentRequest;
import com.lacunasoftware.signer.documents.CreateDocumentResult;
import com.lacunasoftware.signer.flowactions.FlowActionCreateModel;
import com.lacunasoftware.signer.javaclient.PublicStartSignatureRequest;
import com.lacunasoftware.signer.javaclient.SignerClient;
import com.lacunasoftware.signer.javaclient.builders.FileUploadModelBuilder;
import com.lacunasoftware.signer.javaclient.exceptions.RestException;
import com.lacunasoftware.signer.javaclient.models.UploadModel;
import com.lacunasoftware.signer.javaclient.requests.CompleteSignatureRequest;
import com.lacunasoftware.signer.javaclient.responses.StartSignatureResponse;
import com.lacunasoftware.signer.users.ParticipantUserModel;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * API actions for the Batch Signer Signature sample, called asynchronously by
 * batch-signature-signer-form.js. See BatchSignerSignatureController for the overall flow.
 *
 *   - POST /create   : creates the batch of documents on Signer (for the selected certificate's
 *                      CPF) and returns their public-signature keys. Documents are created
 *                      concurrently to speed up the batch.
 *   - POST /start    : starts the public signature of one document and returns its to-sign hash,
 *                      digest algorithm and a token.
 *   - POST /complete : completes the public signature after Web PKI has signed the hash, returning
 *                      the Signer document id.
 */
@RestController
@RequestMapping("/api/batch-signer-signature")
public class BatchSignerSignatureApiController {

    // Number of documents that will compose the batch. It is up to your application's business
    // logic to determine which/how many documents will be signed.
    private static final int DOCUMENT_COUNT = 10;

    // Maximum number of documents created concurrently on Signer. Creating them in parallel is much
    // faster than sequentially; tune this value according to your Signer plan / rate limits.
    private static final int MAX_CONCURRENT_CREATIONS = 10;

    // The signer's email. On this sample it is a fixed placeholder; the CPF and the name come from
    // the certificate selected by the user on Web PKI (see the create() action).
    private static final String SIGNER_EMAIL = "signer.sample@mailinator.com";

    // Patterns used to extract the document "key" and the "ticket" from the embed URL returned by
    // Signer (e.g. https://signer.../document/key/AbCd1234.../sign-embedded?ticket=<guid>).
    private static final Pattern KEY_PATTERN = Pattern.compile("/key/([^/?]+)");
    private static final Pattern TICKET_PATTERN = Pattern.compile("[?&]ticket=([^&]+)");

    /**
     * POST /api/batch-signer-signature/create
     *
     * This action is called by the batch signature page once the user selects a certificate on Web
     * PKI. It creates the documents on Signer for a signer whose CPF is the one of the selected
     * certificate (so the public signature won't fail with "CpfMismatch") and returns the keys of
     * the created documents, which will compose the batch.
     */
    @PostMapping("/create")
    public List<String> create(SignerBatchCreateRequest request, HttpSession session)
            throws IOException, RestException {

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Keep only the digits of the CPF, as that's what Signer expects.
        String cpf = request.getCpf() == null ? null : request.getCpf().replaceAll("\\D", "");
        String name = Util.isNullOrEmpty(request.getName()) ? "Signer Sample" : request.getName();

        // Each document is independent, so we create them concurrently on a small thread pool. This
        // is much faster than doing it sequentially, since most of the time is spent waiting on
        // Signer's HTTP responses (upload + create + action URL of each document).
        int threads = Math.min(MAX_CONCURRENT_CREATIONS, Math.max(1, DOCUMENT_COUNT));
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        try {
            List<Future<String>> futures = new ArrayList<>();
            for (int i = 1; i <= DOCUMENT_COUNT; i++) {
                final int index = i;
                futures.add(pool.submit(() -> createDocumentForSigning(signerClient, session, index, cpf, name)));
            }
            List<String> documentKeys = new ArrayList<>();
            for (Future<String> future : futures) {
                documentKeys.add(future.get());
            }
            return documentKeys;
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(ex);
        } catch (ExecutionException ex) {
            Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
            if (cause instanceof RestException) {
                throw (RestException) cause;
            }
            if (cause instanceof IOException) {
                throw (IOException) cause;
            }
            throw new RuntimeException(cause);
        } finally {
            pool.shutdown();
        }
    }

    /**
     * POST /api/batch-signer-signature/start
     *
     * This action is called asynchronously from the batch signature page in order to initiate the
     * public signature of each document on Signer. It returns the "to-sign hash" that must be
     * signed on the client-side by Web PKI.
     */
    @PostMapping("/start")
    public SignerBatchStartResponse start(SignerBatchStartRequest request, HttpSession session)
            throws RestException {

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Recover the ticket associated with this document key. It was stored when the documents
        // were created (see create()) and authorizes the public signature.
        String ticket = StorageMock.getSignerTicket(session, request.getId());

        // Start the public signature. We pass the certificate selected by the user (sent Base64
        // encoded by Web PKI) so that Signer can build the correct "to-sign hash", together with
        // the ticket that authorizes it.
        PublicStartSignatureRequest startRequest = new PublicStartSignatureRequest();
        startRequest.setCertificate(Base64.getDecoder().decode(request.getCertContent()));
        startRequest.setTicket(ticket);

        // The document "key" is used to identify the public signature. Receive as response a
        // StartSignatureResponse containing:
        // - toSignHash: the hash to be signed (raw bytes);
        // - digestAlgorithm: the digest algorithm that will inform the Web PKI component how to
        //   compute the signature;
        // - token: a token that identifies this signature process, needed on the "complete" step.
        StartSignatureResponse result = signerClient.startPublicSignature(request.getId(), startRequest);

        // Return the fields needed on the JavaScript and on the complete() action. Notice that the
        // to-sign hash is Base64 encoded so it can travel as JSON and be consumed by Web PKI.
        SignerBatchStartResponse res = new SignerBatchStartResponse();
        res.setToSignHash(Base64.getEncoder().encodeToString(result.getToSignHash()));
        // Signer returns the digest algorithm as an OID (e.g. 2.16.840.1.101.3.4.2.1), but Web PKI's
        // signHash expects the algorithm name (e.g. "SHA-256"), so we normalize it here.
        res.setDigestAlgorithm(toWebPkiDigestAlgorithm(result.getDigestAlgorithm()));
        res.setToken(result.getToken());
        return res;
    }

    /**
     * POST /api/batch-signer-signature/complete
     *
     * This action is called asynchronously from the batch signature page, once Web PKI has signed
     * the "to-sign hash", in order to complete the public signature on Signer.
     */
    @PostMapping("/complete")
    public String complete(SignerBatchCompleteRequest request, HttpSession session) throws RestException {

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Complete the public signature. We pass the signature computed by Web PKI (sent Base64
        // encoded) together with the token returned on the "start" step.
        CompleteSignatureRequest completeRequest = new CompleteSignatureRequest();
        completeRequest.setSignature(Base64.getDecoder().decode(request.getSignature()));
        completeRequest.setToken(request.getToken());
        signerClient.completePublicSignature(request.getId(), completeRequest);

        // Return the Signer document id (UUID) so the page can show which document was signed. If
        // for some reason it isn't available, fall back to the public-signature key.
        String documentId = StorageMock.getSignerDocumentId(session, request.getId());
        return documentId != null ? documentId : request.getId();
    }

    /**
     * Creates a single document on Signer with a signer participant (identified by the given CPF)
     * and returns the public-signature "key" that allows signing it without an authenticated Signer
     * session. The ticket needed to start the signature (and the document id) are stored on the
     * session, associated with the key. This method is called concurrently, once per document.
     */
    private String createDocumentForSigning(SignerClient signerClient, HttpSession session, int index,
            String cpf, String name) throws IOException, RestException {

        // 1. Upload the file that will be signed. In this sample every document uses the same bundled
        // PDF, but in a real scenario each document would typically be a different file uploaded here.
        byte[] content = Files.readAllBytes(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_PDF));
        UploadModel uploadModel = signerClient.uploadFile("SamplePdf.pdf", content, "application/pdf");

        FileUploadModelBuilder fileBuilder = new FileUploadModelBuilder(uploadModel);
        fileBuilder.setDisplayName(String.format("Batch Signer Signature Sample %02d", index));

        // 2. Define the participant (signer) and the flow action. The CPF is the one of the
        // certificate selected by the user, so the public signature will match.
        ParticipantUserModel user = new ParticipantUserModel();
        user.setName(name);
        user.setEmail(SIGNER_EMAIL);
        user.setIdentifier(cpf);

        FlowActionCreateModel flowAction = new FlowActionCreateModel();
        flowAction.setType(FlowActionType.SIGNER);
        flowAction.setUser(user);

        // 3. Create the document.
        CreateDocumentRequest documentRequest = new CreateDocumentRequest();
        documentRequest.setFiles(new ArrayList<FileUploadModel>() {{
            add(fileBuilder.toModel());
        }});
        documentRequest.setFlowActions(new ArrayList<FlowActionCreateModel>() {{
            add(flowAction);
        }});

        List<CreateDocumentResult> results = signerClient.createDocument(documentRequest);
        UUID documentId = results.get(0).getDocumentId();

        // 4. Get the action URL for the participant and extract, from the embed URL, the two values
        // needed to sign publicly (without an authenticated Signer session):
        // - the "key", which identifies the signature and goes on the URL of the start/complete calls;
        // - the "ticket", which authorizes the signature and must be sent on the "start" request.
        ActionUrlRequest actionUrlRequest = new ActionUrlRequest();
        actionUrlRequest.setEmailAddress(SIGNER_EMAIL);
        actionUrlRequest.setIdentifier(cpf);
        ActionUrlResponse actionUrlResponse = signerClient.getActionUrl(documentId, actionUrlRequest);

        String embedUrl = actionUrlResponse.getEmbedUrl();
        String key = extractGroup(KEY_PATTERN, embedUrl, "key");
        String ticket = extractGroup(TICKET_PATTERN, embedUrl, "ticket");

        // Store the ticket (needed by the "start" action) and the document id (shown to the user on
        // "complete"), both associated with the key. We use the HTTP session here just for the sake
        // of the sample; on a real application you would keep this association wherever fits your
        // business logic. This is the same approach used by StorageMock for the verification codes.
        StorageMock.setSignerTicket(session, key, ticket);
        StorageMock.setSignerDocumentId(session, key, documentId.toString());

        return key;
    }

    private String extractGroup(Pattern pattern, String embedUrl, String what) {
        Matcher matcher = pattern.matcher(embedUrl);
        if (matcher.find()) {
            return matcher.group(1);
        }
        throw new IllegalArgumentException("Could not extract " + what + " from URL: " + embedUrl);
    }

    /**
     * Converts a digest algorithm OID returned by Signer into the algorithm name expected by Web
     * PKI's signHash method. If the value is already a name (not an OID), it is returned unchanged.
     */
    private static String toWebPkiDigestAlgorithm(String digestAlgorithm) {
        if (digestAlgorithm == null) {
            return null;
        }
        switch (digestAlgorithm) {
            case "1.3.14.3.2.26":
                return "SHA-1";
            case "2.16.840.1.101.3.4.2.1":
                return "SHA-256";
            case "2.16.840.1.101.3.4.2.2":
                return "SHA-384";
            case "2.16.840.1.101.3.4.2.3":
                return "SHA-512";
            default:
                // Not a known OID (likely already an algorithm name); pass it through as-is.
                return digestAlgorithm;
        }
    }
}
