package com.lacunasoftware.pkisuite.api.model.signer;

/**
 * Result of the "complete" action of BatchSignerSignatureApiController: the document now holds the
 * FIRST of its two signatures and waits for the second participant.
 */
public class SignerBatchCompleteResponse {

    // The Signer document id (UUID), used to download the (partially signed) document.
    public String documentId;
    // The action URL of the SECOND participant, now that our signature made it their turn. Lets you
    // watch the flow finish without waiting for the notification e-mail.
    //
    // >>>>> NOTICE <<<<<
    // This URL is a bearer credential: whoever has it can act as that participant. We return it here
    // because it makes the sample self-demonstrating, but on a real application you would not expose
    // another participant's action URL to whoever happens to be operating the batch.
    public String participantActionUrl;

    public SignerBatchCompleteResponse() {
    }

    public SignerBatchCompleteResponse(String documentId, String participantActionUrl) {
        this.documentId = documentId;
        this.participantActionUrl = participantActionUrl;
    }

    public String getDocumentId() {
        return documentId;
    }
    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getParticipantActionUrl() {
        return participantActionUrl;
    }
    public void setParticipantActionUrl(String participantActionUrl) {
        this.participantActionUrl = participantActionUrl;
    }
}
