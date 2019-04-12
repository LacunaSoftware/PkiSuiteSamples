package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.StorageMock;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * This controller allows the user to upload a file to be used on a sample, identified by "rc"
 * parameter. Once the file is uploaded, we save it on the temporary folder controlled by
 * StorageMock class and after that, we redirect the user to the GET function on the required
 * controller passing the filename on the "fileId" URL argument.
 */
@Controller
@RequestMapping("/upload")
public class UploadController {

	/**
	 * GET /upload
	 *
	 * Renders upload page.
	 */
	@GetMapping
	public String get(@RequestParam String rc, @RequestParam(required=false) String certId) {
		return "upload/index";
	}

	/**
	 * POST /upload
	 *
	 * Receives form submission, receiving the upload file. In this action, we will store this file
	 * on our temporary folder using StorageMock class, and will redirect the user passing the
	 * filename on the "fileId" URL argument.
	 */
	@PostMapping
	public String post(
			@RequestParam String rc,
			@RequestParam(required=false) String certId,
			@RequestParam MultipartFile userfile
	) throws IOException {
		InputStream fileStream = userfile.getInputStream();
		String originalFilename = userfile.getOriginalFilename();
		String fileId = StorageMock.store(fileStream, null, originalFilename);

		if (certId != null) {
			return String.format("redirect:/%s?fileId=%s&certId=%s", rc, fileId, certId);
		}
		return String.format("redirect:/%s?fileId=%s", rc, fileId);
	}
}
