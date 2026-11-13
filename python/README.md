# PKI Suite samples for Python

This folder contains **Python sample projects** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

## Default sample (Flask)

A sample using **Flask** to build a web application can be found on folder [flask](flask/).

Steps to execute the sample:

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip) or
   clone the [repository](https://github.com/LacunaSoftware/PkiSuiteSamples.git)
1. On the [flask](flask/) folder, install the dependencies: `pip install -r requirements.txt`

1. Set the `FLASK_APP` environment variable to define the name of the application that should be run: `FLASK_APP=sample`

1. Set the `FLASK_ENV` environment variable, which the app requires: `FLASK_ENV=development` selects the configuration that accepts test certificates

1. Run the web application: `flask run`

1. Access the URL http://localhost:5000

Optionally you can create and activate a "virtualenv" to avoid mixing library versions:

    $ virtualenv <venv>
    $ source <venv>/bin/activate (on Windows: ./<venv>/Scripts/activate)
    $ pip install -r requirements.txt
    $ flask run
    $ deactivate

### Running with devcontainer
The flask sample also has a devcontainer. To run it, just open the folder in [flask](flask/) and install the [Devcontainer for VSCode](https://code.visualstudio.com/docs/devcontainers/containers#_getting-started) to run it, next, use the launch.json configuration in the Run and Debug (`Ctrl+Shift+D`) to run the project.
## Django

There is no Django sample. The calls to Lacuna's client libraries are the same in any Python
web framework, so the Flask sample is the guide: only the routing, the templates and the
request handling change. In Django, keep its CSRF protection on and add the token to the
forms that the sample's page scripts submit.

## REST PKI's client lib

The sample projects depend on [Rest PKI client lib for Python](https://github.com/LacunaSoftware/RestPkiPythonClient) library.

The recommended way to install **REST PKI's client lib for Python** is through [PyPi](https://pypi.org):

    pip install restpki-client

Or adding it to your project's `requirements.txt` file:

    restpki-client>=1.2.1

## Rest PKI Core's client lib

The Rest PKI Core sample of the Flask project uses `restpki-ng-python-client`, a client library for
Rest PKI Core published by Lacuna Software on [PyPi](https://pypi.org/project/restpki-ng-python-client/).
It is generated from the Rest PKI Core API and is not listed yet on the
[Rest PKI Core documentation](https://docs.lacunasoftware.com/en-us/articles/rest-pki/core/integration/get-started).
The sample pins its version on `requirements.txt`:

    restpki-ng-python-client==0.9.1.1

The sample calls the library's API classes (such as `SignatureApi`) with an `ApiClient` created in
`sample/utils.py`, instead of the library's `RestPkiClient` class, because `RestPkiClient` turns off
the verification of the server's TLS certificate.

## PKI Express's helper library

The sample projects also depend on [PKI Express's library for Python](https://github.com/LacunaSoftware/PkiExpressPython) library.

The recommended way to install **PKI Express's lib for Python** is through [PyPi](https://pypi.org):

    pip install pkiexpress

Or adding it to your project's `requirements.txt` file:

    pkiexpress>=1.10.0

## Activating PKI Express

After installing PKI Express, it is necessary to activate it. On Linux, execute the following
command with root permissions:

    $ sudo pkie activate LacunaPkiLicense.config

On Windows, run the _PKI Express Configuration Manager_ (**file `pkiemgr.exe` on the installation folder**
ex.: C:\Program Files\Lacuna Software\PKI Express) and follow the instructions to activate PKI Express.

## See also

- [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
- [Samples in other programming languages](https://github.com/LacunaSoftware/PkiSuiteSamples)
- [REST PKI's Documentation](http://docs.lacunasoftware.com/en-us/articles/rest-pki/python/index.html)
- [PKI Express's Documentation](http://docs.lacunasoftware.com/en-us/articles/pki-express/python/index.html)
- [REST PKI's Python client library on PyPI](https://pypi.org/project/restpki-client)
- [PKI Express's Python library on PyPI](https://pypi.org/project/pkiexpress)
