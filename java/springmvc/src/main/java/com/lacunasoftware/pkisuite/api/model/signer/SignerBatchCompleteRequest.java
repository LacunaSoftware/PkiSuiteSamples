package com.lacunasoftware.pkisuite.api.model.signer;

public class SignerBatchCompleteRequest {

    // The document key of the public signature (the same used on the "start" step).
    public String id;
    // The Base64-encoded signature computed by Web PKI.
    public String signature;
    // The token returned by the "start" step.
    public String token;
    // The second participant of this document's flow.
    //
    // >>>>> NOTICE <<<<<
    // These are IGNORED by the complete() action, which reads the participant from what the server
    // stored when the document was created. Who joins the flow after our signature is a decision of
    // the server, not of the page. They are kept here only so the request stays compatible with
    // pages that still send them.
    public String participantEmail;
    public String participantCpf;

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

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getSignature() {
        return signature;
    }
    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
