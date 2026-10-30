#!/usr/bin/env python3
"""Print, as a JSON list, the sample projects that the build-samples workflow should test.

Usage:  python scripts/ci/changed-projects.py [<base-commit>]

Without a base commit (pushes to master, the weekly schedule, manual runs), every project is
selected. With one (pull requests), a project is selected when the changes since that commit
touch its folder or its entries in samples.json. Changes to the workflow or to scripts/ci
select every project.

Needs git, and the Python 3.8+ standard library.
"""

import json
import subprocess
import sys

# One job per project in .github/workflows/build-samples.yml. dotnet/console is left out on
# purpose: it is a console app with no URL to smoke-test, and .github/workflows/test-console.yml
# runs its tests instead (see docs/adr/0002-console-project-for-agent-driven-signing.md), so
# changes there select nothing here.
PROJECTS = [
    "dotnet/mvc",
    "dotnet/spa",
    "java/springmvc",
    "nodejs/expressmvc",
    "php/plain",
    "python/django",
    "python/flask",
    "ruby/rails",
]
SHARED = (".github/workflows/build-samples.yml", "scripts/ci/")


def git(*args):
    return subprocess.run(["git", *args], check=True, capture_output=True, text=True).stdout


def project_of(path):
    return next((p for p in PROJECTS if path.startswith(p + "/")), None)


def catalog_projects(base):
    """Projects whose samples.json entries differ between base and the working tree."""
    def entries(text):
        return {(e["id"], e["language"], e["framework"]): e for e in json.loads(text)}

    old = entries(git("show", f"{base}:samples.json"))
    with open("samples.json", encoding="utf-8") as f:
        new = entries(f.read())
    changed = [e for key in old.keys() | new.keys()
               for e in (old.get(key), new.get(key)) if e and old.get(key) != new.get(key)]
    return {project_of(e["run"]["cwd"] + "/") for e in changed}


def main():
    if len(sys.argv) < 2:
        print(json.dumps(PROJECTS))
        return

    base = sys.argv[1]
    files = git("diff", "--name-only", base, "HEAD").splitlines()
    if any(f == s or f.startswith(s) for f in files for s in SHARED):
        print(json.dumps(PROJECTS))
        return

    selected = {project_of(f) for f in files}
    if "samples.json" in files:
        selected |= catalog_projects(base)
    print(json.dumps([p for p in PROJECTS if p in selected]))


if __name__ == "__main__":
    main()
