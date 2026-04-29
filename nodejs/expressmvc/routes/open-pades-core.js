const express = require('express');
const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();

function formatValidationResults(vr, indent) {
	indent = indent || '';
	if (!vr) return '';

	const passed  = vr.passedChecks || [];
	const errors  = vr.errors       || [];
	const warnings = vr.warnings    || [];
	const total = passed.length + errors.length + warnings.length;

	let out = `${indent}${total} checks performed`;
	if (!errors.length && !warnings.length) out += ', all passed';
	else if (errors.length) out += `, ${errors.length} error(s)`;

	const formatCheck = (check) => {
		let line = `${indent}- ${check.message}`;
		if (check.detail) line += ` (${check.detail})`;
		if (check.innerValidationResults) {
			line += '\n' + formatValidationResults(check.innerValidationResults, indent + '\t');
		}
		return line;
	};

	if (passed.length)   out += `\n${indent}Passed Checks:\n`  + passed.map(formatCheck).join('\n');
	if (errors.length)   out += `\n${indent}Errors:\n`         + errors.map(formatCheck).join('\n');
	if (warnings.length) out += `\n${indent}Warnings:\n`       + warnings.map(formatCheck).join('\n');

	return out;
}

function attachHelpers(signature) {
	if (!signature || !signature.signers) return;
	signature.signers.forEach((signer) => {
		if (signer.validationResults) {
			const vr = signer.validationResults;
			vr.isValid   = () => !(vr.errors && vr.errors.length > 0);
			vr.toString  = () => formatValidationResults(vr);
		}
	});
}

/**
 * GET /open-pades-core
 *
 * Inspects and validates signatures on a PDF file using REST PKI Core.
 */
router.get('/', async (req, res, next) => {
	const { fileId } = req.query;

	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		const client = Util.getRestPkiCoreClient();
		const fileContent = StorageMock.readSync(fileId);

		const response = await client.inspectSignature({
			file: {
				content: fileContent.toString('base64'),
				contentType: 'application/pdf',
				name: `${fileId}.pdf`,
			},
			validate: true,
			securityContextId: Util.getSecurityContextId(),
		});

		const signature = response.data;
		attachHelpers(signature);

		res.render('open-pades-core', { signature });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
