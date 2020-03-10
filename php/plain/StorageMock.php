<?php

require __DIR__ . '/vendor/autoload.php';

class SampleDocs
{
    const SAMPLE_PDF = 'SAMPLE_PDF';
    const PDF_SIGNED_ONCE = 'PDF_SIGNED_ONCE';
    const PDF_SIGNED_TWICE = 'PDF_SIGNED_TWICE';
    const CMS_SIGNED_ONCE = 'CMS_SIGNED_ONCE';
    const CMS_SIGNED_TWICE = 'CMS_SIGNED_TWICE';
    const SAMPLE_NFE = 'SAMPLE_NFE';
    const SAMPLE_XML = 'SAMPLE_XML';
}

class ServerFile
{
    public $id;
    public $description;

    public function __construct($id, $description) {
        $this->id = $id;
        $this->description = $description;
    }

    public function getDownloadUrl() {
        return '/download/sample.php?docId=' . $this->id;
    }
}

class StorageMock
{
    const APP_DATA_PATH = __DIR__ . '/app-data/';
    const RESOURCES_PATH = __DIR__ . '/resources/';

    static function exists($fileId, &$filename = null)
    {
        $filename = str_replace('_', '.', $fileId);
        // Note: we're passing the filename arguments with "_" as "." because of
        // URL safety.

        $filePath = self::APP_DATA_PATH . $filename;
        return file_exists($filePath);
    }

    static function getDataPath($fileId)
    {
        $filename = str_replace('_', '.', $fileId);
        // Note: we're passing the filename arguments with "_" as "." because of
        // URL safety.

        return self::APP_DATA_PATH . $filename;
    }

    static function getResourcePath($resource)
    {
        return self::RESOURCES_PATH . $resource;
    }

    static function generateFilename($extension, $originalFilename = null)
    {
        $validExtension = null;
        if (!empty($originalFilename)) {
            $validExtension = pathinfo($originalFilename, PATHINFO_EXTENSION);
            $filename = pathinfo($originalFilename, PATHINFO_FILENAME);
        } else {
            $filename = "";
        }

        if (!empty($extension)) {
            if ($extension[0] == '.') {
                $validExtension = substr($extension, 1, count($extension) - 1);
            } else {
                $validExtension = $extension;
            }
        }

        $name = '';
        if (!empty($filename)) {
            $name .= $filename;
            $name .= '.';
        }
        $name .= uniqid();
        if (!empty($validExtension)) {
            $name .= '.';
            $name .= $validExtension;
        }

        return $name;
    }

    static function generateFileId($extension, $originalFilename = null)
    {
        $filename = self::generateFilename($extension, $originalFilename);
        // Replace extension '.'. to '_' to be passe as parameters on URL for
        // safety.
        return str_replace(".", "_", $filename);
    }

    static function retrieveFilename($fileId)
    {
        $filename = str_replace('_', '.', $fileId);
        // Note: we're passing the filename arguments with "_" as "." because of
        // URL safety.

        $last = strripos($filename, '.');
        $first = strripos($filename, '.', $last - strlen($filename) - 1);
        if ($last && $first && $first >= 0 && $last >= 0 && $first != $last) {
            return substr($filename, 0, $first) . substr($filename, $last);
        }
        return $filename;
    }

    static function read($fileId, &$filename = null)
    {
        $filename = str_replace('_', '.', $fileId);
        // Note: we're passing the filename arguments with "_" as "." because of
        // URL safety.

        $filePath = self::APP_DATA_PATH . $filename;
        return file_get_contents($filePath);
    }

    static function store($content, $extension = '', $originalFilename = null)
    {

        // Guarantees tha the 'app-data' folder exists.
        self::createAppData();

        $filename = self::generateFilename($extension, $originalFilename);

        // Store file.
        $filePath = self::APP_DATA_PATH . $filename;
        file_put_contents($filePath, $content);

        // Replace extension '.'. to '_' to be passe as parameters on URL for
        // safety.
        return str_replace('.', '_', $filename);
    }

    /**
     * Returns the verification code associated with the given document, or null
     * if no verification code has been associated with it.
     */
    static function getVerificationCode($fileId)
    {
        // Initialize or resume session
        if (session_status() != PHP_SESSION_ACTIVE) {
            session_start();
        }

        // >>>>> NOTICE <<<<<
        // This should be implemented on your application as a SELECT on your
        // "document table" by the ID of the document, returning the value of
        // the verification code column.
        if (isset($_SESSION['Files/' . $fileId . '/Code'])) {
            return $_SESSION['Files/' . $fileId . '/Code'];
        }
        return null;
    }

    /**
     * Registers the verification code for a given document.
     */
    static function setVerificationCode($fileId, $code)
    {
        // Initialize or resume session
        if (session_status() != PHP_SESSION_ACTIVE) {
            session_start();
        }

        // >>>>> NOTICE <<<<<
        // This should be implemented on your application as a UPDATE on your
        // "document table" filling the verification code column, which should
        // be an indexed column.
        $_SESSION['Files/' . $fileId . '/Code'] = $code;
        $_SESSION['Codes/' . $code] = $fileId;
    }

    /**
     * Returns the ID of the document associated with a given verification code,
     * or null if no document matches the given code.
     */
    static function lookupVerificationCode($code)
    {
        if (empty($code)) {
            return null;
        }

        // Initialize or resume session
        if (session_status() != PHP_SESSION_ACTIVE) {
            session_start();
        }

        // >>>>> NOTICE <<<<<
        // This should be implemented on your application as a SELECT on your
        // "document table" by the verification code column, which should be an
        // indexed column.
        if (isset($_SESSION['Codes/' . $code])) {
            return $_SESSION['Codes/' . $code];
        }
        return null;
    }

    static function createAppData()
    {
        if (!file_exists(StorageMock::APP_DATA_PATH)) {
            mkdir(StorageMock::APP_DATA_PATH);
        }
    }

    static function getSampleDocName($fileId)
    {
        switch ($fileId) {
            case SampleDocs::SAMPLE_PDF:
                return 'SamplePdf.pdf';
            case SampleDocs::PDF_SIGNED_ONCE:
                return 'SamplePdfSignedOnce.pdf';
            case SampleDocs::PDF_SIGNED_TWICE:
                return 'SamplePdfSignedTwice.pdf';
            case SampleDocs::CMS_SIGNED_ONCE:
                return 'SampleCms.p7s';
            case SampleDocs::CMS_SIGNED_TWICE:
                return 'SampleCmsSignedTwice.p7s';
            case SampleDocs::SAMPLE_NFE:
                return 'SampleNFe.xml';
            case SampleDocs::SAMPLE_XML:
                return 'SampleDocument.xml';
            default:
                throw new \Exception('File not found');
        }
    }

    static function getSampleDocPath($fileId, &$filename = null)
    {
        $filename = self::getSampleDocName($fileId);
        return StorageMock::RESOURCES_PATH . $filename;
    }

    static function getSampleDocContent($fileId, &$filename = null)
    {
        return StorageMock::getSampleDocPath($fileId, $filename);
    }

    static function getPdfStampPath()
    {
        return StorageMock::RESOURCES_PATH . 'PdfStamp.png';
    }

    static function getPdfStampContent()
    {
        $path = StorageMock::getPdfStampPath();
        return file_get_contents($path);
    }

    static function getBatchDocPath($id)
    {
        return sprintf('%s/%02d.pdf', StorageMock::RESOURCES_PATH, $id % 10);
    }

    static function getSampleVisualRepPath()
    {
        return StorageMock::RESOURCES_PATH . 'vr.json';
    }

    static function getSampleCertificatePath()
    {
        return StorageMock::RESOURCES_PATH . 'Pierre de Fermat.pfx';
    }
}