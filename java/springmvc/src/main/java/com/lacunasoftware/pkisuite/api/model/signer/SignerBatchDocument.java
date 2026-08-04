package com.lacunasoftware.pkisuite.api.model.signer;

/**
 * One document created on Signer, as returned by the "create" action of
 * BatchSignerSignatureApiController. The batch is a list of these.
 */
public class SignerBatchDocument {

    // The public-signature "key" of the document (extracted from the Signer action URL). This is
    // what identifies the document on the "start" and "complete" calls.
    public String key;
    // The original filename, so the page can show a meaningful document list.
    public String name;

    public SignerBatchDocument() {
    }

    public SignerBatchDocument(String key, String name) {
        this.key = key;
        this.name = name;
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
}
