#!/usr/bin/env python3
"""Validate samples.json against schema/samples.schema.json and the files on disk.

Usage (from anywhere):  python scripts/validate-catalog.py

Checks:
  1. samples.json matches the schema (uses the `jsonschema` package when it is
     installed, otherwise a built-in checker for the subset of JSON Schema the
     schema uses).
  2. Every `path`, every `related_files` entry and every `run.cwd` exists.
  3. `path` lives inside `run.cwd`.
  4. (id, language, framework) is unique, and `id` ends with `-<product>`.
  5. Entries that share an `id` share `title` and `product`.
  6. SAMPLES.md, and the generated samples list in each project README, are what
     scripts/generate-samples-md.py would write.

Exits with status 1 and lists every problem when a check fails.
Needs only the Python 3.8+ standard library.
"""

import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "samples.json"
SCHEMA = ROOT / "schema" / "samples.schema.json"
GENERATOR = ROOT / "scripts" / "generate-samples-md.py"

JSON_TYPES = {
    "string": str,
    "array": list,
    "object": dict,
    "null": type(None),
    "boolean": bool,
    "integer": int,
    "number": (int, float),
}


def check_schema_builtin(value, schema, where, errors):
    """Check `value` against the subset of JSON Schema used by samples.schema.json."""
    types = schema.get("type")
    if types is not None:
        types = types if isinstance(types, list) else [types]
        if not any(isinstance(value, JSON_TYPES[t]) and not (t in ("integer", "number") and isinstance(value, bool))
                   for t in types):
            errors.append(f"{where}: expected {' or '.join(types)}, got {type(value).__name__}")
            return
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{where}: {value!r} is not one of {schema['enum']}")
    if isinstance(value, str):
        if len(value) < schema.get("minLength", 0):
            errors.append(f"{where}: shorter than {schema['minLength']} characters")
        if "pattern" in schema and not re.search(schema["pattern"], value):
            errors.append(f"{where}: {value!r} does not match {schema['pattern']}")
    if isinstance(value, list):
        if schema.get("uniqueItems") and len({json.dumps(v, sort_keys=True) for v in value}) != len(value):
            errors.append(f"{where}: items are not unique")
        if "items" in schema:
            for i, item in enumerate(value):
                check_schema_builtin(item, schema["items"], f"{where}[{i}]", errors)
    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                errors.append(f"{where}: missing required field '{key}'")
        props = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            for key in value:
                if key not in props:
                    errors.append(f"{where}: unexpected field '{key}'")
        for key, sub in props.items():
            if key in value:
                check_schema_builtin(value[key], sub, f"{where}.{key}", errors)


def check_schema(catalog, schema, errors):
    try:
        import jsonschema  # optional
    except ImportError:
        check_schema_builtin(catalog, schema, "samples.json", errors)
        return
    validator = jsonschema.Draft202012Validator(schema)
    for err in sorted(validator.iter_errors(catalog), key=lambda e: list(e.path)):
        loc = "".join(f"[{p}]" if isinstance(p, int) else f".{p}" for p in err.path)
        errors.append(f"samples.json{loc}: {err.message}")


def label(entry, i):
    return f"[{i}] {entry.get('id')} ({entry.get('language')}/{entry.get('framework')})"


def check_disk_and_consistency(catalog, errors):
    seen = {}
    by_id = {}
    for i, e in enumerate(catalog):
        if not isinstance(e, dict):
            continue
        name = label(e, i)

        key = (e.get("id"), e.get("language"), e.get("framework"))
        if key in seen:
            errors.append(f"{name}: duplicates entry [{seen[key]}]")
        seen[key] = i

        product = e.get("product", "")
        if not str(e.get("id", "")).endswith("-" + product):
            errors.append(f"{name}: id must end with '-{product}'")

        cwd = (e.get("run") or {}).get("cwd", "")
        if cwd and not (ROOT / cwd).is_dir():
            errors.append(f"{name}: run.cwd '{cwd}' is not a directory")

        path = e.get("path", "")
        if path and not (ROOT / path).is_file():
            errors.append(f"{name}: path '{path}' does not exist")
        if path and cwd and not (path + "/").startswith(cwd.rstrip("/") + "/"):
            errors.append(f"{name}: path '{path}' is outside run.cwd '{cwd}'")

        for rel in e.get("related_files", []):
            if not (ROOT / rel).is_file():
                errors.append(f"{name}: related file '{rel}' does not exist")
            if rel == path:
                errors.append(f"{name}: '{rel}' is both path and a related file")

        first = by_id.setdefault(e.get("id"), e)
        for field in ("title", "product"):
            if first.get(field) != e.get(field):
                errors.append(f"{name}: {field} {e.get(field)!r} differs from other '{e.get('id')}' entries ({first.get(field)!r})")


def check_generated_markdown(errors):
    spec = importlib.util.spec_from_file_location("generate_samples_md", GENERATOR)
    generator = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(generator)
    for path, expected in generator.generated_files(generator.load_catalog()).items():
        actual = path.read_text(encoding="utf-8") if path.exists() else ""
        if actual.replace("\r\n", "\n") != expected:
            name = path.relative_to(ROOT).as_posix()
            errors.append(f"{name} is out of date: run `python scripts/generate-samples-md.py`")


def main():
    errors = []
    try:
        catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    check_schema(catalog, schema, errors)
    if isinstance(catalog, list):
        check_disk_and_consistency(catalog, errors)
    if not errors:
        check_generated_markdown(errors)

    if errors:
        print(f"samples.json: {len(errors)} problem(s)", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1
    print(f"samples.json: OK ({len(catalog)} entries, generated markdown up to date)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
