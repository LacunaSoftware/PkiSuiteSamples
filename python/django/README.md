# Django sample (Python)

A Django project with **Rest PKI** samples: PAdES signature, validation, printer-friendly version
and a medical prescription. Each sample is a Django app folder in `sample/` with its own `views.py`
and `urls.py`; templates are in `sample/templates/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: python/django/sample) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [views.py](sample/pades_signature_rest/views.py) | http://localhost:8000/server-files?rc=pades-signature-rest&op=signPdf |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [views.py](sample/open_pades_rest/views.py) | http://localhost:8000/upload?rc=open-pades-rest |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [views.py](sample/printer_version_pades_rest/views.py) | http://localhost:8000/server-files?rc=printer-version-pades-rest&op=printerFriendlyPdf |
| Sign a medical prescription (Receita Simples) using Rest PKI<br>`prescription-signature-rest-pki` | Rest PKI | [views.py](sample/receita_simples_rest/views.py) | http://localhost:8000/receita-simples-rest/ |
<!-- END GENERATED SAMPLES LIST -->

## Run

`requirements.txt` is in this folder, and `manage.py` is in `sample/`:

```bash
pip install -r requirements.txt
cd sample
python manage.py migrate
python manage.py runserver
```

Then open http://localhost:8000/. `migrate` creates the SQLite database that Django sessions use.

## Configuration

- `sample/config.py`: Rest PKI settings, read by `sample/utils.py`. Every key is documented in
  [`sample/config.py.example`](sample/config.py.example).
- `sample/PkiSuitePythonDjangoSample/settings.py`: Django settings. The committed `SECRET_KEY` is a
  development-only key.
- The committed Rest PKI token is a trial credential rotated by `update-licenses.ps1`. Do not
  replace it in this repository.

See also: [Python samples README](../README.md), [AGENTS.md](../../AGENTS.md).
