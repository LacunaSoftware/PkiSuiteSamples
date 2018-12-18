const express = require('express');
const { PadesSignatureStarter, InstallationNotFoundError } = require('pki-express');

const { Config } = require('../config');
const { SampleDocs, StorageMock } = require('../storage-mock');

let router = express.Router();

/**
 * GET /
 *
 * The route to the application's homepage.
 */
router.get('/', (req, res, next) => {
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
	starter.setCertificateFromBase64Sync('MIIFLTCCBBegAwIBAgIQAPlQfZfK+GbabULPDzWHmTALBgkqhkiG9w0BAQswVTELMAkGA1UEBhMCQlIxEzARBgNVBAoMCklDUC1CcmFzaWwxHTAbBgNVBAsMFExhY3VuYSBTb2Z0d2FyZSAtIExTMRIwEAYDVQQDDAlMYWN1bmEgQ0EwHhcNMTUwMTIwMTAyMzU5WhcNMTkwMTIwMTAyMzU1WjBtMQswCQYDVQQGEwJCUjETMBEGA1UECgwKSUNQLUJyYXNpbDEuMCwGA1UECwwlQXV0aGVudGljYXRlZCBieSBMYWN1bmEgU29mdHdhcmUgLSBMUzEZMBcGA1UEAwwQUGllcnJlIGRlIEZlcm1hdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALzmguTacZ4YiFpzUvE9xQEFB2bs8FXdXK8DCEDIq6mTudxFQzicCvF1rn5tgJZVDl4ANjKGDnQFUUhW50gf9xCxcytYkf7jWeabiGrHYweQggoTbguc8mY/OIl1W+0GAoVtpFrBs27zHcE4kPu9DJwJjKNHp00SuRkx35WezRRas940vg15eZKFneyw0VaacJelVdtSwto5HrsoFgQIEQhh/33FHhfVt9XnZ1UiZVZPZcOETJ8ebJpjtKL83yy4QKFc235dp0iudAdCVIY4oAlwVjCn6U9dIZk7qR0H1OYE1f2z8lTtiWx/jg/j+bBpMayVz7HEFqJe/mFBimeY5ZECAwEAAaOCAeMwggHfMAkGA1UdEwQCMAAwHwYDVR0jBBgwFoAU0qjYpb7yDHVFWfnN4BUYSk7c2/cwDgYDVR0PAQH/BAQDAgXgMIGmBgNVHREEgZ4wgZugPQYFYEwBAwGgNAQyMDEwMTE5NzA0NzM2MzM2MTg4NjAwMDAwMDAwMDAwMDAwMDAwMDQ5Mzg4ODI3U1NQREagFwYFYEwBAwagDgQMODg1NTc3NTM0NjUyoCgGBWBMAQMFoB8EHTkxMjkzOTIxOTc3NTc3NzY2NjZCcmFzaWxpYURGgRd0ZXN0QGxhY3VuYXNvZnR3YXJlLmNvbTBQBgNVHSAESTBHMEUGBmBMAQIBADA7MDkGCCsGAQUFBwIBFi1odHRwOi8vY2F0ZXN0LmxhY3VuYXNvZnR3YXJlLmNvbS9kcGNhY3JmYi5wZGYwOQYDVR0fBDIwMDAuoCygKoYoaHR0cDovL2NhdGVzdC5sYWN1bmFzb2Z0d2FyZS5jb20vY3Jscy9jYTAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwTAYIKwYBBQUHAQEEQDA+MDwGCCsGAQUFBzAChjBodHRwOi8vY2F0ZXN0LmxhY3VuYXNvZnR3YXJlLmNvbS9jZXJ0aWZpY2F0ZXMvY2EwCwYJKoZIhvcNAQELA4IBAQAAyc4Ylt4Fa2n8DdfjFLTAt4Y78uR3Fo+on8yE2fUG/B/CNLw0TEuSKpvCra1igNjU4VmqRsPAGJiKGaOZe0XeuySVvd16z6J92GLI/02qKvPBuC2qaBF9eu+Hhd4G0G/gnIKFEr/LMoOkBrfU9CL/9jm3/MT2s9F8uF8OBjP0TDaMJkc3yNS9RYEhAM1EdfXUStEv4Zs+Yy+CkkL1vCha1+sH8zNdkYbNMxdGYQTrcG8I1TTh9NLxitTAM7j5JrPycp3rUvu/rq94VnBN9CzN62TWvkaFpQuZSg6FKrsjyGWbpUN96Y21p7QTUAliq226eGBk5BZD8+7ZuZGmG07J');
	starter.start()
		.then(() => {
			const rc = req.query['rc'];
			const fwd = req.query['fwd'];
			const op = req.query['op'];
			if (fwd) {
				if (op) {
					res.redirect(`/${rc}?rc=${fwd}-express&op${op}`);
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
router.get('/check-restpki-token', (req, res, next) => {

	const accessToken = Config.getInstance().get('restPki')['accessToken'];
	if (!accessToken || accessToken.indexOf(' ACCESS TOKEN ') >= 0) {
		res.render('home/restpki-token-not-set');
	} else {
		const rc = req.query['rc'];
		const fwd = req.query['fwd'];
		const op = req.query['op'];
		if (fwd) {
			if (op) {
				res.redirect(`/${rc}?rc=${fwd}-restpki&op${op}`);
			} else {
				res.redirect(`/${rc}?rc=${fwd}-restpki`);
			}
		} else {
			res.redirect(`/${rc}-restpki`);
		}
	}
});

module.exports = router;