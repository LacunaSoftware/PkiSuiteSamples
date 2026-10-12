#!/usr/bin/env python3
"""Smoke-test a running sample project: its home page and a few of its catalog pages.

Usage:  python scripts/ci/smoke-test.py <project> [--base-url URL] [--timeout SECONDS]

<project> is a project folder, such as java/springmvc or dotnet/spa. The script checks the
samples listed for it in SMOKE_SAMPLES below, and reads their URLs (`run.url`) from samples.json.
--base-url replaces the scheme, host and port of those URLs, for an app that listens somewhere
else than the catalog says (the SPA runs on plain HTTP in CI).

It first waits up to --timeout seconds for the app to answer, then checks that:
  1. the home page returns 200;
  2. each listed sample page returns 200 after following redirects. A "check" route, such as
     /check-rest-token or /Home/CheckPkiLicense, must redirect first: when a credential is
     missing it renders an explanation page with status 200 instead of redirecting.

Exits with status 1 when a check fails. Needs only the Python 3.8+ standard library.
"""

import argparse
import http.cookiejar
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CATALOG = ROOT / "samples.json"

PKI_EXPRESS = "its check route runs PKI Express, which CI does not install"
NO_CORE_KEY = ("the committed config has no Rest PKI Core API key yet "
               "(update-licenses.ps1 fills it in at the next rotation)")

# The samples to check in each project, as (sample id, reason to skip or None). Each one's page
# loads without calling Lacuna's cloud services (Rest PKI, Rest PKI Core, Amplia, CloudHub) or
# PKI Express: check routes that end on the server-files or upload page, and Web PKI pages,
# whose server side only renders HTML. Signing itself needs a browser with Web PKI.
SMOKE_SAMPLES = {
    "dotnet/mvc": [
        ("pades-signature-rest-pki-core", None),
        ("pades-signature-rest-pki", None),
        ("pades-signature-pki-sdk", None),
        ("validate-pades-signature-pki-sdk", None),
        ("list-certificates-web-pki", None),
    ],
    "dotnet/spa": [
        ("pades-signature-rest-pki", None),
        ("pades-signature-pki-sdk", None),
        ("xml-signature-pki-sdk", None),
    ],
    "java/springmvc": [
        ("pades-signature-rest-pki-core", None),
        ("pades-signature-rest-pki", None),
        ("validate-pades-signature-rest-pki", None),
        ("list-certificates-web-pki", None),
        ("pades-signature-pki-express", PKI_EXPRESS),
    ],
    "nodejs/expressmvc": [
        ("pades-signature-rest-pki-core", None),
        ("pades-signature-rest-pki", None),
        ("validate-pades-signature-rest-pki", None),
        ("pades-signature-pki-express", None),
        ("list-certificates-web-pki", None),
    ],
    "php/plain": [
        ("pades-signature-rest-pki-core", None),
        ("pades-signature-rest-pki", None),
        ("validate-pades-signature-rest-pki", None),
        ("pades-signature-pki-express", PKI_EXPRESS),
    ],
    "python/django": [
        ("pades-signature-rest-pki", None),
        ("validate-pades-signature-rest-pki", None),
        ("printer-friendly-pdf-rest-pki", None),
    ],
    "python/flask": [
        ("pades-signature-rest-pki-core", NO_CORE_KEY),
        ("pades-signature-rest-pki", None),
        ("validate-pades-signature-rest-pki", None),
        ("list-certificates-web-pki", None),
        ("pades-signature-pki-express", PKI_EXPRESS),
    ],
    "ruby/rails": [
        ("pades-signature-rest-pki-core", NO_CORE_KEY),
        ("pades-signature-rest-pki", None),
        ("validate-pades-signature-rest-pki", None),
        ("list-certificates-web-pki", None),
        ("pades-signature-pki-express", PKI_EXPRESS),
    ],
}

CHECK_ROUTE = re.compile(r"^/(home/)?(check|redirecttospa)", re.IGNORECASE)
IN_ACTIONS = os.environ.get("GITHUB_ACTIONS") == "true"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def get(opener, url, timeout):
    """GET url without following redirects; return (status, Location header)."""
    try:
        with opener.open(url, timeout=timeout) as resp:
            return resp.status, None
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location")


def annotate(level, message):
    if IN_ACTIONS:
        print(f"::{level}::{message}")


def rebase(url, base_url):
    """Replace the scheme, host and port of url with those of base_url."""
    if not base_url:
        return url
    parts = urllib.parse.urlsplit(url)
    base = urllib.parse.urlsplit(base_url)
    return urllib.parse.urlunsplit((base.scheme, base.netloc, parts.path, parts.query, ""))


def wait_for_app(opener, url, timeout):
    deadline = time.monotonic() + timeout
    while True:
        try:
            status, _ = get(opener, url, timeout=30)
            print(f"The app answered {url} with status {status}.")
            return True
        except OSError:
            if time.monotonic() > deadline:
                return False
            time.sleep(3)


def check_page(opener, url, timeout):
    """Follow url's redirects; return a list of problems (empty when the page is fine)."""
    chain = []
    current = url
    for _ in range(10):
        status, location = get(opener, current, timeout)
        chain.append(f"{status} {current}")
        if status in (301, 302, 303, 307, 308) and location:
            current = urllib.parse.urljoin(current, location)
            continue
        break
    print("    " + "\n    -> ".join(chain))
    problems = []
    if status != 200:
        problems.append(f"ended with status {status}, expected 200")
    if CHECK_ROUTE.match(urllib.parse.urlsplit(url).path) and len(chain) < 2:
        problems.append("the check route did not redirect (is a credential or license missing?)")
    return problems


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("project", choices=sorted(SMOKE_SAMPLES))
    parser.add_argument("--base-url", help="scheme://host:port that replaces the catalog's")
    parser.add_argument("--timeout", type=int, default=300, help="seconds to wait for the app")
    args = parser.parse_args()

    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    entries = {e["id"]: e for e in catalog
               if (e["run"]["cwd"] + "/").startswith(args.project + "/")}
    missing = [sid for sid, _ in SMOKE_SAMPLES[args.project] if sid not in entries]
    if missing:
        sys.exit(f"Not in samples.json for {args.project}: {', '.join(missing)}. "
                 f"Update SMOKE_SAMPLES in {Path(__file__).name}.")

    first_url = entries[SMOKE_SAMPLES[args.project][0][0]]["run"]["url"]
    home = urllib.parse.urljoin(rebase(first_url, args.base_url), "/")

    opener = urllib.request.build_opener(
        NoRedirect, urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

    print(f"Waiting up to {args.timeout}s for {home} ...")
    if not wait_for_app(opener, home, args.timeout):
        annotate("error", f"{args.project}: the app did not answer {home} within {args.timeout}s")
        sys.exit(f"The app did not answer {home} within {args.timeout}s.")

    pages = [("home page", home, None)]
    pages += [(sid, rebase(entries[sid]["run"]["url"], args.base_url), skip)
              for sid, skip in SMOKE_SAMPLES[args.project]]

    failures = 0
    for name, url, skip in pages:
        if skip:
            print(f"SKIP {name}: {skip}")
            annotate("notice", f"{args.project}: expected skip of {name}: {skip}")
            continue
        print(f"GET  {name}")
        problems = check_page(opener, url, timeout=120)
        for problem in problems:
            print(f"FAIL {name}: {problem}")
            annotate("error", f"{args.project}: {name} ({url}) {problem}")
        failures += bool(problems)

    checked = sum(1 for _, _, skip in pages if not skip)
    print(f"\n{checked - failures} of {checked} pages passed, {len(pages) - checked} skipped.")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
