package com.lacunasoftware.pkisuite.api.model.signer;

import java.io.Serializable;

/**
 * Everything the server needs to remember about ONE document of the batch between the moment it is
 * created on Signer and the moment its signature is completed -- the window in which a page reload
 * or a change of certificate used to leave a broken flow behind (see BatchSignerSignatureApiController).
 *
 * Two things live here:
 *
 *   - certThumbprint: a SHA-256 fingerprint of the certificate that was selected when the document
 *     was created. The "start" action refuses to go on if the certificate changed, instead of
 *     producing a signature that Signer would reject (or, worse, a document nobody can sign);
 *
 *   - the SECOND participant of the flow. It is NOT sent to Signer at creation time: the flow action
 *     is only added after our signature is completed, so an abandoned batch never turns into a
 *     document pending two actions, and the second participant is never notified for nothing.
 *
 * >>>>> NOTICE <<<<<
 * We keep this on the HTTP session for the sake of the sample. On a real application it would live
 * wherever fits your business logic (typically a "pending documents" table), which also lets a
 * background job clean up documents abandoned by users whose session already expired.
 */
public class SignerBatchPendingDocument implements Serializable {

    private static final long serialVersionUID = 1L;

    private String documentId;
    private String certThumbprint;
    private String participantName;
    private String participantEmail;
    private String participantCpf;

    public SignerBatchPendingDocument() {
    }

    public SignerBatchPendingDocument(
            String documentId,
            String certThumbprint,
            String participantName,
            String participantEmail,
            String participantCpf
    ) {
        this.documentId = documentId;
        this.certThumbprint = certThumbprint;
        this.participantName = participantName;
        this.participantEmail = participantEmail;
        this.participantCpf = participantCpf;
    }

    public String getDocumentId() {
        return documentId;
    }
    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getCertThumbprint() {
        return certThumbprint;
    }
    public void setCertThumbprint(String certThumbprint) {
        this.certThumbprint = certThumbprint;
    }

    public String getParticipantName() {
        return participantName;
    }
    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }

    public String getParticipantEmail() {
        return participantEmail;
    }
    public void setParticipantEmail(String participantEmail) {
        this.participantEmail = participantEmail;
    }

    public String getParticipantCpf() {
        return participantCpf;
    }
    public void setParticipantCpf(String participantCpf) {
        this.participantCpf = participantCpf;
    }
}
