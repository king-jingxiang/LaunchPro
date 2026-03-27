export interface Project {
  id: string;
  name: string;
  path: string;
  defaultTool?: string;
  tags: string[];
  note?: string;
  lastOpened?: number;
  createdAt: number;
}

export interface Tool {
  id: string;
  name: string;
  icon?: string;
  command: string;
  isBuiltin: boolean;
}

export interface Settings {
  defaultTool?: string;
  theme: 'light' | 'dark' | 'system';
}

export type ActiveView = 'projects' | 'tools' | 'settings';
