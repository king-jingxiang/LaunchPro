import { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProjectStore } from '@/stores/useProjectStore';
import { useToolStore } from '@/stores/useToolStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useTheme } from '@/hooks/useTheme';

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

  useEffect(() => {
    loadTools();
    loadProjects();
    loadSettings();
  }, [loadTools, loadProjects, loadSettings]);

  return (
    <TooltipProvider delayDuration={300}>
      <AppContent />
    </TooltipProvider>
  );
}

export default App;
