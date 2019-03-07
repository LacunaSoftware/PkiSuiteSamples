package com.lacunasoftware.pkisuite.model;

import com.lacunasoftware.pkisuite.util.SampleDocs;

import java.util.List;

public class ServerFilesModel {
	private boolean isCmsCoSign;
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
}
