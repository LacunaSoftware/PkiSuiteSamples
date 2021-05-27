package com.lacunasoftware.pkisuite.model;

import com.lacunasoftware.pkisuite.util.SampleDocs;

import java.util.List;
import java.util.ArrayList;

public class MergeServerFile {
	private List<SampleDocs> files;
	private String description;
	private Boolean needDataFile = false;

	public MergeServerFile(SampleDocs file1, SampleDocs file2, Boolean needDataFile, String description){
		this.files = new ArrayList<SampleDocs>();
		this.files.add(file1);
		this.files.add(file2);
		this.needDataFile = needDataFile;
		this.description = description;
	}

	public MergeServerFile(SampleDocs file1, SampleDocs file2, String description){
		this.files = new ArrayList<SampleDocs>();
		this.files.add(file1);
		this.files.add(file2);
		this.description = description;
	}
	
	public MergeServerFile(SampleDocs file, Boolean needDataFile, String description){
		this.files = new ArrayList<SampleDocs>();
		this.files.add(file);
		this.needDataFile = needDataFile;
		this.description = description;
	}

	public Boolean getNeedDataFile() {
		return needDataFile;
	}

	public List<SampleDocs> getFiles() {
		return files;
	}

	public String getDescription() {
		return description;
	}

	public List<String> getDownloadUrls() {
		List<String> urls = new ArrayList<String>();
		for (SampleDocs doc : this.files) {
			urls.add(String.format("/download/sample/%s", doc));
		}
		return urls;
	}
}
