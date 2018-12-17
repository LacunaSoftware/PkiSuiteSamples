package com.lacunasoftware.suite.sample.model.express;

public class BatchSignatureCompleteRequest {

    public int id;
    public String signature;
    public String transferFile;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getSignature() {
        return signature;
    }
    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getTransferFile() {
        return transferFile;
    }
    public void setTransferFile(String transferFile) {
        this.transferFile = transferFile;
    }
}
