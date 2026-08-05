package com.lacunasoftware.pkisuite.api.model.signer;

public class SignerBatchCompleteRequest {

    // The document key of the public signature (the same used on the "start" step).
    public String id;
    // The Base64-encoded signature computed by Web PKI.
    public String signature;
    // The token returned by the "start" step.
    public String token;
    // The second participant of this document's flow. Not needed to complete the signature: it is
    // used only to read that participant's action URL once our signature makes it their turn (a
    // convenience of the sample, see the complete() action).
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
