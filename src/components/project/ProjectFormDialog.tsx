import { useState, useEffect } from 'react';
import { FolderSearch } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjectStore } from '@/stores/useProjectStore';
import { useToolStore } from '@/stores/useToolStore';
import { checkPathExists } from '@/lib/tauri-commands';
import { open } from '@tauri-apps/plugin-dialog';
import { toast } from 'sonner';
import type { Project } from '@/types';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectFormDialog({ open: isOpen, onOpenChange, project }: ProjectFormDialogProps) {
  const addProject = useProjectStore((s) => s.addProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const getEnabledTools = useToolStore((s) => s.getEnabledTools);
  const tools = getEnabledTools();

  const isEdit = !!project;
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [note, setNote] = useState('');
  const [defaultTool, setDefaultTool] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setName(project.name);
        setPath(project.path);
        setTagsStr(project.tags.join(', '));
        setNote(project.note ?? '');
        setDefaultTool(project.defaultTool ?? '');
      } else {
        setName('');
        setPath('');
        setTagsStr('');
        setNote('');
        setDefaultTool('');
      }
    }
  }, [isOpen, project]);

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select project folder',
      });
      if (selected) {
        setPath(selected);
        // Auto-fill name from folder name if empty
        if (!name) {
          const parts = selected.replace(/\/$/, '').split('/');
          setName(parts[parts.length - 1] || '');
        }
      }
    } catch (err) {
      toast.error(`Failed to open folder dialog: ${err}`);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    if (!path.trim()) {
      toast.error('Please enter a project path');
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate path exists
      const exists = await checkPathExists(path.trim());
      if (!exists) {
        toast.error('The specified path does not exist or is not a directory');
        setIsSubmitting(false);
        return;
      }

      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      if (isEdit && project) {
        await updateProject(project.id, {
          name: name.trim(),
          path: path.trim(),
          tags,
          note: note.trim() || undefined,
          defaultTool: defaultTool || undefined,
        });
        toast.success('Project updated');
      } else {
        await addProject({
          name: name.trim(),
          path: path.trim(),
          tags,
          note: note.trim() || undefined,
          defaultTool: defaultTool || undefined,
        });
        toast.success('Project added');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(`Error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="My Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Path */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Path</label>
            <div className="flex gap-2">
              <Input
                placeholder="/Users/you/projects/my-project"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleSelectFolder}
                title="Browse..."
              >
                <FolderSearch className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="work, react, personal (comma separated)"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
            />
          </div>

          {/* Default Tool */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Default Tool</label>
            <Select value={defaultTool} onValueChange={setDefaultTool}>
              <SelectTrigger>
                <SelectValue placeholder="Use global default" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground w-5">{tool.icon}</span>
                      {tool.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Note</label>
            <Textarea
              placeholder="Optional notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
