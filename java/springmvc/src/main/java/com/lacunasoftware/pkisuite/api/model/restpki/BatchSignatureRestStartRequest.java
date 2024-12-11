package com.lacunasoftware.pkisuite.api.model.restpki;

public class BatchSignatureRestStartRequest {
    private String signerCertificate;
    private int docId;
    
    // Getters and Setters
    public int getDocId() {
        return docId;
    }

    public void setDocId(int docId) {
        this.docId = docId;
    }

    public String getSignerCertificate() {
        return signerCertificate;
    }

    public void setSignerCertificate(String signerCertificate) {
        this.signerCertificate = signerCertificate;
    }
}
