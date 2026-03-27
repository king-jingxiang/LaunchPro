import type { Tool, Settings } from '@/types';

export const BUILTIN_TOOLS: Tool[] = [
  { id: 'qoder', name: 'Qoder', command: 'qoder {path}', icon: 'Q', isBuiltin: true },
  { id: 'cursor', name: 'Cursor', command: 'cursor {path}', icon: 'Cu', isBuiltin: true },
  { id: 'vscode', name: 'VS Code', command: 'code {path}', icon: 'VS', isBuiltin: true },
  { id: 'kiro', name: 'Kiro', command: 'kiro {path}', icon: 'Ki', isBuiltin: true },
  { id: 'codebuddy', name: 'CodeBuddy', command: 'codebuddy {path}', icon: 'CB', isBuiltin: true },
  { id: 'trae', name: 'Trae', command: 'trae {path}', icon: 'Tr', isBuiltin: true },
  { id: 'terminal', name: 'Terminal', command: 'open -a Terminal {path}', icon: 'T', isBuiltin: true },
  { id: 'finder', name: 'Finder', command: 'open {path}', icon: 'F', isBuiltin: true },
  { id: 'opencode', name: 'OpenCode', command: 'opencode {path}', icon: 'OC', isBuiltin: true },
  { id: 'claudecode', name: 'Claude Code', command: 'claude {path}', icon: 'CC', isBuiltin: true },
  { id: 'gemini-cli', name: 'Gemini CLI', command: 'gemini {path}', icon: 'GC', isBuiltin: true },
  { id: 'codex', name: 'Codex', command: 'codex {path}', icon: 'CX', isBuiltin: true },
  { id: 'antigravity', name: 'Antigravity', command: 'antigravity {path}', icon: 'AG', isBuiltin: true },
  { id: 'kimi-cli', name: 'Kimi CLI', command: 'kimi {path}', icon: 'KC', isBuiltin: true },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
};
