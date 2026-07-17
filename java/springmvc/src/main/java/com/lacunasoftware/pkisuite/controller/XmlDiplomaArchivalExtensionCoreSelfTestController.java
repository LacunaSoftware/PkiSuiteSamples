package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpkicore.ArchiveTimestampInfo;
import com.lacunasoftware.restpkicore.ExtendArchivalSignatureRequest;
import com.lacunasoftware.restpkicore.ExtendArchivalSignatureResponse;
import com.lacunasoftware.restpkicore.FileReferenceModel;
import com.lacunasoftware.restpkicore.RestPkiService;
import com.lacunasoftware.restpkicore.RestPkiServiceFactory;
import com.lacunasoftware.restpkicore.SecurityContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * ================================================================================================
 * Diploma "carimbo do tempo" via Archival Signature Extension — REST PKI Core, headless self-test
 * ================================================================================================
 *
 * PURPOSE: carimbar an already-signed diploma with a fresh archive timestamp, exercising the
 * extendArchivalSignature() capability added on the feature/extendachive branch (commit 93e460c)
 * of RestPkiNGJavaClient (restpkicore-client, wired via mavenLocal in build.gradle).
 *
 * The MEC digital diploma is a XAdES-A document that already carries signatures and archive
 * timestamps. This operation validates it against the given security context and, if the current
 * active archive timestamp is closer to expiring than minActiveTimestampValidityDays, adds a NEW
 * archive timestamp to extend its long-term validity. No user certificate / Web PKI is involved.
 *
 *   1. RestPkiServiceFactory.getService(...)      -> instantiates the client
 *   2. service.extendArchivalSignature(request)   -> POST api/signature/archival-extension
 *                                                    -> returns the extended (carimbado) document
 *
 * Run it (with the app started) via:  GET /xml-diploma-archival-extension-core/selftest
 */
@RestController
@RequestMapping("/xml-diploma-archival-extension-core")
public class XmlDiplomaArchivalExtensionCoreSelfTestController {

    private static final String DIPLOMA_NAME = "diploma-97963832928.xml";

    // Force a fresh archive timestamp regardless of how long the current one is still valid, while
    // staying well within the server's date arithmetic (very large values overflow server-side).
    private static final int MIN_ACTIVE_TIMESTAMP_VALIDITY_DAYS = 36500; // 100 years

    @GetMapping(value = "/selftest", produces = MediaType.TEXT_PLAIN_VALUE)
    public String selfTest() {
        StringBuilder out = new StringBuilder();
        try {
            // --- 1. Load the already-signed diploma. ----------------------------------------------
            byte[] xml = Files.readAllBytes(StorageMock.getResourcePath(DIPLOMA_NAME));
            out.append("OK  loaded signed diploma: ").append(DIPLOMA_NAME)
               .append(" (").append(xml.length).append(" bytes)\n");

            // --- 2. Instantiate the REST PKI Core client (the library under test). -----------------
            RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());
            out.append("OK  instantiated RestPkiService (restpkicore-client)\n");

            // --- 3. Build the archival-extension request. ------------------------------------------
            FileReferenceModel file = new FileReferenceModel();
            file.setContent(xml);
            file.setMimeType("application/xml");
            file.setName(DIPLOMA_NAME);

            ExtendArchivalSignatureRequest request = new ExtendArchivalSignatureRequest();
            request.setFile(file);
            // ICP-Brasil trust for validating the diploma's existing signatures and timestamps.
            request.setSecurityContextId(SecurityContext.pkiBrazil.getUUID());
            request.setReturnTimestampModels(true);
            request.setMinActiveTimestampValidityDays(MIN_ACTIVE_TIMESTAMP_VALIDITY_DAYS);

            // --- 4. Extend the archival signature (add a fresh archive timestamp). -----------------
            ExtendArchivalSignatureResponse response = service.extendArchivalSignature(request);
            out.append("OK  extendArchivalSignature -> extended=").append(response.isExtended()).append("\n");
            out.append("    daysUntilExpiration      = ").append(response.getDaysUntilExpiration()).append("\n");
            appendTs(out, "activeTimestampBefore", response.getActiveTimestampBefore());
            appendTs(out, "activeTimestampAfter ", response.getActiveTimestampAfter());

            // --- 5. Save the extended (carimbado) diploma. -----------------------------------------
            byte[] extended = resolveContent(service, response.getFile());
            if (extended == null) {
                out.append("\nNOTE: document not extended (current archive timestamp still valid enough); "
                        + "no new file returned.\n");
                return out.toString();
            }
            Path outPath = StorageMock.getTempFolderPath().resolve(
                    "carimbado-" + DIPLOMA_NAME);
            Files.write(outPath, extended);
            out.append("OK  saved carimbado diploma to: ").append(outPath.toString())
               .append(" (").append(extended.length).append(" bytes)\n");

            out.append("\nSUCCESS: extendArchivalSignature added an archive timestamp to the diploma.\n");
        } catch (Throwable ex) {
            out.append("\nFAILED: ").append(ex.getClass().getName()).append(": ")
               .append(ex.getMessage()).append("\n");
            for (StackTraceElement el : ex.getStackTrace()) {
                if (el.getClassName().contains("lacunasoftware")) {
                    out.append("    at ").append(el).append("\n");
                }
            }
        }
        return out.toString();
    }

    private static void appendTs(StringBuilder out, String label, ArchiveTimestampInfo ts) {
        if (ts == null) {
            out.append("    ").append(label).append("    = <none>\n");
            return;
        }
        out.append("    ").append(label).append("    = issued ").append(ts.getDateIssued())
           .append(", expires ").append(ts.getDateExpires()).append("\n");
    }

    /** Returns the extended document bytes, whether the server inlined them or returned a URL. */
    private static byte[] resolveContent(RestPkiService service, FileReferenceModel f) throws Exception {
        if (f == null) {
            return null;
        }
        if (f.getContent() != null && f.getContent().length > 0) {
            return f.getContent();
        }
        if (f.getUrl() != null && !f.getUrl().isEmpty()) {
            return service.getContent(f.getUrl());
        }
        return null;
    }
}
