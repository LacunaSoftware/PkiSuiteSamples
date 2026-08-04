package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCreateRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchDocument;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchStartRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchStartResponse;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchUploadedFile;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
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
 *   - POST /upload   : receives the files chosen by the user and forwards each one to Signer's
 *                      upload API, returning one reference per file. Nothing is created yet.
 *   - POST /create   : creates the documents on Signer from those uploads (for the selected
 *                      certificate's CPF) and returns their public-signature keys.
 *   - POST /start    : starts the public signature of one document and returns its to-sign hash,
 *                      digest algorithm and a token.
 *   - POST /complete : completes the public signature after Web PKI has signed the hash, returning
 *                      the Signer document id.
 */
@RestController
@RequestMapping("/api/batch-signer-signature")
public class BatchSignerSignatureApiController {

    // Limits of the batch. Adjust to your application's business logic. Enforcing them here (and not
    // only on the browser) is important: the client-side check is a convenience, not a control.
    private static final int MAX_FILES = 50;
    private static final long MAX_FILE_SIZE = 20L * 1024 * 1024; // 20 MB

    // Maximum number of concurrent calls to Signer. Uploading the files (and later reading the
    // action URLs) in parallel is much faster than sequentially, since most of the time is spent
    // waiting on Signer's HTTP responses; tune this value according to your Signer plan / rate
    // limits.
    private static final int MAX_CONCURRENT_CALLS = 10;

    // The signer's email. On this sample it is a fixed placeholder; the CPF and the name come from
    // the certificate selected by the user on Web PKI (see the create() action).
    private static final String SIGNER_EMAIL = "signer.sample@mailinator.com";

    // Patterns used to extract the document "key" and the "ticket" from the embed URL returned by
    // Signer (e.g. https://signer.../document/key/AbCd1234.../sign-embedded?ticket=<guid>).
    private static final Pattern KEY_PATTERN = Pattern.compile("/key/([^/?]+)");
    private static final Pattern TICKET_PATTERN = Pattern.compile("[?&]ticket=([^&]+)");

    /**
     * POST /api/batch-signer-signature/upload
     *
     * This action is called by the batch signature page as soon as the user chooses the files to be
     * signed (the user may add as many files as wanted, in as many rounds as wanted). Each file is
     * forwarded to Signer's upload API, which stores it temporarily and returns an upload id.
     *
     * Notice that NO document is created here: at this point we don't even know who the signer is
     * (that comes from the certificate the user selects afterwards). Uploading and creating are two
     * separate steps on Signer's API precisely because of that.
     */
    @PostMapping("/upload")
    public List<SignerBatchUploadedFile> upload(
            @RequestParam("userfiles") MultipartFile[] userfiles,
            HttpSession session
    ) throws IOException, RestException {

        if (userfiles == null || userfiles.length == 0) {
            throw new IllegalArgumentException("No file was uploaded");
        }
        if (userfiles.length > MAX_FILES) {
            throw new IllegalArgumentException(String.format("The batch is limited to %d files", MAX_FILES));
        }

        // Validate every file BEFORE uploading anything, so we don't leave half of the batch on
        // Signer if the last file is rejected.
        for (MultipartFile userfile : userfiles) {
            String filename = userfile.getOriginalFilename();
            if (userfile.isEmpty() || filename == null || !filename.toLowerCase().endsWith(".pdf")) {
                throw new IllegalArgumentException("Only PDF files can be signed on this sample: " + filename);
            }
            if (userfile.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("File is too large: " + filename);
            }
        }

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Signer's upload API takes ONE file per call (POST /api/uploads), so this is the only
        // per-file round trip of the whole flow. We do them concurrently.
        List<Callable<SignerBatchUploadedFile>> tasks = new ArrayList<>();
        for (MultipartFile userfile : userfiles) {
            final MultipartFile file = userfile;
            tasks.add(new Callable<SignerBatchUploadedFile>() {
                @Override
                public SignerBatchUploadedFile call() throws Exception {

                    // Stream the file straight to Signer, without storing it on our server. The
                    // returned UploadModel carries the upload id that identifies the file on Signer.
                    UploadModel upload;
                    try (InputStream stream = file.getInputStream()) {
                        upload = signerClient.uploadFile(file.getOriginalFilename(), stream, file.getContentType());
                    }

                    // The upload response only guarantees the id, so we fill in the name and the
                    // content type ourselves: the document creation request needs all three.
                    upload.setName(file.getOriginalFilename());
                    upload.setContentType(file.getContentType());

                    // Keep the upload on the server side, associated with an opaque reference that we
                    // hand to the page. That way the page doesn't need to be trusted with (nor send
                    // back) Signer upload ids.
                    String fileRef = UUID.randomUUID().toString();
                    StorageMock.setSignerUpload(session, fileRef, upload);

                    return new SignerBatchUploadedFile(fileRef, file.getOriginalFilename());
                }
            });
        }

        return runConcurrently(tasks);
    }

    /**
     * POST /api/batch-signer-signature/create
     *
     * This action is called by the batch signature page once the user selects a certificate on Web
     * PKI and clicks "Sign Batch". It creates, on Signer, one document per uploaded file for a
     * signer whose CPF is the one of the selected certificate (so the public signature won't fail
     * with "CpfMismatch") and returns the key of each created document, which will compose the batch.
     */
    @PostMapping("/create")
    public List<SignerBatchDocument> create(SignerBatchCreateRequest request, HttpSession session)
            throws RestException {

        List<String> fileRefs = request.getFileRefs();
        if (fileRefs == null || fileRefs.isEmpty()) {
            throw new IllegalArgumentException("No file was uploaded for the batch");
        }

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Keep only the digits of the CPF, as that's what Signer expects.
        String cpf = request.getCpf() == null ? null : request.getCpf().replaceAll("\\D", "");
        String name = Util.isNullOrEmpty(request.getName()) ? "Signer Sample" : request.getName();

        // 1. Recover the uploads made by the "upload" action and build the list of files of the
        // creation request. The display name of each document is the original filename.
        List<FileUploadModel> files = new ArrayList<>();
        Map<String, String> namesByUploadId = new HashMap<>();
        for (String fileRef : fileRefs) {

            UploadModel upload = StorageMock.getSignerUpload(session, fileRef);
            if (upload == null) {
                throw new IllegalArgumentException("Unknown or already used file: " + fileRef);
            }

            FileUploadModelBuilder fileBuilder = new FileUploadModelBuilder(upload);
            fileBuilder.setDisplayName(upload.getName());
            files.add(fileBuilder.toModel());
            namesByUploadId.put(upload.getId(), upload.getName());
        }

        // 2. Define the participant (signer) and the flow action. The CPF is the one of the
        // certificate selected by the user, so the public signature will match.
        ParticipantUserModel user = new ParticipantUserModel();
        user.setName(name);
        user.setEmail(SIGNER_EMAIL);
        user.setIdentifier(cpf);

        FlowActionCreateModel flowAction = new FlowActionCreateModel();
        flowAction.setType(FlowActionType.SIGNER);
        flowAction.setUser(user);

        // 3. Create ALL the documents on a SINGLE call. Signer creates one document per file of the
        // request, all of them sharing the same flow (the signer defined above), and returns one
        // result per file with the upload id it came from, so we know which document is which. If
        // instead you wanted the files merged into ONE document, you would set isEnvelope(true) and
        // an envelopeName (PDF only) -- but then there would be a single document to sign, not a
        // batch.
        CreateDocumentRequest documentRequest = new CreateDocumentRequest();
        documentRequest.setFiles(files);
        documentRequest.setFlowActions(Collections.singletonList(flowAction));

        List<CreateDocumentResult> results = signerClient.createDocument(documentRequest);

        // The uploads became documents, so they can't be used again. We only discard them here (and
        // not while building the list above) so that a failure before this point leaves the uploads
        // intact and the user can simply click "Sign Batch" again.
        for (String fileRef : fileRefs) {
            StorageMock.removeSignerUpload(session, fileRef);
        }

        // 4. For each created document, get the action URL of the participant and extract, from the
        // embed URL, the two values needed to sign publicly (without an authenticated Signer
        // session):
        // - the "key", which identifies the signature and goes on the start/complete calls;
        // - the "ticket", which authorizes the signature and must be sent on the "start" request.
        // These are independent calls, so we do them concurrently as well.
        List<Callable<SignerBatchDocument>> tasks = new ArrayList<>();
        for (CreateDocumentResult result : results) {
            final UUID documentId = result.getDocumentId();
            final String documentName = namesByUploadId.get(result.getUploadId());
            tasks.add(new Callable<SignerBatchDocument>() {
                @Override
                public SignerBatchDocument call() throws Exception {

                    ActionUrlRequest actionUrlRequest = new ActionUrlRequest();
                    actionUrlRequest.setEmailAddress(SIGNER_EMAIL);
                    actionUrlRequest.setIdentifier(cpf);
                    ActionUrlResponse actionUrlResponse = signerClient.getActionUrl(documentId, actionUrlRequest);

                    String embedUrl = actionUrlResponse.getEmbedUrl();
                    String key = extractGroup(KEY_PATTERN, embedUrl, "key");
                    String ticket = extractGroup(TICKET_PATTERN, embedUrl, "ticket");

                    // Store the ticket (needed by the "start" action) and the document id (shown to
                    // the user on "complete"), both associated with the key. We use the HTTP session
                    // here just for the sake of the sample; on a real application you would keep this
                    // association wherever fits your business logic. This is the same approach used
                    // by StorageMock for the verification codes.
                    StorageMock.setSignerTicket(session, key, ticket);
                    StorageMock.setSignerDocumentId(session, key, documentId.toString());

                    return new SignerBatchDocument(key, documentName);
                }
            });
        }

        return runConcurrently(tasks);
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
     * Runs the given tasks on a small thread pool and returns their results, in the same order as
     * the tasks. Used to parallelize the (independent) per-file calls to Signer.
     */
    private static <T> List<T> runConcurrently(List<Callable<T>> tasks) throws RestException {

        int threads = Math.min(MAX_CONCURRENT_CALLS, Math.max(1, tasks.size()));
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        try {
            List<Future<T>> futures = new ArrayList<>();
            for (Callable<T> task : tasks) {
                futures.add(pool.submit(task));
            }
            List<T> results = new ArrayList<>();
            for (Future<T> future : futures) {
                results.add(future.get());
            }
            return results;
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(ex);
        } catch (ExecutionException ex) {
            Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
            if (cause instanceof RestException) {
                throw (RestException) cause;
            }
            if (cause instanceof RuntimeException) {
                throw (RuntimeException) cause;
            }
            throw new RuntimeException(cause);
        } finally {
            pool.shutdown();
        }
    }

    private static String extractGroup(Pattern pattern, String embedUrl, String what) {
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
