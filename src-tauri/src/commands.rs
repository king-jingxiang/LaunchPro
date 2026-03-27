use std::path::Path;
use std::process::Command;
use tauri::Manager;

/// Read system PATH from /etc/paths and common locations on macOS.
/// Tauri apps don't inherit shell PATH, so we need to build it manually.
fn get_system_path() -> String {
    let mut paths: Vec<String> = Vec::new();

    // Read /etc/paths
    if let Ok(content) = std::fs::read_to_string("/etc/paths") {
        for line in content.lines() {
            let trimmed = line.trim();
            if !trimmed.is_empty() {
                paths.push(trimmed.to_string());
            }
        }
    }

    // Add common paths that IDEs install their CLI tools to
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

    // Include current PATH as fallback
    if let Ok(current) = std::env::var("PATH") {
        for p in current.split(':') {
            let s = p.to_string();
            if !paths.contains(&s) {
                paths.push(s);
            }
        }
    }

    paths.join(":")
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
