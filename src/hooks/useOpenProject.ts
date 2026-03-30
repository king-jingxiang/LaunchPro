import { useCallback } from 'react';
import { useToolStore } from '@/stores/useToolStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { openProjectWithTool } from '@/lib/tauri-commands';
import { toast } from 'sonner';
import type { Project } from '@/types';

export function useOpenProject() {
  const getToolById = useToolStore((s) => s.getToolById);
  const getEnabledTools = useToolStore((s) => s.getEnabledTools);
  const defaultTool = useSettingsStore((s) => s.settings.defaultTool);
  const updateLastOpened = useProjectStore((s) => s.updateLastOpened);
  const enabledTools = getEnabledTools();

  const openProject = useCallback(
    async (project: Project, toolId?: string) => {
      const resolvedToolId = toolId ?? project.defaultTool ?? defaultTool;

      if (!resolvedToolId) {
        toast.error('No tool selected. Please choose a tool to open the project.');
        return;
      }

      const tool = getToolById(resolvedToolId);
      if (!tool) {
        // Fallback: try first available tool
        toast.error(`Tool not found: ${resolvedToolId}`);
        return;
      }

      try {
        await openProjectWithTool(tool.command, project.path);
        await updateLastOpened(project.id);
        toast.success(`Opened ${project.name} with ${tool.name}`);
      } catch (err) {
        toast.error(`Failed to open: ${err}`);
      }
    },
    [getToolById, defaultTool, updateLastOpened]
  );

  return { openProject, tools: enabledTools };
}
