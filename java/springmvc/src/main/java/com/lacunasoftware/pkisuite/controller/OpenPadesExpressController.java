package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkiexpress.PadesSignatureExplorer;
import com.lacunasoftware.pkiexpress.PadesSignature;
import com.lacunasoftware.pkiexpress.SignatureValidationPolicies;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;

import java.io.IOException;


@Controller
public class OpenPadesExpressController {

    /**
	 * This action submits a PDF file to Rest PKI for inspection of its signatures.
     */
    @RequestMapping(value = "/open-pades-express", method = {RequestMethod.GET})
    public String get(
            @RequestParam(value = "fileId") String signatureFile,
            Model model
    ) throws IOException {

        // Get an instance of the PadesSignatureExplorer class, used to open/validate PDF signatures.
        PadesSignatureExplorer sigExplorer = new PadesSignatureExplorer();

        // Set PKI default options. (see Util.java)
        Util.setPkiDefaults(sigExplorer);

        // Set the PDF file to be inspected.
        sigExplorer.setSignatureFile(StorageMock.getDataPath(signatureFile));
        // sigExplorer.setSignatureValidationPolicy(SignatureValidationPolicies.AdobeReader);
        // Specify that we want to validate the signatures in the file, not only inspect them.
        sigExplorer.setValidate(true);

        // Call the open() method, which returns the signature file's information.
        PadesSignature signature = sigExplorer.open();

        // Render the information (see file resources/templates/open-pades-express/index.html 
        // for more information on the information returned)
        model.addAttribute("signature", signature);
        return "open-pades-express/index";
    }
}
