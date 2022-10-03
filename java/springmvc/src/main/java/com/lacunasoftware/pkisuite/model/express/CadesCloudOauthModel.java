package com.lacunasoftware.pkisuite.model.express;

import com.lacunasoftware.pkiexpress.TrustServiceAuthParameters;
import com.lacunasoftware.pkiexpress.TrustServiceInfo;
import java.util.List;

public class CadesCloudOauthModel {

    private List<TrustServiceAuthParameters> services;
	private String cpf;

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
}
