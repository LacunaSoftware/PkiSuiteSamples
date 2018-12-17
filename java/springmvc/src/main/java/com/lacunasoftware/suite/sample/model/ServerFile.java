package com.lacunasoftware.suite.sample.model;

import com.lacunasoftware.suite.sample.util.SampleDocs;

public class ServerFile {
	private SampleDocs id;
	private String description;

	public ServerFile(SampleDocs id, String description) {
		this.id = id;
		this.description = description;
	}

	public SampleDocs getId() {
		return id;
	}

	public void setId(SampleDocs id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDownloadUrl() {
		return String.format("/download/sample/%s", id);
	}
}