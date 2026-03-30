import type { Tool, Settings } from '@/types';

// Detect current platform for platform-specific commands
const getPlatform = (): 'macos' | 'windows' | 'linux' => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('mac')) return 'macos';
  if (userAgent.includes('win')) return 'windows';
  return 'linux';
};

const platform = getPlatform();

// Platform-specific commands
const PLATFORM_COMMANDS = {
  terminal: {
    macos: 'open -a Terminal {path}',
    windows: 'cmd /c start cmd /K "cd /d {path}"',
    linux: 'x-terminal-emulator --working-directory={path}',
  },
  fileManager: {
    macos: 'open {path}',
    windows: 'explorer {path}',
    linux: 'xdg-open {path}',
  },
};

// Platform-specific names
const PLATFORM_NAMES = {
  fileManager: {
    macos: 'Finder',
    windows: 'Explorer',
    linux: 'File Manager',
  },
};

export const BUILTIN_TOOLS: Tool[] = [
  { id: 'qoder', name: 'Qoder', command: 'qoder {path}', icon: 'Q', isBuiltin: true, enabled: true },
  { id: 'cursor', name: 'Cursor', command: 'cursor {path}', icon: 'Cu', isBuiltin: true, enabled: true },
  { id: 'vscode', name: 'VS Code', command: 'code {path}', icon: 'VS', isBuiltin: true, enabled: true },
  { id: 'kiro', name: 'Kiro', command: 'kiro {path}', icon: 'Ki', isBuiltin: true, enabled: true },
  { id: 'codebuddy', name: 'CodeBuddy', command: 'codebuddy {path}', icon: 'CB', isBuiltin: true, enabled: true },
  { id: 'trae', name: 'Trae', command: 'trae {path}', icon: 'Tr', isBuiltin: true, enabled: true },
  { id: 'terminal', name: 'Terminal', command: PLATFORM_COMMANDS.terminal[platform], icon: 'T', isBuiltin: true, enabled: true },
  { id: 'finder', name: PLATFORM_NAMES.fileManager[platform], command: PLATFORM_COMMANDS.fileManager[platform], icon: 'F', isBuiltin: true, enabled: true },
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
