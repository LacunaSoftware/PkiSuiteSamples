package com.lacunasoftware.pkisuite.controller;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import com.lacunasoftware.amplia.RestException;
import com.lacunasoftware.pkiexpress.AuthCompleteResult;
import com.lacunasoftware.pkiexpress.Authentication;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpkicore.CompleteAuthenticationRequest;
import com.lacunasoftware.restpkicore.CompleteAuthenticationResponse;
import com.lacunasoftware.restpkicore.CreateSignatureSessionRequest;
import com.lacunasoftware.restpkicore.CreateSignatureSessionResponse;
import com.lacunasoftware.restpkicore.DigestAlgorithmAndValueModel;
import com.lacunasoftware.restpkicore.PrepareAuthenticationRequest;
import com.lacunasoftware.restpkicore.PrepareAuthenticationResponse;
import com.lacunasoftware.restpkicore.RestPkiOptions;
import com.lacunasoftware.restpkicore.RestPkiCoreClient;
import com.lacunasoftware.restpkicore.RestPkiService;
import com.lacunasoftware.restpkicore.RestPkiServiceFactory;
import com.lacunasoftware.restpkicore.ValidationResults;
import com.lacunasoftware.restpkicore.ValidationResultsModel;
import com.lacunasoftware.restpki.*;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("authentication-restpki-core")
public class AuthenticationRestPkiCoreController {    

    @GetMapping
    public String get(Model model, HttpServletResponse response) throws Exception {
        RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());
        UUID securityContextId = UUID.fromString(Util.getSecurityContextId().getId());

        PrepareAuthenticationRequest request = new PrepareAuthenticationRequest();
        request.setSecurityContextId(securityContextId);
        PrepareAuthenticationResponse prepareAuthResponse = service.prepareAuthentication(request);
        model.addAttribute("state", prepareAuthResponse.getState());
        model.addAttribute("toSignHashAlgorithm", prepareAuthResponse.getToSignHash().getAlgorithm().getValue());
        model.addAttribute("toSignHashValue", Util.encodeBase64(prepareAuthResponse.getToSignHash().getValue()));

        return "authentication-restpki-core/index";
    }

    @PostMapping
    public String post(
    Model model, 
    @RequestParam String state,
    @RequestParam String certificate,
    @RequestParam String signature) throws Exception {
        CompleteAuthenticationRequest request = new CompleteAuthenticationRequest();

        request.setCertificate(Util.decodeBase64(certificate));
        request.setSignature(Util.decodeBase64(signature));
        request.setState(state);
        RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		CompleteAuthenticationResponse response = service.completeAuthentication(request);
        ValidationResultsModel vr = response.getValidationResults();
        
        if(vr.getErrors() != null) {
            return "authentication-restpki-core/failed";
        }
        
        return "authentication-restpki-core/success";
    }
}

