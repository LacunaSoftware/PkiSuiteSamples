// -------------------------------------------------------------------------------------------------
// This file contains logic for calling the Web PKI component to perform a signature. It is only an
// example, feel free to alter it to meet your application's needs.
// -------------------------------------------------------------------------------------------------
var signatureForm = (function () {

	// Auxiliary global variable.
	var formElements = {};

	// Get an instance of the LacunaWebPKI object. If a license was set on application.yml, the
	// layout.html master view will have placed it on the global variable _webPkiLicense, which we
	// pass to the class constructor.
	var pki = new LacunaWebPKI(_webPkiLicense);
    

	// ----------------------------------------------------------------------------------------------
	// Initializes the signature form.
	// ----------------------------------------------------------------------------------------------
	function init(fe) {

		// Receive from parameters received as arguments.
		formElements = fe;

		// Wireup of button clicks.
		formElements.signButton.click(sign);

		// Block the UI while we get things ready.
		$.blockUI({message: 'Initializing ...'});

        // Render documents to be signed.
		for (var i = 0; i < formElements.documentsIds.length; i++) {
			var docId = formElements.documentsIds[i];
			if (endsWithXml(docId)) {
				formElements.docList
					.append($('<li />')
						.append($('<a />')
							.text('Document ' + docId)
							.attr('href', '/download/' + docId)));
			} else {
				formElements.docList
					.append($('<li />')
						.append($('<a />')
							.text('Document ' + docId)
							.attr('href', '/download/xml/' + docId)));

			}
		}

		// Call the init() method on the LacunaWebPKI object, passing a callback for when the
		// component is ready to be used and another to be called when an error occurs on any of
		// the subsequent operations. For more information, see:
		// https://docs.lacunasoftware.com/en-us/articles/web-pki/get-started.html#coding-the-first-lines
		// http://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_init
		pki.init({
			ready: sign,     // As soon as the component is ready we'll load the certificates.
			defaultFail: onWebPkiError, // Generic error callback defined below.
			restPkiUrl: _restPkiEndpoint // REST PKI endpoint to communication between Web PKI.
		});
	}

    
	function endsWithXml(str){
		const regex = /_xml$/;
    	return regex.test(str);
	}


	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Sign" button.
	// ----------------------------------------------------------------------------------------------
	function sign() {

		// Block the UI while we perform the signature.
		$.blockUI({message: 'Signing ...'});

		// Get the thumbprint of the selected certificate.
		var selectedCertThumbprint = formElements.certificateSelect
        var digestAlgorithm = formElements.digestAlgorithms[0]; // get the first one since the algorithm will always be the same
        
        console.log("digestAlgorithm: ", digestAlgorithm);
        // Get the hashes to be signed
        var hashes = formElements.hashes;

		// Call signWithRestPki() on the Web PKI component passing the token received from REST PKI
		// and the certificate selected by the user.
		pki.signHashBatch({
			batch: hashes,
			certificateThumbprint: selectedCertThumbprint,
            digestAlgorithm: digestAlgorithm
		}).success(function (signatures) {
			// Once the operation is completed, we submit the form.
			// formElements.form.submit();
            completeSignature(signatures);

		});
	}

    function completeSignature(signatures) {
        // Call the server asynchronously to notify that the signature has been performed.
		$.post({
			url: formElements.ctrlEndpoint + '/complete/', // The signature process token is guaranteed to be URL-safe.
			method: 'POST',
            data: signatures,
			dataType: 'json',
		}).success(function (fileId) {
			console.log("File IDs: ", fileId)
		});
    }

	// ---------------------------------------------------------------------------------------------
    // Function called if an error occurs on the Web PKI component.
    // ---------------------------------------------------------------------------------------------
    function onWebPkiError(ex) {

        // Unblock the UI.
        $.unblockUI();

        // Log the error to the browser console (for debugging purposes).
        if (console) {
            console.log('Web PKI error originated at ' + ex.origin + ': (' + ex.code + ') ' + ex.error);
        }

        // Show the message to the user. You might want to substitute the alert below with a more
        // user-friendly UI component to show the error.
        addAlert('danger', ex.userMessage);
    }

	return {
		init: init
	};

})();
