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
 * This sample signs a BATCH of documents that live on Lacuna Signer, using the user's certificate
 * through Web PKI (in the browser). It combines two Lacuna products:
 *
 *   - Lacuna Signer: hosts the documents and produces, for each one, the "to-sign hash". We use its
 *     PUBLIC SIGNATURE flow, which lets a document be signed with just a "key" + a "ticket" (no
 *     authenticated Signer session). This mirrors the SignerSamples "PublicSignatureScenario"
 *     console sample.
 *   - Web PKI: the browser component that reads the user's certificate and computes each signature.
 *     The batch/queue logic mirrors this project's "batch-cades-signature-express" sample.
 *
 * The key insight is that Signer generates the hashes on the server, while the private-key signing
 * happens on the client (Web PKI). So the server never handles the user's private key.
 *
 * End-to-end flow
 * ---------------
 *   1. GET /batch-signer-signature (this controller) renders the page. Web PKI lists the user's
 *      certificates. No document is created yet.
 *
 *   2. The user selects a certificate and clicks "Sign Batch". The page (batch-signature-signer-
 *      form.js) reads the certificate's CPF (cert.pkiBrazil.cpf) and calls:
 *
 *         POST /api/batch-signer-signature/create   (BatchSignerSignatureApiController.create)
 *
 *      which creates N documents on Signer for a signer with that CPF and returns the public-
 *      signature "key" of each one. NOTE: creating the documents here is only for demonstration; in
 *      a real application they would already exist on your Signer organization.
 *
 *   3. Then, for each document, the page runs the classic 3-step batch pipeline (an "assembly
 *      line", so several documents are processed at once):
 *         a) POST .../start    -> starts the public signature and returns the to-sign hash + a token;
 *         b) Web PKI signHash  -> signs the hash on the client with the selected certificate;
 *         c) POST .../complete -> completes the public signature on Signer, returning the document id.
 *
 *   4. Each signed document can be downloaded via GET .../download/{documentId} (this controller),
 *      which streams the signed file from Signer. The download is proxied by our server so the
 *      Signer API key never reaches the browser.
 *
 * Files involved
 * --------------
 *   - BatchSignerSignatureController (this class): renders the page and proxies the download.
 *   - BatchSignerSignatureApiController: the /create, /start and /complete API actions.
 *   - templates/batch-signer-signature/index.html: the page.
 *   - static/js/batch-signature-signer-form.js: the client-side batch logic (Web PKI).
 *
 * Requirements / things to know
 * -----------------------------
 *   - Configure the Signer API key and endpoint in src/main/resources/application.yml
 *     (signer.apiKey and signer.endpoint).
 *   - The public signature requires the signer's CPF, and Signer validates that the signing
 *     certificate belongs to that SAME CPF (otherwise it fails with "CpfMismatch"). Here the CPF
 *     comes from the certificate the user selects, so it always matches.
 *   - The "key" (identifies the signature) and the "ticket" (authorizes it) are extracted from the
 *     action URL that Signer returns for the document/participant.
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
     * Downloads a signed document from Signer and streams it to the browser. We proxy the download
     * through our server so the Signer API key never reaches the client. The "document ID" is the
     * one returned by the "complete" API action.
     */
    @GetMapping("/download/{documentId}")
    public void download(@PathVariable("documentId") String documentId, HttpServletResponse response)
            throws IOException, RestException {

        // Get an instance of the SignerClient class, responsible for communicating with Signer.
        SignerClient signerClient = Util.getSignerClient();

        // Download the signed document (SIGNATURES = the document with the applied signatures).
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


