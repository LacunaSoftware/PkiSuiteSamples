var authenticationForm = (function () {

	var pki = null;
	var formElements = {};
	var selectedCertThumbprint = null;

	// -------------------------------------------------------------------------------------------------
	// Function called once the page is loaded
	// -------------------------------------------------------------------------------------------------
	function init(fe) {

		formElements = fe;

		// Wireup of button clicks.
		formElements.signInButton.click(signIn);
		formElements.refreshButton.click(refresh);

		// Block the UI while we get things ready
		$.blockUI({ message: 'Initializing ...' });

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
		$.blockUI({ message: 'Refreshing ...' });
		// Invoke the loading of the certificates
		loadCertificates();
	}

	// -------------------------------------------------------------------------------------------------
	// Function that loads the certificates, either on startup or when the user
	// clicks the "Refresh" button. At this point, the UI is already blocked.
	// -------------------------------------------------------------------------------------------------
	function loadCertificates() {

		// Call the listCertificates() method to list the user's certificates. For more information see
		// http://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_listCertificates
		pki.listCertificates({

			// id of the select to be populated with the certificates
			selectId: formElements.certificateSelect.attr('id'),

			// function that will be called to get the text that should be displayed for each option
			selectOptionFormatter: function (cert) {
				var s = cert.subjectName + ' (issued by ' + cert.issuerName + ')';
				if (new Date() > cert.validityEnd) {
					s = '[EXPIRED] ' + s;
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
	function signIn() {
		// Block the UI while we perform the signature
		$.blockUI({ message: 'Signing in ...' });

		// Get the value attribute of the option selected on the dropdown. Since we placed the "thumbprint"
		// property on the value attribute of each item (see function loadCertificates above), we're actually
		// retrieving the thumbprint of the selected certificate.
		selectedCertThumbprint = formElements.certificateSelect.val();

		pki.readCertificate(selectedCertThumbprint).success(function (certEncoded) {
			formElements.certificateField.val(certEncoded);
			pki.signData({
				thumbprint: selectedCertThumbprint,
				data: formElements.nonceField.val(),
				digestAlgorithm: formElements.digestAlgorithmField.val()
			}).success(function (signature) {
				formElements.signatureField.val(signature);
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
		if (console) {
			console.log('An error has occurred on the signature browser component: ' + message, error);
		}
		// Show the message to the user. You might want to substitute the alert below with a more user-friendly UI
		// component to show the error.
		alert(message);
	}

	return {
		init: init
	};
})();