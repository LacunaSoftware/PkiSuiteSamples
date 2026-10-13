#!/usr/bin/env python3
"""Smoke-test a running sample project: its home page and a few of its catalog pages.

Usage:  python scripts/ci/smoke-test.py <project> [--base-url URL] [--timeout SECONDS]

<project> is a project folder, such as java/springmvc or dotnet/mvc. The script checks the
samples listed for it in SMOKE_SAMPLES below, and reads their URLs (`run.url`) from samples.json.
--base-url replaces the scheme, host and port of those URLs, for an app that listens somewhere
else than the catalog says, such as an HTTPS app run on plain HTTP in CI.

It first waits up to --timeout seconds for the app to answer, then checks that:
  1. the home page returns 200;
  2. each listed sample page returns 200 after following redirects. A "check" route, such as
     /check-rest-token or /Home/CheckPkiLicense, must redirect first: when a credential is
     missing it renders an explanation page with status 200 instead of redirecting.
For a single-page app (SPA_PROJECTS below), which answers every route with its index.html, it
also checks that:
  3. each page contains the app's root element, such as <app-root>;
  4. the app's JavaScript declares a route for each listed sample, without which the browser
     would show the app's not-found page. The script reads the <script> files of index.html and
     every module they import, lazy chunks included, each of which must answer 200 with
     JavaScript. It looks for a route declaration with the sample's path (`path: "<sample id>"`),
     not just the id, which the home page also lists. This checks only that the route exists:
     the script runs no JavaScript, so it cannot tell whether the page renders;
  5. a JSON API endpoint, such as /api/configuration, answers 200 with JSON.

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
    # An Angular app: see SPA_PROJECTS below. Every sample is listed, since each check costs one
    # request. Its Rest PKI Core pages call Rest PKI Core only when the user acts, so they need no
    # skip.
    "dotnet/spa": [
        ("pades-signature-pki-sdk", None),
        ("pades-signature-rest-pki-core", None),
        ("cades-signature-pki-sdk", None),
        ("cades-signature-rest-pki-core", None),
        ("xml-signature-pki-sdk", None),
        ("xml-signature-rest-pki-core", None),
        ("xml-nfe-signature-pki-sdk", None),
        ("validate-pades-signature-pki-sdk", None),
        ("validate-pades-signature-rest-pki-core", None),
        ("authentication-pki-sdk", None),
        ("authentication-rest-pki-core", None),
        ("timestamp-pdf-rest-pki-core", None),
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

# Single-page apps, as {project: (root element, JSON API path)}. Their server answers every route
# that is not an API or a file with the app's index.html and status 200, so a status check alone
# proves little. For them the script also checks that each page holds the app's root element, that
# the app's JavaScript has a route for each sample, and that the API path answers 200 with JSON.
SPA_PROJECTS = {
    "dotnet/spa": ("app-root", "/api/configuration"),
}

CHECK_ROUTE = re.compile(r"^/(home/)?(check|redirecttospa)", re.IGNORECASE)
# The scripts of an index.html, and the relative imports of a JavaScript module: static
# (`from "./chunk.js"`, `import "./chunk.js"`) and dynamic (`import("./chunk.js")`), as Angular's
# build writes them. Angular 22 quotes them with backticks (import(`./chunk.js`)).
SCRIPT_SRC = re.compile(r"""<script\b[^>]*\bsrc=["']([^"']+)["']""", re.IGNORECASE)
JS_IMPORT = re.compile(r"""(?:\bfrom|\bimport)\s*\(?\s*["'`](\.{1,2}/[^"'`]+\.m?js)["'`]""")
MAX_SCRIPTS = 500  # stop following imports after this many scripts
IN_ACTIONS = os.environ.get("GITHUB_ACTIONS") == "true"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def get(opener, url, timeout):
    """GET url without following redirects; return (status, Location header)."""
    status, location, _, _ = fetch(opener, url, timeout, read_body=False)
    return status, location


def fetch(opener, url, timeout, read_body=True):
    """GET url without following redirects; return (status, Location, Content-Type, body).

    The body is read only for a 2xx response when read_body is true, and is b"" otherwise."""
    try:
        with opener.open(url, timeout=timeout) as resp:
            body = resp.read() if read_body else b""
            return resp.status, None, resp.headers.get("Content-Type", ""), body
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location"), e.headers.get("Content-Type", ""), b""


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
    """Return None once the app answers url with any status, or the last error at the deadline."""
    deadline = time.monotonic() + timeout
    while True:
        try:
            status, _ = get(opener, url, timeout=30)
            print(f"The app answered {url} with status {status}.")
            return None
        except OSError as e:
            if time.monotonic() > deadline:
                return e
            time.sleep(3)


def check_page(opener, url, timeout, root_element=None):
    """Follow url's redirects; return a list of problems (empty when the page is fine).

    With root_element, the final page must also contain that element."""
    chain = []
    current = url
    for _ in range(10):
        try:
            status, location, _, body = fetch(opener, current, timeout, read_body=bool(root_element))
        except OSError as e:
            print("    " + "\n    -> ".join(chain + [f"{e} {current}"]))
            return [f"request failed: {e}"]
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
    if status == 200 and root_element and f"<{root_element}".encode() not in body:
        problems.append(f"the page has no <{root_element}> element (is the app built into wwwroot?)")
    return problems


def route_pattern(path):
    """A regex for a route declaration with this path, such as path:"pades-signature-pki-sdk", or
    path:`pades-signature-pki-sdk` as Angular 22 writes it."""
    return re.compile(r"""["']?\bpath["']?\s*:\s*["'`]""" + re.escape(path) + r"""["'`]""")


def read_app_scripts(opener, home, timeout):
    """Read the scripts of the app's index.html and every module they import, transitively.

    Return (JavaScript texts, problems); a script that does not answer 200 with JavaScript is a
    problem."""
    try:
        status, _, _, body = fetch(opener, home, timeout)
    except OSError as e:
        return [], [f"request failed: {e} {home}"]
    if status != 200:
        return [], [f"{home} ended with status {status}, expected 200"]
    queue = [urllib.parse.urljoin(home, src) for src in SCRIPT_SRC.findall(body.decode("utf-8", "replace"))]
    if not queue:
        return [], [f"{home} has no <script src=...> (is the app built into wwwroot?)"]
    seen, texts, problems = set(queue), [], []
    while queue and len(seen) <= MAX_SCRIPTS:
        url = queue.pop(0)
        try:
            status, _, content_type, body = fetch(opener, url, timeout)
        except OSError as e:
            problems.append(f"request failed: {e} {url}")
            continue
        if status != 200:
            problems.append(f"the script {url} ended with status {status}, expected 200")
            continue
        if "javascript" not in content_type.lower():
            # A missing file that fell through to the app's index.html, for instance.
            problems.append(f"the script {url} answered {content_type or 'no Content-Type'}, "
                            "expected JavaScript")
            continue
        text = body.decode("utf-8", "replace")
        texts.append(text)
        for path in JS_IMPORT.findall(text):
            imported = urllib.parse.urljoin(url, path)
            if imported not in seen:
                seen.add(imported)
                queue.append(imported)
    print(f"    read {len(texts)} script(s) of {home}")
    return texts, problems


def check_json_api(opener, url, timeout):
    """GET url; return a list of problems unless it answers 200 with a JSON body."""
    try:
        status, _, content_type, body = fetch(opener, url, timeout)
    except OSError as e:
        print(f"    {e} {url}")
        return [f"request failed: {e}"]
    print(f"    {status} {url} ({content_type or 'no Content-Type'})")
    if status != 200:
        return [f"ended with status {status}, expected 200"]
    if "json" not in content_type.lower():
        return [f"answered {content_type or 'no Content-Type'}, expected JSON "
                "(did the request fall through to the single-page app's index.html?)"]
    try:
        json.loads(body)
    except ValueError as e:
        return [f"the body is not valid JSON: {e}"]
    return []


def main():
    sys.stdout.reconfigure(line_buffering=True)  # show progress in CI logs as it happens
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
    error = wait_for_app(opener, home, args.timeout)
    if error:
        message = f"the app did not answer {home} within {args.timeout}s (last error: {error})"
        annotate("error", f"{args.project}: {message}")
        sys.exit(message)

    root_element, api_path = SPA_PROJECTS.get(args.project, (None, None))

    # For a single-page app: its JavaScript, read once, in which each sample needs a route.
    scripts = None

    def spa_route_problems(url):
        nonlocal scripts
        if scripts is None:
            scripts = read_app_scripts(opener, home, timeout=120)
        texts, problems = scripts
        route = urllib.parse.urlsplit(url).path.strip("/").split("/")[0]
        if not problems and route and not any(route_pattern(route).search(t) for t in texts):
            problems = [f"the app's JavaScript has no route for /{route} "
                        "(the browser would show the not-found page)"]
        return problems

    def page(url):
        problems = check_page(opener, url, timeout=120, root_element=root_element)
        if root_element and not problems:
            problems = spa_route_problems(url)
        return problems

    def json_api(url):
        return check_json_api(opener, url, timeout=120)

    # (name, URL, reason to skip or None, check)
    pages = [("home page", home, None, page)]
    pages += [(sid, rebase(entries[sid]["run"]["url"], args.base_url), skip, page)
              for sid, skip in SMOKE_SAMPLES[args.project]]
    if api_path:
        pages.append(("JSON API", urllib.parse.urljoin(home, api_path), None, json_api))

    failures = 0
    for name, url, skip, check in pages:
        if skip:
            print(f"SKIP {name}: {skip}")
            annotate("notice", f"{args.project}: expected skip of {name}: {skip}")
            continue
        print(f"GET  {name}")
        problems = check(url)
        for problem in problems:
            print(f"FAIL {name}: {problem}")
            annotate("error", f"{args.project}: {name} ({url}) {problem}")
        failures += bool(problems)

    checked = sum(1 for _, _, skip, _ in pages if not skip)
    print(f"\n{checked - failures} of {checked} pages passed, {len(pages) - checked} skipped.")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
