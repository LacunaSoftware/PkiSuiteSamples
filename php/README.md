# PKI Suite samples for PHP

This folder contains **PHP sample projects** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

Default sample (PHP Plain)
--------------------------

A sample using **PHP** plain to build a web application can be found on folder [plain](plain).

Steps to execute the sample:

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip) or 
   clone the [repository](https://github.com/LacunaSoftware/PkiSuiteSamples.git)
   
1. Install dependencies: `composer install`

1. Run application: `composer start`

1. Access the URL http://localhost:8000

> This sample requires **PHP 5.5+**. If you're doing another version of PHP, please visit our legacy samples
for [PHP 5.3 and 5.4](https://github.com/LacunaSoftware/RestPkiSamples/tree/master/PHP/legacy) or for
[PHP 5.2](https://github.com/LacunaSoftware/RestPkiSamples/tree/master/PHP/legacy52).

REST PKI's client lib
---------------------

The sample projects depend on [Rest PKI client lib for PHP](https://github.com/LacunaSoftware/RestPkiPhpClient) library, which in
turn requires **PHP 5.5** or greater.

This dependency is specified in the file `composer.json`:

	{
		"require": {
			"lacuna/restpki-client": "^2.3.1"
		}
	}

PKI Express's helper library
----------------------------

The sample projects also depend on [PKI Express's library for PHP](https://github.com/LacunaSoftware/RestPkiPhpClient) library, which in
turn requires **PHP 5.5** or greater.

	{
		"require": {
			"lacuna/pki-express": "^1.5.0"
		}
	}

See also
--------

* [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
* [Samples in other programming languages](https://github.com/LacunaSoftware/PkiSuiteSamples)
* [REST PKI's Documentation](http://docs.lacunasoftware.com/en-us/articles/rest-pki/php/index.html)
* [PKI Express's Documentation](http://docs.lacunasoftware.com/en-us/articles/pki-express/php/index.html)
* [REST PKI's PHP client library on Packagist](https://packagist.org/packages/lacuna/restpki-client)
* [PKI Express's PHP library on Packagist](https://packagist.org/packages/lacuna/pki-express)