package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCompleteResponse;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchCreateRequest;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchDocument;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchFlowItem;
import com.lacunasoftware.pkisuite.api.model.signer.SignerBatchPendingDocument;
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
import com.lacunasoftware.signer.documents.DocumentFlowEditRequest;
import com.lacunasoftware.signer.documents.DocumentModel;
import com.lacunasoftware.signer.flowactions.FlowActionCreateModel;
import com.lacunasoftware.signer.flowactions.FlowActionModel;
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
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
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
 *   - POST /create   : creates ONE document per file on Signer, each with its OWN flow, and returns
 *                      the public-signature key of each one. Only the batch signer's flow action
 *                      (step 1) is created here, with notifications off.
 *   - POST /start    : starts the public signature of one document and returns its to-sign hash,
 *                      digest algorithm and a token. Refuses a certificate other than the one the
 *                      documents were created for.
 *   - POST /complete : adds the second participant to the flow, completes the public signature that
 *                      Web PKI computed and only then notifies that participant, returning the
 *                      Signer document id and their action URL.
 *   - POST /abort    : deletes the documents of a batch that was abandoned before being signed.
 *
 * The split between "create" and "complete" is deliberate. Signer can only produce a to-sign hash
 * for a document that already exists, so the document is necessarily created before we sign it. If
 * the whole flow were created upfront, anything that interrupts the batch in between -- a page
 * reload, a change of certificate, a closed tab -- would leave on Signer a document pending TWO
 * actions, bound to a certificate the user may no longer be using, with the second participant
 * already invited to sign something that was never signed. Creating the second participant only
 * after our signature, keeping the certificate fixed for the whole batch and deleting what was
 * abandoned turns that window into a harmless one.
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

    // >>>>> THE POINT OF THIS SAMPLE'S FLOW <<<<<
    //
    // Signer can only produce the "to-sign hash" of a document that already exists, so between
    // "create" and "complete" there is inevitably a window in which the document is on Signer and
    // our signature is not. What we CAN choose is what sits inside that window.
    //
    // With DEFER_SECOND_PARTICIPANT = true the document is created with a SINGLE flow action (ours,
    // step 1) and no notifications. The second participant's flow action is only added by the
    // "complete" action -- right before completing the signature, which is what keeps Signer from
    // concluding a document that still needs a second signer (see complete()). If the user reloads
    // the page, closes the tab or picks another certificate in the middle of the batch, what is left
    // behind is a document with one pending action that nobody was told about -- not a document
    // "waiting for two signatures" that the second participant was already invited to sign.
    //
    // Set it to false to reproduce the original behaviour (both flow actions created upfront), which
    // is what leaves a broken flow behind when the batch is abandoned.
    private static final boolean DEFER_SECOND_PARTICIPANT = true;

    // Whether Signer should notify the participants by e-mail as soon as the documents are created.
    // Only meaningful when DEFER_SECOND_PARTICIPANT is off: with the deferred flow, notifications are
    // always disabled at creation time (there is nothing to tell anyone about yet). Set to false
    // while testing, so you don't mail real people on every run.
    private static final boolean NOTIFY_PARTICIPANTS = true;

    // Whether to ALSO send an explicit reminder to the second participant once their flow action is
    // added.
    //
    // Keep it off. Adding a flow action through the flow-edit endpoint already notifies that
    // participant when the turn becomes theirs -- the "disablePendingActionNotifications" flag set at
    // creation time does NOT carry over to actions added later. Turning this on sends them a second,
    // identical e-mail. It is here only to make that explicit, and for the case where your Signer
    // organization has notifications globally disabled and you want the reminder anyway.
    private static final boolean SEND_SECOND_PARTICIPANT_REMINDER = false;

    // Whether the "start" action must refuse a certificate other than the one selected when the
    // documents were created. Keep it on: the flow action created for step 1 is bound to that
    // certificate's CPF, so signing the rest of the batch with another certificate cannot work --
    // failing here, with a clear message, is much better than half a batch of documents that their
    // own creator is not allowed to sign.
    private static final boolean ENFORCE_SAME_CERTIFICATE = true;

    // Session attribute prefixes for the state described on SignerBatchPendingDocument.
    private static final String PENDING_PREFIX = "SignerBatchPending/";
    private static final String PENDING_KEYS = "SignerBatchPendingKeys";

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

        // Fingerprint of the certificate that is starting this batch. Every "start" call of these
        // documents will have to present the same certificate (see start()).
        if (ENFORCE_SAME_CERTIFICATE && Util.isNullOrEmpty(request.getCertContent())) {
            throw new IllegalArgumentException("The certificate content was not informed");
        }
        final String certThumbprint = thumbprint(request.getCertContent());

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

        // A previous attempt of this session may have left documents created but never signed (the
        // user reloaded the page, changed the certificate, closed the tab). Discard them before
        // creating a new batch, so a retry doesn't pile up documents on Signer.
        abort(session);

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
                    return createFlowDocument(signerClient, session, item, name, cpf, certThumbprint);
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
            String signerCpf,
            String certThumbprint
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

        // Step 2: this document's own second participant, who signs later.
        //
        // This is the flow action we do NOT create now (unless DEFER_SECOND_PARTICIPANT is off): it
        // is added by the complete() action, after our signature. Until then the document has a
        // single pending action, so an abandoned batch cannot leave a document waiting for two
        // signatures -- and nobody is invited to a document whose first signature never happened.
        FlowActionCreateModel secondSignerAction = buildSecondSignerAction(item);

        // 3. Create the document. Notice that this call carries a SINGLE file: the flow is specific to
        // this document, so it can't be shared with the other files of the batch. (Were the flow the
        // same for every file, all of them could go on a single call -- and if you wanted them merged
        // into ONE document, you would set isEnvelope(true) and an envelopeName, PDF only.)
        List<FlowActionCreateModel> flowActions = DEFER_SECOND_PARTICIPANT
                ? new ArrayList<>(Arrays.asList(batchSignerAction))
                : new ArrayList<>(Arrays.asList(batchSignerAction, secondSignerAction));

        CreateDocumentRequest documentRequest = new CreateDocumentRequest();
        documentRequest.setFiles(new ArrayList<>(Arrays.asList(fileBuilder.toModel())));
        documentRequest.setFlowActions(flowActions);
        // While the batch is running, nobody should hear about this document: it is a document that
        // may still be thrown away. The second participant's notification is sent by complete(),
        // when there really is something for them to sign.
        documentRequest.setDisablePendingActionNotifications(
                DEFER_SECOND_PARTICIPANT || !NOTIFY_PARTICIPANTS);

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

        // Remember the certificate this document was created for and the second participant that
        // complete() will add to the flow. Registering the key as "pending" is also what allows the
        // abort() action below to delete the documents of a batch that never got signed.
        setPending(session, key, new SignerBatchPendingDocument(
                documentId.toString(),
                certThumbprint,
                item.getParticipantName(),
                item.getParticipantEmail(),
                onlyDigits(item.getParticipantCpf())));

        // Notice that we do NOT read the action URL of the second participant here: on an ordered
        // flow, Signer only hands out a participant's action URL when the turn is theirs, so at this
        // point it would fail. We do it on the complete() action, right after our signature.
        return new SignerBatchDocument(key, upload.getName(), item.getParticipantName());
    }

    /**
     * Builds the flow action of the SECOND participant of a document (step 2). Used either at
     * creation time or, when DEFER_SECOND_PARTICIPANT is on, by the complete() action.
     */
    private static FlowActionCreateModel buildSecondSignerAction(SignerBatchFlowItem item) {

        ParticipantUserModel secondSigner = new ParticipantUserModel();
        secondSigner.setName(item.getParticipantName());
        secondSigner.setEmail(item.getParticipantEmail());
        secondSigner.setIdentifier(onlyDigits(item.getParticipantCpf()));

        FlowActionCreateModel action = new FlowActionCreateModel();
        action.setType(FlowActionType.SIGNER);
        action.setUser(secondSigner);
        action.setStep(2);
        return action;
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

        // Refuse to go on if this document is not one of the batch we created on this session, or if
        // the certificate is not the one it was created for. The second case is the one that used to
        // break the flow: the step-1 flow action carries the CPF of the certificate selected at
        // creation time, so a certificate swapped in the middle of the batch (by reloading the page
        // and picking another one, typically) can never sign these documents. Better to say so here
        // than to leave documents pending forever.
        SignerBatchPendingDocument pending = getPending(session, request.getId());
        if (pending == null) {
            throw new IllegalArgumentException(
                    "This document is not part of a batch in progress. Reload the page and start the "
                            + "batch again.");
        }
        if (ENFORCE_SAME_CERTIFICATE
                && !thumbprint(request.getCertContent()).equals(pending.getCertThumbprint())) {
            throw new IllegalArgumentException(
                    "The certificate changed after this batch was created. The documents were created "
                            + "for the certificate you had selected, so they can only be signed by it. "
                            + "Reload the page and start the batch again with the certificate you want "
                            + "to use.");
        }

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

        // The second participant we are about to add to the flow comes from what WE stored when the
        // document was created, not from the request: the browser has no say on who signs next.
        SignerBatchPendingDocument pending = getPending(session, request.getId());
        if (pending == null) {
            throw new IllegalArgumentException(
                    "This document is not part of a batch in progress. Reload the page and start the "
                            + "batch again.");
        }

        // Recover the Signer document id (UUID), needed both to complete the flow and to show the
        // user which document was signed.
        String documentId = pending.getDocumentId();
        if (documentId == null) {
            documentId = StorageMock.getSignerDocumentId(session, request.getId());
        }
        UUID id = documentId == null ? null : UUID.fromString(documentId);

        // >>>>> HERE IS WHERE THE SECOND PARTICIPANT JOINS THE FLOW <<<<<
        //
        // Notice that this happens BEFORE the signature is completed, and that the order matters.
        //
        // Up to this point the document has a single flow action -- ours. If we completed it now, the
        // document would have nothing left pending, so Signer would CONCLUDE it and notify everyone
        // that the flow is over. Adding the second participant afterwards would then reopen the
        // document and send a second e-mail. That is why the step-2 action goes in first: the flow
        // must already know that there is someone after us when our signature lands.
        //
        // The window this opens is not the one that broke the customer's flow: at this point the user
        // has ALREADY signed the hash with the certificate this batch is bound to, so there is no
        // reload or certificate change to worry about -- only the "complete" call below, which either
        // succeeds or leaves a document that abort() deletes and that nobody was notified about
        // (notifications are off since creation; the second participant is only told once our
        // signature is in, right after this).
        if (DEFER_SECOND_PARTICIPANT && id != null) {
            SignerBatchFlowItem item = new SignerBatchFlowItem();
            item.setParticipantName(pending.getParticipantName());
            item.setParticipantEmail(pending.getParticipantEmail());
            item.setParticipantCpf(pending.getParticipantCpf());

            DocumentFlowEditRequest flowEdit = new DocumentFlowEditRequest();
            flowEdit.setAddedFlowActions(
                    new ArrayList<>(Arrays.asList(buildSecondSignerAction(item))));
            try {
                signerClient.updateDocumentFlow(id, flowEdit);
            } catch (java.io.IOException ex) {
                throw new RuntimeException(
                        "The second participant could not be added to the flow of document "
                                + documentId + ", so the signature was not completed", ex);
            }
            // If the call above failed, the RestException propagates and we do NOT complete the
            // signature: completing it would conclude a document that should have had a second
            // signer. The document stays pending and unsigned, which abort() cleans up.
        }

        // Complete the public signature. We pass the signature computed by Web PKI (sent Base64
        // encoded) together with the token returned on the "start" step. The flow now continues to
        // the second participant instead of being concluded.
        CompleteSignatureRequest completeRequest = new CompleteSignatureRequest();
        completeRequest.setSignature(Base64.getDecoder().decode(request.getSignature()));
        completeRequest.setToken(request.getToken());
        signerClient.completePublicSignature(request.getId(), completeRequest);

        // From here on the document is safe: it holds our signature, so it is no longer a candidate
        // for the cleanup performed by abort().
        removePending(session, request.getId());

        if (id == null) {
            return new SignerBatchCompleteResponse(request.getId(), null);
        }

        // The second participant is notified by Signer itself, now that the flow reached their step:
        // the notification is a consequence of a signature that already exists. We do NOT send a
        // reminder on top of it -- that would be a second, identical e-mail (see the constant).
        if (DEFER_SECOND_PARTICIPANT && SEND_SECOND_PARTICIPANT_REMINDER) {
            notifySecondParticipant(signerClient, id, pending.getParticipantEmail());
        }

        // Our signature (step 1) is done, so it is now the second participant's turn -- which means
        // Signer will hand us THEIR action URL. We return it so the page can offer a link and you can
        // watch the flow finish without waiting for the notification e-mail.
        //
        // This is a convenience of the sample, not part of the signature flow: if Signer refuses it
        // for any reason, we simply don't show the link.
        String participantActionUrl = null;
        if (!Util.isNullOrEmpty(pending.getParticipantEmail())) {
            try {
                ActionUrlRequest actionUrlRequest = new ActionUrlRequest();
                actionUrlRequest.setEmailAddress(pending.getParticipantEmail());
                actionUrlRequest.setIdentifier(pending.getParticipantCpf());
                participantActionUrl = signerClient.getActionUrl(id, actionUrlRequest).getUrl();
            } catch (RestException ex) {
                // Ignored on purpose (see above).
            }
        }

        return new SignerBatchCompleteResponse(documentId, participantActionUrl);
    }

    /**
     * POST /api/batch-signer-signature/abort
     *
     * Called by the page (via navigator.sendBeacon) when the user leaves it with a batch in
     * progress, and also at the beginning of every batch, to discard documents left over by a
     * previous attempt of the same session.
     *
     * These are documents that were created on Signer but never signed by us. Deleting them is what
     * keeps the "reload the page in the middle of the batch" case from accumulating garbage that
     * their own creator can no longer sign.
     *
     * >>>>> NOTICE <<<<<
     * The session only covers users who come back. On a real application, keep the pending documents
     * on your database and have a scheduled job delete the ones left behind for too long.
     */
    @PostMapping("/abort")
    public int abort(HttpSession session) {

        SignerClient signerClient = Util.getSignerClient();
        int deleted = 0;

        for (String key : takePendingKeys(session)) {
            SignerBatchPendingDocument pending = getPending(session, key);
            removePending(session, key);
            if (pending == null || pending.getDocumentId() == null) {
                continue;
            }
            try {
                // Only documents that hold no signature at all are deleted. A document that was
                // signed while we weren't looking is left alone -- deleting it would destroy a real
                // signature. (Use cancelDocument if your business logic prefers keeping the record.)
                DocumentModel document = signerClient.getDocumentDetails(
                        UUID.fromString(pending.getDocumentId()));
                if (document.isHasSignature() != null && document.isHasSignature()) {
                    continue;
                }
                signerClient.deleteDocument(UUID.fromString(pending.getDocumentId()));
                deleted++;
            } catch (RestException ex) {
                // The document may already be gone, or belong to a session that is no longer valid.
                // Nothing to do about it here: this is a best-effort cleanup.
            }
        }

        return deleted;
    }

    /**
     * Asks Signer to notify the second participant of a document, now that our signature made it
     * their turn. The reminder is sent per flow action, so we look the document up to find the one
     * we just added.
     *
     * Notifying is a convenience, not a step of the signature: a failure here must not fail the
     * signature that already succeeded.
     */
    private static void notifySecondParticipant(SignerClient signerClient, UUID documentId, String email) {
        if (Util.isNullOrEmpty(email)) {
            return;
        }
        try {
            DocumentModel document = signerClient.getDocumentDetails(documentId);
            if (document.getFlowActions() == null) {
                return;
            }
            for (FlowActionModel action : document.getFlowActions()) {
                if (action.getUser() != null && email.equalsIgnoreCase(action.getUser().getEmail())) {
                    signerClient.sendFlowActionReminder(documentId, action.getId());
                    return;
                }
            }
        } catch (RestException ex) {
            // Ignored on purpose (see above). The participant can still be reached by the action URL
            // and by Signer's own pending-action reminders.
        }
    }

    // region Pending documents (the state that makes the workaround above possible)

    @SuppressWarnings("unchecked")
    private static Set<String> pendingKeys(HttpSession session) {
        Set<String> keys = (Set<String>) session.getAttribute(PENDING_KEYS);
        if (keys == null) {
            keys = new LinkedHashSet<>();
            session.setAttribute(PENDING_KEYS, keys);
        }
        return keys;
    }

    private static void setPending(HttpSession session, String key, SignerBatchPendingDocument pending) {
        // The documents of a batch are created concurrently (see runConcurrently), so the bookkeeping
        // of the batch is synchronized on the session.
        synchronized (session.getId().intern()) {
            session.setAttribute(PENDING_PREFIX + key, pending);
            pendingKeys(session).add(key);
        }
    }

    private static SignerBatchPendingDocument getPending(HttpSession session, String key) {
        if (Util.isNullOrEmpty(key)) {
            return null;
        }
        return (SignerBatchPendingDocument) session.getAttribute(PENDING_PREFIX + key);
    }

    private static void removePending(HttpSession session, String key) {
        synchronized (session.getId().intern()) {
            session.removeAttribute(PENDING_PREFIX + key);
            pendingKeys(session).remove(key);
        }
    }

    /**
     * Returns the keys of the documents still pending on this session and clears the list, so two
     * concurrent cleanups don't try to delete the same documents.
     */
    private static List<String> takePendingKeys(HttpSession session) {
        synchronized (session.getId().intern()) {
            Set<String> keys = pendingKeys(session);
            List<String> taken = new ArrayList<>(keys);
            keys.clear();
            return taken;
        }
    }

    // endregion

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

    /**
     * Fingerprint (SHA-256, Base64) of a Base64-encoded certificate. Used only to tell whether the
     * certificate presented on "start" is the same one the documents were created for -- we never
     * need to parse the certificate for that.
     */
    private static String thumbprint(String base64Certificate) {
        if (Util.isNullOrEmpty(base64Certificate)) {
            return "";
        }
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(Base64.getDecoder().decode(base64Certificate));
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException(ex);
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
