#!/usr/bin/env python3
"""Generate SAMPLES.md from samples.json.

Usage (from anywhere):  python scripts/generate-samples-md.py

SAMPLES.md is generated: edit samples.json and re-run this script instead of
editing the markdown. scripts/validate-catalog.py fails when they drift apart.
Needs only the Python 3.8+ standard library.
"""

import json
import sys
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "samples.json"
SAMPLES_MD = ROOT / "SAMPLES.md"

LANGUAGES = OrderedDict([
    ("dotnet", ".NET"),
    ("java", "Java"),
    ("nodejs", "Node.js"),
    ("php", "PHP"),
    ("python", "Python"),
    ("ruby", "Ruby"),
])

FRAMEWORKS = {
    "aspnet-mvc": "ASP.NET MVC",
    "aspnet-core-angular": "ASP.NET Core + Angular",
    "spring-boot": "Spring Boot",
    "express": "Express",
    "php": "PHP",
    "flask": "Flask",
    "django": "Django",
    "rails": "Rails",
}

PRODUCTS = {
    "web-pki": "Web PKI",
    "rest-pki": "Rest PKI",
    "rest-pki-core": "Rest PKI Core",
    "pki-express": "PKI Express",
    "pki-sdk": "PKI SDK",
    "amplia": "Amplia",
    "cloudhub": "CloudHub",
    "signer": "Signer",
}

# Headings for task groups (the `id` minus its `-<product>` suffix). A group
# missing here still renders, with a heading derived from its slug.
TASK_GROUPS = {
    "pades-signature": "Sign a PDF (PAdES)",
    "pades-signature-without-communication": "Sign a PDF without browser access to Rest PKI",
    "batch-pades-signature": "Sign multiple PDFs",
    "pades-signature-server-key": "Sign a PDF with a server key",
    "sign-with-cloud-certificate": "Sign a PDF with a cloud certificate (CloudHub)",
    "pades-signature-cloud-oauth": "Sign a PDF with a cloud certificate (OAuth flow)",
    "pades-signature-cloud-password": "Sign a PDF with a cloud certificate (password flow)",
    "signature-session": "Rest PKI Core signature sessions",
    "signature-session-predefined-documents": "Rest PKI Core signature sessions with predefined documents",
    "signature-session-file-validation": "Validate files uploaded to a signature session",
    "webhook": "Webhooks",
    "timestamp-pdf": "Timestamp a PDF",
    "cades-signature": "Sign a file with CMS/CAdES",
    "batch-cades-signature": "Sign multiple files with CMS/CAdES",
    "cades-signature-server-key": "Sign a file with CMS/CAdES and a server key",
    "cades-signature-cloud-oauth": "Sign a file with CMS/CAdES and a cloud certificate",
    "merge-cades-signatures": "Merge CMS/CAdES signatures",
    "xml-signature": "Sign an XML document (XAdES)",
    "xml-signature-server-key": "Sign an XML document with a server key",
    "xml-signature-cloud-oauth": "Sign an XML document with a cloud certificate",
    "xml-element-signature": "Sign one element of an XML document",
    "xml-nfe-signature": "Sign a Brazilian NF-e",
    "xml-cod-signature": "Sign a COD XML",
    "xml-diploma-signature": "Sign a Brazilian digital diploma",
    "validate-pades-signature": "Validate a signed PDF",
    "validate-cades-signature": "Validate a CMS/CAdES signature",
    "validate-xml-signature": "Validate a signed XML",
    "printer-friendly-pdf": "Printer-friendly version of a signed PDF",
    "printer-friendly-cades": "Printer-friendly version of a CMS/CAdES signature",
    "authentication": "Authenticate with a digital certificate",
    "authentication-cloud-oauth": "Authenticate with a cloud certificate (OAuth flow)",
    "list-certificates": "List the user's certificates",
    "read-certificate": "Read a certificate's details",
    "rsa-signature": "Raw RSA signature in the browser",
    "issue-certificate-user-key": "Issue a certificate with the key on the user's machine",
    "issue-certificate-server-key": "Issue a certificate with the key on the server",
    "issue-pkcs12-certificate": "Issue a PKCS #12 certificate",
    "issue-attribute-certificate": "Issue an attribute certificate",
    "prescription-signature": "Sign a medical prescription (Receita Simples)",
}

STATUS_LEGEND = [
    ("current", "Recommended for new integrations."),
    ("legacy", "Works and is still supported, but prefer the `current` alternative for new code."),
    ("deprecated", "Kept for reference only. Do not copy into new code."),
]


def load_catalog():
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def task_of(entry):
    return entry["id"][: -(len(entry["product"]) + 1)]


def heading(task):
    return TASK_GROUPS.get(task) or task.replace("-", " ").capitalize()


def anchor(text):
    keep = "".join(c for c in text.lower() if c.isalnum() or c in " -")
    return keep.replace(" ", "-")


def cell(entries, multi_framework):
    links = []
    for e in sorted(entries, key=lambda x: list(FRAMEWORKS).index(x["framework"])):
        text = FRAMEWORKS[e["framework"]] if multi_framework else "code"
        links.append(f"[{text}]({e['path']})")
    return "<br>".join(links) if links else "—"


def render(catalog):
    groups = OrderedDict()
    for e in catalog:
        groups.setdefault(task_of(e), OrderedDict()).setdefault(e["id"], []).append(e)

    frameworks_per_language = {}
    for e in catalog:
        frameworks_per_language.setdefault(e["language"], set()).add(e["framework"])

    out = [
        "<!-- Generated by scripts/generate-samples-md.py from samples.json. Do not edit by hand. -->",
        "",
        "# Samples by task",
        "",
        "Every sample in this repository, grouped by task, with one column per language. "
        "Each link opens the sample's entry file (controller, route module or page). "
        "The machine-readable version, with related files, run commands and docs links, is "
        "[samples.json](samples.json).",
        "",
        "## Status legend",
        "",
        "| Status | Meaning |",
        "|---|---|",
    ]
    out += [f"| `{s}` | {m} |" for s, m in STATUS_LEGEND]
    out += ["", "## Tasks", ""]
    out += [f"- [{heading(t)}](#{anchor(heading(t))})" for t in groups]
    out += ["", "## How to run each project", "", "| Project | Run from | Command | Open |", "|---|---|---|---|"]

    projects = OrderedDict()
    for e in catalog:
        run = e["run"]
        base = run["url"].split("/", 3)
        projects.setdefault(run["cwd"], (e, run["command"], "/".join(base[:3]) + "/"))
    for cwd, (e, command, base) in projects.items():
        name = f"{LANGUAGES[e['language']]} / {FRAMEWORKS[e['framework']]}"
        out.append(f"| {name} | [`{cwd}`]({cwd}) | `{command}` | {base} |")

    for task, ids in groups.items():
        out += ["", f"## {heading(task)}", ""]
        out.append("| Sample | Product | Status | " + " | ".join(LANGUAGES.values()) + " |")
        out.append("|---|---|---|" + "---|" * len(LANGUAGES))
        for sample_id, entries in ids.items():
            first = entries[0]
            row = [f"**{first['title']}**<br>`{sample_id}`", PRODUCTS[first["product"]]]
            statuses = sorted({e["status"] for e in entries})
            row.append(" / ".join(f"`{s}`" for s in statuses))
            for lang in LANGUAGES:
                in_lang = [e for e in entries if e["language"] == lang]
                row.append(cell(in_lang, len(frameworks_per_language.get(lang, ())) > 1))
            out.append("| " + " | ".join(row) + " |")
    out.append("")
    return "\n".join(out)


def main():
    SAMPLES_MD.write_text(render(load_catalog()), encoding="utf-8", newline="\n")
    print(f"wrote {SAMPLES_MD.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
