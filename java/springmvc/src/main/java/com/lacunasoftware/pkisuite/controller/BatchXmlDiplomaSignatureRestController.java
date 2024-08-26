package com.lacunasoftware.pkisuite.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.lacunasoftware.restpki.RestException;

@Controller
@RequestMapping("/batch-xml-diploma-signature-rest")
public class BatchXmlDiplomaSignatureRestController {

	/**
	 * GET /batch-xml-diploma-signature-rest/
	 * This action initiates a Xml signature using REST PKI
	 * that will sign the element DadosDiploma with e-CNPJ.
	 */
	@GetMapping
	public String index(Model model) {
		// It is up to your application's business logic to determine which documents
		// will compose
		// the batch.
		List<Integer> documentIds = new ArrayList<Integer>();
		for (int i = 1; i <= 30; i++) {
			documentIds.add(i);
		}
		model.addAttribute("documentIds", documentIds);

		// Render the batch signature page
		return "batch-xml-diploma-signature-rest/index";
	}

	/**
	 * POST /batch-xml-diploma-signature-rest/dados-registro
	 * This action adds the signed xmls from the previous step into this one
	 */
	@PostMapping("/dados-registro")
	public String postDadosRegistro(
			@RequestParam(value = "signedXmls") String signedXmls,
			Model model,
			HttpServletResponse response)
			throws IOException, RestException {
		// Split the string based on commas and remove any surrounding spaces
		List<String> stringArray = Arrays.stream(signedXmls.split(","))
				.map(String::trim)
				.collect(Collectors.toList());

		model.addAttribute("inputXmls", stringArray);
		return "batch-xml-diploma-signature-rest/dados-registro";
	}
	
	/**
	 * GET /batch-xml-diploma-signature-rest/diploma
	 * This action initiates a Xml signature using REST PKI
	 * that will signs the element DadosRegistro with e-CPF.
	 */
	@PostMapping("/diploma")
	public String postDiploma(
		@RequestParam(value = "signedXmls") String signedXmls,
		Model model,
		HttpServletResponse response) throws IOException, RestException {
			// Split the string based on commas and remove any surrounding spaces
			List<String> stringArray = Arrays.stream(signedXmls.split(","))
			.map(String::trim)
			.collect(Collectors.toList());

			
			model.addAttribute("inputXmls", stringArray);
			
			// Render the batch signature page
			return "batch-xml-diploma-signature-rest/diploma";
		}
	}
	