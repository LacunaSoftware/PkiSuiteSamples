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
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js" integrity="sha384-Ct2s0NBxEbvJlnXHOZJheqOGKjX3Q4ewsYoJZYnLz/teMXnlGhim5o9305EkvlsN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js" integrity="sha256-u7MY6EG5ass8JhTuxBek18r5YG6pllB9zLqE4vZyTn4=" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>