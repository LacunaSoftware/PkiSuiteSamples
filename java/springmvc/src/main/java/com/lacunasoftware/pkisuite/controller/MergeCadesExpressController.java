package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkiexpress.CadesSignatureEditor;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.lang.IllegalArgumentException;
import java.io.FileNotFoundException;
import java.io.IOException;

@Controller
@RequestMapping("/merge-cades-express")
public class MergeCadesExpressController {

	/**
	 * GET /merge-cades-express?dataFile={dataFile}&fileId1={fileId1}&fileId2={fileId2}
	 *
	 * This action performs a merge of CAdES signature using PKI Express 
	 * when both signatures doesn't have encapsulated content or when one 
	 * signature has encpasulated content and the other doesn't
	 * 
	 * GET /merge-cades-express?fileId1={fileId1}&fileId2={fileId2}
	 *
	 * This action performs a merge of CAdES signature using PKI Express
	 * when both signatures have encapsulated content
	 * 
	 * GET /merge-cades-express?dataFile={dataFile}&fileId1={fileId1}
	 *
	 * This action performs a merge of CAdES signature using PKI Express to
	 * generate an attached file from the data file and detached CMS file
	 */
	@GetMapping
	public String detached(
		@RequestParam(value = "dataFile", defaultValue = "") String dataFile,
		@RequestParam(value = "fileId1") String fileId1,
		@RequestParam(value = "fileId2", defaultValue = "") String fileId2,
		Model model
		) throws IOException, IllegalArgumentException {
			// Verify if the fileId1 correspond to an existing file on our StorageMock class.
			if (fileId1 == null || !StorageMock.exists(fileId1)) {
				throw new FileNotFoundException();
			}

			// Verify if the fileId2 or the dataFile are setted.
			if (Util.isNullOrEmpty(fileId2) && Util.isNullOrEmpty(dataFile)) {
				throw new IllegalArgumentException();
			}

			// Get an instance of the CadesSignatureEditor class, responsible for
			// receiving the files and merge them.
			CadesSignatureEditor signatureEditor = new CadesSignatureEditor();

			// Set PKI default options (see Util.java)
			Util.setPkiDefaults(signatureEditor);

			if (!Util.isNullOrEmpty(dataFile)) {
				// Verify if the dataFile correspond to an existing file on our StorageMock class.
				if(!StorageMock.exists(dataFile)){
					throw new FileNotFoundException();
				}
				// Set the CMS data file
				signatureEditor.setDataFile(StorageMock.getDataPath(dataFile));
			}

			// Add first signature
			signatureEditor.addCmsFile(StorageMock.getDataPath(fileId1));

			if (!Util.isNullOrEmpty(fileId2)){
				// Verify if the fileId2 correspond to an existing file on our StorageMock class.
				if(!StorageMock.exists(fileId2)) {
					throw new FileNotFoundException();
				}
				// Add second signature
				signatureEditor.addCmsFile(StorageMock.getDataPath(fileId2));
			}

			// Generate path for output file and add to signature editor.
			String outputFile = StorageMock.generateFileId("p7s");
			signatureEditor.setOutputFilePath(StorageMock.getDataPath(outputFile));

			// Set encapsulate content to true (default)
			signatureEditor.setEncapsulateContent(true);

			// Merge files
			signatureEditor.merge();

			// If you want to delete the temporary files created by this step, use the method
			// dispose(). This method MUST be called after the complete() method, because it
			// deletes some files needed by the method.
			signatureEditor.dispose();

			// Render the signature page (templates/merge-cades-express/index.html).
			model.addAttribute("cmsFile", outputFile);
			return "merge-cades-express/index";
	}
}
