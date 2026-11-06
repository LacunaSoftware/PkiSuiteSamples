<?php

require __DIR__ . '/../../vendor/autoload.php';
$config = getConfig();

?>
<script>
	var _webPkiLicense = '<?= $config['webPki']['license']; ?>';
	var _restPkiEndpoint = '<?= $config['restPki']['endpoint'] ?>';

	// Global method to add an alert on "messagePanel".
	function addAlert(type, message) {

		// Limit message size.
		var MESSAGE_LIMIT = 280;
		if (message.length > MESSAGE_LIMIT) {
			message = message.substring(0, MESSAGE_LIMIT);
			message += '...';
		}

		$('#messagesPanel').append(
			'<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
			'<span>' + message + '</span>' +
			'    <button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
			'        <span aria-hidden="true" class="fas fa-times"></span>' +
			'    </button>' +
			'</div>');
	}
</script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha384-1H217gwSVyLSIfaLxHbE7dRb3v4mYCKbpQvzx0cegeju1MVsGrX5xXxAvs/HgeFs" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js" integrity="sha384-Ct2s0NBxEbvJlnXHOZJheqOGKjX3Q4ewsYoJZYnLz/teMXnlGhim5o9305EkvlsN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js" integrity="sha384-6LwNpGeYDjlORU0Q5rfxEC8SQO6/FTh/VecUcvFvNx1gLMdX5dm8y1Y739D3lFSW" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js" integrity="sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+" crossorigin="anonymous"></script>