# PKI Suite samples for Python

This folder contains **Python sample projects** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

Default sample (Flask)
----------------------

A sample using **Flask** to build a web application can be found on folder [flask](flask/).

Steps to execute the sample:

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip) or 
   clone the [repository](https://github.com/LacunaSoftware/PkiSuiteSamples.git)
   
1. Install dependencies: `pip install -r requirements.txt`

1. Set the `FLASK_APP` environment variable to define the name of the application that should be run: `FLASK_APP=sample`

1. Run the web application: `flask run`

1. Access the URL http://localhost:5000

Optionally you can create and activate a "virtualenv" to avoid mixing library versions:

	$ virtualenv <venv>
	$ source bin/activate (on Windows: ./<venv>/Scripts/activate)
	$ pip install -r requirements.txt
	$ python manage.py runserver
	$ deactivate

REST PKI's client lib
---------------------

The sample projects depend on [Rest PKI client lib for PHP](https://github.com/LacunaSoftware/RestPkiPhpClient) library, which in
turn requires **PHP 5.5** or greater.

The recommended way to install **REST PKI's client lib for Python** is through [PyPi](https://pypi.org):

	pip install restpki-client

Or informing on your project's `requirements.txt` file:

	restpki-client==1.0.0

PKI Express's helper library
----------------------------

The sample projects also depend on [PKI Express's library for PHP](https://github.com/LacunaSoftware/RestPkiPhpClient) library, which in
turn requires **PHP 5.5** or greater.

The recommended way to install **PKI Express's lib for Python** is through [PyPi](https://pypi.org):

	pip install pkiexpress

Or informing on your project's `requirements.txt` file:

	pkiexpress==1.3.2

Activating PKI Express
----------------------

After installing PKI Express, is necessary to activate it. On Linux, execute the following
command with root permissions:

	$ sudo pkie activate LacunaPkiLicense.config
	
On Windows, run the _PKI Express Configuration Manager_ (**file `pkiemgr.exe` on the installation folder** 
ex.: C:\Program Files\Lacuna Software\PKI Express) and follow the instructions to activate PKI Express.

See also
--------

* [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
* [Samples in other programming languages](https://github.com/LacunaSoftware/PkiSuiteSamples)
* [REST PKI's Documentation](http://docs.lacunasoftware.com/en-us/articles/rest-pki/python/index.html)
* [PKI Express's Documentation](http://docs.lacunasoftware.com/en-us/articles/pki-express/python/index.html)
* [REST PKI's PHP client library on Packagist](https://pypi.org/project/restpki-client)
* [PKI Express's PHP library on Packagist](https://pypi.org/project/pkiexpress)