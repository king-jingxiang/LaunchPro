import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useToolStore } from '@/stores/useToolStore';
import { getAppDataDir } from '@/lib/tauri-commands';
import { useState } from 'react';
import { toast } from 'sonner';

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const defaultTool = useSettingsStore((s) => s.settings.defaultTool);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const tools = useToolStore((s) => s.tools);
  const [dataDir, setDataDir] = useState<string>('');

  const handleShowDataDir = async () => {
    try {
      const dir = await getAppDataDir();
      setDataDir(dir);
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-3 border-b">
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      <div className="p-4 space-y-6 overflow-auto">
        {/* Theme */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Appearance</h3>
          <div className="flex gap-2">
            {([
              { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
              { id: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
              { id: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
            ] as const).map((t) => (
              <Button
                key={t.id}
                variant={theme === t.id ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => setTheme(t.id)}
              >
                {t.icon}
                {t.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Default Tool */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Default Tool</h3>
          <p className="text-xs text-muted-foreground mb-2">
            The IDE/tool used when opening a project without a specific tool selected
          </p>
          <Select
            value={defaultTool ?? ''}
            onValueChange={(v) => updateSettings({ defaultTool: v || undefined })}
          >
            <SelectTrigger className="w-60">
              <SelectValue placeholder="None (always ask)" />
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
        </Card>

        <Separator />

        {/* Data directory */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Data</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={handleShowDataDir}>
              Show Data Directory
            </Button>
            {dataDir && (
              <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                {dataDir}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
