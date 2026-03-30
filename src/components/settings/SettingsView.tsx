import { Sun, Moon, Monitor, Terminal, CheckCircle2, Download, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useToolStore } from '@/stores/useToolStore';
import { getAppDataDir, installCli, getCliInstallPath, getAutostart, setAutostart } from '@/lib/tauri-commands';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const defaultTool = useSettingsStore((s) => s.settings.defaultTool);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const getEnabledTools = useToolStore((s) => s.getEnabledTools);
  const tools = getEnabledTools();
  const [dataDir, setDataDir] = useState<string>('');
  const [cliAlias, setCliAlias] = useState('launch');
  const [cliInstallPath, setCliInstallPath] = useState<string>('');
  const [cliInstalling, setCliInstalling] = useState(false);
  const [autostartEnabled, setAutostartEnabled] = useState(false);

  // Check if a CLI with the current alias is already installed
  useEffect(() => {
    const trimmed = cliAlias.trim() || 'launch';
    getCliInstallPath(trimmed).then(setCliInstallPath).catch(() => setCliInstallPath(''));
  }, [cliAlias]);

  // Load autostart status
  useEffect(() => {
    getAutostart().then(setAutostartEnabled).catch(() => setAutostartEnabled(false));
  }, []);

  const handleAutostartToggle = async (checked: boolean) => {
    try {
      await setAutostart(checked);
      setAutostartEnabled(checked);
      toast.success(checked ? 'Launch at login enabled' : 'Launch at login disabled');
    } catch (err) {
      toast.error(`Failed to update autostart: ${err}`);
    }
  };

  const handleShowDataDir = async () => {
    try {
      const dir = await getAppDataDir();
      setDataDir(dir);
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  const handleInstallCli = async () => {
    const alias = cliAlias.trim() || 'launch';
    setCliInstalling(true);
    try {
      const result = await installCli(alias);
      setCliInstallPath(result.path);
      if (result.needsPathSetup) {
        // Detect platform for appropriate PATH setup instructions
        const isWindows = navigator.userAgent.toLowerCase().includes('win');
        if (isWindows) {
          toast.success(
            `CLI installed to ${result.path}. Add the installation directory to your PATH environment variable.`,
            { duration: 8000 }
          );
        } else {
          toast.success(
            `CLI installed to ${result.path}. Add ~/.local/bin to your PATH:\nexport PATH="$HOME/.local/bin:$PATH"`,
            { duration: 8000 }
          );
        }
      } else {
        toast.success(`CLI installed to ${result.path}`);
      }
    } catch (err) {
      toast.error(`Install failed: ${err}`);
    } finally {
      setCliInstalling(false);
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

        {/* Launch at Login */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className="h-4 w-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">Launch at Login</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically start LaunchPro when you log in
                </p>
              </div>
            </div>
            <Switch
              checked={autostartEnabled}
              onCheckedChange={handleAutostartToggle}
            />
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

        {/* CLI Tool */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">CLI Tool</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Install a command to open any project from the terminal.
            Run{' '}
            <code className="font-mono bg-muted px-1 rounded">
              {(cliAlias.trim() || 'launch')} .
            </code>{' '}
            in a directory to open it with its configured tool and record it in LaunchPro.
          </p>

          {/* Alias input */}
          <div className="flex items-center gap-2 mb-3">
            <label className="text-xs text-muted-foreground whitespace-nowrap">Command name</label>
            <Input
              value={cliAlias}
              onChange={(e) => setCliAlias(e.target.value)}
              placeholder="launch"
              className="h-7 text-xs font-mono w-36"
              spellCheck={false}
            />
          </div>

          {cliInstallPath ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Installed at <code className="font-mono">{cliInstallPath}</code></span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleInstallCli}
                disabled={cliInstalling}
              >
                <Download className="h-3.5 w-3.5" />
                {cliInstalling ? 'Reinstalling...' : 'Reinstall / Update'}
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={handleInstallCli}
              disabled={cliInstalling}
            >
              <Download className="h-3.5 w-3.5" />
              {cliInstalling ? 'Installing...' : 'Install CLI'}
            </Button>
          )}
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
