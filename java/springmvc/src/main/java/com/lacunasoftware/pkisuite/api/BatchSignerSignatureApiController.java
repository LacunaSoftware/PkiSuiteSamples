package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCompleteResponse;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCreateRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchDocument;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchFlowItem;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
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
 *   - POST /create   : creates ONE document per file on Signer, each with its OWN two-step flow (the
 *                      batch signer at step 1, that document's second participant at step 2), and
 *                      returns the public-signature key of each one.
 *   - POST /start    : starts the public signature of one document and returns its to-sign hash,
 *                      digest algorithm and a token.
 *   - POST /complete : completes the public signature after Web PKI has signed the hash, returning
 *                      the Signer document id and the action URL of the participant we now wait for.
 */
@RestController
@RequestMapping("/api/batch-signer-signature")
public class BatchSignerSignatureApiController {

    // Limits of the batch. Adjust to your application's business logic. Enforcing them here (and not
    // only on the browser) is important: the client-side check is a convenience, not a control.
    private static final int MAX_FILES = 50;
    private static final long MAX_FILE_SIZE = 20L * 1024 * 1024; // 20 MB

    // Maximum number of concurrent calls to Signer. Each document of the batch needs its own "create
    // document" call (because each one has its own flow), so without concurrency a batch of 50
    // documents would be 50 sequential round trips. Tune according to your Signer plan / rate limits.
    private static final int MAX_CONCURRENT_CALLS = 10;

    // Whether Signer should notify the second participants by e-mail as soon as the documents are
    // created. Set to false while testing, so you don't mail real people on every run.
    private static final boolean NOTIFY_PARTICIPANTS = true;

    // The batch signer's email (the FIRST participant of every flow). On this sample it is a fixed
    // placeholder; the CPF and the name come from the certificate selected by the user on Web PKI
    // (see the create() action). On a real application this would be the logged-in user's e-mail.
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
    ) throws RestException {

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
     * This action is called by the batch signature page once the user has uploaded the files, told us
     * who signs each document second and selected a certificate on Web PKI.
     *
     * Each document gets its OWN flow with TWO signers, in order: the holder of the selected
     * certificate at step 1 (the one this batch signs for) and that document's own second participant
     * at step 2 (who Signer notifies and who signs later). This mirrors SignerSamples'
     * CreateDocumentWithTwoOrMoreSignersWithOrderScenario, with the participants coming from the
     * certificate and from the page instead of being hardcoded.
     *
     * Since the flow is defined PER creation request, we cannot create every document on a single
     * call as we would if they all shared the same flow: it is one call per document, and we run them
     * concurrently.
     *
     * Received as JSON (and not as form fields) because of the nested list of items.
     */
    @PostMapping("/create")
    public List<SignerBatchDocument> create(@RequestBody SignerBatchCreateRequest request, HttpSession session)
            throws RestException {

        List<SignerBatchFlowItem> flows = request.getFlows();
        if (flows == null || flows.isEmpty()) {
            throw new IllegalArgumentException("No document was informed for the batch");
        }

        // The first participant of every flow: the holder of the certificate selected on Web PKI.
        // Keep only the digits of the CPF, as that's what Signer expects.
        final String cpf = onlyDigits(request.getCpf());
        final String name = Util.isNullOrEmpty(request.getName()) ? "Signer Sample" : request.getName();
        if (cpf == null || cpf.length() != 11) {
            throw new IllegalArgumentException(
                    "The selected certificate does not have a valid CPF (ICP-Brasil certificate required)");
        }

        // Validate the whole batch BEFORE creating anything on Signer, so a typo on the last row
        // doesn't leave half of the documents created.
        for (SignerBatchFlowItem flow : flows) {
            if (StorageMock.getSignerUpload(session, flow.getFileRef()) == null) {
                throw new IllegalArgumentException("Unknown or already used file: " + flow.getFileRef());
            }
            if (Util.isNullOrEmpty(flow.getParticipantName())) {
                throw new IllegalArgumentException("Inform the name of the second signer of every document");
            }
            if (Util.isNullOrEmpty(flow.getParticipantEmail()) || !flow.getParticipantEmail().contains("@")) {
                throw new IllegalArgumentException(
                        "Inform a valid e-mail for the second signer of " + flow.getParticipantName());
            }
            String participantCpf = onlyDigits(flow.getParticipantCpf());
            if (participantCpf == null || participantCpf.length() != 11) {
                throw new IllegalArgumentException(
                        "Inform a valid CPF (11 digits) for " + flow.getParticipantName());
            }
            if (participantCpf.equals(cpf)) {
                throw new IllegalArgumentException(String.format(
                        "%s has the same CPF as the selected certificate: the second signer must be "
                                + "someone else", flow.getParticipantName()));
            }
        }

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // One task per document: create it with its own two-step flow and read the action URL of the
        // first participant. These are independent, so they run concurrently.
        List<Callable<SignerBatchDocument>> tasks = new ArrayList<>();
        for (SignerBatchFlowItem flow : flows) {
            final SignerBatchFlowItem item = flow;
            tasks.add(new Callable<SignerBatchDocument>() {
                @Override
                public SignerBatchDocument call() throws Exception {
                    return createFlowDocument(signerClient, session, item, name, cpf);
                }
            });
        }

        List<SignerBatchDocument> documents = runConcurrently(tasks);

        // The uploads became documents, so they can't be used again. We only discard them here (and
        // not while validating above) so that a failure before this point leaves the uploads intact
        // and the user can simply click "Sign Batch" again.
        for (SignerBatchFlowItem flow : flows) {
            StorageMock.removeSignerUpload(session, flow.getFileRef());
        }

        return documents;
    }

    /**
     * Creates ONE document on Signer with a two-step flow -- the batch signer at step 1 and this
     * document's second participant at step 2 -- and returns the public-signature "key" that allows
     * the batch signer to sign it without an authenticated Signer session.
     */
    private SignerBatchDocument createFlowDocument(
            SignerClient signerClient,
            HttpSession session,
            SignerBatchFlowItem item,
            String signerName,
            String signerCpf
    ) throws RestException {

        // 1. Recover the file this document is made of (uploaded by the "upload" action above). The
        // display name of the document is the original filename.
        UploadModel upload = StorageMock.getSignerUpload(session, item.getFileRef());
        if (upload == null) {
            throw new IllegalArgumentException("Unknown or already used file: " + item.getFileRef());
        }

        FileUploadModelBuilder fileBuilder = new FileUploadModelBuilder(upload);
        fileBuilder.setDisplayName(upload.getName());

        // 2. Define the two participants of THIS document's flow.
        //
        // Step 1: the holder of the certificate selected on Web PKI. Being step 1 is what makes it
        // possible for the batch to sign right now: were this participant on step 2, every "start"
        // call would fail because it wouldn't be their turn yet.
        ParticipantUserModel batchSigner = new ParticipantUserModel();
        batchSigner.setName(signerName);
        batchSigner.setEmail(SIGNER_EMAIL);
        batchSigner.setIdentifier(signerCpf);

        FlowActionCreateModel batchSignerAction = new FlowActionCreateModel();
        batchSignerAction.setType(FlowActionType.SIGNER);
        batchSignerAction.setUser(batchSigner);
        batchSignerAction.setStep(1);

        // Step 2: this document's own second participant, who Signer notifies and who signs later.
        ParticipantUserModel secondSigner = new ParticipantUserModel();
        secondSigner.setName(item.getParticipantName());
        secondSigner.setEmail(item.getParticipantEmail());
        secondSigner.setIdentifier(onlyDigits(item.getParticipantCpf()));

        FlowActionCreateModel secondSignerAction = new FlowActionCreateModel();
        secondSignerAction.setType(FlowActionType.SIGNER);
        secondSignerAction.setUser(secondSigner);
        secondSignerAction.setStep(2);

        // 3. Create the document. Notice that this call carries a SINGLE file: the flow is specific to
        // this document, so it can't be shared with the other files of the batch. (Were the flow the
        // same for every file, all of them could go on a single call -- and if you wanted them merged
        // into ONE document, you would set isEnvelope(true) and an envelopeName, PDF only.)
        CreateDocumentRequest documentRequest = new CreateDocumentRequest();
        documentRequest.setFiles(new ArrayList<>(Arrays.asList(fileBuilder.toModel())));
        documentRequest.setFlowActions(new ArrayList<>(Arrays.asList(batchSignerAction, secondSignerAction)));
        documentRequest.setDisablePendingActionNotifications(!NOTIFY_PARTICIPANTS);

        List<CreateDocumentResult> results = signerClient.createDocument(documentRequest);
        UUID documentId = results.get(0).getDocumentId();

        // 4. Get the action URL of the FIRST participant (the batch signer) and extract, from the
        // embed URL, the two values needed to sign publicly (without an authenticated Signer
        // session):
        // - the "key", which identifies the signature and goes on the start/complete calls;
        // - the "ticket", which authorizes the signature and must be sent on the "start" request.
        ActionUrlRequest actionUrlRequest = new ActionUrlRequest();
        actionUrlRequest.setEmailAddress(SIGNER_EMAIL);
        actionUrlRequest.setIdentifier(signerCpf);
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

        // Notice that we do NOT read the action URL of the second participant here: on an ordered
        // flow, Signer only hands out a participant's action URL when the turn is theirs, so at this
        // point it would fail. We do it on the complete() action, right after our signature.
        return new SignerBatchDocument(key, upload.getName(), item.getParticipantName());
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
     *
     * After it, the document holds the FIRST of its two signatures and remains pending until the
     * second participant signs.
     */
    @PostMapping("/complete")
    public SignerBatchCompleteResponse complete(SignerBatchCompleteRequest request, HttpSession session)
            throws RestException {

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Complete the public signature. We pass the signature computed by Web PKI (sent Base64
        // encoded) together with the token returned on the "start" step.
        CompleteSignatureRequest completeRequest = new CompleteSignatureRequest();
        completeRequest.setSignature(Base64.getDecoder().decode(request.getSignature()));
        completeRequest.setToken(request.getToken());
        signerClient.completePublicSignature(request.getId(), completeRequest);

        // Recover the Signer document id (UUID) so the page can show which document was signed. If
        // for some reason it isn't available, fall back to the public-signature key.
        String documentId = StorageMock.getSignerDocumentId(session, request.getId());
        if (documentId == null) {
            return new SignerBatchCompleteResponse(request.getId(), null);
        }

        // Our signature (step 1) is done, so it is now the second participant's turn -- which means
        // Signer will hand us THEIR action URL. We return it so the page can offer a link and you can
        // watch the flow finish without waiting for the notification e-mail.
        //
        // This is a convenience of the sample, not part of the signature flow: if Signer refuses it
        // for any reason, we simply don't show the link.
        String participantActionUrl = null;
        if (!Util.isNullOrEmpty(request.getParticipantEmail())) {
            try {
                ActionUrlRequest actionUrlRequest = new ActionUrlRequest();
                actionUrlRequest.setEmailAddress(request.getParticipantEmail());
                actionUrlRequest.setIdentifier(onlyDigits(request.getParticipantCpf()));
                participantActionUrl = signerClient
                        .getActionUrl(UUID.fromString(documentId), actionUrlRequest).getUrl();
            } catch (RestException ex) {
                // Ignored on purpose (see above).
            }
        }

        return new SignerBatchCompleteResponse(documentId, participantActionUrl);
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

    private static String onlyDigits(String value) {
        return value == null ? null : value.replaceAll("\\D", "");
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
