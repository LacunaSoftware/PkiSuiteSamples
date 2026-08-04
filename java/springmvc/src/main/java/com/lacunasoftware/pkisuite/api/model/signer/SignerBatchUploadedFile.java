package com.lacunasoftware.pkisuite.api.model.signer;

/**
 * One file uploaded by the user and forwarded to Signer's upload API. Returned by the "upload"
 * action of BatchSignerSignatureApiController.
 */
public class SignerBatchUploadedFile {

    // Opaque reference to the upload, which the page sends back on the "create" call. The actual
    // Signer upload id is kept on the server (see StorageMock.setSignerUpload).
    public String fileRef;
    // The original filename, so the page can show a meaningful document list.
    public String name;

    public SignerBatchUploadedFile() {
    }

    public SignerBatchUploadedFile(String fileRef, String name) {
        this.fileRef = fileRef;
        this.name = name;
    }

    public String getFileRef() {
        return fileRef;
    }
    public void setFileRef(String fileRef) {
        this.fileRef = fileRef;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
