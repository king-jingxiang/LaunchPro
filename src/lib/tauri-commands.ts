import { invoke } from '@tauri-apps/api/core';

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
