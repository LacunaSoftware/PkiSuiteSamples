// ------------------------------------------------------------------------------------------------
// This file contains logic for calling the Web PKI component to start a signature. It is only an
// example, feel free to alter it to meet your application's needs.
// ------------------------------------------------------------------------------------------------
var signatureStartForm = (function () {

	// Auxiliary global variable.
	var formElements = {};

	// Instance Web PKi object.
	var pki = new LacunaWebPKI(_webPkiLicense);

	// ---------------------------------------------------------------------------------------------
	// Initializes the signature form. It is called once the page is loaded.
	// ---------------------------------------------------------------------------------------------
	function init(fe) {

		// Receive form parameters received as arguments.
		formElements = fe;

		// Wireup of button clicks.
		formElements.signButton.click(startSignature);
		formElements.refreshButton.click(refresh);

		// Block the UI while we het things ready.
		$.blockUI({message: 'Initializing ...'});

		// Call the init() method on the LacunaWebPKI object, passing a callback for when the
		// component is ready to be used and another to be called when an error occurs on any
		// of the subsequent operations. For more information, see:
		// https://docs.lacunasoftware.com/en-us/articles/web-pki/get-started.html#coding-the-first-lines
		// https://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_init
		pki.init({
			// As soon as the component is ready we'll load the certificates.
			ready: loadCertificates,
			// Generic error callback (see function (declaration below).
			defaultError: onWebPkiError
		});

	}

	// ---------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Refresh" button.
	// ---------------------------------------------------------------------------------------------
	function refresh() {
		// Block the UI while we load the certificates.
		$.blockUI({message: 'Refreshing ...'});
		// Invoke the loading of the certificates.
		loadCertificates();
	}

	// ---------------------------------------------------------------------------------------------
	// Function that loads the certificates, either on startup or when the user clicks the "Refresh"
	// button. At this point, the UI is already blocked.
	// ---------------------------------------------------------------------------------------------
	function loadCertificates() {

		// Call the listCertificates() method to list the user's certificates.
		pki.listCertificates({

			// ID of the <select> element to be populated with the certificates.
			selectId: formElements.certificateSelect.attr('id'),

			// Function that will be called to get the text that should be displayed for each option.
			selectOptionFormatter: function (cert) {
				var s = cert.subjectName + ' (issued by ' + cert.issuerName + ')';
				if (new Date() > cert.validityEnd) {
					s = '[EXPIRED] ' + s;
				}
				return s;
			}

		}).success(function () {

			// Once the certificates have been listed, unblock the UI.
			$.unblockUI();
		});
	}

	// ---------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Sign File" button.
	// ---------------------------------------------------------------------------------------------
	function startSignature() {

		// Block the UI while we perform the signature.
		$.blockUI({message: 'Starting signature ...'});

		// Get the value attribute of the option selected on the dropdown. Since we placed the
		// "thumbprint" property on the value attribute of each item (see function loadCertificates
		// above), we're actually retrieving the thumbprint of the selected certificate.
		var selectedCertThumbprint = formElements.certificateSelect.val();
		formElements.certThumbField.val(selectedCertThumbprint);

		// Get certificate content to be passed to "start" step of the signature.
		pki.readCertificate(selectedCertThumbprint).success(function (certEncoded) {

			// Submit form to start signature on server-side.
			formElements.certContentField.val(certEncoded);
			formElements.form.submit();

		});
	}

	// ---------------------------------------------------------------------------------------------
	// Function called if an error occurs on the Web PKI component.
	// ---------------------------------------------------------------------------------------------
	function onWebPkiError(message, error, origin) {

		// Unblock the UI.
		$.unblockUI();

		// Log the error to the browser console (for debugging purposes).
		if (console) {
			console.log('An error has occurred on the signature browser component: ' + message, error);
		}

		// Show the message to the user. You might want to substitute the alert below with a more
		// user-friendly UI component to show the error.
		alert(message);


	}

	return {
		init: init
	};

})();