<?php

/**
 * This file allows the user to upload a file to be signed. Once the file is uploaded, we save it to
 * the "app-data" folder and redirect to the specified file (by the "goto" URL argument) passing the
 * filename on the "userfile" URL argument.
 */
require __DIR__ . '/../vendor/autoload.php';

// Indicate the maximum size of the uploaded file. You can change this value how ever you want. Be
// aware that if this value is greater than the "post_max_size" and the "upload_max_filesize" fields
// on your php.ini, the upload will not work. To resolve that, increase these fields to support the
// desired upload maximum size.
const MAX_FILE_SIZE = 10485760; // 10MB

// Get URL parameter "rc".
$rc = $_GET['rc'];
$certId = $_GET['certId'];

if (isset($_FILES['userfile'])) {

    if ($_FILES['userfile']['error'] === UPLOAD_ERR_OK) {

        // Process the file uploaded
        $file = $_FILES['userfile'];
        if ($file['size'] > MAX_FILE_SIZE) {
            die('File too large');
        }
        $filenameParts = explode('.', $file['name']);
        $fileExt = end($filenameParts);

        // Generate a unique filename
        StorageMock::createAppData(); // make sure the "app-data" folder exists (util.php)
        $filename = StorageMock::generateFileId($fileExt, $file['name']);

        // Move the file to the "app-data" folder with the unique filename
        if (!move_uploaded_file($file['tmp_name'], StorageMock::getDataPath($filename))) {
            die('File upload error');
        }

        // Redirect the user to the provided page (by the "goto" URL argument), passing the name of
        // the file as a URL argument.
        if (isset($certId)) {
            header("Location: {$rc}?fileId={$filename}&certId={$certId}", true, 302);
            exit;
        } else {
            header("Location: {$rc}?fileId={$filename}", true, 302);
            exit;
        }


    } else {

        // Handling errors
        switch ($_FILES['userfile']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMessage = 'The provided file was too large!';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMessage = 'No file was provided!';
                break;
            default:
                $errorMessage = 'Some error has occurred on uploading the file!';
        }
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <?php include 'shared/head.php' ?>
</head>
<body>

<?php include 'shared/menu.php' ?>

<div class="container content">
	<div id="messagesPanel"></div>

	<h2 class="ls-title">Upload a file</h2>
	<h5 class="ls-subtitle">You will be redirected to <b>/<?= $rc ?></b></h5>

	<div class="ls-content">
		<form method="POST" enctype="multipart/form-data">

       <?php
       // MAX_FILE_SIZE = 10MB (see http://php.net/manual/en/features.file-upload.post-method.php)
       ?>
		<input type="hidden" name="MAX_FILE_SIZE" value="<?= MAX_FILE_SIZE ?>"/>

		<label for="selectFile">
			Select file:
			<input id="selectFile" type="file" name="userfile" style="display: block;"/>
		</label>

		<input type="submit" value="Upload" name="submit" class="btn btn-primary" style="display: block;"/>
		</form>
	</div>
</div>

<?php include 'shared/scripts.php' ?>

</body>
</html>
