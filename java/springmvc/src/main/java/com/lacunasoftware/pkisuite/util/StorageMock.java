package com.lacunasoftware.pkisuite.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.apache.commons.io.IOUtils;

import javax.servlet.http.HttpSession;
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
		return exists(fileId, null);
	}

	public static boolean exists(String fileId, String extension) {
		Path path;
		try {
			path = getDataPath(fileId, extension);
		} catch (IOException ex) {
			return false;
		}

		return Files.exists(path);
	}

	public static Path getDataPath(String fileId) throws IOException {
		return getDataPath(fileId, null);
	}
	public static Path getSampleDiplomaPath() throws IOException {
		return getResourcePath("SampleDiploma.xml");
	}

	public static Path getDataPath(String fileId, String extension) throws IOException {
		String filename = fileId.replace('_', '.');
		// Note: we're passing the filename arguments with "_" as "." because of URL safety
		if (extension != null) {
			filename += extension;
		}

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
			filename = i == -1 ? originalFilename : originalFilename.substring(0, 1);
			validExtension = i == -1 ? "" : originalFilename.substring(i + 1);
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

	// region Certificate & Key Store

	public static boolean existsKey(String certId, String extension) {
		String filename = certId + extension;
		Path path;
		try {
			path = getTempFolderPath().resolve(filename);
		} catch (IOException ex) {
			return false;
		}

		return Files.exists(path);
	}

	public static Path getKeyPath(String certId, String extension) throws IOException {
		String filename = certId + extension;
		return getTempFolderPath().resolve(filename);
	}

	public static void storeKey(InputStream stream, String extension, String certId) throws IOException {
		String filename = certId + extension;
		Path path = getTempFolderPath().resolve(filename);
		try (FileOutputStream fos = new FileOutputStream(path.toFile())) {
			IOUtils.copy(stream, fos);
		}
	}

	public static void storeKey(byte[] content, String extension, String certId) throws IOException {
		try (InputStream bais = new ByteArrayInputStream(content)) {
			storeKey(bais, extension, certId);
		}
	}

	public static String readKeyAsText(String certId, String extension) throws IOException {

		String filename = certId + extension;
		StringBuilder sb = new StringBuilder();
		FileReader fileReader = new FileReader(getTempFolderPath().resolve(filename).toFile());
		BufferedReader bufferedReader = new BufferedReader(fileReader);

		String line = null;
		while ((line = bufferedReader.readLine()) != null) {
			sb.append(line);
		}

		return sb.toString();
	}

	// endregion

	// region Verification Code

	/**
	 * Returns the verification code associated with the given document, or null if no verification
	 * code has been associated with it.
	 *
	 * @param session
	 * @param fileId
	 * @return
	 */
	public static String getVerificationCode(HttpSession session, String fileId) {
		// >>>>> NOTICE <<<<<
		// This should be implemented on your application as a SELECT on your "document table" by the
		// ID of the document, returning the value of the verification code column
		return (String) session.getAttribute(String.format("Files/%s/Code", fileId));
	}

	/**
	 * Registers the verification code for a given document.
	 *
	 * @param session
	 * @param fileId
	 * @param code
	 */
	public static void setVerificationCode(HttpSession session, String fileId, String code) {
		// >>>>> NOTICE <<<<<
		// This should be implemented on your application as an UPDATE on your "document table"
		// filling the verification code column, which should be an indexed column
		session.setAttribute(String.format("Files/%s/Code", fileId), code);
		session.setAttribute(String.format("Codes/%s", code), fileId);
	}

	/**
	 * Returns the ID of the document associated with a given verification code, or null if no
	 * document matcher the given code.
	 *
	 * @param session
	 * @param code
	 * @return
	 */
	public static String lookupVerificationCode(HttpSession session, String code) {
		if (code == null || code.length() == 0) {
			return null;
		}
		// >>>>> NOTICE <<<<<
		// This should be implemented on your application as a SELECT on your "document table" by the
		// verification code column, which should be an indexed column
		return (String) session.getAttribute(String.format("Codes/%s", code));
	}

	// endregion

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
			case CMS_DETACHED_1:
				return "CMSDetached1.p7s";
			case CMS_DETACHED_2:
				return "CMSDetached2.p7s";
			case CMS_ATTACHED_1:
				return "CMSAttached1.p7s";
			case CMS_ATTACHED_2:
				return "CMSAttached2.p7s";
			case CMS_DATA_FILE:
				return "CMSDataFile.pdf";
			case SAMPLE_NFE:
				return "SampleNFe.xml";
			case SAMPLE_XML:
				return "SampleDocument.xml";
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

	public static byte[] getIcpBrasilLogoContent() throws IOException {
		return getResourceContent("icp-brasil.png");
	}

	public static byte[] getValidationResultIconContent(boolean isValid) throws IOException {
		String filename = isValid ? "ok.png" : "not-ok.png";
		return getResourceContent(filename);
	}

	public static Path getBatchDocPath(int id) throws IOException {
		return getResourcePath(String.format("%02d.pdf", id % 10));
	}

	public static Path getSamplePkcs12Path() throws IOException {
		return getResourcePath("Pierre de Fermat.pfx");
	}
}
