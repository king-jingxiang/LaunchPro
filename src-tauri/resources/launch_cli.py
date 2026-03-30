#!/usr/bin/env python3
"""launch - Open a project with its configured tool (LaunchPro CLI)

Usage:
  launch [directory]   Open the specified directory (default: current dir)
  launch -h | --help   Show this help message
  launch --version     Show version information
"""

import sys
import os
import json
import subprocess
import time
import uuid
import pathlib

VERSION = "1.0.0"
APP_IDENTIFIER = "com.lancnchpro.app"
APP_DATA_DIR = os.path.expanduser(
    f"~/Library/Application Support/{APP_IDENTIFIER}"
)

# Fallback tools when tools.json is not found
DEFAULT_TOOLS = [
    {"id": "qoder",      "name": "Qoder",       "command": "qoder {path}",          "enabled": True},
    {"id": "cursor",     "name": "Cursor",       "command": "cursor {path}",         "enabled": True},
    {"id": "vscode",     "name": "VS Code",      "command": "code {path}",           "enabled": True},
    {"id": "kiro",       "name": "Kiro",         "command": "kiro {path}",           "enabled": True},
    {"id": "codebuddy",  "name": "CodeBuddy",    "command": "codebuddy {path}",      "enabled": True},
    {"id": "trae",       "name": "Trae",         "command": "trae {path}",           "enabled": True},
    {"id": "terminal",   "name": "Terminal",     "command": "open -a Terminal {path}", "enabled": True},
    {"id": "finder",     "name": "Finder",       "command": "open {path}",           "enabled": True},
    {"id": "opencode",   "name": "OpenCode",     "command": "opencode {path}",       "enabled": True},
    {"id": "claudecode", "name": "Claude Code",  "command": "claude {path}",         "enabled": True},
    {"id": "gemini-cli", "name": "Gemini CLI",   "command": "gemini {path}",         "enabled": True},
    {"id": "codex",      "name": "Codex",        "command": "codex {path}",          "enabled": True},
    {"id": "antigravity","name": "Antigravity",  "command": "antigravity {path}",    "enabled": True},
    {"id": "kimi-cli",   "name": "Kimi CLI",     "command": "kimi {path}",           "enabled": True},
]


def read_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_enabled_tools(tools):
    return [t for t in tools if t.get("enabled", True) is not False]


def find_tool(tools, tool_id):
    return next((t for t in tools if t.get("id") == tool_id), None)


def main():
    args = sys.argv[1:]

    if not args or args[0] in ("-h", "--help"):
        print((__doc__ or "").strip())
        sys.exit(0)

    if args[0] == "--version":
        print(f"launch version {VERSION}")
        sys.exit(0)

    raw_target = args[0]
    target = str(pathlib.Path(raw_target).resolve())

    if not os.path.isdir(target):
        print(f"Error: '{raw_target}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    # ── Read data files ──────────────────────────────────────────────────────
    projects_path = os.path.join(APP_DATA_DIR, "projects.json")
    tools_path    = os.path.join(APP_DATA_DIR, "tools.json")
    settings_path = os.path.join(APP_DATA_DIR, "settings.json")

    projects_data = read_json(projects_path, {"projects": []})
    tools_data    = read_json(tools_path,    {"tools": DEFAULT_TOOLS})
    settings_data = read_json(settings_path, {"settings": {}})

    all_tools  = tools_data.get("tools", DEFAULT_TOOLS) or DEFAULT_TOOLS
    tools      = get_enabled_tools(all_tools)
    settings   = settings_data.get("settings", {})
    projects   = projects_data.get("projects", [])

    # ── Find existing project entry ──────────────────────────────────────────
    project = next((p for p in projects if p.get("path") == target), None)

    # ── Resolve tool: project.defaultTool → settings.defaultTool → first enabled ─
    tool = None
    if project and project.get("defaultTool"):
        tool = find_tool(tools, project["defaultTool"])
    if tool is None and settings.get("defaultTool"):
        tool = find_tool(tools, settings["defaultTool"])
    if tool is None and tools:
        tool = tools[0]

    if tool is None:
        print(
            "Error: No tool configured. Please open LaunchPro and configure a default tool.",
            file=sys.stderr,
        )
        sys.exit(1)

    # ── Execute tool ─────────────────────────────────────────────────────────
    command_template = tool.get("command", "")
    if not command_template:
        print(f"Error: Tool '{tool.get('name')}' has no command configured.", file=sys.stderr)
        sys.exit(1)

    command = command_template.replace("{path}", target)
    project_name = os.path.basename(target)
    print(f"Opening '{project_name}' with {tool.get('name', tool.get('id'))}...")

    subprocess.Popen(command, shell=True, start_new_session=True)

    # ── Update project record ─────────────────────────────────────────────────
    now_ms = int(time.time() * 1000)

    if project:
        for p in projects:
            if p.get("path") == target:
                p["lastOpened"] = now_ms
                break
    else:
        new_project = {
            "id":          str(uuid.uuid4()),
            "name":        project_name,
            "path":        target,
            "tags":        [],
            "createdAt":   now_ms,
            "lastOpened":  now_ms,
        }
        projects.append(new_project)
        print(f"Recorded new project: {project_name}")

    projects_data["projects"] = projects

    try:
        write_json(projects_path, projects_data)
    except Exception as e:
        print(f"Warning: Could not save project record: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
