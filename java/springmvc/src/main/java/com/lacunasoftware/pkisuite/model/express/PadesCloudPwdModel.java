package com.lacunasoftware.pkisuite.model.express;

import com.lacunasoftware.pkiexpress.TrustServiceInfo;
import java.util.List;

public class PadesCloudPwdModel {
	List<TrustServiceInfo> services;
	String cpf;

	public List<TrustServiceInfo> getServices() {
		return services;
	}

	public void setServices(List<TrustServiceInfo> services) {
		this.services = services;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}
}
