package com.lacunasoftware.pkisuite.model;

import java.util.List;

import com.lacunasoftware.pkisuite.util.SampleDocs;

public class ServerFilesModel {
	private boolean isCmsCoSign;
	private boolean isXmlToSign;
	private List<ServerFile> availableFiles;
	private SampleDocs chosenFileId;

	public boolean getIsCmsCoSign() {
		return isCmsCoSign;
	}

	public void setIsCmsCoSign(boolean isCmsCoSign) {
		this.isCmsCoSign = isCmsCoSign;
	}

	public List<ServerFile> getAvailableFiles() {
		return availableFiles;
	}

	public void setAvailableFiles(List<ServerFile> availableFiles) {
		this.availableFiles = availableFiles;
	}

	public SampleDocs getChosenFileId() {
		return chosenFileId;
	}

	public void setChosenFileId(SampleDocs chosenFileId) {
		this.chosenFileId = chosenFileId;
	}

    public boolean getIsXmlToSign() {
		return isXmlToSign;
	}

	public void setIsXmlToSign(boolean isXmlToSign) {
		this.isXmlToSign = isXmlToSign;
	}
}
