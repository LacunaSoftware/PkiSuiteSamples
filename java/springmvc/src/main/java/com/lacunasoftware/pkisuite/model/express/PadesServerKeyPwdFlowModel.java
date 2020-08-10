package com.lacunasoftware.pkisuite.model.express;

import com.lacunasoftware.pkiexpress.TrustServiceInfo;
import com.lacunasoftware.pkiexpress.TrustServiceInfoModel;
import com.lacunasoftware.pkiexpress.TrustServicesManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.List;

public class PadesServerKeyPwdFlowModel {
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
