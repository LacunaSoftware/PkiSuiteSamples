package com.lacunasoftware.pkisuite.api.model.signer;

/**
 * One item of the batch: the file that will become a document on Signer and the SECOND participant
 * of that document's flow.
 *
 * Since each document has its own flow, this data is per item -- and that's exactly why the
 * documents cannot all be created on a single call (see the "create" action of
 * BatchSignerSignatureApiController).
 */
public class SignerBatchFlowItem {

    // Reference to the uploaded file (returned by the "upload" action).
    private String fileRef;
    // The second participant of this document's flow, who signs AFTER the batch (step 2). On this
    // sample the data is typed by the user on the page; on a real application it would come from your
    // business logic (a customer record, a spreadsheet, an HR list, ...).
    private String participantName;
    private String participantEmail;
    private String participantCpf;

    public String getFileRef() {
        return fileRef;
    }
    public void setFileRef(String fileRef) {
        this.fileRef = fileRef;
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
