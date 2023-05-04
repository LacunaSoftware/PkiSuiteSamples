package com.lacunasoftware.pkisuite.model.amplia;


public class IssueAttributeCertServerModel {
	private String name;
	private String degree;
    private String registrationNumber;
    private String course;
	private String institutionName;
	private String institutionCity;
	private String institutionState;
	private String cpf;
	private String eea;
	
    public String getEea() {
		return eea;
	}

	public void setEea(String eea) {
		this.eea = eea;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}
	
    public String getInstitutionCity() {
		return institutionCity;
	}

	public void setInstitutionCity(String institutionCity) {
		this.institutionCity = institutionCity;
	}
	
	public String getInstitutionState() {
		return institutionState;
	}

	public void setInstitutionState(String institutionState) {
		this.institutionState = institutionState;
	}

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
