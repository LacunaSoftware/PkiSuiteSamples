package com.lacunasoftware.pkisuite.model.express;
import java.util.List;

import com.lacunasoftware.pkiexpress.TrustServiceAuthParameters;
import com.lacunasoftware.pkiexpress.TrustServiceInfo;

public class AuthenticationCloudExpressModel {
    private List<TrustServiceAuthParameters> services;
	private String cpf;
    private String state;

	public List<TrustServiceAuthParameters> getServices() {
		return services;
	}

	public void setServices(List<TrustServiceAuthParameters> services) {
		this.services = services;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

    public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
}