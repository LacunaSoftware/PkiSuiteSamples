package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.model.ServerFile;
import com.lacunasoftware.pkisuite.model.ServerFilesModel;
import com.lacunasoftware.pkisuite.util.SampleDocs;
import com.lacunasoftware.pkisuite.util.StorageMock;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/server-files")
public class ServerFilesController {

	/**
	 * GET /server-files
	 *
	 * This method will render a page to show the available server files to be used on the sample
	 * referred by "rc" parameter.
	 */
	@GetMapping
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
			case "printerFriendly":
				availableFiles.add(new ServerFile(SampleDocs.PDF_SIGNED_ONCE, "A sample PDF that was signed just once."));
				availableFiles.add(new ServerFile(SampleDocs.PDF_SIGNED_TWICE, "A sample PDF that was signed twice."));
				break;
			case "signCms":
			case "signPdf":
				availableFiles.add(new ServerFile(SampleDocs.SAMPLE_PDF, "A sample PDF document (size: 25kb) with no signatures."));
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

	/**
	 * POST /server-files
	 *
	 * This method is called when the user chooses a sample file. It will get the file's content and
	 * will store it on a temporary folder using our StorageMock class.
	 */
	@PostMapping
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

		// Only the REST PKI sample needs to pass this file as "cosign" variable when cosigning a
		// CMS file.
		if (rc.equals("cades-signature-rest") && model.getIsCmsCoSign()) {
			return String.format("redirect:/%s?cosign=%s", rc, fileId);
		}

		return String.format("redirect:/%s?fileId=%s", rc, fileId);
	}
}
