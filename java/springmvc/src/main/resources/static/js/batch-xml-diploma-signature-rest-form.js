// -------------------------------------------------------------------------------------------------
// This file contains logic for calling the Web PKI component to sign a batch of documents. It is
// only an example, feel free to alter it to meet your application's needs.
// -------------------------------------------------------------------------------------------------
var batchSignatureRestForm = (function () {

	// The Javascript class "Queue" defined here helps to process the documents in the batch. You
	// don't necessarily need to understand this code, only how to use it (see the usage below on
	// the function startBatch).
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
	var formElements = {};

	var signedElementsList = []

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

		// Block the UI while we get things ready.
		$.blockUI({ message: 'Initializing ...' });

		//debug
		console.log("documentsIds: ", formElements.documentsIds);
		

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
			ready: loadCertificates,     // As soon as the component is ready we'll load the certificates.
			defaultFail: onWebPkiError, // Generic error callback (see function declaration below).
			restPkiUrl: _restPkiEndpoint // REST PKI endpoint for communication between Web PKI.
		});
	}

	function endsWithXml(str){
		const regex = /_xml$/;
    	return regex.test(str);
	}

	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Refresh" button.
	// ----------------------------------------------------------------------------------------------
	function refresh() {
		// Block the UI while we load the certificates.
		$.blockUI({ message: 'Refreshing ...' });
		// Invoke the loading of the certificates.
		loadCertificates();
	}

	// ---------------------------------------------------------------------------------------------
	// Function that loads the certificates, either on startup or when the user clicks the
	// "Refresh" button. At this point, the UI is already blocked.
	// ---------------------------------------------------------------------------------------------
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

		}).success(function () {

			// Once the certificates have been listed, unblock the UI.
			$.unblockUI();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called when the user clicks the "Sign Batch" button.
	// ----------------------------------------------------------------------------------------------
	function sign() {

		// Block the UI while we perform the signature.
		$.blockUI({ message: 'Signing ...' });

		// Get the thumbprint of the selected certificate.
		var selectedCertThumbprint = formElements.certificateSelect.val();

		// Call Web PKI to preauthorize the signatures, so that the user only sees one confirmation
		// dialog.
		pki.preauthorizeSignatures({
			certificateThumbprint: selectedCertThumbprint,
			// Number of signatures to be authorized by the user.
			signatureCount: formElements.documentsIds.length
		}).success(startBatch); // Callback to be called if the user authorizes the signatures.
	}

	// ----------------------------------------------------------------------------------------------
	// Function called when the user authorizes the signatures.
	// ----------------------------------------------------------------------------------------------
	function startBatch() {


		// For each document, we must perform 3 actions in sequence:
		//
		//    1. Start the signature    : Call batch-signature-rest/start to start the signature
		//                                and get the signature process token.
		//    2. Perform the signature  : Call Web PKI's method signWithRestPki with the token.
		//    3. Complete the signature : Call batch-signature-rest/complete to notify that the
		//                                signature is complete.
		//
		// We'll use the Queue Javascript class defined above in order to perform these steps
		// simultaneously.

		// Create the queues.
		startQueue = new Queue();
		performQueue = new Queue();
		completeQueue = new Queue();

		// Add all documents to the first ("start") queue.
		for (var i = 0; i < formElements.documentsIds.length; i++) {
			startQueue.add({ index: i, docId: formElements.documentsIds[i] });
		}

		// Process each queue placing the result on the next queue, forming a sort of "assembly line":
		//
		//  startQueue                             performQueue                             completeQueue
		// ------------                            ------------                             ------------
		// XXXXXXX      ->  (startSignature)  ->             XX ->  (performSignature)  ->           XXX ->  (completeSignature)
		// ------------       2 threads            ------------         2 threads           ------------          2 threads
		startQueue.process(startSignature, { threads: 2, output: performQueue });
		performQueue.process(performSignature, { threads: 2, output: completeQueue });
		completeQueue.process(completeSignature, { threads: 2, completed: onBatchCompleted });
		// onBatchCompleted is a callback for when the last queue is completely processed.

		// Notice: the thread count on each call above is already optimized, increasing the number
		// of threads will not enhance the performance significantly.
	}

	// ----------------------------------------------------------------------------------------------
	// Function that performs the first step described above for each document, which is the call
	// batch-signature-rest/complete in order to start the signature and get the token associated
	// with the signature process.
	//
	// This function is called by the Queue.process function, taking documents from the "start"
	// queue. Once we're done, we'll call the "done" callback passing the document, and the
	// Queue.process function will place the document on the "perform" queue to await processing.
	// ----------------------------------------------------------------------------------------------
	function startSignature(step, done) {
		// Call the server asynchronously to start the signature (the server will call REST PKI and
		// will return the signature operation token).
		$.ajax({
			url: formElements.ctrlEndpoint + formElements.apiRoute + step.docId,
			method: 'POST',
			dataType: 'json'
		}).then(function (token) {

			// Add the token to the document information (we'll need it in the second step).
			step.token = token;
			// Call the "done" callback signalling we're done with the document.
			done(step);

		}, function (jqXHR, textStatus, errorThrown) {

			// Render error.
			renderFail(step, textStatus, errorThrown, jqXHR.responseJSON);
			// Call the "done" callback with no argument, signalling the document should not go/ to the
			// next queue.
			done();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function that performs the second step described above for each document, which is the call
	// to Web PKI's signWithRestPki function using the token acquired on the first step.
	//
	// This function is called by the Queue.process function, taking documents from the "perform"
	// queue. Once we're done, we'll call the "done" callback passing the document, and the
	// Queue.process function will place the document on the "complete" queue to await processing.
	// ----------------------------------------------------------------------------------------------
	function performSignature(step, done) {
		// Call signWithRestPki() on the Web PKI component passing the token received from REST PKI
		// and the certificate selected by the user.
		pki.signWithRestPki({
			token: step.token,
			thumbprint: formElements.certificateSelect.val()
		}).success(function () {

			// Call the "done" callback signalling we're done with the document.
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
	// batch-signature-complete in order to complete the signature.
	//
	// This function is called by the Queue.process function, taking documents from the "complete"
	// queue. Once we're done, we'll call the "done" callback passing the document. Once all
	// documents are processed, the Queue.process will call the "onBatchCompleted" function.
	// ----------------------------------------------------------------------------------------------
	function completeSignature(step, done) {

		// Call the server asynchronously to notify that the signature has been performed.
		$.ajax({
			url: formElements.ctrlEndpoint + '/complete/' + step.token, // The signature process token is guaranteed to be URL-safe.
			method: 'POST',
			dataType: 'json'
		}).then(function (fileId) {
			storeSignedDocument(fileId)
			// Store fileId to render a link to download it.
			step.fileId = fileId;
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

	function storeSignedDocument(fileId) {
		signedElementsList.push(fileId)
	}

	// ----------------------------------------------------------------------------------------------
	// Function called once the batch is completed.
	// ----------------------------------------------------------------------------------------------
	function onBatchCompleted() {
		// Notify the user and unblock the UI.
		addAlert('primary', '<strong>Batch processing completed</strong>');
		// Prevent user from clicking "sign batch" again (our logic isn't prepared for that).
		formElements.signButton.prop('disabled', true);

		if(formElements.signedXmls != null){
			// add all signedXmls to hidden input
			formElements.signedXmls.val(signedElementsList)
		}
		if(formElements.nextStepButton != null){
			// Enables the next step button
			formElements.nextStepButton.prop('disabled', false);
		}
		// Unblock the UI.
		$.unblockUI();
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders a document as completed successfully.
	// ----------------------------------------------------------------------------------------------
	function renderSuccess(step) {
		var docLi = $('#docList li').eq(step.index);
		docLi
			.append(document.createTextNode(' '))
			.append($('<span />')
				.addClass('fas fa-arrow-right'))
			.append(document.createTextNode(' '))
			.append($('<a />')
				.text(step.fileId.replace('_', '.'))
				.attr('href', '/download/' + step.fileId));
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders a document as failed.
	// ----------------------------------------------------------------------------------------------
	function renderFail(step, status, error, response) {

		var errorMsg = null;
		if (response) {
			errorMsg = response.status + ' (' + response.error + ') ' + response.message;
		} else {
			errorMsg = status + ' (' + error + ')';
		}

		addAlert('danger', '<strong>An error has occurred while signing Document ' + step.docId + '</strong>: ' + errorMsg);
		var docLi = $('#docList li').eq(step.index);
		docLi
			.append(document.createTextNode(' '))
			.append($('<span />')
				.addClass('fas fa-times'));
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