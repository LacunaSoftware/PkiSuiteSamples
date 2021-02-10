package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkiexpress.CadesSignatureExplorer;
import com.lacunasoftware.pkiexpress.CadesSignature;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;

import java.io.IOException;


@Controller
public class OpenCadesExpressController {

    /**
	 * This action submits a CMS file to Rest PKI for inspection of its signatures.
     */
    @RequestMapping(value = "/open-cades-express", method = {RequestMethod.GET})
    public String get(
            @RequestParam(value = "fileId") String signatureFile,
            Model model
    ) throws IOException {

        // Get an instance of the CadesSignatureExplorer class, used to open/validate PDF signatures.
        CadesSignatureExplorer sigExplorer = new CadesSignatureExplorer();

        // Set PKI default options. (see Util.java)
        Util.setPkiDefaults(sigExplorer);

        // Set the CMS file to be inspected.
        sigExplorer.setSignatureFile(StorageMock.getDataPath(signatureFile));

        // Specify that we want to validate the signatures in the file, not only inspect them.
        sigExplorer.setValidate(true);

        // Generate path for output file and add to signature editor.
        String outputFile = StorageMock.generateFileId("pdf");
        sigExplorer.setExtractContentPath(StorageMock.getDataPath(outputFile));

        // Call the open() method, which returns the signature file's information.
        CadesSignature signature = sigExplorer.open();

        // Render the information (see file resources/templates/open-cades-express/index.html 
        // for more information on the information returned)
        model.addAttribute("signature", signature);
        model.addAttribute("outputFile", outputFile);
        return "open-cades-express/index";
    }
}
