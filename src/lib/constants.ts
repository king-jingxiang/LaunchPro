import type { Tool, Settings } from '@/types';

export const BUILTIN_TOOLS: Tool[] = [
  { id: 'qoder', name: 'Qoder', command: 'qoder {path}', icon: 'Q', isBuiltin: true, enabled: true },
  { id: 'cursor', name: 'Cursor', command: 'cursor {path}', icon: 'Cu', isBuiltin: true, enabled: true },
  { id: 'vscode', name: 'VS Code', command: 'code {path}', icon: 'VS', isBuiltin: true, enabled: true },
  { id: 'kiro', name: 'Kiro', command: 'kiro {path}', icon: 'Ki', isBuiltin: true, enabled: true },
  { id: 'codebuddy', name: 'CodeBuddy', command: 'codebuddy {path}', icon: 'CB', isBuiltin: true, enabled: true },
  { id: 'trae', name: 'Trae', command: 'trae {path}', icon: 'Tr', isBuiltin: true, enabled: true },
  { id: 'terminal', name: 'Terminal', command: 'open -a Terminal {path}', icon: 'T', isBuiltin: true, enabled: true },
  { id: 'finder', name: 'Finder', command: 'open {path}', icon: 'F', isBuiltin: true, enabled: true },
  { id: 'opencode', name: 'OpenCode', command: 'opencode {path}', icon: 'OC', isBuiltin: true, enabled: true },
  { id: 'claudecode', name: 'Claude Code', command: 'claude {path}', icon: 'CC', isBuiltin: true, enabled: true },
  { id: 'gemini-cli', name: 'Gemini CLI', command: 'gemini {path}', icon: 'GC', isBuiltin: true, enabled: true },
  { id: 'codex', name: 'Codex', command: 'codex {path}', icon: 'CX', isBuiltin: true, enabled: true },
  { id: 'antigravity', name: 'Antigravity', command: 'antigravity {path}', icon: 'AG', isBuiltin: true, enabled: true },
  { id: 'kimi-cli', name: 'Kimi CLI', command: 'kimi {path}', icon: 'KC', isBuiltin: true, enabled: true },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
};
