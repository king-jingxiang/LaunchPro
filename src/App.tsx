import { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProjectStore } from '@/stores/useProjectStore';
import { useToolStore } from '@/stores/useToolStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useTheme } from '@/hooks/useTheme';
import { useOpenProject } from '@/hooks/useOpenProject';
import { listen } from '@tauri-apps/api/event';
import { toast } from 'sonner';

function AppContent() {
  useTheme();

  return (
    <>
      <MainLayout />
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}

function App() {
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const loadTools = useToolStore((s) => s.loadTools);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const projects = useProjectStore((s) => s.projects);
  const { openProject } = useOpenProject();

  useEffect(() => {
    loadTools();
    loadProjects();
    loadSettings();
  }, [loadTools, loadProjects, loadSettings]);

  // 监听托盘菜单点击最近项目事件
  useEffect(() => {
    const unlisten = listen<string>('tray-open-project', (event) => {
      const projectId = event.payload;
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        openProject(project);
      } else {
        toast.error('Project not found');
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [projects, openProject]);

  return (
    <TooltipProvider delayDuration={300}>
      <AppContent />
    </TooltipProvider>
  );
}

export default App;
