package com.lacunasoftware.pkisuite.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.apache.commons.io.IOUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

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

	public static Path getTempFolderPath() throws IOException {
		if (tempFolderPath == null) {
			tempFolderPath = Files.createTempDirectory("PkiSuiteSample");
		}
		return tempFolderPath;
	}

	public static boolean exists(String fileId) {
		Path path;
		try {
			path = getDataPath(fileId);
		} catch (IOException ex) {
			return false;
		}

		return Files.exists(path);
	}

	public static Path getDataPath(String fileId) throws IOException {
		String filename = fileId.replace('_', '.');
		// Note: we're passing the filename arguments with "_" as "." because of URL safety

		return getTempFolderPath().resolve(filename);
	}

	public static Path getResourcePath(String resourceFile) throws IOException {
		return getResource(resourceFile).getFile().toPath();
	}

	public static byte[] getResourceContent(String resourceFile) throws IOException {
		Resource resource = getResource(resourceFile);
		InputStream fileStream = resource.getInputStream();
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		IOUtils.copy(fileStream, buffer);
		fileStream.close();
		buffer.flush();
		return buffer.toByteArray();
	}

	public static String generateFilename(String extension) {
		return generateFilename(extension, null);
	}

	public static String generateFilename(String extension, String originalFilename) {
		String filename, validExtension = null;
		if (originalFilename != null) {
			int i = originalFilename.lastIndexOf('.');
			filename = originalFilename.substring(0, i);
			validExtension = originalFilename.substring(i + 1);
		} else {
			filename = "";
		}

		if (!Util.isNullOrEmpty(extension)) {
			if (extension.charAt(0) == '.') {
				validExtension = extension.substring(1);
			} else {
				validExtension = extension;
			}
		}

		StringBuilder sb = new StringBuilder();
		if (!Util.isNullOrEmpty(filename)) {
			sb.append(filename);
			sb.append('.');
		}
		sb.append(UUID.randomUUID());
		if (!Util.isNullOrEmpty(validExtension)) {
			sb.append('.');
			sb.append(validExtension);
		}

		return sb.toString();
	}

	public static String generateFileId(String extension) {
		return generateFileId(extension, null);
	}

	public static String generateFileId(String extension, String originalFilename) {
		String filename = generateFilename(extension, originalFilename);
		return filename.replace('.', '_');
		// Note: The fileId are generated with "." as "_" because of URL safety.
	}

	public static String retriveFilename(String fileId) {
		String filename = fileId.replace('_', '.');
		int firstIndex = filename.indexOf('.');
		int lastIndex = filename.lastIndexOf('.');
		if (firstIndex >= 0 && lastIndex >= 0 && firstIndex != lastIndex) {
			return filename.substring(0, firstIndex) + filename.substring(lastIndex);
		}

		return filename;
	}

	public static InputStream openRead(String fileId) throws IOException {
		String filename = fileId.replace('_', '.');
		// Note: we're passing the filename arguments with "_" as "." because of URL safety

		Path path = getTempFolderPath().resolve(filename);
		return new FileInputStream(path.toFile());
	}

	public static String store(InputStream stream) throws IOException {
		return store(stream, "");
	}

	public static String store(InputStream stream, String extension) throws IOException {
		return store(stream, extension, null);
	}

	public static String store(InputStream stream, String extension, String filename) throws IOException {

		String fileId = generateFilename(extension, filename);

		Path path = getTempFolderPath().resolve(fileId);
		try (OutputStream out = new FileOutputStream(path.toFile())) {
			IOUtils.copy(stream, out);
		}

		return fileId.replace('.', '_');
		// Note: The fileId are generated with "." as "_" because of URL safety.
	}

	public static String store(byte[] content) throws IOException {
		return store(content, "");
	}

	public static String store(byte[] content, String extension) throws IOException {
		return store(content, extension, null);
	}

	public static String store(byte[] content, String extension, String filename) throws IOException {
		String fileId;
		try (InputStream stream = new ByteArrayInputStream(content)) {
			fileId = store(stream, extension, filename);
		}
		return fileId;
	}

	public static String getSampleDocName(SampleDocs sampleId) throws IOException {
		switch (sampleId) {
			case SAMPLE_PDF:
				return "SamplePdf.pdf";
			case PDF_SIGNED_ONCE:
				return "SamplePdfSignedOnce.pdf";
			case PDF_SIGNED_TWICE:
				return "SamplePdfSignedTwice.pdf";
			case CMS_SIGNED_ONCE:
				return "SampleCms.p7s";
			case CMS_SIGNED_TWICE:
				return "SampleCmsSignedTwice.p7s";
			default:
				throw new FileNotFoundException();
		}
	}


	public static Path getSampleDocPath(SampleDocs sampleId) throws IOException {
		String filename = getSampleDocName(sampleId);
		return getResourcePath(filename);
	}

	public static byte[] getPdfStampContent() throws IOException {
		return getResourceContent("stamp.png");
	}

	public static Path getBatchDocPath(int id) throws IOException {
		return getResourcePath(String.format("%02d.pdf", id % 10));
	}
}
