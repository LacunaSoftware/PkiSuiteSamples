package com.lacunasoftware.pkisuite.model;

import com.lacunasoftware.pkisuite.util.SampleDocs;

import java.util.List;

public class MergeServerFilesModel {
	private SampleDocs cmsDataFile;
	private List<MergeServerFile> availableFiles;
	private List<SampleDocs> chosenFileIds;
	private Boolean needDataFile;

	public SampleDocs getCmsDataFile() {
		return cmsDataFile;
	}

	public void setCmsDataFile(SampleDocs cmsDataFile) {
		this.cmsDataFile = cmsDataFile;
	}

	public List<MergeServerFile> getAvailableFiles() {
		return availableFiles;
	}

	public void setAvailableFiles(List<MergeServerFile> availableFiles) {
		this.availableFiles = availableFiles;
	}

	public List<SampleDocs> getChosenFileIds() {
		return chosenFileIds;
	}

	public void setChosenFileIds(List<SampleDocs> chosenFileIds) {
		this.chosenFileIds = chosenFileIds;
	}

	public Boolean getNeedDataFile(){
		return this.needDataFile;
	}

	public void setNeedDataFile(Boolean needDataFile){
		this.needDataFile = needDataFile;
	}

	public String getDownloadUrl() {
		return String.format("/download/sample/%s", cmsDataFile);
	}
}
