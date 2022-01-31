package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkiexpress.CadesSignatureStarter;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureStartRequest;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureStartResponse;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/batch-cades-signature-express")
public class BatchCadesSignatureExpressApiController {

    /**
     * POST /api/batch-cades-signature-express/start
     *
     * This action is called asynchronously from the batch signature page in order to initiate the
     * signature of each document in the batch.
     */
    @PostMapping(value = "/start")
    public BatchSignatureStartResponse start(
            BatchSignatureStartRequest request
    ) throws IOException {

        // Get an instance of the CadesSignatureStarter class, responsible for receiving
        // the signature elements and start the signature process.
        CadesSignatureStarter signatureStarter = new CadesSignatureStarter();

        // Set PKI default options (see Util.java)
        Util.setPkiDefaults(signatureStarter);

        // Set signature policy.
        signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PkiBrazilCadesAdrBasica);

        // Set file to be signed. If the file is a CMS, the PKI Express will recognize that
        // and will co-sign that file.
        signatureStarter.setFileToSign(StorageMock.getBatchDocPath(request.getId()));

        // Set Base64-encoded certificate's content to signature starter.
        signatureStarter.setCertificateBase64(request.getCertContent());

        // Set the 'encapsulate content' option (default: true).
        signatureStarter.setEncapsulateContent(true);

        // Start the signature process. Receive as response a SignatureStartResult instance
        // containing the following fields:
        // - toSignHash: The hash to be signed.
        // - digestAlgorithm: The digest algorithm that will inform the Web PKI component
        // to compute the signature.
        // - transferFile: A temporary file to be passed to "complete" step.
        SignatureStartResult result = signatureStarter.start();

        // If you want to delete the temporary files created by this step use the method
        // dispose(). This method MUST be called after the start() method, because it
        // deletes some files needed by the method.
        signatureStarter.dispose();

        // Return the fields needed on javascript and complete() method.
        BatchSignatureStartResponse res = new BatchSignatureStartResponse();
        res.setToSignHash(result.getToSignHash());
        res.setDigestAlgorithm(result.getDigestAlgorithm());
        res.setTransferFile(result.getTransferFile());
        return res;
    }

    /**
     * POST /cades-signature-express/complete?fileId={fileToSign}
     *
     * This action receives the form submission from the signature page. It will perform a CAdES
     * signature in three steps using PKI Express and Web PKI.
     */
    @PostMapping("/complete")
    public String complete(
            BatchSignatureCompleteRequest request
    ) throws IOException {

        // Get an instance of the SignatureFinisher class, responsible for completing the
        // signature process.
        SignatureFinisher signatureFinisher = new SignatureFinisher();

        // Set PKI default options (see Util.java)
        Util.setPkiDefaults(signatureFinisher);

        // Set file to be signed. It's the same file we used on "start" step.
        signatureFinisher.setFileToSign(StorageMock.getBatchDocPath(request.getId()));

        // Set transfer file.
        signatureFinisher.setTransferFilePath(request.getTransferFile());

        // Set the signature value.
        signatureFinisher.setSignature(request.getSignature());

        // Generate path for output file and add to signature finisher.
        String outputFile = StorageMock.generateFileId("p7s");
        signatureFinisher.setOutputFilePath(StorageMock.getDataPath(outputFile));

        // Complete the signature process.
        signatureFinisher.complete();

        // If you want to delete the temporary files created by this step, use the method
        // dispose(). This method MUST be called after the complete() method, because it
        // deletes some files needed by the method.
        signatureFinisher.dispose();

        // Return the JSON with the signed file.
        return outputFile;
    }

}
