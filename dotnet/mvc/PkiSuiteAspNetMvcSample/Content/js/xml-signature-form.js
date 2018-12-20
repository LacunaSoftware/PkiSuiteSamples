/*
 *
 */
var xmlSignatureForm = (function () {

	var pki = null;
	var formElements = {};

	// -------------------------------------------------------------------------------------------------
	// Function called once the page is loaded
	// -------------------------------------------------------------------------------------------------
	function init(fe) {

		formElements = fe;

		// Wireup of button clicks
		formElements.signButton.click(sign);
		formElements.refreshButton.click(refresh);

		// Block the UI while we get things ready
		$.blockUI({ message: 'Initializing ...' });

		// Get an instance of the LacunaWebPKI object. If a license was set on Web.config, the _Layout.cshtml master
		// view will have placed it on the global variable _webPkiLicense, which we pass to the class constructor.
		pki = new LacunaWebPKI(_webPkiLicense);

		// Call the init() method on the LacunaWebPKI object, passing a callback for when
		// the component is ready to be used and another to be called when an error occurrs
		// on any of the subsequent operations. For more information, see:
		// https://webpki.lacunasoftware.com/#/Documentation#coding-the-first-lines
		// http://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_init
		pki.init({
			ready: loadCertificates, // as soon as the component is ready we'll load the certificates
			defaultError: onWebPkiError // generic error callback on Content/js/app/site.js
		});
	}


	// -------------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Refresh" button
	// -------------------------------------------------------------------------------------------------
	function refresh() {
		// Block the UI while we load the certificates
		$.blockUI();
		// Invoke the loading of the certificates
		loadCertificates();
	}

	// -------------------------------------------------------------------------------------------------
	// Function that loads the certificates, either on startup or when the user
	// clicks the "Refresh" button. At this point, the UI is already blocked.
	// -------------------------------------------------------------------------------------------------
	function loadCertificates() {

		// Call the listCertificates() function to list the user's certificates. For more information see
		// http://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_listCertificates
		pki.listCertificates({

			// specify that expired certificates should be ignored
			//filter: pki.filters.isWithinValidity,

			// in order to list only certificates within validity period and having a CPF (ICP-Brasil), use this instead:
			//filter: pki.filters.all(pki.filters.hasPkiBrazilCpf, pki.filters.isWithinValidity),

			// id of the select to be populated with the certificates
			selectId: formElements.certificateSelect.attr('id'),

			// function that will be called to get the text that should be displayed for each option
			selectOptionFormatter: function (cert) {
				var s = cert.subjectName + ' (issued by ' + cert.issuerName + ')';
				var now = new Date();
				if (now > cert.validityEnd) {
					s = '[EXPIRED] ' + s; // useful to let the user know that his certificate has expired
				} else if (now < cert.validityStart) {
					s = '[NOT YET VALID] ' + s; // this is very uncommon
				}
				return s;
			}

		}).success(function () {

			// once the certificates have been listed, unblock the UI
			$.unblockUI();

		});
	}

	// -------------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Sign" button
	// -------------------------------------------------------------------------------------------------
	function sign() {

		// Block the UI while we perform the signature
		$.blockUI({ message: 'Signing ...' });

		// Get the value attribute of the option selected on the dropdown. Since we placed the "thumbprint"
		// property on the value attribute of each item (see function loadCertificates above), we're actually
		// retrieving the thumbprint of the selected certificate.
		var selectedCertThumbprint = formElements.certificateSelect.val();

		// Call the readCertificate() function on the Web PKI component passing the selected certificate's
		// thumbprint. This retrieves the certificate's encoding.
		pki.readCertificate(selectedCertThumbprint).success(function (certEncoded) {

			// Place the certificate encoding in a hidden input field on the page's form
			formElements.certContentField.val(certEncoded);

			// Call the signHash() function on the Web PKI component passing:
			// - The thumbprint of the certificate
			// - The "to-sign-hash" and digest algorithm given by the server
			pki.signHash({
				thumbprint: selectedCertThumbprint,
				hash: formElements.toSignHashField.val(),
				digestAlgorithm: formElements.digestAlgorithmField.val()
			}).success(function (signature) {
				// Place the signature in a hidden input field on the page's form
				formElements.signatureField.val(signature);
				// Submit the form
				formElements.form.submit();
			});
		});
	}

	// -------------------------------------------------------------------------------------------------
	// Function called if an error occurs on the Web PKI component
	// -------------------------------------------------------------------------------------------------
	function onWebPkiError(message, error, origin) {
		// Unblock the UI
		$.unblockUI();
		// Log the error to the browser console (for debugging purposes)
		if (console && console.log) {
			console.log('An error has occurred on the signature browser component: ' + message, { message, error, origin });
		}
		// Show the message to the user. You might want to substitute the alert below with a more user-friendly UI
		// component to show the error.
		addAlert('danger', 'An error has occurred on the signature browser component: ' + message);
	}

	return {
		init: init
	};
})();