import { LazyStore } from '@tauri-apps/plugin-store';
import { BUILTIN_TOOLS, DEFAULT_SETTINGS } from '@/lib/constants';

const projectsStore = new LazyStore('projects.json', {
  defaults: { projects: [] },
  autoSave: true,
});

const toolsStore = new LazyStore('tools.json', {
  defaults: { tools: BUILTIN_TOOLS },
  autoSave: true,
});

const settingsStore = new LazyStore('settings.json', {
  defaults: { settings: DEFAULT_SETTINGS },
  autoSave: true,
});

export function getProjectsStore() {
  return projectsStore;
}

export function getToolsStore() {
  return toolsStore;
}

export function getSettingsStore() {
  return settingsStore;
}
