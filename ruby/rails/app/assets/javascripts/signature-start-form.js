// -------------------------------------------------------------------------------------------------
// This file contains logic for calling the Web PKI component to perform the initialization of the
// signature process. It is only an example, feel free to alter it to meet your application's
// needs.
// -------------------------------------------------------------------------------------------------
var signatureStartForm = (function () {

	// Auxiliary global variables.
	var formElements = null;

	// Create an instance of the LacunaWebPKI object. If a license was set on application.yml, the
	// layout.html master view will have placed it on the global variable _webPkiLicense, which
	// we pass to the class constructor.
	var pki = new LacunaWebPKI(_webPkiLicense);

	// ----------------------------------------------------------------------------------------------
	// Initializes the signature form.
	// ----------------------------------------------------------------------------------------------
	function init(fe) {

		// Receive form parameters received as arguments.
		formElements = fe;

		// Wireup of buttons clicks.
		formElements.signButton.click(startSignature);
		formElements.refreshButton.click(refresh);

		// Block the UI while we get things ready.
		$.blockUI({ message: 'Initializing ...' });

		// Call the init() method on the LacunaWebPKI object, passing a callback for when the
		// component is ready to be used and another to be called when an error occurs on any of the
		// subsequent operations. For more information, see:
		// https://docs.lacunasoftware.com/en-us/articles/web-pki/get-started.html#coding-the-first-lines
		// https://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_init
		pki.init({
			ready: loadCertificates,    // As soon as the component is ready we'll load the certificates.
			defaultError: onWebPkiError // Generic error callback (see function declaration below).
		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Refresh" button
	// ----------------------------------------------------------------------------------------------
	function refresh() {
		// Block the UI while we load the certificates.
		$.blockUI({ message: 'Refreshing ...' });
		// Invoke the loading of the certificates.
		loadCertificates();
	}

	// ----------------------------------------------------------------------------------------------
	// Function that loads the certificates, either on startup or when the user clicks the "Refresh"
	// button. At this point, the UI is already blocked.
	// ----------------------------------------------------------------------------------------------
	function loadCertificates() {

		// Call the listCertificates() method to list the user's certificates.
		pki.listCertificates({

			// ID of the <select> element to be populated with the certificates:
			selectId: formElements.certificateSelect.attr('id'),

			// Function that will be called to get the text that should be displayed for each option:
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

	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Sign File" button.
	// ----------------------------------------------------------------------------------------------
	function startSignature() {

		// Block the UI while we perform the signature.
		$.blockUI({ message: 'Starting signature ...' });

		// Get the thumbprint of the selected certificate.
		var selectedCertThumbprint = formElements.certificateSelect.val();

		// Get certificate content to be passed to "start" action after the form submission.
		pki.readCertificate(selectedCertThumbprint).success(function (certEncoded) {

			// Fill fields needed on the next steps of the signature.
			formElements.certThumbField.val(selectedCertThumbprint);
			formElements.certContentField.val(certEncoded);

			// Submit the form.
			formElements.form.submit();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called if an error occurs on the Web PKI component.
	// ----------------------------------------------------------------------------------------------
	function onWebPkiError(message, error, origin) {

		// Unblock the UI.
		$.unblockUI();

		// Log the error to the browser console (for debugging purposes).
		if (console) {
			console.log('An error has occurred on the signature browser component: ' + message, error);
		}

		// Show the message to the user. You might want to substitute the alert below with a more
		// user-friendly UI component to show the error (see function addAlert() on layout.html).
		addAlert('danger', '<strong>An error has occurred on the signature browser component</strong>: ' + message);
	}

	return {
		init: init
	};

})();
