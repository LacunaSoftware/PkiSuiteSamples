const express = require("express");

const router = express.Router();

/**
 * Define routes.
 */
router.use('/authentication-cloudhub', require("./authentication-cloudhub"));
router.use("/authentication-express", require("./authentication-express"));
router.use("/authentication-restpki", require("./authentication-restpki"));
router.use(
	"/batch-pades-signature-express",
	require("./batch-pades-signature-express")
);
router.use(
	"/batch-pades-signature-restpki",
	require("./batch-pades-signature-restpki")
);
router.use(
	"/batch-cades-signature-express",
	require("./batch-cades-signature-express")
);
router.use(
	"/batch-cades-signature-restpki",
	require("./batch-cades-signature-restpki")
);
router.use("/cades-server-key-express", require("./cades-server-key-express"));
router.use("/cades-signature-restpki", require("./cades-signature-restpki"));
router.use("/cades-signature-express", require("./cades-signature-express"));
router.use("/check-cades-express", require("./check-cades-express"));
router.use("/check-pades-restpki", require("./check-pades-restpki"));
router.use("/check-pades-express", require("./check-pades-express"));
router.use("/download", require("./download"));
router.use("/", require("./home"));
router.use("/issue-cert-server-amplia", require("./issue-cert-server-amplia"));
router.use("/issue-cert-user-amplia", require("./issue-cert-user-amplia"));
router.use("/issue-pkcs12-cert-server-amplia", require("./issue-pkcs12-cert-server-amplia"));
router.use("/list-cert-select2", require("./list-cert-select2"));
router.use("/list-cert-jquery", require("./list-cert-jquery"));
router.use("/merge-cades-express", require("./merge-cades-express"));
router.use("/merge-server-files", require("./merge-server-files"));
router.use("/open-cades-express", require("./open-cades-express"));
router.use("/open-cades-restpki", require("./open-cades-restpki"));
router.use("/open-pades-express", require("./open-pades-express"));
router.use("/open-pades-restpki", require("./open-pades-restpki"));
router.use("/pades-server-key-express", require("./pades-server-key-express"));
router.use("/pades-signature-express", require("./pades-signature-express"));
router.use("/pades-signature-restpki", require("./pades-signature-restpki"));
router.use("/pades-signature-core", require("./pades-signature-core"));
router.use(
	"/pades-wo-communication-restpki",
	require("./pades-wo-communication-restpki")
);
router.use(
	"/pades-cloud-oauth-express",
	require("./pades-cloud-oauth-express")
);
router.use("/pades-cloud-pwd-express", require("./pades-cloud-pwd-express"));
router.use(
	"/printer-version-cades-express",
	require("./printer-version-cades-express")
);
router.use(
	"/printer-version-pades-restpki",
	require("./printer-version-pades-restpki")
);
router.use(
	"/printer-version-pades-express",
	require("./printer-version-pades-express")
);
router.use("/read-cert-select2", require("./read-cert-select2"));
router.use("/read-cert-jquery", require("./read-cert-jquery"));
router.use("/receita-simples-express", require("./receita-simples-express"));
router.use("/rsa-web", require("./rsa-web"));
router.use("/server-files", require("./server-files"));
router.use("/timestamp-pdf-express", require("./timestamp-pdf-express"));
router.use("/tsp-callback", require("./tsp-callback"));
router.use("/upload", require("./upload"));
router.use("/xml-cloud-oauth-express", require("./xml-cloud-oauth-express"));
router.use(
	"/xml-nfe-signature-restpki",
	require("./xml-nfe-signature-restpki")
);
router.use(
	"/xml-nfe-signature-express",
	require("./xml-nfe-signature-express")
);
router.use("/xml-server-key-express", require("./xml-server-key-express"));
router.use("/xml-signature-restpki", require("./xml-signature-restpki"));
router.use("/xml-signature-express", require("./xml-signature-express"));
router.use("/pades-signature-cloudhub-restpki", require("./pades-signature-cloudhub-restpki"));


module.exports = router;
