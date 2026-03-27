import { FolderOpen, Wrench, Settings, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUIStore } from '@/stores/useUIStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useOpenProject } from '@/hooks/useOpenProject';
import type { ActiveView } from '@/types';

const NAV_ITEMS: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
  { id: 'projects', label: 'Projects', icon: <FolderOpen className="h-4 w-4" /> },
  { id: 'tools', label: 'Tools', icon: <Wrench className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export function Sidebar() {
  const activeView = useUIStore((s) => s.activeView);
  const setActiveView = useUIStore((s) => s.setActiveView);
  const projects = useProjectStore((s) => s.projects);
  const { openProject } = useOpenProject();

  const recentProjects = [...projects]
    .filter((p) => p.lastOpened)
    .sort((a, b) => (b.lastOpened ?? 0) - (a.lastOpened ?? 0))
    .slice(0, 5);

  return (
    <div className="w-52 border-r bg-sidebar-background flex flex-col h-full shrink-0">
      <div className="p-4 pb-2">
        <h1 className="text-lg font-semibold text-sidebar-foreground">LaunchPro</h1>
      </div>

      <nav className="px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2 h-9"
            onClick={() => setActiveView(item.id)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>

      {recentProjects.length > 0 && (
        <>
          <Separator className="my-3 mx-2" />
          <div className="px-3 mb-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recent
            </span>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-0.5">
              {recentProjects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs truncate"
                  title={project.path}
                  onClick={() => openProject(project)}
                >
                  <span className="truncate">{project.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      <div className="p-3 mt-auto border-t">
        <p className="text-[10px] text-muted-foreground text-center">v0.1.0</p>
      </div>
    </div>
  );
}
