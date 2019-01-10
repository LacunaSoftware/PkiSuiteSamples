package com.lacunasoftware.suite.sample.api.model.express;

public class BatchSignatureStartResponse {

    public String transferFile;
    public String toSignHash;
    public String digestAlgorithm;

    public String getTransferFile() {
        return transferFile;
    }
    public void setTransferFile(String transferFile) {
        this.transferFile = transferFile;
    }

    public String getToSignHash() {
        return toSignHash;
    }
    public void setToSignHash(String toSignHash) {
        this.toSignHash = toSignHash;
    }

    public String getDigestAlgorithm() {
        return digestAlgorithm;
    }
    public void setDigestAlgorithm(String digestAlgorithm) {
        this.digestAlgorithm = digestAlgorithm;
    }
}
