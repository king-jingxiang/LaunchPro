import { create } from 'zustand';
import type { Project } from '@/types';
import { getProjectsStore } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateLastOpened: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: true,

  loadProjects: async () => {
    try {
      const store = getProjectsStore();
      // 先从磁盘重新加载数据，确保获取最新的外部修改（如 CLI 写入的数据）
      await store.reload({ ignoreDefaults: true });
      const projects = await store.get<Project[]>('projects');
      set({ projects: projects ?? [], isLoading: false });
    } catch {
      set({ projects: [], isLoading: false });
    }
  },

  addProject: async (data) => {
    const project: Project = {
      ...data,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    const projects = [...get().projects, project];
    set({ projects });
    const store = getProjectsStore();
    await store.set('projects', projects);
  },

  updateProject: async (id, updates) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    set({ projects });
    const store = getProjectsStore();
    await store.set('projects', projects);
  },

  deleteProject: async (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    set({ projects });
    const store = getProjectsStore();
    await store.set('projects', projects);
  },

  updateLastOpened: async (id) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, lastOpened: Date.now() } : p
    );
    set({ projects });
    const store = getProjectsStore();
    await store.set('projects', projects);
    // 更新托盘菜单（最近项目顺序可能变化）
    const { updateTrayMenu } = await import('@/lib/tauri-commands');
    await updateTrayMenu().catch(() => {});
  },
}));
