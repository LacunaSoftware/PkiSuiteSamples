package com.lacunasoftware.pkisuite.api.model.restpki;

public class BatchSignatureRestStartResponse {
    private String token;
    private String digestAlgorithmOid;
    private String toSignHash;
    
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getDigestAlgorithmOid() {
        return digestAlgorithmOid;
    }
    public void setDigestAlgorithmOid(String digestAlgorithmOid) {
        this.digestAlgorithmOid = digestAlgorithmOid;
    }
    public String getToSignHash() {
        return toSignHash;
    }
    public void setToSignHash(String toSignHash) {
        this.toSignHash = toSignHash;
    }

}
