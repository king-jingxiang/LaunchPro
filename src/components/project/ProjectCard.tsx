import { useState } from 'react';
import { Play, MoreHorizontal, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOpenProject } from '@/hooks/useOpenProject';
import { useProjectStore } from '@/stores/useProjectStore';
import { useToolStore } from '@/stores/useToolStore';
import { ProjectFormDialog } from './ProjectFormDialog';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { openProject } = useOpenProject();
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const tools = useToolStore((s) => s.tools);
  const getToolById = useToolStore((s) => s.getToolById);
  const [showEdit, setShowEdit] = useState(false);

  const defaultTool = project.defaultTool ? getToolById(project.defaultTool) : null;
  const lastOpenedStr = project.lastOpened
    ? formatRelativeTime(project.lastOpened)
    : null;

  const shortenPath = (p: string) => {
    const home = '/Users/';
    if (p.startsWith(home)) {
      const afterHome = p.substring(home.length);
      const slashIdx = afterHome.indexOf('/');
      if (slashIdx !== -1) {
        return '~' + afterHome.substring(slashIdx);
      }
    }
    return p;
  };

  return (
    <>
      <Card className="p-3 hover:bg-accent/50 transition-colors group">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sm font-semibold text-primary">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">{project.name}</h3>
              {defaultTool && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 shrink-0">
                  {defaultTool.name}
                </Badge>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground truncate mt-0.5 cursor-default">
                  {shortenPath(project.path)}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="text-xs">{project.path}</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1.5 mt-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] h-4 px-1.5">
                  {tag}
                </Badge>
              ))}
              {lastOpenedStr && (
                <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                  {lastOpenedStr}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => openProject(project)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open with {defaultTool?.name ?? 'default tool'}</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Open with...
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {tools.map((tool) => (
                      <DropdownMenuItem
                        key={tool.id}
                        onClick={() => openProject(project, tool.id)}
                      >
                        <span className="w-5 text-xs font-mono text-muted-foreground">{tool.icon}</span>
                        {tool.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowEdit(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ProjectFormDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        project={project}
      />
    </>
  );
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}
