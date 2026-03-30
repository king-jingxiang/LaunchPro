import { invoke } from '@tauri-apps/api/core';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

export async function openProjectWithTool(commandTemplate: string, projectPath: string): Promise<void> {
  return invoke('open_project_with_tool', {
    commandTemplate,
    projectPath,
  });
}

export async function checkPathExists(path: string): Promise<boolean> {
  return invoke('check_path_exists', { path });
}

export async function getAppDataDir(): Promise<string> {
  return invoke('get_app_data_dir');
}

export async function updateTrayMenu(): Promise<void> {
  return invoke('update_tray_menu');
}

export interface CliInstallResult {
  path: string;
  /** When true, ~/.local/bin is used and needs to be added to PATH */
  needsPathSetup: boolean;
}

export async function installCli(alias = 'launch'): Promise<CliInstallResult> {
  return invoke('install_cli', { alias });
}

export async function getCliInstallPath(alias = 'launch'): Promise<string> {
  return invoke('get_cli_install_path', { alias });
}

export async function getAutostart(): Promise<boolean> {
  return isEnabled();
}

export async function setAutostart(enabled: boolean): Promise<void> {
  if (enabled) {
    await enable();
  } else {
    await disable();
  }
}
