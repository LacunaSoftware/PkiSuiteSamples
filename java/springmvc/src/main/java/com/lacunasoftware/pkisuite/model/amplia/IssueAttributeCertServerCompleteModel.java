package com.lacunasoftware.pkisuite.model.amplia;

import com.lacunasoftware.amplia.Certificate;

public class IssueAttributeCertServerCompleteModel {

        private Certificate certificate;
        private String fileId; 
    
        public IssueAttributeCertServerCompleteModel() {
        }

        public String getFileId() {
            return fileId;
        }

        public void setFileId(String fileId) {
            this.fileId = fileId;
        }

        public Certificate getCertificate() {
            return certificate;
        }
    
        public void setCertificate(Certificate certificate) {
            this.certificate = certificate;
        }


}
