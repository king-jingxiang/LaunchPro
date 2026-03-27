use tauri::{
    image::Image,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, AppHandle, Emitter,
};
use crate::commands::get_recent_projects;

/// 构建托盘菜单（包含最近项目）
fn build_tray_menu(app: &AppHandle) -> Result<tauri::menu::Menu<tauri::Wry>, Box<dyn std::error::Error>> {
    let show = MenuItemBuilder::with_id("show", "Show Window").build(app)?;
    let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
    
    let mut menu_builder = MenuBuilder::new(app);
    
    // 添加显示窗口选项
    menu_builder = menu_builder.item(&show);
    menu_builder = menu_builder.separator();
    
    // 获取最近项目并添加到菜单
    match get_recent_projects(app.clone()) {
        Ok(recent_projects) if !recent_projects.is_empty() => {
            for project in recent_projects {
                let item_id = format!("open_project:{}", project.id);
                let item = MenuItemBuilder::with_id(item_id, project.name).build(app)?;
                menu_builder = menu_builder.item(&item);
            }
            menu_builder = menu_builder.separator();
        }
        _ => {}
    }
    
    // 添加退出选项
    menu_builder = menu_builder.item(&quit);
    
    Ok(menu_builder.build()?)
}

/// 更新托盘菜单（供前端调用）
#[tauri::command]
pub fn update_tray_menu(app_handle: AppHandle) -> Result<(), String> {
    if let Some(tray) = app_handle.tray_by_id("main-tray") {
        let menu = build_tray_menu(&app_handle)
            .map_err(|e| format!("Failed to build tray menu: {}", e))?;
        tray.set_menu(Some(menu))
            .map_err(|e| format!("Failed to set tray menu: {}", e))?;
    }
    Ok(())
}

pub fn create_tray(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // 检查是否已存在托盘图标，避免重复创建
    if app.tray_by_id("main-tray").is_some() {
        return Ok(());
    }

    let menu = build_tray_menu(&app.handle())?;

    let _tray = TrayIconBuilder::with_id("main-tray")
        .icon(Image::from_path("icons/icon.png").unwrap_or_else(|_| {
            app.default_window_icon().cloned().expect("no default icon")
        }))
        .icon_as_template(true)
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(move |app, event| {
            let event_id = event.id().as_ref();
            match event_id {
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                id if id.starts_with("open_project:") => {
                    // 提取项目ID
                    let project_id = id.strip_prefix("open_project:").unwrap_or("");
                    if let Some(window) = app.get_webview_window("main") {
                        // 发送事件到前端，让前端处理项目打开
                        let _ = window.emit("tray-open-project", project_id);
                        // 显示并聚焦窗口
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    // 将托盘图标保存到应用状态中，防止被丢弃
    app.manage(_tray);

    Ok(())
}
