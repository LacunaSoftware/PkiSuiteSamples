package com.lacunasoftware.suite.sample.api.model.express;

public class BatchSignatureStartRequest {

    public int id;
    public String certContent;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getCertContent() {
        return certContent;
    }
    public void setCertContent(String certContent) {
        this.certContent = certContent;
    }
}
