# PKI Suite samples for Node.js

This folder contains **Node.js sample projects** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

Default sample (Express.js MVC)
-------------------------------

A sample using **Express.js** to build a web application can be found in the folder [expressmvc](expressmvc/)

Steps to execute the sample:

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip) or 
   clone the [repository](https://github.com/LacunaSoftware/PkiSuiteSamples.git)
   
1. Install dependencies: `npm install`

1. Run application: `npm start`

1. Access the URL http://localhost:3000

> If you use [Yarn](https://yarnpkg.com), you can use `yarn install` or `yarn` to **download the dependencies** and
> `yarn start` to **run the application**.

REST PKI's client lib
---------------------

The recommend way to install **REST PKI's client library for Node.js** is through [npm](https://www.npmjs.com/):

    $ npm install restpki-client

Or informing on your project's `package.json` file:

```json
{
  "dependencies": {
    "restpki-client": "2.3.1"
  }
}
```

Amplia's client lib
---------------------

The recommend way to install **REST PKI's client library for Node.js** is through [npm](https://www.npmjs.com/):

    $ npm install amplia-client

Or informing on your project's `package.json` file:

```json
{
  "dependencies": {
    "amplia-client": "1.2.0"
  }
}
```

Cloudhub's client lib
---------------------
This library contains classes that encapsulate the calls to the Cloudhub API.

The recommend way to install **Cloudhub client library** is through [npm](https://www.npmjs.com/):

    $ npm install cloudhub-client

Or informing on your project's `package.json` file:

    {
      ...
      "dependencies": {
        "cloudhub-client": "1.0.0"
      }
    }


PKI Express's helper library
----------------------------

The recommend way to install **PKI Express for Node.js** is through [npm](https://www.npmjs.com/):

    $ npm install pki-express

Or informing on your project's `package.json` file:

```json
{
  "dependencies": {
    "pki-express": "1.12.0"
  }
}
```

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
* [REST PKI's Documentation](http://docs.lacunasoftware.com/en-us/articles/rest-pki/nodejs/index.html)
* [PKI Express's Documentation](http://docs.lacunasoftware.com/en-us/articles/pki-express/nodejs/index.html)
* [REST PKI's Node.js client library on NPM](https://www.npmjs.com/package/restpki-client)
* [PKI Express's Node.js library on NPM](https://www.npmjs.com/package/pki-express)