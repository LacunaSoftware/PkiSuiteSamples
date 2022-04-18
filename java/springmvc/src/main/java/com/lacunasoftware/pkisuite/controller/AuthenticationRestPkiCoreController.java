package com.lacunasoftware.pkisuite.controller;

import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpkicore.CompleteAuthenticationRequest;
import com.lacunasoftware.restpkicore.DigestAlgorithmAndValueModel;
import com.lacunasoftware.restpkicore.PrepareAuthenticationRequest;
import com.lacunasoftware.restpkicore.PrepareAuthenticationResponse;
import com.lacunasoftware.restpkicore.RestPkiService;
import com.lacunasoftware.restpkicore.RestPkiServiceFactory;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("authentication-restpki-core")
public class AuthenticationRestPkiCoreController {    

    @GetMapping
    public String get(Model model, HttpServletResponse response){
        // CompleteAuthenticationRequest completeAuthenticationRequest = new CompleteAuthenticationRequest();
        return "authentication-restpki-core/index";
    }

    @PostMapping
    public String postPrepareAndCompleteAuthentication(Model model, HttpServletResponse response) throws Exception {
        RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

        PrepareAuthenticationRequest prepareAuthRequest = new PrepareAuthenticationRequest();
        // Tomar cuidado com essa linha
        prepareAuthRequest.setSecurityContextId(UUID.fromString(Util.getSecurityContextId().getId()));
        prepareAuthRequest.setIgnoreRevocationStatusUnknown(true);

        // Executes POST request for prepareAuthentication (api/v2/authentication)
        PrepareAuthenticationResponse prepareAuthResponse = service.prepareAuthentication(prepareAuthRequest);
        System.out.println("Deu bom");
        System.out.println(prepareAuthResponse.toString());

        String state = prepareAuthResponse.getState();
        // DigestAlgorithmAndValueModel toSignHash = prepareAuthResponse.getToSignHash();

        CompleteAuthenticationRequest completeAuthRequest = new CompleteAuthenticationRequest();
        
        completeAuthRequest.setState(state);


        return "authentication-restpki-core/success";
    }

}
