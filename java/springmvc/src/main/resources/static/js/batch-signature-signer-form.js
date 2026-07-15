// -------------------------------------------------------------------------------------------------
// This file is a copy of batch-signature-express-form.js adapted to sign a batch of documents
// hosted on Lacuna Signer (public signature flow). The queue/threads logic is exactly the same as
// the express batch sample; only the "start" and "complete" server calls were adapted:
//   - the "start" step returns a "token" (instead of a "transferFile") that identifies the Signer
//     signature process;
//   - the "complete" step notifies Signer that the signature was performed and the document is no
//     longer stored locally (it lives on Signer), so we just render it as completed.
// It is only an example, feel free to alter it to meet your application's needs.
// -------------------------------------------------------------------------------------------------
var batchSignatureSignerForm = (function () {

	// The Javascript class "Queue" defined here helps to process the documents in the batch. You
	// don't necessarily need to understand this code, only how to use it (see the usage below on
	// the function startBatch)
	(function () {
		window.Queue = function () {
			this.items = [];
			this.writerCount = 0;
			this.readerCount = 0;
		};
		window.Queue.prototype.add = function (e) {
			this.items.push(e);
		};
		window.Queue.prototype.addRange = function (array) {
			for (var i = 0; i < array.length; i++) {
				this.add(array[i]);
			}
		};
		var _process = function (inQueue, processor, outQueue, endCallback) {
			var obj = inQueue.items.shift();
			if (obj !== undefined) {
				processor(obj, function (result) {
					if (result != null && outQueue != null) {
						outQueue.add(result);
					}
					_process(inQueue, processor, outQueue, endCallback);
				});
			} else if (inQueue.writerCount > 0) {
				setTimeout(function () {
					_process(inQueue, processor, outQueue, endCallback);
				}, 200);
			} else {
				--inQueue.readerCount;
				if (outQueue != null) {
					--outQueue.writerCount;
				}
				if (inQueue.readerCount == 0 && endCallback) {
					endCallback();
				}
			}
		};
		window.Queue.prototype.process = function (processor, options) {
			var threads = options.threads || 1;
			this.readerCount = threads;
			if (options.output) {
				options.output.writerCount = threads;
			}
			for (var i = 0; i < threads; i++) {
				_process(this, processor, options.output, options.completed);
			}
		};
	})();


	// Auxiliary global variables.
	var startQueue = null;
	var performQueue = null;
	var completeQueue = null;
	var selectedCertContent = null;
	var formElements = {};
	// Map of thumbprint -> certificate (as returned by Web PKI), so we can read the CPF of the
	// selected certificate when creating the batch.
	var certsByThumbprint = {};

	// Create an instance of the LacunaWebPKI object.
	var pki = new LacunaWebPKI(_webPkiLicense);

	// ----------------------------------------------------------------------------------------------
	// Function called once the page is loaded.
	// ----------------------------------------------------------------------------------------------
	function init(fe) {

		// Receive from parameters received as arguments.
		formElements = fe;

		// Wireup of button clicks.
		formElements.signButton.click(sign);
		formElements.refreshButton.click(refresh);

		// The documents don't exist yet: they'll be created on Signer only after the user selects a
		// certificate and clicks "Sign Batch" (see the sign() function), so at this point there's
		// nothing to render on the documents list.
		formElements.documentsIds = [];

		// Instead of blocking the whole screen, we simply disable the buttons while Web PKI gets
		// ready. They'll be re-enabled once the certificates are loaded (see loadCertificates).
		setButtonsEnabled(false);

		// Call the init() method on the LacunaWebPKI object, passing a callback for when the
		// component is ready to be used and another to be called when an error occurs on any of
		// the subsequent operations. For more information, see:
		// https://docs.lacunasoftware.com/en-us/articles/web-pki/get-started.html#coding-the-first-lines
		// http://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_init
		pki.init({
			ready: loadCertificates,    // As soon as the component is ready we'll load the certificates.
			defaultFail: onWebPkiError // Generic error callback (see function declaration below).
		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Refresh" button.
	// ----------------------------------------------------------------------------------------------
	function refresh() {
		// Disable the buttons while we reload the certificates (they'll be re-enabled on success).
		setButtonsEnabled(false);
		// Invoke the loading of the certificates.
		loadCertificates();
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that enables/disables the action buttons. We use this instead of blocking the whole
	// screen, so the user stays free to interact with the page while the batch is processed.
	// ----------------------------------------------------------------------------------------------
	function setButtonsEnabled(enabled) {
		formElements.signButton.prop('disabled', !enabled);
		formElements.refreshButton.prop('disabled', !enabled);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that loads the certificates, either on startup or when the user clicks the
	// "Refresh" button. At this point, the UI is already blocked.
	// ----------------------------------------------------------------------------------------------
	function loadCertificates() {

		// Call the listCertificates() method to list the user's certificates. For more information
		// see:
		// http://webpki.lacunasoftware.com/Help/classes/LacunaWebPKI.html#method_listCertificates
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

		}).success(function (certs) {

			// Keep the certificates indexed by thumbprint so we can read the CPF of the one the
			// user selects (cert.pkiBrazil.cpf) when creating the batch.
			certsByThumbprint = {};
			for (var i = 0; i < certs.length; i++) {
				certsByThumbprint[certs[i].thumbprint] = certs[i];
			}

			// Once the certificates have been listed, re-enable the buttons.
			setButtonsEnabled(true);

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Sign Batch" button.
	// ----------------------------------------------------------------------------------------------
	function sign() {

		// Get the thumbprint of the selected certificate and its CPF (from the certificate listed
		// by Web PKI). The CPF is needed to create the documents on Signer for the right signer.
		var selectedCertThumbprint = formElements.certificateSelect.val();
		var selectedCert = certsByThumbprint[selectedCertThumbprint];
		var cpf = selectedCert && selectedCert.pkiBrazil ? selectedCert.pkiBrazil.cpf : null;

		if (!cpf) {
			addAlert('danger', 'The selected certificate does not have a CPF (ICP-Brasil). Please select an ICP-Brasil certificate.');
			return;
		}

		// Instead of blocking the whole screen, we disable the buttons and turn the sign button into
		// a "Signing..." indicator, so the user stays free to interact with the page.
		setButtonsEnabled(false);
		formElements.signButton.html('<i class="fas fa-spinner fa-spin"></i> Signing ...');

		// Create the batch of documents on Signer for this signer (using the CPF of the selected
		// certificate). The server returns the keys of the documents that will be signed.
		$.ajax({
			url: formElements.ctrlEndpoint + '/create',
			method: 'POST',
			data: {
				cpf: cpf,
				name: selectedCert.subjectName
			},
			dataType: 'json'
		}).then(function (documentKeys) {

			// Store the document keys and render them on the documents list.
			formElements.documentsIds = documentKeys;
			renderDocList(documentKeys);

			pki.readCertificate(selectedCertThumbprint).success(function (certEncoded) {

				// Store the certificate content.
				selectedCertContent = certEncoded;

				// Call Web PKI to preauthorize the signatures, so that the user only sees one
				// confirmation dialog.
				pki.preauthorizeSignatures({
					certificateThumbprint: selectedCertThumbprint,
					// Number of signatures to be authorized by the user.
					signatureCount: formElements.documentsIds.length
				}).success(startBatch); // Callback to be called if the user authorizes the signatures.
			});

		}, function (jqXHR, textStatus, errorThrown) {

			// Render error and re-enable the buttons so the user can try again.
			resetSignButton();
			setButtonsEnabled(true);
			var response = jqXHR.responseJSON;
			var errorMsg = response ? (response.status + ' (' + response.error + ') ' + response.message) : (textStatus + ' (' + errorThrown + ')');
			addAlert('danger', '<strong>An error has occurred while creating the documents</strong>: ' + errorMsg);

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that restores the "Sign Batch" button to its original label.
	// ----------------------------------------------------------------------------------------------
	function resetSignButton() {
		formElements.signButton.html('<i class="fas fa-list"></i> Sign Batch');
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders the documents to be signed on the documents list.
	// ----------------------------------------------------------------------------------------------
	function renderDocList(documentKeys) {
		formElements.docList.empty();
		for (var i = 0; i < documentKeys.length; i++) {
			// Each document gets a "status" element that we update in real time as it moves through
			// the pipeline (hash generated -> signed).
			formElements.docList
				.append($('<li />')
					.append(document.createTextNode('Document ' + (i + 1) + ' '))
					.append($('<span />')
						.addClass('doc-status text-muted')
						.append($('<span />').addClass('fas fa-clock'))
						.append(document.createTextNode(' waiting ...'))));
		}
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that replaces the "status" element of a given document on the list. Receives the
	// document index and a jQuery element (or array of nodes) to be shown as the new status.
	// ----------------------------------------------------------------------------------------------
	function setDocStatus(index, content) {
		$('#docList li').eq(index).find('.doc-status').empty().removeClass('text-muted').append(content);
	}

	// --------------------------------------------------------------------------------------------
	// Function called when the user authorizes the signatures.
	// --------------------------------------------------------------------------------------------
	function startBatch() {

		// For each document, we must perform 3 actions in sequence:
		//
		//    1. Start the signature    : Call the action batch-signer-signature/start to start the
		//                                public signature on Signer and get the "to-sign-hash"
		//                                content, the digest algorithm and the token needed for the
		//                                signature computation.
		//    2. Perform the signature  : Call Web PKI's method signHash with the information from
		//                                the start action.
		//    3. Complete the signature : Call the action batch-signer-signature/complete to notify
		//                                Signer that the signature is complete.
		//
		// We'll use the Queue Javascript class defined above in order to perform these steps
		// simultaneously.

		// Create the queues.
		startQueue = new Queue();
		performQueue = new Queue();
		completeQueue = new Queue();

		// Add all documents to the first ("start") queue.
		for (var i = 0; i < formElements.documentsIds.length; i++) {
			startQueue.add({index: i, docId: formElements.documentsIds[i]});
		}


		// Process each queue placing the result on the next queue, forming a sort of "assembly line":
		//
		//  startQueue                             performQueue                             completeQueue
		// ------------                            ------------                             ------------
		// XXXXXXX      ->  (startSignature)  ->             XX ->  (performSignature)  ->           XXX ->  (completeSignature)
		// ------------       2 threads            ------------         2 threads           ------------          2 threads
		startQueue.process(startSignature, {threads: 2, output: performQueue});
		performQueue.process(performSignature, {threads: 2, output: completeQueue});
		completeQueue.process(completeSignature, {threads: 2, completed: onBatchCompleted});
		// onBatchCompleted is a callback for when the last queue is completely processed.

		// Notice: the thread count on each call above is already optimized, increasing the number
		// of threads will not enhance the performance significantly.
	}

	// ----------------------------------------------------------------------------------------------
	// Function that performs the first step described above for each document, which is the call
	// batch-signer-signature/start in order to start the signature and get the token associated
	// with the signature process.
	//
	// This function is called by the Queue.process function, taking documents from the "start"
	// queue. Once we're done, we'll call the "done" callback passing the document, and the
	// Queue.process function will place the document on the "perform" queue to await processing.
	// ----------------------------------------------------------------------------------------------
	function startSignature(step, done) {
		// Call the server asynchronously to start the signature.
		$.ajax({
			url: formElements.ctrlEndpoint + '/start',
			method: 'POST',
			data: {
				id: step.docId,
				certContent: selectedCertContent
			},
			dataType: 'json'
		}).then(function(response, textStatus) {

			// Add the parameters to the document information (we'll need it in the second and third
			// steps). Notice that, unlike the express sample, here we carry a "token" instead of a
			// "transferFile".
			step.token = response.token;
			step.toSignHash = response.toSignHash;
			step.digestAlgorithm = response.digestAlgorithm;
			// Give real-time feedback: the hash for this document was generated by Signer.
			renderHashGenerated(step);
			// Call the "done" callback signalling we're done with the document.
			done(step);

		}, function (jqXHR, textStatus, errorThrown) {

			// Render error.
			renderFail(step, textStatus, errorThrown, jqXHR.responseJSON);
			// Call the "done" callback with no argument, signalling the document should not go to the
			// next queue.
			done();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function that performs the second step described above for each document, which is the call
	// to Web PKI's signHash function using the "to-sign-hash" and the digest algorithm acquired on
	// the first step.
	//
	// This function is called by the Queue.process function, taking documents from the "perform"
	// queue. Once we're done, we'll call the "done" callback passing the document, and the
	// Queue.process function will place the document on the "complete" queue to await processing.
	// ----------------------------------------------------------------------------------------------
	function performSignature(step, done) {
		// Call signHash() on the Web PKI component passing the "to-sign-hash", the digest
		// algorithm and the certificate selected by the user.
		pki.signHash({
			thumbprint: formElements.certificateSelect.val(),
			hash: step.toSignHash,
			digestAlgorithm: step.digestAlgorithm
		}).success(function (signature) {

			// Call the "done" callback signalling we're done with the document.
			step.signature = signature;
			done(step);

		}).error(function (error) {

			// Render error.
			renderFail(step, error);
			// Call the "done" callback with no argument, signalling the document should not go to
			// the next queue.
			done();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function that performs the third step described above for each document, which is the call
	// to the action "complete" of the BatchSignerSignatureApiController in order to complete the
	// signature.
	//
	// This function is called by the Queue.process function, taking documents from the "complete"
	// queue. Once we're done, we'll call the "done" callback passing the document. Once all
	// documents are processed, the Queue.process will call the "onBatchCompleted" function.
	// ----------------------------------------------------------------------------------------------
	function completeSignature(step, done) {

		// Call the server asynchronously to notify that the signature has been performed.
		$.ajax({
			url: formElements.ctrlEndpoint + '/complete',
			method: 'POST',
			data: {
				id: step.docId,
				signature: step.signature,
				token: step.token
			},
			dataType: 'json'
		}).then(function (documentId) {

			// Store the Signer document id (returned by the server) to render a reference to it.
			step.documentId = documentId;
			// Render success.
			renderSuccess(step);
			// Call the "done" callback signalling we're done with the document.
			done(step);

		}, function (jqXHR, textStatus, errorThrown) {

			// Render error.
			renderFail(step, textStatus, errorThrown, jqXHR.responseJSON);
			// Call the "done" callback with no argument, signalling the document should not go to the
			// next queue.
			done();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called once the batch is completed.
	// ----------------------------------------------------------------------------------------------
	function onBatchCompleted() {
		// Notify the user.
		addAlert('primary', '<strong>Batch processing completed</strong>');
		// Keep "Sign Batch" disabled (our logic isn't prepared to run the batch twice), but restore
		// its label and re-enable the "Refresh" button.
		resetSignButton();
		formElements.signButton.prop('disabled', true);
		formElements.refreshButton.prop('disabled', false);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that gives real-time feedback that the document's hash was generated by Signer (the
	// "start" step finished). The document is now being signed by Web PKI.
	// ----------------------------------------------------------------------------------------------
	function renderHashGenerated(step) {
		setDocStatus(step.index, [
			$('<span />').addClass('fas fa-check text-success')[0],
			document.createTextNode(' hash generated '),
			$('<span />').addClass('fas fa-arrow-right text-muted')[0],
			$('<span />').addClass('text-muted').append($('<span />').addClass('fas fa-spinner fa-spin')).append(document.createTextNode(' signing ...'))[0]
		]);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders a document as completed successfully. Unlike the express sample, the
	// signed document is stored on Signer (not locally), so we only render a "signed" mark (with the
	// Signer document ID) instead of a download link.
	// ----------------------------------------------------------------------------------------------
	function renderSuccess(step) {
		setDocStatus(step.index, [
			$('<span />').addClass('fas fa-check text-success')[0],
			document.createTextNode(' hash generated '),
			$('<span />').addClass('fas fa-arrow-right text-muted')[0],
			document.createTextNode(' '),
			$('<span />').addClass('fas fa-check text-success')[0],
			document.createTextNode(' signed on Signer (document ID: '),
			$('<code />').text(step.documentId)[0],
			document.createTextNode(') '),
			// Link to download the signed document (proxied by our server, see the controller).
			$('<a />')
				.attr('href', '/batch-signer-signature/download/' + encodeURIComponent(step.documentId))
				.attr('target', '_blank')
				.append($('<span />').addClass('fas fa-download'))
				.append(document.createTextNode(' download'))[0]
		]);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders a document as failed.
	// ----------------------------------------------------------------------------------------------
	function renderFail(step, status, error, response) {

		var errorMsg = null;
		if (response) {
			errorMsg = response.status +  ' (' + response.error + ') ' + response.message;
		} else {
			errorMsg = status + ' (' + error + ')';
		}

		addAlert('danger', '<strong>An error has occurred while signing Document ' + (step.index + 1) + '</strong>: ' + errorMsg);
		setDocStatus(step.index, [
			$('<span />').addClass('fas fa-times text-danger')[0],
			document.createTextNode(' failed')
		]);
	}

	// ---------------------------------------------------------------------------------------------
    // Function called if an error occurs on the Web PKI component.
    // ---------------------------------------------------------------------------------------------
    function onWebPkiError(ex) {

        // Re-enable the buttons so the user can retry.
        resetSignButton();
        setButtonsEnabled(true);

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
