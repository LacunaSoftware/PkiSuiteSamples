// ------------------------------------------------------------------------------------------------
// This file contains logic for calling the Web PKI component to perform a signature. It is only an
// example, feel free to alter it to meet your application's needs.
// ------------------------------------------------------------------------------------------------
var signatureCompleteForm = (function () {

	// Auxiliary global variable.
	var formElements = {};

	// Instance Web PKi object.
	var pki = new LacunaWebPKI(_webPkiLicense);

	// ---------------------------------------------------------------------------------------------
	// Initializes the signature form. It is caled once the page is loaded.
	// ---------------------------------------------------------------------------------------------
	function init(fe) {

		// Receive form parameters received as arguments.
		formElements = fe;

		// Block the UI while we get things ready.
		$.blockUI({message: 'Signing ...'});

		// Call the init() method again to perform the signature.
		pki.init({
			// As soon as the component is ready we'll perform the signature.
			ready: sign,
			// Generic error callback (see function declaration below).
			defaultError: onWebPkiError
		});

	}

	// ---------------------------------------------------------------------------------------------
	// Function called when the signature was started on server-side and a this page is rendered.
	// ---------------------------------------------------------------------------------------------
	function sign() {

		// Call signHash() on the Web PKI component passing the "to-sign-hash", the digest
		// algorithm and the certificate selected by the user.
		pki.signHash({
			thumbprint: formElements.certThumbField.val(),
			hash: formElements.toSignHashField.val(),
			digestAlgorithm: formElements.digestAlgorithmField.val()
		}).success(function (signature) {

			// Submit form to complete the signature on server-side.
			formElements.signatureField.val(signature);
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

		// Render the "Try again" button.
		formElements.tryAgainButton.show();
	}

	return {
		init: init
	};

})();
