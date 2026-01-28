<?php

require __DIR__ . '/vendor/autoload.php';

use Lacuna\Amplia\AmpliaClient;
use Lacuna\Cloudhub\CloudhubClient;
use Lacuna\RestPki\RestPkiOptions;
use Lacuna\RestPki\RestPkiCoreClient;
use Lacuna\RestPki\RestPkiClient;
use Lacuna\RestPki\StandardSecurityContexts;
use Lacuna\PkiExpress\TimestampAuthority;

class Util
{

    //region REST PKI

    public static function getRestPkiClient()
    {
        // Get configuration.
        $config = getConfig();

        // Get your token value from REST PKI configuration.
        $accessToken = $config['restPki']['accessToken'];

        // Throw exception if token is not set (this check is here just for the sake of newcomers, you
        // can remove it).
        if (empty($accessToken) || strpos($accessToken, ' ACCESS TOKEN ') !== false) {
            throw new \Exception('The REST PKI access token was not set! Hint: to run this ' .
                'sample you must generate an API access token on the REST PKI website and paste it ' .
                'on the file config.php');
        }

        $endpoint = $config['restPki']['endpoint'];

        if (empty($endpoint)) {
            $endpoint = 'https://pki.rest/';
        }

        return new RestPkiClient($endpoint, $accessToken);
    }

    public static function getRestPkiCoreClient()
    {
        // Get configuration.
        $config = getConfig();

        // Get your API Key value from REST PKI NG configuration.
        $apiKey = $config['restPkiNg']['apiKey'];

        // Throw exception if key is not set (this check is here just for the sake of newcomers, you
        // can remove it).
        if (empty($apiKey) || strpos($apiKey, ' API KEY ') !== false) {
            throw new \Exception('The REST PKI NG API Key was not set! Hint: to run this ' .
                'sample you must generate an API Key on the REST PKI NG website and paste it ' .
                'on the file config.php');
        }

        $endpoint = $config['restPkiNg']['endpoint'];

        $options = new RestPkiOptions($endpoint, $apiKey);
        return new RestPkiCoreClient($options);
    }

    public static function getCloudhubClient()
    {
        $config = getConfig();
        $apiKey = $config['cloudHub']['apiKey'];

        if (empty($apiKey) || strpos($apiKey, ' API KEY ') !== false) {
            throw new \Exception('The Cloudhub API Key was not set!');
        }

        $endpoint = $config['cloudHub']['endpoint'];
        return new CloudhubClient($endpoint, $apiKey);
    }

    /**
     * This method is called by all pages to determine the security context to be used.
     *
     * Security contexts dictate witch root certification authorities are trusted during certificate
     * validation. In you API calls, you can use one of the standard security contexts or reference one
     * of you custom contexts.
     */
    public static function getSecurityContextId()
    {
        // Get configuration.
        $config = getConfig();

        if ($config['trustLacunaTestRoot']) {
            return StandardSecurityContexts::LACUNA_TEST;
        }

        // In production, accept only certificates from ICP-Brasil.
        return StandardSecurityContexts::PKI_BRAZIL;
    }

    //endregion

    //region PKI Express

    public static function setPkiDefaults(&$operator)
    {
        // Get configuration.
        $config = getConfig();

        // Set the operator to trust in a custom trusted root, you need to inform the operator class. We
        // will add each trusted root from configuration file. In this sample, we assumed that all
        // trusted roots are in the resources/ folder. You are free to pass any path.
        $trustedRoots = $config['pkiExpress']['trustedRoots'];
        foreach ($trustedRoots as $root) {
            $operator->addTrustedRoot(StorageMock::getResourcePath($root));
        }

        // Set the operator to "OFFLINE MODE" (default: false):
        $operator->offline = $config['pkiExpress']['offline'];

        // Set the operator to use a timestamp authority when performing an timestamp operation. In this
        // sample, we will use the REST PKI by default to emit a timestamp. It only be filled if the
        // REST PKI was provided.
        $restPkiEndpoint = $config['restPki']['endpoint'];
        $restPkiAccessToken = $config['restPki']['accessToken'];
        if ($restPkiAccessToken) {

            // Get an instance of the TimestampAuthority class, responsible to
            // inform the url and authentication logic to be used when contacting
            // and timestamp authority.
            $url = $restPkiEndpoint . 'tsp/a402df41-8559-47b2-a05c-be555bf66310';
            $authority = new TimestampAuthority($url);

            // Set authentication strategy. In the case of REST PKI, is using a bearer token.
            $authority->setOAuthTokenAuthentication($restPkiAccessToken);

            // Add authority to be used on operator.
            $operator->timestampAuthority = $authority;
        }

        // Trust Lacuna Test Root (for development purposes only!). Use this to accept the test
        // certificate provided by Lacuna Software.
        //
        // THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!
        $operator->trustLacunaTestRoot = $config['trustLacunaTestRoot'];
    }

    //endregion

    // region Amplia

    public static function getAmpliaClient()
    {
        $config = getConfig();

        // Throw exception if the API key is not set (this check is here just for the sake fo newcomers,
        // you can remove it).
        $ampliaApiKey = $config['amplia']['apiKey'];
        if (empty($ampliaApiKey) || strpos($ampliaApiKey, ' API KEY ') !== false) {
            throw new \Exception('The API key was not set! Hint: to run this sample ' .
                'you must generate an API key on the Amplia website and paste it on the file config.php');
        }

        $ampliaEndpoint = $config['amplia']['endpoint'];
        if ($ampliaEndpoint == null || count($ampliaEndpoint) === 0) {
            $ampliaEndpoint = 'https://amplia.lacunasoftware.com/';
        }

        // Return an instance of AmpliaClient class, passing the endpoint and the API key.
        return new AmpliaClient($ampliaEndpoint, $ampliaApiKey);
    }

    // endregion

    public static function setExpiredPage()
    {
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() - 3600) . ' GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Cache-Control: private, no-store, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0');
        header('Pragma: no-cache');
    }

    public static function getDateYearsFromNow($years)
    {
        return date('Y-m-d', strtotime("+{$years} years"));
    }

    public static function joinStringsPt($strings)
    {
        $text = '';
        $count = count($strings);
        $index = 0;
        foreach ($strings as $s) {
            if ($index > 0) {
                if ($index < $count - 1) {
                    $text .= ', ';
                } else {
                    $text .= ' e ';
                }
            }
            $text .= $s;
            ++$index;
        }
        return $text;
    }
}
