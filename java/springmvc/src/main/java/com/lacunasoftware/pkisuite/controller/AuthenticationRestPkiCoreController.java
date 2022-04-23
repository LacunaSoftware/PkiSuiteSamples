package com.lacunasoftware.pkisuite.controller;

import javax.servlet.http.HttpServletResponse;

import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpkicore.AuthenticationFailures;
import com.lacunasoftware.restpkicore.AuthenticationResult;
import com.lacunasoftware.restpkicore.CompleteAuthenticationOptions;
import com.lacunasoftware.restpkicore.PrepareAuthenticationResult;
import com.lacunasoftware.restpkicore.PrepareAuthenticationOptions;
import com.lacunasoftware.restpkicore.RestPkiService;
import com.lacunasoftware.restpkicore.RestPkiServiceFactory;
import com.lacunasoftware.restpkicore.ValidationResults;

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

        // Get an instance of the RestPkiService class, responsible for contacting Rest
        // PKI core to prepare and complete the authentication operation.
        RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

        // Prepare the Authentication and set the Request options.
        PrepareAuthenticationOptions options = new PrepareAuthenticationOptions();
        options.setSecurityContext(Util.getSecurityContextIdCore());
        PrepareAuthenticationResult prepareAuthResult = service.prepareAuthentication(options);

        // Render the authentication page
        model.addAttribute("state", prepareAuthResult.getState());
        model.addAttribute("toSignHashAlgorithm", prepareAuthResult.getToSignHash().getAlgorithm().getName());
        model.addAttribute("toSignHashValue", prepareAuthResult.getToSignHash().getValueAsBase64());
        return "authentication-restpki-core/index";
    }

    @PostMapping
    public String post(
            Model model,
            @RequestParam String state,
            @RequestParam String certificate,
            @RequestParam String signature) throws Exception {

        // Get another instance of the RestPkiService class
        RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

        // Complete the Autentication with the user's certificate and the hash's signature, plus the state
        CompleteAuthenticationOptions request = new CompleteAuthenticationOptions();
        request.setCertificateFromBase64(certificate);
        request.setSignatureFromBase64(signature);
        request.setState(state);

        AuthenticationResult authResult = service.completeAuthentication(request);

        // If the authentication was successful show the user detail, otherwise show the failure page

        if (authResult.isSuccess()) {
            model.addAttribute("userCert", authResult.getCertificate());
            return "authentication-restpki-core/success";

        } else if (authResult.getFailure().equals(AuthenticationFailures.CERTIFICATEFAILEDVALIDATION)) {

            ValidationResults vr = authResult.getValidationResults();
            model.addAttribute("vrHtml", vr.toHtml());
            return "authentication-restpki-core/failed";

        } else {

            // Session has become stale, restart process
            return "redirect:/authentication-restpki-core";
        }
    }
}
