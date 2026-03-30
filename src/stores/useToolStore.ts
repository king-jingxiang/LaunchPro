import { create } from 'zustand';
import type { Tool } from '@/types';
import { getToolsStore } from '@/lib/storage';
import { BUILTIN_TOOLS } from '@/lib/constants';
import { v4 as uuidv4 } from 'uuid';

interface ToolState {
  tools: Tool[];
  isLoading: boolean;
  loadTools: () => Promise<void>;
  addTool: (tool: Omit<Tool, 'id' | 'isBuiltin'>) => Promise<void>;
  updateTool: (id: string, updates: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  toggleToolEnabled: (id: string) => Promise<void>;
  getToolById: (id: string) => Tool | undefined;
  getEnabledTools: () => Tool[];
}

export const useToolStore = create<ToolState>((set, get) => ({
  tools: [],
  isLoading: true,

  loadTools: async () => {
    try {
      const store = getToolsStore();
      const tools = await store.get<Tool[]>('tools');
      if (tools && tools.length > 0) {
        // Merge: ensure all builtins exist, preserve user customizations
        const existingIds = new Set(tools.map((t) => t.id));
        const missingBuiltins = BUILTIN_TOOLS.filter((b) => !existingIds.has(b.id));
        const merged = [...tools, ...missingBuiltins];
        set({ tools: merged, isLoading: false });
      } else {
        // First launch: initialize with builtin tools
        set({ tools: BUILTIN_TOOLS, isLoading: false });
        await store.set('tools', BUILTIN_TOOLS);
      }
    } catch {
      set({ tools: BUILTIN_TOOLS, isLoading: false });
    }
  },

  addTool: async (data) => {
    const tool: Tool = {
      ...data,
      id: uuidv4(),
      isBuiltin: false,
    };
    const tools = [...get().tools, tool];
    set({ tools });
    const store = getToolsStore();
    await store.set('tools', tools);
  },

  updateTool: async (id, updates) => {
    const tools = get().tools.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    set({ tools });
    const store = getToolsStore();
    await store.set('tools', tools);
  },

  deleteTool: async (id) => {
    const tool = get().tools.find((t) => t.id === id);
    if (tool?.isBuiltin) return; // Cannot delete builtin tools
    const tools = get().tools.filter((t) => t.id !== id);
    set({ tools });
    const store = getToolsStore();
    await store.set('tools', tools);
  },

  toggleToolEnabled: async (id) => {
    const tool = get().tools.find((t) => t.id === id);
    if (!tool) return;
    const newEnabled = tool.enabled === false ? true : false;
    const tools = get().tools.map((t) =>
      t.id === id ? { ...t, enabled: newEnabled } : t
    );
    set({ tools });
    const store = getToolsStore();
    await store.set('tools', tools);
  },

  getToolById: (id) => {
    return get().tools.find((t) => t.id === id);
  },

  getEnabledTools: () => {
    return get().tools.filter((t) => t.enabled !== false);
  },
}));
