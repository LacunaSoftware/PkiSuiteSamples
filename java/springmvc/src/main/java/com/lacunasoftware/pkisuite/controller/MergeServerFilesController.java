package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.model.MergeServerFilesModel;
import com.lacunasoftware.pkisuite.model.MergeServerFile;
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
@RequestMapping("/merge-server-files")
public class MergeServerFilesController {

	/**
	 * GET /merge-server-files
	 *
	 * This method will render a page to show the available server files to be used on the merge
	 * sample referred by "rc" parameter.
	 */
	@GetMapping
	public String get(
		@RequestParam String rc,
		Model model
	) throws IOException {

		List<MergeServerFile> availableFiles = new ArrayList<MergeServerFile>();

		availableFiles.add(new MergeServerFile(
				SampleDocs.CMS_DETACHED_1, SampleDocs.CMS_DETACHED_2, true,
				"A sample where both CMS don't have encapsulated content.")
		);
		availableFiles.add(new MergeServerFile(
				SampleDocs.CMS_ATTACHED_1, SampleDocs.CMS_DETACHED_2, true,
				"A sample where a CMS has encapsulated content and another doesn't.")
		);
		availableFiles.add(new MergeServerFile(
				SampleDocs.CMS_ATTACHED_1, SampleDocs.CMS_ATTACHED_2, false,
				"A sample where both CMS have encapsulated content.")
		);
		availableFiles.add(new MergeServerFile(
				SampleDocs.CMS_DETACHED_1, true,
				"A sample where the original file is attached to a CMS that doesn't have encapsulated content.")
		);

		// It is up to your application's business logic to determine which server documents
		// to be available for the signature.
		MergeServerFilesModel MergeServerFilesModel = new MergeServerFilesModel();
		MergeServerFilesModel.setCmsDataFile(SampleDocs.CMS_DATA_FILE);
		MergeServerFilesModel.setAvailableFiles(availableFiles);

		model.addAttribute("model", MergeServerFilesModel);
		return "merge-server-files/index";
	}

	/**
	 * POST /merge-server-files
	 *
	 * This method is called when the user chooses a sample file. It will get the file's content and
	 * will store it on a temporary folder using our StorageMock class.
	 */
	@PostMapping
	public String post(
		@RequestParam String rc,
		@ModelAttribute MergeServerFilesModel model
	) throws IOException {
		Path path;
		String redirectUrl, filename, fileId;
		List<SampleDocs> files = model.getChosenFileIds();

		if(model.getNeedDataFile()){
			path = StorageMock.getSampleDocPath(model.getCmsDataFile());
			filename = StorageMock.getSampleDocName(model.getCmsDataFile());
			// Copy file to the temporary folder, where the upload files are stored.
			try (InputStream fileStream = new FileInputStream(path.toFile())) {
				fileId = StorageMock.store(fileStream, "pdf", filename);
			}

			redirectUrl = String.format("redirect:/%s?dataFile=%s&", rc, fileId);
		} else {
			redirectUrl = String.format("redirect:/%s?", rc);
		}
		
		for(int i = 0; i < files.size(); i++) {
			path = StorageMock.getSampleDocPath(files.get(i));
			filename = StorageMock.getSampleDocName(files.get(i));
			// Copy file to the temporary folder, where the upload files are stored.
			try (InputStream fileStream = new FileInputStream(path.toFile())) {
				fileId = StorageMock.store(fileStream, "p7s", filename);
			}

			if(i > 0){
				redirectUrl = String.format("%s&fileId2=%s", redirectUrl, fileId);
			} else {
				redirectUrl = String.format("%sfileId1=%s", redirectUrl, fileId);
			}
		}

		return redirectUrl;
	}
}
