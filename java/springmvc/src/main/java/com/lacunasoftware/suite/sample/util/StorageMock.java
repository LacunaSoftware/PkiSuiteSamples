package com.lacunasoftware.suite.sample.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class StorageMock {

	private static Path tempFolderPath;

	public static Resource getResource(String resourceFile) {
		return new ClassPathResource(String.format("/static/%s", resourceFile));
	}

	public static void createTempFolder() throws IOException {
		if (tempFolderPath == null) {
			tempFolderPath = Files.createTempDirectory("PkiSuiteSample");
		}
	}

	public static Path getTempFolderPath() {
		return tempFolderPath;
	}

	public static Path getResourcePath(String resourceFile) throws FileNotFoundException {

		File resource;
		try {
			resource = getResource(resourceFile).getFile();
		} catch (IOException ex) {
			throw new FileNotFoundException();
		}

		return resource.toPath();
	}

}
