package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.suite.sample.util.StorageMock;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * This controller allows the user to upload a file to be used on a sample, identified by "rc"
 * parameter. Once the file is uploaded, we save it on the temporary folder controlled by
 * StorageMock class and after that, we redirect the user to the GET function on the required
 * controller passing the filename on the "userfile" URL argument.
 */
@Controller
public class UploadController {

	@RequestMapping(value = "/upload", method = {RequestMethod.GET})
	public String get() {
		return "upload/index";
	}

	@RequestMapping(value = "/upload", method = {RequestMethod.POST})
	public String post(
			@RequestParam String rc,
			@RequestParam MultipartFile userfile
	) throws IOException {
		InputStream fileStream = userfile.getInputStream();
		String originalFilename = userfile.getOriginalFilename();
		String fileId = StorageMock.store(fileStream, null, originalFilename);

		return String.format("redirect:/%s?fileId=%s", rc, fileId);
	}

}
