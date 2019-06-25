<?php

require __DIR__ . '/vendor/autoload.php';

class SampleDocs
{
    const SAMPLE_PDF = 0;
    const PDF_SIGNED_ONCE = 1;
    const PDF_SIGNED_TWICE = 2;
    const CMS_SIGNED_ONCE = 3;
    const CMS_SIGNED_TWICE = 4;
    const SAMPLE_NFE = 5;
    const SAMPLE_XML = 6;
}

class StorageMock
{
    const APP_DATA_PATH = __DIR__ . '/app-data/';
    const RESOURCES_PATH = __DIR__ . '/resources/';

    static function getDataPath($fileId, $extension = '')
    {
        $filename = str_replace('_', '.', $fileId) . $extension;
        return StorageMock::APP_DATA_PATH . $filename;
    }

    static function getResourcePath($resource)
    {
        return StorageMock::RESOURCES_PATH . $resource;
    }

    static function exists($fileId, &$filename = null)
    {
        $filename = str_replace('_', '.', $fileId);
        $filePath = StorageMock::APP_DATA_PATH . $filename;
        return file_exists($filePath);
    }

    static function read($fileId, &$filename = null)
    {
        $filename = str_replace('_', '.', $fileId);
        $filePath = StorageMock::APP_DATA_PATH . $filename;
        return file_get_contents($filePath);
    }

    static function store($content, $extension = '', $filename = null)
    {

        // Guarantees tha the 'app-data' folder exists.
        StorageMock::createAppData();

        // Generate fileId.
        if (empty($filename)) {
            $filename = uniqid();
        }
        $fileId = $filename . $extension;

        // Store file.
        $filePath = StorageMock::APP_DATA_PATH . $fileId;
        file_put_contents($filePath, $content);

        // Replace extension '.'. to '_' to be passe as parameters on URL for safety.
        return str_replace('.', '_', $fileId);
    }

    /**
     * Returns the verification code associated with the given document, or null if no verification
     * code has been associated with it.
     */
    static function getVerificationCode($fileId)
    {
        // Initialize or resume session
        if (session_status() != PHP_SESSION_ACTIVE) {
            session_start();
        }

        // >>>>> NOTICE <<<<<
        // This should be implemented on your application as a SELECT on your "document table" by
        // the ID of the document, returning the value of the verification code column.
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
        // This should be implemented on your application as a UPDATE on your "document table"
        // filling the verification code column, which should be an indexed column.
        $_SESSION['Files/' . $fileId . '/Code'] = $code;
        $_SESSION['Codes/' . $code] = $fileId;
    }

    /**
     * Returns the ID of the document associated with a given verification code, or null if no
     * document matches the given code.
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
        // This should be implemented on your application as a SELECT on your "document table" by
        // the verification code column, which should be an indexed column.
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

    static function getSampleDocPath($fileId, &$filename = null)
    {

        switch ($fileId) {
            case SampleDocs::SAMPLE_PDF:
                $filename = 'SampleDocument.pdf';
                break;
            case SampleDocs::PDF_SIGNED_ONCE:
                $filename = 'SamplePdfSignedOnce.pdf';
                break;
            case SampleDocs::PDF_SIGNED_TWICE:
                $filename = 'SamplePdfSignedTwice.pdf';
                break;
            case SampleDocs::CMS_SIGNED_ONCE:
                $filename = 'SampleCms.p7s';
                break;
            case SampleDocs::CMS_SIGNED_TWICE:
                $filename = 'SampleCmsSignedTwice.p7s';
                break;
            case SampleDocs::SAMPLE_NFE:
                $filename = 'SampleNFe.xml';
                break;
            case SampleDocs::SAMPLE_XML:
                $filename = 'SampleDocument.xml';
                break;
            default:
                throw new \Exception('Invalid fileId');
        }
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
}