package com.lacunasoftware.pkisuite.api.model.signer;

import java.util.List;

/**
 * Body of the "create" action of BatchSignerSignatureApiController. It is received as JSON (and not
 * as form fields) because of the nested list of items.
 */
public class SignerBatchCreateRequest {

    // The CPF of the certificate selected by the user on Web PKI. This is the FIRST participant of
    // every flow: the one who signs the whole batch, right now, on the browser. The documents are
    // created for a signer with this CPF so that the public signature does not fail with a
    // "CpfMismatch" when the very same certificate signs them.
    //
    // Notice that we don't need to trust the browser here: Signer validates that the certificate
    // performing each signature belongs to the participant's CPF, so a tampered CPF can't be used to
    // sign on someone else's behalf.
    public String cpf;
    // The subject name of the certificate, used as the first participant's display name.
    public String name;
    // The Base64-encoded content of the certificate selected on Web PKI (the same that will be sent
    // on every "start" call of this batch). We don't send it to Signer here: we fingerprint it and
    // remember the fingerprint, so that the "start" action can refuse a certificate swapped in the
    // middle of the batch -- which would otherwise leave documents nobody can sign.
    public String certContent;
    // The batch: one item per document, each carrying the file and the SECOND participant of that
    // document's flow.
    public List<SignerBatchFlowItem> flows;

    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getCertContent() {
        return certContent;
    }
    public void setCertContent(String certContent) {
        this.certContent = certContent;
    }

    public List<SignerBatchFlowItem> getFlows() {
        return flows;
    }
    public void setFlows(List<SignerBatchFlowItem> flows) {
        this.flows = flows;
    }
}
