package com.lacunasoftware.pkisuite.api.model.signer;

/**
 * One document created on Signer, as returned by the "create" action of
 * BatchSignerSignatureApiController. The batch is a list of these.
 */
public class SignerBatchDocument {

    // The public-signature "key" of the document, for the FIRST participant (the one signing the
    // batch). This is what identifies the document on the "start" and "complete" calls.
    public String key;
    // The original filename, so the page can show a meaningful list of documents.
    public String name;
    // The name of the second participant of this document's flow, who signs after the batch. Used to
    // render the "waiting for ..." status.
    public String participantName;

    public SignerBatchDocument() {
    }

    public SignerBatchDocument(String key, String name, String participantName) {
        this.key = key;
        this.name = name;
        this.participantName = participantName;
    }

    public String getKey() {
        return key;
    }
    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getParticipantName() {
        return participantName;
    }
    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }
}
