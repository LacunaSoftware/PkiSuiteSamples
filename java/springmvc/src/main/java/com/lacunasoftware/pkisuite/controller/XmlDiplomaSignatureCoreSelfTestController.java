package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpkicore.CertificateReferenceModel;
import com.lacunasoftware.restpkicore.CompleteSignatureRequestV2;
import com.lacunasoftware.restpkicore.DocumentFileModel;
import com.lacunasoftware.restpkicore.DocumentModel;
import com.lacunasoftware.restpkicore.FileReferenceModel;
import com.lacunasoftware.restpkicore.PrepareSignatureRequest;
import com.lacunasoftware.restpkicore.PrepareSignatureResponse;
import com.lacunasoftware.restpkicore.RestPkiService;
import com.lacunasoftware.restpkicore.RestPkiServiceFactory;
import com.lacunasoftware.restpkicore.SecurityContext;
import com.lacunasoftware.restpkicore.SignatureParametersModel;
import com.lacunasoftware.restpkicore.SignatureTypes;
import com.lacunasoftware.restpkicore.XmlSignatureOptions;
import com.lacunasoftware.restpkicore.XmlSignatureTypes;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.cert.X509Certificate;

/**
 * ================================================================================================
 * XML Diploma Signature (REST PKI Core) — headless self-test
 * ================================================================================================
 *
 * PURPOSE: verify that the locally-published RestPkiNGJavaClient library
 * (com.lacunasoftware.restpki:restpkicore-client, wired to 1.4.0 in build.gradle via mavenLocal)
 * works end-to-end, by driving a full XML signature of a diploma through REST PKI Core.
 *
 * This is a TEST HARNESS, not a product sample. It replaces the browser + Web PKI part of a normal
 * signature flow with local signing using the bundled "Pierre de Fermat.pfx" test certificate, so
 * the whole flow (start -> sign hash -> complete) can run without a browser or an installed
 * certificate. It exercises exactly the library methods a real rest-core XML sample would use, using
 * the same generic prepare/complete endpoints as the pades-signature-core sample:
 *
 *   1. RestPkiServiceFactory.getService(...)     -> instantiates the client (proves it loads/wires)
 *   2. service.startSignature(request)           -> round-trips to core.pki.rest, returns to-sign data
 *   3. (local) sign the returned DigestInfo      -> stands in for Web PKI signHash
 *   4. service.completeSignature(request)        -> returns the signed diploma document
 *
 * If every step succeeds and a signed XML comes back, the local 1.4.0 build is functional.
 *
 * Run it (with the app started) via:  GET /xml-diploma-signature-core/selftest
 */
@RestController
@RequestMapping("/xml-diploma-signature-core")
public class XmlDiplomaSignatureCoreSelfTestController {

    // The diploma to sign, bundled under src/main/resources/static (see StorageMock.getResourcePath).
    private static final String DIPLOMA_NAME = "diploma-97963832928.xml";

    // Password of the bundled test certificate (Pierre de Fermat.pfx). It is a well-known sample
    // certificate; this test uses the value directly to keep the harness self-contained.
    private static final char[] PFX_PASSWORD = "1234".toCharArray();

    @GetMapping(value = "/selftest", produces = MediaType.TEXT_PLAIN_VALUE)
    public String selfTest() {
        StringBuilder out = new StringBuilder();
        try {
            // --- 1. Load the diploma XML that will be signed. --------------------------------------
            byte[] xml = Files.readAllBytes(StorageMock.getResourcePath(DIPLOMA_NAME));
            out.append("OK  loaded diploma: ").append(DIPLOMA_NAME)
               .append(" (").append(xml.length).append(" bytes)\n");

            // --- 2. Load the test certificate + private key (stands in for the user's cert). -------
            KeyStore ks = KeyStore.getInstance("PKCS12");
            try (InputStream in = Files.newInputStream(StorageMock.getSamplePkcs12Path())) {
                ks.load(in, PFX_PASSWORD);
            }
            String alias = ks.aliases().nextElement();
            PrivateKey privateKey = (PrivateKey) ks.getKey(alias, PFX_PASSWORD);
            X509Certificate cert = (X509Certificate) ks.getCertificate(alias);
            out.append("OK  loaded test cert: ").append(cert.getSubjectX500Principal().getName()).append("\n");

            // --- 3. Instantiate the REST PKI Core client (the library under test). -----------------
            RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());
            out.append("OK  instantiated RestPkiService (restpkicore-client)\n");

            // --- 4. Start a full XML signature of the diploma. -------------------------------------
            PrepareSignatureRequest request = new PrepareSignatureRequest();

            FileReferenceModel file = new FileReferenceModel();
            file.setContent(xml);
            file.setContentType("text/xml");
            file.setName(DIPLOMA_NAME);
            request.setFile(file);

            CertificateReferenceModel certRef = new CertificateReferenceModel();
            certRef.setContent(cert.getEncoded());
            request.setCertificate(certRef);

            request.setSignatureType(SignatureTypes.XML);
            XmlSignatureOptions xmlOptions = new XmlSignatureOptions();
            xmlOptions.setType(XmlSignatureTypes.FULLXML);
            request.setXmlSignatureOptions(xmlOptions);

            // Use the Lacuna test security context so the sample test certificate is trusted.
            request.setSecurityContextId(SecurityContext.lacunaTest.getUUID());

            PrepareSignatureResponse start = service.startSignature(request);
            SignatureParametersModel toSign = start.getToSign();
            out.append("OK  startSignature -> state=").append(abbreviate(start.getState()))
               .append(", digestOid=").append(toSign.getSignatureAlgorithm().getDigestAlgorithmOid()).append("\n");

            // --- 5. Sign the returned hash locally (this is what Web PKI does in the browser). -----
            byte[] signature = signLocally(toSign, privateKey);
            out.append("OK  signed to-sign bytes locally (").append(signature.length).append(" bytes)\n");

            // --- 6. Complete the signature and get the signed diploma back. ------------------------
            CompleteSignatureRequestV2 complete = new CompleteSignatureRequestV2();
            complete.setState(start.getState());
            complete.setSignature(signature);
            DocumentModel document = service.completeSignature(complete);

            byte[] signedXml = readSignedFile(service, document);
            Path signedPath = StorageMock.getTempFolderPath().resolve("signed-" + DIPLOMA_NAME);
            Files.write(signedPath, signedXml);
            out.append("OK  completeSignature -> signed diploma (")
               .append(signedXml.length).append(" bytes), documentId=").append(document.getId()).append("\n");
            out.append("OK  saved to: ").append(signedPath.toString()).append("\n");

            out.append("\nSUCCESS: restpkicore-client 1.4.0 signed the diploma end-to-end.\n");
        } catch (Throwable ex) {
            out.append("\nFAILED: ").append(ex.getClass().getName()).append(": ")
               .append(ex.getMessage()).append("\n");
            // Include a compact stack trace to help diagnose which library call failed.
            for (StackTraceElement el : ex.getStackTrace()) {
                if (el.getClassName().contains("lacunasoftware")) {
                    out.append("    at ").append(el).append("\n");
                }
            }
        }
        return out.toString();
    }

    /**
     * Reproduces what Web PKI's signHash does on the client: an RSA PKCS#1 v1.5 signature over the
     * to-sign bytes returned by REST PKI Core. We sign the DigestInfo the server provides (NONEwithRSA
     * just applies PKCS#1 padding + RSA), which is exactly the value Web PKI would sign.
     */
    private static byte[] signLocally(SignatureParametersModel toSign, PrivateKey privateKey) throws Exception {
        byte[] digestInfo = toSign.getDigestInfo();
        if (digestInfo != null && digestInfo.length > 0) {
            Signature sig = Signature.getInstance("NONEwithRSA");
            sig.initSign(privateKey);
            sig.update(digestInfo);
            return sig.sign();
        }
        // Fallback: sign the raw to-sign data with the full "<digest>withRSA" algorithm.
        String digest = digestNameFromOid(toSign.getSignatureAlgorithm().getDigestAlgorithmOid());
        Signature sig = Signature.getInstance(digest + "withRSA");
        sig.initSign(privateKey);
        sig.update(toSign.getData());
        return sig.sign();
    }

    /**
     * Returns the signed document bytes, whether the server inlined them or returned a URL to fetch.
     */
    private static byte[] readSignedFile(RestPkiService service, DocumentModel document) throws Exception {
        DocumentFileModel signedFile = document.getSignedFile();
        if (signedFile == null) {
            throw new IllegalStateException("completeSignature returned no signed file");
        }
        if (signedFile.getContent() != null && signedFile.getContent().length > 0) {
            return signedFile.getContent();
        }
        return service.getContent(signedFile.getUrl());
    }

    private static String digestNameFromOid(String oid) {
        if (oid == null) {
            return "SHA256";
        }
        switch (oid) {
            case "1.3.14.3.2.26":              return "SHA1";
            case "2.16.840.1.101.3.4.2.1":     return "SHA256";
            case "2.16.840.1.101.3.4.2.2":     return "SHA384";
            case "2.16.840.1.101.3.4.2.3":     return "SHA512";
            default:                            return "SHA256";
        }
    }

    private static String abbreviate(String s) {
        if (s == null) {
            return "null";
        }
        return s.length() <= 16 ? s : s.substring(0, 16) + "...";
    }
}
