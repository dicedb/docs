#!/usr/bin/env python3
# Copyright (C) 2025, DiceDB contributors
# SPDX-License-Identifier: BSD-3-Clause

"""
Add YAML frontmatter to command Markdown files using JSON metadata.

For each .md file in content/commands/, looks up the corresponding
JSON metadata from $(DICEDB_ROOT)/src/commands/<name>.json, extracts
title, synopsis, since, acl_categories, and group, computes
dicedb_since via a version mapping, and writes YAML frontmatter
to the top of the file along with an attribution notice.
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

# The current DiceDB release version. Commands whose Valkey "since"
# version exceeds the corresponding max Valkey version for this
# DiceDB release will be deleted (not yet supported).
CURRENT_DICEDB_VERSION = "1.0.0"

# Maps (valkey_version, dicedb_version). For a given Valkey "since"
# version, we find the first entry where valkey_version >= since
# and use the corresponding DiceDB version.
VERSION_MAP = [
    ("8.0.6", "1.0.0"),
]


def version_tuple(v: str) -> tuple:
    """Convert a version string like '2.0.0' to a tuple (2, 0, 0)."""
    return tuple(int(x) for x in v.split("."))


def max_valkey_version_for_dicedb(dicedb_version: str) -> str:
    """Return the max Valkey version that ships with the given DiceDB version."""
    target = version_tuple(dicedb_version)
    result = ""
    for valkey_ver, dicedb_ver in VERSION_MAP:
        if version_tuple(dicedb_ver) <= target:
            if not result or version_tuple(valkey_ver) > version_tuple(result):
                result = valkey_ver
    return result


def compute_dicedb_since(valkey_since: str) -> str:
    """Map a Valkey version to the corresponding DiceDB version."""
    if not valkey_since:
        return ""
    since = version_tuple(valkey_since)
    for valkey_ver, dicedb_ver in VERSION_MAP:
        if version_tuple(valkey_ver) >= since:
            return dicedb_ver
    return ""


def yaml_escape(s: str) -> str:
    """Escape a string for safe YAML scalar output."""
    if not s:
        return "''"
    # If the string contains characters that need quoting, use double quotes
    needs_quoting = any(c in s for c in ":{}[]&*?|>!%@`#,\"'\\")
    if needs_quoting:
        escaped = s.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    return s


def load_command_meta(json_path: Path) -> dict | None:
    """Load and return the command metadata from a JSON file."""
    try:
        with open(json_path) as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return None

    # The JSON has a single top-level key (the sub-command name or command name)
    if not data:
        return None

    key = next(iter(data))
    return data[key]


def build_title(json_path: Path, meta: dict) -> str:
    """Build the command title from filename and container field."""
    # For sub-commands like acl-cat.json, the JSON key is "CAT" and
    # there's a "container" field "ACL", so title = "ACL CAT".
    # For simple commands like append.json, the key is "APPEND".
    name = json_path.stem.upper().replace("-", " ")
    return name


def build_frontmatter(meta: dict, title: str) -> str:
    """Build YAML frontmatter string from command metadata."""
    since = meta.get("since", "")
    dicedb_since = compute_dicedb_since(since)
    summary = meta.get("summary", "")
    acl_cats = meta.get("acl_categories", [])

    lines = ["---"]
    lines.append(f"title: {yaml_escape(title)}")
    lines.append(f"synopsis: {yaml_escape(summary)}")
    lines.append(f'since: "{since}"')
    lines.append(f'dicedb_since: "{dicedb_since}"')

    if acl_cats:
        lines.append("acl_categories:")
        for cat in acl_cats:
            lines.append(f'  - "@{cat.lower()}"')
    else:
        lines.append("acl_categories: []")

    lines.append("---")
    return "\n".join(lines)


ATTRIBUTION = "> This content is taken from the Valkey documentation and may retain some Valkey-specific references. Given that DiceDB extends Valkey the references will be compatible. Also, DiceDB-specific features or comments, if present, are included at the end of this doc."


def escape_angle_brackets(content: str) -> str:
    content = re.sub(r"(/commands/[^/\s]+)\.md", r"\1", content)
    content = re.sub(r"\(([^()\s]+)\.md\)", r"(\1)", content)
    return content


def process_file(md_path: Path, dicedb_root: Path, max_valkey: str) -> bool:
    """Add frontmatter to a single .md file. Returns True if modified.

    If the command's Valkey "since" version is newer than max_valkey,
    the file is deleted (command not yet supported in this DiceDB release).
    """
    print(f"Processing {md_path}...")
    name = md_path.stem  # e.g. "append" or "acl-cat"
    json_path = dicedb_root / "src" / "commands" / f"{name}.json"

    if not json_path.exists():
        md_path.unlink()
        return False

    meta = load_command_meta(json_path)
    if meta is None:
        return False

    # Delete files for commands newer than the current DiceDB release
    since = meta.get("since", "")
    if since and max_valkey and version_tuple(since) > version_tuple(max_valkey):
        md_path.unlink()
        print(f"deleted {md_path.name} (since {since} > max valkey {max_valkey})")
        return False

    content = md_path.read_text()

    # Skip if frontmatter already present
    if content.startswith("---"):
        return False

    title = build_title(json_path, meta)
    frontmatter = build_frontmatter(meta, title)
    content = escape_angle_brackets(content)

    new_content = f"{frontmatter}\n\n{ATTRIBUTION}\n\n{content}"
    md_path.write_text(new_content)
    return True


def generate_valkey_index(dicedb_root: Path, output_path: Path) -> None:
    """Generate a Valkey commands index MDX file with a table of all commands.

    Scans all JSON command metadata under dicedb_root/src/commands/,
    applies the DiceDB version filter, and writes an MDX file at
    output_path containing a markdown table of supported commands.
    """
    max_valkey = max_valkey_version_for_dicedb(CURRENT_DICEDB_VERSION)
    if not max_valkey:
        print(f"error: no Valkey version mapped for DiceDB {CURRENT_DICEDB_VERSION}", file=sys.stderr)
        sys.exit(1)

    commands_dir = dicedb_root / "src" / "commands"
    rows = []

    for json_path in sorted(commands_dir.glob("*.json")):
        meta = load_command_meta(json_path)
        if meta is None:
            continue

        since = meta.get("since", "")

        # Skip commands newer than the current DiceDB release
        if since and max_valkey and version_tuple(since) > version_tuple(max_valkey):
            continue

        title = build_title(json_path, meta)
        dicedb_since = compute_dicedb_since(since) if since else ""
        summary = meta.get("summary", "")

        rows.append((title, summary, dicedb_since, since))

    # Sort alphabetically by command name
    rows.sort(key=lambda r: r[0])

    # Build the MDX content
    lines = [
        "---",
        "title: Inherited from Valkey",
        "description: List of commands supported in DiceDB that are inherited from Valkey.",
        "---",
        "",
        "| Command | Doc | Synopsis | Min DiceDB | Min Valkey |",
        "| ------- | ---- | -------- | ------------------ | -------------------------- |",
    ]

    for title, summary, dicedb_since, since in rows:
        # Escape pipe characters in summary for markdown table
        safe_summary = summary.replace("|", "\\|")
        lines.append(f"| {title} | [doc](https://valkey.io/commands/{title.lower().replace(' ', '-')}) | {safe_summary} | {dicedb_since} | {since} |")

    lines.append("")  # trailing newline
    output_path.write_text("\n".join(lines))
    print(f"Generated {output_path} with {len(rows)} commands")


def main():
    parser = argparse.ArgumentParser(
        description="Add YAML frontmatter to command Markdown files."
    )
    subparsers = parser.add_subparsers(dest="command")

    # Sub-command: frontmatter (default / original behavior)
    fm_parser = subparsers.add_parser(
        "frontmatter",
        help="Add YAML frontmatter to command Markdown files.",
    )
    fm_parser.add_argument(
        "--dicedb-root",
        required=True,
        type=Path,
        help="Path to the DiceDB source root",
    )
    fm_parser.add_argument(
        "files",
        nargs="+",
        type=Path,
        help="Markdown files to process",
    )

    # Sub-command: valkey-index
    idx_parser = subparsers.add_parser(
        "valkey-index",
        help="Generate the Valkey commands index MDX file.",
    )
    idx_parser.add_argument(
        "--dicedb-root",
        required=True,
        type=Path,
        help="Path to the DiceDB source root",
    )
    idx_parser.add_argument(
        "--output",
        required=True,
        type=Path,
        help="Output MDX file path",
    )

    args = parser.parse_args()

    if args.command == "valkey-index":
        generate_valkey_index(args.dicedb_root, args.output)
        return

    # Default: frontmatter mode
    if args.command != "frontmatter":
        parser.print_help()
        sys.exit(1)

    max_valkey = max_valkey_version_for_dicedb(CURRENT_DICEDB_VERSION)
    if not max_valkey:
        print(f"error: no Valkey version mapped for DiceDB {CURRENT_DICEDB_VERSION}", file=sys.stderr)
        sys.exit(1)
    print(f"DiceDB {CURRENT_DICEDB_VERSION} -> max Valkey {max_valkey}")

    modified = 0
    for md_file in args.files:
        if not md_file.exists():
            print(f"warning: {md_file} does not exist, skipping", file=sys.stderr)
            continue
        if process_file(md_file, args.dicedb_root, max_valkey):
            modified += 1

    print(f"Added frontmatter to {modified} file(s)")


if __name__ == "__main__":
    main()
