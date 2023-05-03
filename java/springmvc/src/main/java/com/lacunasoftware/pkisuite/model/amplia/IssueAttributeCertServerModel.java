package com.lacunasoftware.pkisuite.model.amplia;


public class IssueAttributeCertServerModel {
	private String name;
	private String degree;
    private String registrationNumber;
    private String course;


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDegree() {
		return degree;
	}

	public void setDegree(String degree) {
		this.degree = degree;
	}

    public String getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}

    public String getCourse() {
		return course;
	}

	public void setCourse(String course) {
		this.course = course;
	}
}
