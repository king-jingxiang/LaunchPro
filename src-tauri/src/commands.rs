use std::path::Path;
use std::process::Command;
use tauri::Manager;
use serde::Serialize;

/// Embedded launch CLI Python script
const LAUNCH_CLI_SCRIPT: &str = include_str!("../resources/launch_cli.py");

/// 最近项目信息
#[derive(Serialize, Clone)]
pub struct RecentProject {
    pub id: String,
    pub name: String,
    pub path: String,
}

/// Get the PATH separator for the current platform
#[cfg(windows)]
const PATH_SEPARATOR: &str = ";";
#[cfg(not(windows))]
const PATH_SEPARATOR: &str = ":";

/// Read system PATH and add common locations.
/// Tauri apps don't inherit shell PATH, so we need to build it manually.
fn get_system_path() -> String {
    let mut paths: Vec<String> = Vec::new();

    #[cfg(target_os = "macos")]
    {
        // Read /etc/paths on macOS
        if let Ok(content) = std::fs::read_to_string("/etc/paths") {
            for line in content.lines() {
                let trimmed = line.trim();
                if !trimmed.is_empty() {
                    paths.push(trimmed.to_string());
                }
            }
        }

        // Add macOS-specific paths
        let home = std::env::var("HOME").unwrap_or_default();
        let extra_paths = [
            format!("{home}/.cargo/bin"),
            format!("{home}/.local/bin"),
            "/usr/local/bin".to_string(),
            "/opt/homebrew/bin".to_string(),
            "/opt/homebrew/sbin".to_string(),
        ];
        for p in &extra_paths {
            if !paths.contains(p) {
                paths.push(p.clone());
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        // Add Linux-specific paths
        let home = std::env::var("HOME").unwrap_or_default();
        let extra_paths = [
            format!("{home}/.cargo/bin"),
            format!("{home}/.local/bin"),
            "/usr/local/bin".to_string(),
            "/usr/bin".to_string(),
            "/bin".to_string(),
            "/snap/bin".to_string(),
            format!("{home}/.nvm/versions/node/*/bin"),
        ];
        for p in &extra_paths {
            if !paths.contains(p) {
                paths.push(p.clone());
            }
        }
    }

    #[cfg(windows)]
    {
        // Add Windows-specific paths
        let userprofile = std::env::var("USERPROFILE").unwrap_or_default();
        let localappdata = std::env::var("LOCALAPPDATA").unwrap_or_default();
        let programfiles = std::env::var("ProgramFiles").unwrap_or_default();
        let programfiles_x86 = std::env::var("ProgramFiles(x86)").unwrap_or_default();

        let extra_paths = [
            format!("{}\\AppData\\Local\\Programs\\Microsoft VS Code\\bin", userprofile),
            format!("{}\\Programs\\cursor\\resources\\app\\bin", localappdata),
            format!("{}\\Microsoft VS Code\\bin", programfiles),
            format!("{}\\Git\\cmd", programfiles),
            format!("{}\\.cargo\\bin", userprofile),
            format!("{}\\Microsoft VS Code\\bin", programfiles_x86),
        ];
        for p in &extra_paths {
            if !paths.contains(p) {
                paths.push(p.clone());
            }
        }
    }

    // Include current PATH as fallback
    if let Ok(current) = std::env::var("PATH") {
        for p in current.split(PATH_SEPARATOR) {
            let s = p.to_string();
            if !paths.contains(&s) {
                paths.push(s);
            }
        }
    }

    paths.join(PATH_SEPARATOR)
}

#[tauri::command]
pub fn open_project_with_tool(command_template: String, project_path: String) -> Result<(), String> {
    let path = Path::new(&project_path);
    if !path.exists() {
        return Err(format!("Path does not exist: {}", project_path));
    }
    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", project_path));
    }

    // Replace {path} placeholder in command template
    let full_command = command_template.replace("{path}", &project_path);

    // Split command into program and arguments
    let parts: Vec<&str> = full_command.split_whitespace().collect();
    if parts.is_empty() {
        return Err("Command template is empty".to_string());
    }

    let program = parts[0];
    let args = &parts[1..];

    let system_path = get_system_path();

    Command::new(program)
        .args(args)
        .env("PATH", &system_path)
        .spawn()
        .map_err(|e| format!("Failed to execute '{}': {}", program, e))?;

    Ok(())
}

#[tauri::command]
pub fn check_path_exists(path: String) -> Result<bool, String> {
    let p = Path::new(&path);
    Ok(p.exists() && p.is_dir())
}

#[tauri::command]
pub fn get_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    let path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    Ok(path.to_string_lossy().to_string())
}

/// 获取最近打开的5个项目
#[tauri::command]
pub fn get_recent_projects(app_handle: tauri::AppHandle) -> Result<Vec<RecentProject>, String> {
    use std::fs;
    use serde_json::Value;

    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let store_path = app_data_dir.join("projects.json");
    
    if !store_path.exists() {
        return Ok(vec![]);
    }

    let content = fs::read_to_string(&store_path)
        .map_err(|e| format!("Failed to read store file: {}", e))?;
    
    let json: Value = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse store file: {}", e))?;
    
    let projects = json.get("projects")
        .and_then(|p| p.as_array())
        .cloned()
        .unwrap_or_default();

    // 过滤有 lastOpened 的项目，按时间倒序排序
    let mut recent: Vec<(i64, RecentProject)> = projects
        .into_iter()
        .filter_map(|p| {
            let id = p.get("id")?.as_str()?.to_string();
            let name = p.get("name")?.as_str()?.to_string();
            let path = p.get("path")?.as_str()?.to_string();
            let last_opened = p.get("lastOpened")?.as_i64()?;
            Some((last_opened, RecentProject { id, name, path }))
        })
        .collect();

    // 按 lastOpened 倒序排序
    recent.sort_by(|a, b| b.0.cmp(&a.0));

    // 取前5个
    let result: Vec<RecentProject> = recent
        .into_iter()
        .take(5)
        .map(|(_, project)| project)
        .collect();

    Ok(result)
}

/// Returns the path where the launch CLI is currently installed, or empty string if not found.
/// `alias` is the command name to look for (default: "launch").
#[tauri::command]
pub fn get_cli_install_path(alias: String) -> String {
    let name = if alias.trim().is_empty() { "launch".to_string() } else { alias.trim().to_string() };
    
    #[cfg(unix)]
    {
        let home = std::env::var("HOME").unwrap_or_default();
        let candidates = [
            format!("/usr/local/bin/{name}"),
            format!("{home}/.local/bin/{name}"),
        ];
        for path in &candidates {
            if Path::new(path).exists() {
                return path.clone();
            }
        }
    }

    #[cfg(windows)]
    {
        let userprofile = std::env::var("USERPROFILE").unwrap_or_default();
        let localappdata = std::env::var("LOCALAPPDATA").unwrap_or_default();
        let script_name = format!("{name}.py");
        let batch_name = format!("{name}.bat");
        let candidates = [
            format!("{}\\AppData\\Local\\Programs\\LaunchPro\\{}", userprofile, script_name),
            format!("{}\\AppData\\Local\\Programs\\LaunchPro\\{}", userprofile, batch_name),
            format!("{}\\Programs\\LaunchPro\\{}", localappdata, script_name),
            format!("{}\\Programs\\LaunchPro\\{}", localappdata, batch_name),
        ];
        for path in &candidates {
            if Path::new(path).exists() {
                return path.clone();
            }
        }
    }

    String::new()
}

#[derive(Serialize)]
pub struct CliInstallResult {
    pub path: String,
    /// When true, the install path is not in a standard PATH location and the user
    /// needs to add it manually (e.g. ~/.local/bin).
    pub needs_path_setup: bool,
}

/// Install the launch CLI script to the system.
/// `alias` sets the command name (default: "launch"). Only alphanumeric, hyphens and underscores allowed.
#[tauri::command]
pub fn install_cli(alias: String) -> Result<CliInstallResult, String> {
    // Resolve alias
    let name = if alias.trim().is_empty() {
        "launch".to_string()
    } else {
        alias.trim().to_string()
    };

    // Validate: only allow safe characters for a shell command name
    if !name.chars().all(|c| c.is_alphanumeric() || c == '-' || c == '_') {
        return Err(format!(
            "Invalid alias '{}'. Use only letters, numbers, hyphens and underscores.",
            name
        ));
    }

    #[cfg(unix)]
    {
        // ── Try /usr/local/bin first ─────────────────────────────────────────────
        let primary_path = format!("/usr/local/bin/{name}");
        match write_executable(&primary_path, LAUNCH_CLI_SCRIPT) {
            Ok(_) => {
                return Ok(CliInstallResult {
                    path: primary_path,
                    needs_path_setup: false,
                });
            }
            Err(_) => {} // fall through to local bin
        }

        // ── Fall back to ~/.local/bin ────────────────────────────────────────────
        let home = std::env::var("HOME").map_err(|e| format!("Cannot read $HOME: {e}"))?;
        let local_bin = format!("{home}/.local/bin");
        std::fs::create_dir_all(&local_bin)
            .map_err(|e| format!("Failed to create {local_bin}: {e}"))?;
        let local_path = format!("{local_bin}/{name}");
        write_executable(&local_path, LAUNCH_CLI_SCRIPT)
            .map_err(|e| format!("Failed to install CLI: {e}"))?;

        return Ok(CliInstallResult {
            path: local_path,
            needs_path_setup: true,
        });
    }

    #[cfg(windows)]
    {
        // Windows: Install to AppData\Local\Programs\LaunchPro
        let localappdata = std::env::var("LOCALAPPDATA")
            .map_err(|e| format!("Cannot read %LOCALAPPDATA%: {e}"))?;
        let install_dir = format!("{}\\Programs\\LaunchPro", localappdata);
        std::fs::create_dir_all(&install_dir)
            .map_err(|e| format!("Failed to create {install_dir}: {e}"))?;

        // Write the Python script
        let script_path = format!("{}\\{}.py", install_dir, name);
        std::fs::write(&script_path, LAUNCH_CLI_SCRIPT)
            .map_err(|e| format!("Failed to write script: {e}"))?;

        // Create a batch wrapper for easy execution
        let batch_content = format!("@echo off\npython \"%~dp0{}.py\" %*", name);
        let batch_path = format!("{}\\{}.bat", install_dir, name);
        std::fs::write(&batch_path, batch_content)
            .map_err(|e| format!("Failed to write batch file: {e}"))?;

        return Ok(CliInstallResult {
            path: batch_path,
            needs_path_setup: true,
        });
    }

    #[cfg(not(any(unix, windows)))]
    {
        Err("CLI installation is not supported on this platform".to_string())
    }
}

/// Write content to a file and make it executable (Unix only)
#[cfg(unix)]
fn write_executable(path: &str, content: &str) -> std::io::Result<()> {
    use std::os::unix::fs::PermissionsExt;
    std::fs::write(path, content)?;
    let mut perms = std::fs::metadata(path)?.permissions();
    perms.set_mode(0o755);
    std::fs::set_permissions(path, perms)?;
    Ok(())
}
