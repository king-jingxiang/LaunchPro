import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToolStore } from '@/stores/useToolStore';
import { toast } from 'sonner';
import type { Tool } from '@/types';

interface ToolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool?: Tool;
}

export function ToolFormDialog({ open: isOpen, onOpenChange, tool }: ToolFormDialogProps) {
  const addTool = useToolStore((s) => s.addTool);
  const updateTool = useToolStore((s) => s.updateTool);
  const isEdit = !!tool;

  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (tool) {
        setName(tool.name);
        setCommand(tool.command);
        setIcon(tool.icon ?? '');
      } else {
        setName('');
        setCommand('');
        setIcon('');
      }
    }
  }, [isOpen, tool]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a tool name');
      return;
    }
    if (!command.trim()) {
      toast.error('Please enter a command template');
      return;
    }
    if (!command.includes('{path}')) {
      toast.error('Command must include {path} placeholder');
      return;
    }

    try {
      if (isEdit && tool) {
        await updateTool(tool.id, {
          name: name.trim(),
          command: command.trim(),
          icon: icon.trim() || name.charAt(0).toUpperCase(),
        });
        toast.success('Tool updated');
      } else {
        await addTool({
          name: name.trim(),
          command: command.trim(),
          icon: icon.trim() || name.charAt(0).toUpperCase(),
        });
        toast.success('Tool added');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Tool' : 'Add Tool'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="My IDE"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Command Template</label>
            <Input
              placeholder="myide {path}"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use <code className="bg-muted px-1 rounded">{'{path}'}</code> as placeholder for the project path
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Icon (1-2 chars)</label>
            <Input
              placeholder="MI"
              value={icon}
              onChange={(e) => setIcon(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
