// -------------------------------------------------------------------------------------------------
// This file is a copy of batch-signature-express-form.js adapted to sign a batch of documents
// hosted on Lacuna Signer (public signature flow), using the files uploaded by the user, where EACH
// document gets its OWN flow with a SECOND signer. The queue/threads logic is exactly the same as
// the express batch sample; what changes is:
//   - the documents are not known when the page loads: the user chooses PDFs on a multiple file
//     input and each one is uploaded to Signer right away (see onFilesChosen). The user may add as
//     many files as wanted, in as many rounds as wanted;
//   - each row of the table carries the SECOND participant of that document's flow, typed by the
//     user. That's what makes each document have its own flow;
//   - when the batch starts, "create" turns each upload into a document on Signer with a two-step
//     flow (the certificate holder at step 1, the informed participant at step 2) and returns the
//     key of each one;
//   - the "start" step returns a "token" (instead of a "transferFile") that identifies the Signer
//     signature process;
//   - the "complete" step notifies Signer that OUR signature was performed. The document is NOT
//     finished at this point: it stays pending until the second participant signs, so we render
//     "signed by you - waiting for <name>" instead of a plain "signed", with a link to that
//     participant's action URL and another to download the (partially signed) file from Signer.
// The selected certificate is kept, so after a batch finishes the user can add more files and sign
// again without selecting the certificate (and typing the PIN) all over again.
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
	// Every file the user added, in the order they were added. Each item is
	// { index, name, fileRef, key, status }, where "status" is 'pending' (uploaded, not signed yet),
	// 'signed' or 'failed'. Only the 'pending' ones take part on the next batch.
	var docs = [];

	// Create an instance of the LacunaWebPKI object.
	var pki = new LacunaWebPKI(_webPkiLicense);

	// ----------------------------------------------------------------------------------------------
	// Function called once the page is loaded.
	// ----------------------------------------------------------------------------------------------
	function init(fe) {

		// Receive from parameters received as arguments.
		formElements = fe;

		// Wireup of the events.
		formElements.fileInput.change(onFilesChosen);
		formElements.signButton.click(sign);
		formElements.refreshButton.click(refresh);

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
	// Function called when the user chooses files on the file input. We upload them to Signer right
	// away, so that when the user clicks "Sign Batch" all that's left is creating the documents.
	// Notice that choosing files again ADDS to the batch instead of replacing it.
	// ----------------------------------------------------------------------------------------------
	function onFilesChosen() {

		var files = formElements.fileInput[0].files;
		if (!files || files.length === 0) {
			return;
		}

		// Build the multipart body. The field name must match the @RequestParam on the controller.
		var formData = new FormData();
		for (var i = 0; i < files.length; i++) {
			formData.append('userfiles', files[i]);
		}

		// Allow the same file to be chosen again later (the input keeps its value otherwise).
		formElements.fileInput.val('');
		setFileInputLabel('Uploading ' + files.length + ' file(s) ...');
		setButtonsEnabled(false);

		$.ajax({
			url: formElements.ctrlEndpoint + '/upload',
			method: 'POST',
			data: formData,
			processData: false, // Let the browser build the multipart body.
			contentType: false, // Ditto (so the boundary is set correctly).
			dataType: 'json'
		}).then(function (uploaded) {

			// Append the uploaded files to the batch and render them on the documents list.
			for (var i = 0; i < uploaded.length; i++) {
				var doc = {
					index: docs.length,
					name: uploaded[i].name,
					fileRef: uploaded[i].fileRef,
					key: null,
					status: 'pending'
				};
				docs.push(doc);
				renderDocRow(doc);
			}

			setFileInputLabel('Choose files');
			setButtonsEnabled(true);

		}, function (jqXHR, textStatus, errorThrown) {

			setFileInputLabel('Choose files');
			setButtonsEnabled(true);
			addAlert('danger', '<strong>An error has occurred while uploading the files</strong>: '
				+ getErrorMessage(jqXHR, textStatus, errorThrown));

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
	// screen, so the user stays free to interact with the page while the batch is processed. The
	// "Sign Batch" button is only enabled when there is something to sign.
	// ----------------------------------------------------------------------------------------------
	function setButtonsEnabled(enabled) {
		formElements.signButton.prop('disabled', !enabled || getPendingDocs().length === 0);
		formElements.refreshButton.prop('disabled', !enabled);
		formElements.fileInput.prop('disabled', !enabled);
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that updates the text of the file input's label.
	// ----------------------------------------------------------------------------------------------
	function setFileInputLabel(text) {
		formElements.fileInput.closest('.custom-file').find('.filename').text(text);
	}

	// ----------------------------------------------------------------------------------------------
	// Returns the documents that were uploaded but not signed yet, which are the ones that will
	// compose the next batch.
	// ----------------------------------------------------------------------------------------------
	function getPendingDocs() {
		var pending = [];
		for (var i = 0; i < docs.length; i++) {
			if (docs[i].status === 'pending') {
				pending.push(docs[i]);
			}
		}
		return pending;
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

		// The batch is made of the files uploaded so far that haven't been signed yet.
		var pending = getPendingDocs();
		if (pending.length === 0) {
			addAlert('danger', 'Please choose the files to be signed.');
			return;
		}

		// Get the thumbprint of the selected certificate and its CPF (from the certificate listed
		// by Web PKI). The CPF is needed to create the documents on Signer for the right signer.
		var selectedCertThumbprint = formElements.certificateSelect.val();
		var selectedCert = certsByThumbprint[selectedCertThumbprint];
		var cpf = selectedCert && selectedCert.pkiBrazil ? selectedCert.pkiBrazil.cpf : null;

		if (!cpf) {
			addAlert('danger', 'The selected certificate does not have a CPF (ICP-Brasil). Please select an ICP-Brasil certificate.');
			return;
		}

		// Read the second participant of each document from the table. Every document must have one:
		// it is what gives each document its own flow on Signer.
		var flows = [];
		for (var i = 0; i < pending.length; i++) {
			var participant = readParticipant(pending[i]);
			if (!participant.participantName || !participant.participantEmail || !participant.participantCpf) {
				addAlert('danger', 'Inform the name, the e-mail and the CPF of the second signer of <strong>'
					+ pending[i].name + '</strong>.');
				return;
			}
			participant.fileRef = pending[i].fileRef;
			flows.push(participant);
			// Keep the participant on the document as well: the "complete" step uses their e-mail and
			// CPF to fetch their action URL (once our signature makes it their turn).
			pending[i].participant = participant;
		}

		// Instead of blocking the whole screen, we disable the buttons and turn the sign button into
		// a "Signing..." indicator, so the user stays free to interact with the page.
		setButtonsEnabled(false);
		formElements.signButton.prop('disabled', true);
		formElements.signButton.html('<i class="fas fa-spinner fa-spin"></i> Signing ...');

		// Read the certificate's encoding, which Signer needs in order to compute the to-sign hash
		// of each document.
		pki.readCertificate(selectedCertThumbprint).success(function (certEncoded) {

			// Store the certificate content.
			selectedCertContent = certEncoded;

			// Create the documents on Signer from the files already uploaded: one document per file,
			// each with its own two-step flow (this certificate's holder at step 1, the participant
			// informed on the row at step 2). The server returns the key of each document.
			//
			// Notice that we send JSON, not form fields: the payload is a nested list, and jQuery would
			// serialize it in a format Spring doesn't bind ("flows[0][fileRef]").
			$.ajax({
				url: formElements.ctrlEndpoint + '/create',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					cpf: cpf,
					name: selectedCert.subjectName,
					flows: flows
				}),
				dataType: 'json'
			}).then(function (documents) {

				// Store what the server returned for each document (the "create" action answers in the
				// same order we sent the items).
				for (var i = 0; i < pending.length; i++) {
					pending[i].key = documents[i].key;
					pending[i].participantName = documents[i].participantName;
					// The row's inputs are now read-only: the flow is created on Signer.
					lockParticipantInputs(pending[i]);
				}

				// Call Web PKI to preauthorize the signatures, so that the user only sees one
				// confirmation dialog for the whole batch.
				pki.preauthorizeSignatures({
					certificateThumbprint: selectedCertThumbprint,
					// Number of signatures to be authorized by the user.
					signatureCount: pending.length

					// Callback to be called if the user authorizes the signatures.
				}).success(function () {
					startBatch(pending);
				});

			}, function (jqXHR, textStatus, errorThrown) {

				// Render error and re-enable the buttons so the user can try again.
				resetSignButton();
				setButtonsEnabled(true);
				addAlert('danger', '<strong>An error has occurred while creating the documents</strong>: '
					+ getErrorMessage(jqXHR, textStatus, errorThrown));

			});
		});
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that restores the "Sign Batch" button to its original label.
	// ----------------------------------------------------------------------------------------------
	function resetSignButton() {
		formElements.signButton.html('<i class="fas fa-list"></i> Sign Batch');
	}

	// ----------------------------------------------------------------------------------------------
	// Function that appends one document to the table: the filename, the inputs of the second
	// participant of its flow and a "status" cell that we update in real time as the document moves
	// through the pipeline (hash generated -> signed).
	// ----------------------------------------------------------------------------------------------
	function renderDocRow(doc) {
		formElements.docList
			.append($('<tr />')
				.attr('data-index', doc.index)
				.append($('<td />').append($('<span />').addClass('text-monospace small').text(doc.name)))
				.append($('<td />').append($('<input />')
					.addClass('form-control form-control-sm participant-name')
					.attr('type', 'text')
					.attr('placeholder', 'Full name')))
				.append($('<td />').append($('<input />')
					.addClass('form-control form-control-sm participant-email')
					.attr('type', 'email')
					.attr('placeholder', 'email@example.com')))
				.append($('<td />').append($('<input />')
					.addClass('form-control form-control-sm participant-cpf')
					.attr('type', 'text')
					.attr('placeholder', '000.000.000-00')))
				.append($('<td />').append($('<span />')
					.addClass('doc-status text-muted')
					.append($('<span />').addClass('fas fa-clock'))
					.append(document.createTextNode(' waiting ...')))));
	}

	// ----------------------------------------------------------------------------------------------
	// Helpers that read/lock the second participant's inputs of a document's row.
	// ----------------------------------------------------------------------------------------------
	function getDocRow(doc) {
		return formElements.docList.find('tr[data-index="' + doc.index + '"]');
	}

	function readParticipant(doc) {
		var row = getDocRow(doc);
		return {
			participantName: $.trim(row.find('.participant-name').val()),
			participantEmail: $.trim(row.find('.participant-email').val()),
			participantCpf: $.trim(row.find('.participant-cpf').val())
		};
	}

	function lockParticipantInputs(doc) {
		getDocRow(doc).find('input').prop('readonly', true);
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that replaces the "status" cell of a given document. Receives the document and a jQuery
	// element (or array of nodes) to be shown as the new status.
	// ----------------------------------------------------------------------------------------------
	function setDocStatus(doc, content) {
		getDocRow(doc).find('.doc-status').empty().removeClass('text-muted').append(content);
	}

	// --------------------------------------------------------------------------------------------
	// Function called when the user authorizes the signatures, receiving the documents that compose
	// this batch.
	// --------------------------------------------------------------------------------------------
	function startBatch(batch) {

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

		// Add all documents of this batch to the first ("start") queue.
		startQueue.addRange(batch);


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
				id: step.key,
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
			renderFail(step, getErrorMessage(jqXHR, textStatus, errorThrown));
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
				id: step.key,
				signature: step.signature,
				token: step.token,
				// Sent so the server can fetch this participant's action URL, which Signer only
				// releases now that our signature (step 1) is done and the turn is theirs.
				participantEmail: step.participant ? step.participant.participantEmail : null,
				participantCpf: step.participant ? step.participant.participantCpf : null
			},
			dataType: 'json'
		}).then(function (response) {

			// Store what the server returned: the Signer document id and, when available, the action
			// URL of the participant we're now waiting for.
			step.documentId = response.documentId;
			step.participantActionUrl = response.participantActionUrl;
			// Render success.
			renderSuccess(step);
			// Call the "done" callback signalling we're done with the document.
			done(step);

		}, function (jqXHR, textStatus, errorThrown) {

			// Render error.
			renderFail(step, getErrorMessage(jqXHR, textStatus, errorThrown));
			// Call the "done" callback with no argument, signalling the document should not go to the
			// next queue.
			done();

		});
	}

	// ----------------------------------------------------------------------------------------------
	// Function called once the batch is completed.
	// ----------------------------------------------------------------------------------------------
	function onBatchCompleted() {
		// Notify the user. Notice that the documents are NOT finished: each one still waits for its
		// second signer, who Signer notified by e-mail.
		addAlert('primary', '<strong>Batch processing completed</strong>. Each document now waits for '
			+ 'its second signer on Signer.');
		// Restore the button's label and re-enable the controls. Notice that the certificate stays
		// selected: the user may now add more files and sign them with the same certificate.
		resetSignButton();
		setButtonsEnabled(true);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that gives real-time feedback that the document's hash was generated by Signer (the
	// "start" step finished). The document is now being signed by Web PKI.
	// ----------------------------------------------------------------------------------------------
	function renderHashGenerated(step) {
		setDocStatus(step, [
			$('<span />').addClass('fas fa-check text-success')[0],
			document.createTextNode(' hash '),
			$('<span />').addClass('text-muted')
				.append($('<span />').addClass('fas fa-spinner fa-spin'))
				.append(document.createTextNode(' signing ...'))[0]
		]);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders a document as signed BY US. The document is not finished: it lives on
	// Signer and stays pending until the second participant of its flow signs, so we say so -- and,
	// when the server managed to read it, we offer that participant's action URL so the flow can be
	// tested without the notification e-mail. We also link the download of the (partially signed)
	// file, proxied by our server (see the controller).
	// ----------------------------------------------------------------------------------------------
	function renderSuccess(step) {

		step.status = 'signed';

		var content = [
			$('<span />').addClass('fas fa-check text-success')[0],
			document.createTextNode(' signed by you '),
			$('<span />').addClass('badge badge-warning')
				.text('waiting ' + (step.participantName || 'signer 2'))[0],
			document.createTextNode(' ')
		];

		if (step.participantActionUrl) {
			content.push($('<a />')
				.addClass('small')
				.attr('href', step.participantActionUrl)
				.attr('target', '_blank')
				.append($('<span />').addClass('fas fa-external-link-alt'))
				.append(document.createTextNode(' sign as them'))[0]);
			content.push(document.createTextNode(' '));
		}

		content.push($('<a />')
			.addClass('small')
			.attr('href', formElements.downloadEndpoint + '/' + encodeURIComponent(step.documentId))
			.attr('target', '_blank')
			.append($('<span />').addClass('fas fa-download'))
			.append(document.createTextNode(' download'))[0]);

		setDocStatus(step, content);
	}

	// ----------------------------------------------------------------------------------------------
	// Function that renders a document as failed.
	// ----------------------------------------------------------------------------------------------
	function renderFail(step, errorMsg) {

		// The document didn't get signed, but its upload was already consumed by the "create" call,
		// so it can't take part on another batch: mark it as failed. Notice that the document DOES
		// exist on Signer -- it just wasn't signed by us, so its flow is still on step 1.
		step.status = 'failed';

		addAlert('danger', '<strong>An error has occurred while signing ' + step.name + '</strong>: ' + errorMsg);
		setDocStatus(step, [
			$('<span />').addClass('fas fa-times text-danger')[0],
			document.createTextNode(' failed')
		]);
	}

	// ----------------------------------------------------------------------------------------------
	// Helper that extracts a readable message from a failed jQuery Ajax call.
	// ----------------------------------------------------------------------------------------------
	function getErrorMessage(jqXHR, textStatus, errorThrown) {
		var response = jqXHR.responseJSON;
		if (response) {
			return response.status + ' (' + response.error + ') ' + response.message;
		}
		return textStatus + ' (' + errorThrown + ')';
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
