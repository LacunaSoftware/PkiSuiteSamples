package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.suite.sample.model.ServerFile;
import com.lacunasoftware.suite.sample.model.ServerFilesModel;
import com.lacunasoftware.suite.sample.util.SampleDocs;
import com.lacunasoftware.suite.sample.util.StorageMock;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Controller
public class ServerFilesController {

	@RequestMapping(value = "/server-files", method = {RequestMethod.GET})
	public String get(
		@RequestParam String rc,
		@RequestParam String op,
		Model model
	) throws IOException {

		List<ServerFile> availableFiles = new ArrayList<ServerFile>();
		boolean isCmsCoSign = false;

		switch (op) {
			case "cosignCms":
				isCmsCoSign = true;
				availableFiles.add(new ServerFile(SampleDocs.CMS_SIGNED_ONCE, "A sample CMS file that was signed once."));
				availableFiles.add(new ServerFile(SampleDocs.CMS_SIGNED_TWICE, "A sample CMS file that was signed twice."));
				break;
			case "cosignPdf":
			case "printerFriendlyPdf":
				availableFiles.add(new ServerFile(SampleDocs.PDF_SIGNED_ONCE, "A sample PDF that was signed just once."));
				availableFiles.add(new ServerFile(SampleDocs.PDF_SIGNED_TWICE, "A sample PDF that was signed twice."));
				break;
			case "signCms":
			case "signPdf":
				availableFiles.add(new ServerFile(SampleDocs.SAMPLE_PDF, "A sample PDF file to be signed"));
				break;
			default:
				throw new FileNotFoundException();
		}

		// It is up to your application's business logic to determine which server documents
		// to be available for the signature.
		ServerFilesModel serverFilesModel = new ServerFilesModel();
		serverFilesModel.setIsCmsCoSign(isCmsCoSign);
		serverFilesModel.setAvailableFiles(availableFiles);

		model.addAttribute("model", serverFilesModel);
		return "server-files/index";
	}

	@RequestMapping(value = "/server-files", method = {RequestMethod.POST})
	public String post(
		@RequestParam String rc,
		@ModelAttribute ServerFilesModel model
	) throws IOException {

		Path path = StorageMock.getSampleDocPath(model.getChosenFileId());
		String filename = StorageMock.getSampleDocName(model.getChosenFileId());

		// Copy file to the temporary folder, where the upload files are stored.
		String fileId;
		try (InputStream fileStream = new FileInputStream(path.toFile())) {
			fileId = StorageMock.store(fileStream, "pdf", filename);
		}

		if (model.getIsCmsCoSign()) {
			return String.format("redirect:/%s?cosign=%s", rc, fileId);
		}

		return String.format("redirect:/%s?fileId=%s", rc, fileId);
	}
}
