import { useState } from 'react';
import { Plus, Pencil, Trash2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToolStore } from '@/stores/useToolStore';
import { ToolFormDialog } from './ToolFormDialog';
import type { Tool } from '@/types';

export function ToolList() {
  const tools = useToolStore((s) => s.tools);
  const deleteTool = useToolStore((s) => s.deleteTool);
  const [showAdd, setShowAdd] = useState(false);
  const [editTool, setEditTool] = useState<Tool | undefined>();

  const builtinTools = tools.filter((t) => t.isBuiltin);
  const customTools = tools.filter((t) => !t.isBuiltin);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-3 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tools</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure IDE and shell commands for opening projects
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Tool
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Built-in tools */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Built-in</h3>
            <div className="space-y-2">
              {builtinTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onEdit={() => setEditTool(tool)}
                />
              ))}
            </div>
          </div>

          {customTools.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Custom</h3>
                <div className="space-y-2">
                  {customTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onEdit={() => setEditTool(tool)}
                      onDelete={() => deleteTool(tool.id)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <ToolFormDialog open={showAdd} onOpenChange={setShowAdd} />
      <ToolFormDialog
        open={!!editTool}
        onOpenChange={(open) => { if (!open) setEditTool(undefined); }}
        tool={editTool}
      />
    </div>
  );
}

function ToolCard({
  tool,
  onEdit,
  onDelete,
}: {
  tool: Tool;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
          <span className="text-xs font-mono font-semibold">{tool.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{tool.name}</span>
            {tool.isBuiltin && (
              <Badge variant="secondary" className="text-[10px] h-4">built-in</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Terminal className="h-3 w-3 text-muted-foreground" />
            <code className="text-xs text-muted-foreground font-mono">{tool.command}</code>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
