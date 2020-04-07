const express = require('express');
const { PadesSignatureStarter, InstallationNotFoundError } = require('pki-express');

const { Config } = require('../config');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();

/**
 * GET /
 *
 * The route to the application's homepage.
 */
router.get('/', (req, res) => {
	res.render('home');
});

/**
 * GET /check-pki-express
 *
 * ...
 */
router.get('/check-pki-express', (req, res, next) => {
	const starter = new PadesSignatureStarter();
	starter.setPdfToSignFromPathSync(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_PDF));
	starter.setCertificateFromBase64Sync('MIIGojCCBIqgAwIBAgIRAMpzsGiIzZZGogw9yZfV1e0wDQYJKoZIhvcNAQELBQAwUDELMAkGA1UEBhMCQlIxGDAWBgNVBAoTD0xhY3VuYSBTb2Z0d2FyZTELMAkGA1UECxMCSVQxGjAYBgNVBAMTEUxhY3VuYSBDQSBUZXN0IHYxMB4XDTE5MDEyMTIwMzg0MVoXDTIyMDEyMTIwMzgyM1owQjELMAkGA1UEBhMCQlIxGDAWBgNVBAoTD0xhY3VuYSBTb2Z0d2FyZTEZMBcGA1UEAxMQUGllcnJlIGRlIEZlcm1hdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK8st2TeNd8Ny4A8pI8g7SiWLrr9xxo45fwwm6JNAyOiEmdFTOIsCIzE+mNGOsv9dK7c1ZfH6mFymgY5zi3qcwTeMvibvCzO6MFluLl/NSEqL2lRiN1HKadNHc3M2MlU/tS0aMuhF/4Gz2/SWpnqWK+BSsbldeQ302nImDUlCGMYBLJY9bQkX37fpRpv8WGiOzTB/Pvzn0ZdB1VRRl3hNdFWs2KspDS/zlCsYnKZJ5gkIIOlYWdIdI1hq3GCzG8lEi0Qw0yooY5fpRx+anYsM6vL6PDRU3RH0WbySESCDR91fytFV/lbfEEs0ZDdWU02QACtxTYTo7acg99FkiprJdUCAwEAAaOCAoMwggJ/MAkGA1UdEwQCMAAwgZcGA1UdEQSBjzCBjKA4BgVgTAEDAaAvBC0wMDAwMDAwMDQ3MzYzMzYxODg2MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDCgFwYFYEwBAwagDgQMMDAwMDAwMDAwMDAwoB4GBWBMAQMFoBUEEzAwMDAwMDAwMDAwMDAwMDAwMDCBF3Rlc3RAbGFjdW5hc29mdHdhcmUuY29tMIHdBgNVHR8EgdUwgdIwRKBCoECGPmh0dHA6Ly9hbXBsaWEtcjEubGFjdW5hc29mdHdhcmUuY29tL2NybHMvbGFjdW5hLWNhLXRlc3QtdjEuY3JsMESgQqBAhj5odHRwOi8vYW1wbGlhLXIyLmxhY3VuYXNvZnR3YXJlLmNvbS9jcmxzL2xhY3VuYS1jYS10ZXN0LXYxLmNybDBEoEKgQIY+aHR0cDovL2FtcGxpYS1yMy5sYWN1bmFzb2Z0d2FyZS5jb20vY3Jscy9sYWN1bmEtY2EtdGVzdC12MS5jcmwwgfcGCCsGAQUFBwEBBIHqMIHnMEsGCCsGAQUFBzAChj9odHRwOi8vYW1wbGlhLXIxLmxhY3VuYXNvZnR3YXJlLmNvbS9jZXJ0cy9sYWN1bmEtY2EtdGVzdC12MS5jZXIwSwYIKwYBBQUHMAKGP2h0dHA6Ly9hbXBsaWEtcjIubGFjdW5hc29mdHdhcmUuY29tL2NlcnRzL2xhY3VuYS1jYS10ZXN0LXYxLmNlcjBLBggrBgEFBQcwAoY/aHR0cDovL2FtcGxpYS1yMy5sYWN1bmFzb2Z0d2FyZS5jb20vY2VydHMvbGFjdW5hLWNhLXRlc3QtdjEuY2VyMA0GCSqGSIb3DQEBCwUAA4ICAQBnfo9NP1DvCnoQ08OyRmw6/eS0kHYjEFlhX1f4DMPzUKWfft0oCS+c0RDyNUCEhCn3Rw3Nyqeh9XQXZUfo5twWeVJWQAx1r+ukLz4Zr6PpIJ14GrZXobziyijPxvcjrtDSWxRyzfrns1SNjxwfvoxRoVeREMPOhNl34c5ww8sujduJVfzZLzLrqHDbBuYx8yR86RLQOzSDYE6z+VQC9v8OsQWQ+fGwyRz3YI52uR1AjFCTTjai4a7f9sl0szN3so3ZXyxAIfw6UrTdD7aSqGKyO5cOJmDtuM1g7BTTH+Qd6piLttpts6Vfmyq648kdJqB07kxE15GoIsVyIqAemA5tQO1W6Kblii4n8z2CsQQPRDwqL8PNivFyXujlVlneE76AXd+nGi21nouW1nRZYl6u+akFORj3eiCpvZGmdyZFdGRSSa73LH0TR5Weo5jBhqBKSJp4Y8uYXeWc6OkRj9orWuV05bNEJPv/WMRBBa2yQ3R5+NgrG2EHIwtu1gROW5kMVXjydWIuCuZgs3W4Kq05xHWnO4W/IANSiTTee58WCPlzrQorGCVLbgNO5PMV3xW0ssyZs2yNnxeACWWDQ3yYsn5o3mewwemJH37PgSrWfI/rBwPlQ9em7f0MOSCKNxTZ4cuJbG8Jx/awgSKdSB0mVT6deioKvvDWiz9qmMermA==');
	starter.start()
		.then(() => {
			const { rc } = req.query;
			const { fwd } = req.query;
			const { op } = req.query;
			if (fwd) {
				if (op) {
					res.redirect(`/${rc}?rc=${fwd}-express&op=${op}`);
				} else {
					res.redirect(`/${rc}?rc=${fwd}-express`);
				}
			} else {
				res.redirect(`/${rc}-express`);
			}
		})
		.catch((err) => {
			if (err instanceof InstallationNotFoundError) {
				res.render('home/express-installation-not-found');
			} else {
				next(err);
			}
		});
});

/**
 * GET /check-restpki-token
 *
 * ...
 */
router.get('/check-restpki-token', (req, res) => {
	const { accessToken } = Config.getInstance().get('restPki');
	if (!accessToken || accessToken.indexOf(' ACCESS TOKEN ') >= 0) {
		res.render('home/restpki-token-not-set');
	} else {
		const { rc } = req.query;
		const { fwd } = req.query;
		const { op } = req.query;
		if (fwd) {
			if (op) {
				res.redirect(`/${rc}?rc=${fwd}-restpki&op=${op}`);
			} else {
				res.redirect(`/${rc}?rc=${fwd}-restpki`);
			}
		} else {
			res.redirect(`/${rc}-restpki`);
		}
	}
});

/**
 * GET /check-amplia-api-key
 *
 * ...
 */
router.get('/check-amplia-api-key', (req, res) => {
	const { apiKey } = Config.getInstance().get('amplia');
	if (!apiKey || apiKey.indexOf(' API KEY ') >= 0) {
		res.render('home/amplia-api-key-not-set');
	} else {
		const { rc, fwd, op } = req.query;
		if (fwd) {
			if (op) {
				res.redirect(`/${rc}?rc=${fwd}-amplia&op=${op}`);
			} else {
				res.redirect(`/${rc}?rc=${fwd}-amplia`);
			}
		} else {
			res.redirect(`/${rc}-amplia`);
		}
	}
});

module.exports = router;
