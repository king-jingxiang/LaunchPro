import { Sidebar } from '@/components/layout/Sidebar';
import { useUIStore } from '@/stores/useUIStore';
import { ProjectList } from '@/components/project/ProjectList';
import { ToolList } from '@/components/tool/ToolList';
import { SettingsView } from '@/components/settings/SettingsView';

export function MainLayout() {
  const activeView = useUIStore((s) => s.activeView);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {activeView === 'projects' && <ProjectList />}
        {activeView === 'tools' && <ToolList />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
