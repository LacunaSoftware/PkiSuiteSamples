'use strict';
const { RestPkiClient, StandardSecurityContexts } = require('restpki-client');
const { TimestampAuthority } = require('pki-express');
const fs = require('fs');
const crypto = require('crypto');
const { Config } = require('./config');
const { StorageMock } = require('./storage-mock');

class Util {

	//region REST PKI Configuration

	/**
	 * Creates an instance of the RestPkiClient class, use to connect to REST PKI
	 * on every sample using the REST PKI client library.
	 */
	static getRestPkiClient() {

		// Get configuration from config/{env}.js file. It will choose the
		// desirable configuration according to the environment of the
		// application.
		const CONFIG = Config.getInstance().get('restPki');

		// Get your token and endpoint values from used configuration file.
		let token = CONFIG['accessToken'];
		let endpoint = CONFIG['endpoint'];

		// Throw exception if token is not set (this check is here just for the
		// sake of newcomers, you can remove it).
		if (!token || token.indexOf(' ACCESS TOKEN ') >= 0) {
			throw new Error('The REST PKI access token was not set! Hint: to ' +
				'run this sample you must generate an API access token on the ' +
				'REST PKI website and paste it on the file config/default.js.');
		}

		return new RestPkiClient(endpoint, token);
	}

	/**
	 * This method is called by all pages to determine the security context to be
	 * used.
	 *
	 * Security contexts dictate witch root certification authorities are trusted
	 * during certificate validation. In you API calls, you can use on of the
	 * standard security contexts or reference one of your custom contexts.
	 */
	static getSecurityContextId() {

		// Get configuration from config/{env}.js file. It will choose the
		// desirable configuration according to the environment of the
		// application.
		const CONFIG = Config.getInstance();

		if (CONFIG.get('trustLacunaTestRoot')) {
			/*
			 * Lacuna Text PKI (for development purposes only!)
			 *
			 * This security context trusts ICP-Brasil certificates as well as
			 * certificates on Lacuna Software's test PKI. Use it to accept the
			 * test certificates provided by Lacuna Software.
			 *
			 * THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
			 */
			return StandardSecurityContexts.LACUNA_TEST;
			// Notice for On Premises users: this security context might not exist
			// on your installation, if you encounter an error please contact
			// developer support.
		}

		// Otherwise, accept only certificates from ICP-Brasil, by passing the
		// "PKI_BRAZIL" security context.
		return StandardSecurityContexts.PKI_BRAZIL;
	}

	//endregion

	//region PKI Express Configuration

	/**
	 * Sets default configuration to any PKI Express operator.
	 *
	 * @param operator The operator instance to be configured.
	 */
	static setPkiDefaults(operator) {

		// Get configuration from config/{env}.js file. It will choose the
		// desirable configuration according to the environment of the
		// application.
		const CONFIG = Config.getInstance().get('pkiExpress');

		// Set the operator to trust in a custom trusted root, you need to
		// inform the operator class. We will add each trusted root from
		// configuration file. In this sample, we assumed that all trusted roots
		// are in the resources/ folder. You are free to pass any path.
		let trustedRoots = CONFIG['trustedRoots'];
		for (let root of trustedRoots) {
			operator.addTrustedRootSync(StorageMock.getResourcePath(root));
		}

		// Set operator to "OFFLINE MODE" (default: false):
		operator.offline = CONFIG['offline'];

		// Set the operator to use a timestamp authority when performing an
		// timestamp operation. In this sample, we will use the REST PKI by
		// default to emit a timestamp. It only be filled if the REST PKI was
		// provided.
		const REST_PKI_CONFIG = Config.getInstance().get('restPki');
		if (REST_PKI_CONFIG['accessToken']) {

			// Get an instance of the TimestampAuthority class, responsible to
			// inform the url and authentication logic to be used when contacting
			// and timestamp authority.
			let authority = new TimestampAuthority('https://pki.rest/tsp/a402df41-8559-47b2-a05c-be555bf66310');

			// Set authentication strategy. In the case of REST PKI, is using a
			// bearer token.
			authority.setOAuthTokenAuthentication(REST_PKI_CONFIG['accessToken']);

			// Add authority to be used on operator.
			operator.timestampAuthority = authority;
		}

		// Trust Lacuna Test Root (for development purposes only!). Use this to
		// accept the test certificate provided by Lacuna Software.
		//
		// THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!
		operator.trustLacunaTestRoot = Config.getInstance().get('trustLacunaTestRoot');
	}

	//endregion

	static setExpiredPage(res) {
		res.set({
			'Cache-Control': 'private, no-store, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
			'Pragma': 'no-cache'
		});
	}

	static range(start, end) {
		let array = [...new Array(end - start + 1).keys()];
		for (let i = 0; i < array.length; i++) {
			array[i] += start;
		}
		return array;
	}

	static getValidationResultIcon(isValid) {
		let appRoot = process.cwd();
		let filename = isValid ? 'ok.png' : 'not-ok.png';
		return fs.readFileSync(appRoot + '/public/' + filename);
	}

	static getIcpBrasilLogoContent() {
		let appRoot = process.cwd();
		return fs.readFileSync(appRoot + '/public/icp-brasil.png');
	}

	static joinStringPt(strings) {
		let text = '';
		let count = strings.length;
		for (let i = 0; i < strings.length; i++) {
			if (i > 0) {
				if (i < count - 1) {
					text += ', ';
				} else {
					text += ' and ';
				}
			}
			text += strings[i];
		}
		return text;
	}
	
	static getDescription(cert) {
		let text = '';
		text += Util.getDisplayName(cert);
		if (cert.pkiBrazil.cpf) {
			text += ` (CPF ${cert.pkiBrazil.cpfFormatted})`;
		}
		if (cert.pkiBrazil.cnpj) {
			text += `, company ${cert.pkiBrazil.companyName} (CNPJ ${cert.pkiBrazil.cnpjFormatted})`
		}
		return text;
	}

	static getDisplayName(cert) {
		if (cert.pkiBrazil.responsavel) {
			return cert.pkiBrazil.responsavel;
		}
		return cert.subjectName.commonName;
	}

	static generateVerificationCode() {

		/*
		 * Configuration of the code generation
		 * ------------------------------------
		 *
		 * - CodeSize   : size of the code in characters
		 *
		 * Entropy
		 * -------
		 *
		 * The resulting entropy of the code in bits is the size of the code
		 * times 4. Here are some suggestions:
		 *
		 * - 12 characters = 48 bits
		 * - 16 characters = 64 bits
		 * - 20 characters = 80 bits
		 * - 24 characters = 92 bits
		 */
		let codeSize = 16;
  
		// Generate the entropy with Node.js Crypto's cryptographically strong
		// pseudo-random generation function.
		let numBytes = Math.floor(codeSize / 2);
		let randBuffer = crypto.randomBytes(numBytes);
  
		return randBuffer.toString('hex').toUpperCase();
	 }
  
	static formatVerificationCode(code) {
		/*
		* Examples
		* --------
		*
		* - codeSize = 12, codeGroups = 3 : XXXX-XXXX-XXXX
		* - codeSize = 12, codeGroups = 4 : XXX-XXX-XXX-XXX
		* - codeSize = 16, codeGroups = 4 : XXXX-XXXX-XXXX-XXXX
		* - codeSize = 20, codeGroups = 4 : XXXXX-XXXXX-XXXXX-XXXXX
		* - codeSize = 20, codeGroups = 5 : XXXX-XXXX-XXXX-XXXX-XXXX
		* - codeSize = 25, codeGroups = 5 : XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
		*/
		let codeGroups = 4;

		// Return the code separated in groups
		let charsPerGroup = (code.length - code.length % codeGroups) / codeGroups;
		let text = '';
		for (let i = 0; i < code.length; i++) {
			if (i !== 0 && i % charsPerGroup === 0) {
				text += '-';
			}
			text += code[i];
		}

		return text;
	}

	static parseVerificationCode(code) {
		let text = '';
		for (let i = 0; i < code.length; i++) {
			if (code[i] !== '-') {
				text += code[i];
			}
		}
		return text;
	}  
}

exports.Util = Util;