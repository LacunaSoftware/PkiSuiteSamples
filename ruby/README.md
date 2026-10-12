# PKI Suite samples for Ruby

This folder contains the **Ruby sample project** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**: [`rails/`](rails/), a Rails 8.1 app
on Ruby 3.3 with the samples for Rest PKI, Rest PKI Core, PKI Express and Web PKI.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

## Running the sample

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip)
   or clone the repository

2. Install Ruby 3.3 and Bundler

3. In the `ruby/rails` folder, install dependencies: `bundle install`

4. Run application: `rails server`

5. Access the URL [http://localhost:3000](http://localhost:3000)

The committed `config/lacuna.yml` holds the trial credentials that `update-licenses.ps1` rotates.
To use your own Rest PKI access token or Rest PKI Core API key, see
[rails/README.md](rails/README.md#configuration). The PKI Express samples also need PKI Express
installed and activated.

## See also

* [Rails sample README](rails/README.md), with the list of samples
* [Sample projects in other programming languages](../README.md)
* [PKI Suite demos](https://demos.lacunasoftware.com/)
* [Documentation](https://docs.lacunasoftware.com/)
* [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
* [Lacuna Software website](https://www.lacunasoftware.com/)
