package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.signer.DocumentTicketType;
import com.lacunasoftware.signer.javaclient.SignerClient;
import com.lacunasoftware.signer.javaclient.exceptions.RestException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

/**
 * ================================================================================================
 * Batch Signer Signature sample
 * ================================================================================================
 *
 * This sample signs a BATCH of documents uploaded by the user, where EACH document gets its OWN
 * signature flow on Lacuna Signer with a SECOND participant who signs afterwards. It is the
 * combination of two scenarios:
 *
 *   - SignerSamples' "CreateDocumentWithTwoOrMoreSignersWithOrderScenario": a document whose flow has
 *     two signers, in order (step 1, then step 2). That sample is a console application, so it stops
 *     at creating the document.
 *   - This project's batch signature samples: many documents signed on the browser with the user's
 *     certificate through Web PKI, using a queue/"assembly line" so several are processed at once.
 *     Signer's PUBLIC SIGNATURE flow is what lets a document be signed with just a "key" + a
 *     "ticket", with no authenticated Signer session (as in SignerSamples' "PublicSignatureScenario").
 *
 * The relationship is 1:N -- ONE first participant (the person operating the page, whose certificate
 * signs everything) and N documents, each with its OWN second participant:
 *
 *     documento1.pdf  ->  flow: [1] you (batch, now)  ->  [2] Maria    (later, by e-mail)
 *     documento2.pdf  ->  flow: [1] you (batch, now)  ->  [2] Joao     (later, by e-mail)
 *     documento3.pdf  ->  flow: [1] you (batch, now)  ->  [2] Roberto  (later, by e-mail)
 *
 * The batch covers ONLY the first participant's signatures. Each second participant is notified by
 * Signer and signs on their own time -- which is precisely why the documents live on Signer instead
 * of being signed locally with PKI Express / REST PKI.
 *
 * The key insight is that Signer generates the hashes on the server, while the private-key signing
 * happens on the client (Web PKI). So the server never handles the user's private key.
 *
 * End-to-end flow
 * ---------------
 *   1. GET /batch-signer-signature (this controller) renders the page. Web PKI lists the user's
 *      certificates. No file and no document exist yet.
 *
 *   2. The user chooses PDFs. Each one is uploaded to Signer right away (POST .../upload), and the
 *      page renders one row per file asking WHO is the second signer of that document (name, e-mail
 *      and CPF). No document is created yet: at this point we don't even know who the first
 *      participant is (that comes from the certificate).
 *
 *   3. The user selects a certificate and clicks "Sign Batch". The page (batch-signature-signer-
 *      form.js) reads the certificate's CPF (cert.pkiBrazil.cpf) and calls:
 *
 *         POST /api/batch-signer-signature/create   (BatchSignerSignatureApiController.create)
 *
 *      which creates ONE document per file on Signer, each with its own two-step flow, and returns
 *      the public-signature "key" of each one (for the first participant). NOTE: creating the
 *      documents here is only for demonstration; in a real application the flow would be assembled
 *      from your business data.
 *
 *   4. Then, for each document, the page runs the classic 3-step batch pipeline (an "assembly
 *      line", so several documents are processed at once):
 *         a) POST .../start    -> starts the public signature and returns the to-sign hash + a token;
 *         b) Web PKI signHash  -> signs the hash on the client with the selected certificate;
 *         c) POST .../complete -> completes the public signature on Signer, returning the document id
 *                                 and the action URL of the participant we now wait for.
 *
 *   5. Each document now has ONE of its TWO signatures. It stays pending on Signer until the second
 *      participant signs. The page shows "signed by you -- waiting for <name>", a link to that
 *      participant's action URL (so you can test the second signature without e-mail) and a link to
 *      download the partially signed file via GET .../download/{documentId} (this controller), which
 *      streams it from Signer. The download is proxied by our server so the Signer API key never
 *      reaches the browser.
 *
 * Files involved
 * --------------
 *   - BatchSignerSignatureController (this class): renders the page and proxies the download.
 *   - BatchSignerSignatureApiController: the /upload, /create, /start and /complete API actions.
 *   - templates/batch-signer-signature/index.html: the page.
 *   - static/js/batch-signature-signer-form.js: the client-side batch logic (Web PKI).
 *
 * Requirements / things to know
 * -----------------------------
 *   - Configure the Signer API key and endpoint in src/main/resources/application.yml
 *     (signer.apiKey and signer.endpoint).
 *   - The public signature requires the signer's CPF, and Signer validates that the signing
 *     certificate belongs to that SAME CPF (otherwise it fails with "CpfMismatch"). Here the CPF of
 *     the first participant comes from the certificate the user selects, so it always matches.
 *   - The order of the flow matters: the first participant MUST be able to sign right away. With
 *     step 1 for the batch signer and step 2 for the other participant, that's guaranteed. Were it
 *     the other way around, every "start" call would fail because it wouldn't be their turn yet.
 *   - For the same reason, Signer only hands out the SECOND participant's action URL after our
 *     signature: that's why it is read on "complete" and not on "create".
 *   - The "key" (identifies the signature) and the "ticket" (authorizes it) are extracted from the
 *     action URL that Signer returns for the document/participant.
 *   - Creating the documents makes Signer notify each second participant BY E-MAIL. While testing,
 *     set NOTIFY_PARTICIPANTS to false on BatchSignerSignatureApiController.
 */
@Controller
@RequestMapping("/batch-signer-signature")
public class BatchSignerSignatureController {

    /**
     * GET /batch-signer-signature
     *
     * Renders the batch signature page. The documents are only created later, after the user
     * selects a certificate on Web PKI (see BatchSignerSignatureApiController.create).
     */
    @GetMapping
    public String index() {
        return "batch-signer-signature/index";
    }

    /**
     * GET /batch-signer-signature/download/{documentId}
     *
     * Downloads a document from Signer and streams it to the browser. We proxy the download through
     * our server so the Signer API key never reaches the client. The "document ID" is the one
     * returned by the "complete" API action.
     *
     * Notice that right after the batch this file carries only the FIRST signature: the second
     * participant of the flow hasn't signed yet, so the document is still pending on Signer.
     */
    @GetMapping("/download/{documentId}")
    public void download(@PathVariable("documentId") String documentId, HttpServletResponse response)
            throws IOException, RestException {

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Download the document (SIGNATURES = the document with the signatures applied so far).
        // Other options are available (e.g. ORIGINAL, PRINTERFRIENDLYVERSION).
        byte[] content = signerClient.getDocumentBytes(UUID.fromString(documentId), DocumentTicketType.SIGNATURES);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition",
                String.format("attachment; filename=\"signed-%s.pdf\"", documentId));
        response.setContentLength(content.length);
        response.getOutputStream().write(content);
        response.getOutputStream().flush();
    }
}


