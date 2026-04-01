# Changelog

All notable changes to this project will be documented in this file.

## [0.5.0]

### 🐛 Bug Fixes
- **ScrollArea Layout**: Fixed scrolling issue in flex container
  - Added `h-full` to MainLayout for proper height inheritance chain
  - Applied `min-h-0` to break default `min-height: auto` in flexbox
  - Resolved content overflow not triggering scroll behavior

### 🎨 Improvements
- **App Icons**: Updated application icon resources

## [0.4.0]

### 🐛 Bug Fixes
- **Store Sync**: Fixed project data synchronization issue
  - Reload data from disk before loading projects
  - Ignore default config to capture external modifications (e.g., CLI writes)
  - Prevent data inconsistency caused by caching

## [0.3.0]

### ✨ New Features
- **CLI Tool**: Added integrated command-line tool installation and path query functionality
  - Support CLI installation with fallback to user local directory
  - Custom command alias support with character safety validation
  - Auto-refresh project list on window focus for CLI compatibility
- **Auto-start**: Integrated tauri-plugin-autostart for system startup launch
- **Tool Toggle**: Added tool enable/disable toggle functionality with UI switch component

### 🔄 Changes
- **Cross-platform Support**: Enhanced cross-platform compatibility
  - Platform-aware application data directory detection (macOS, Windows, Linux)
  - Dynamic Terminal and file manager command generation per platform
  - Improved system PATH retrieval for Windows and Linux
  - CLI installation support for Windows platform

### 📚 Documentation
- Added macOS "app is damaged" error solution in README

## [0.2.0] - 2026-03-27

### ✨ New Features
- **System Tray**: Added tray recent projects support and project list context menu

### 🔄 Changes
- **Branding**: Renamed project to LaunchPro and updated related resources

### 📚 Documentation
- Added detailed API reference and Tauri command interface documentation

## [0.1.0] - 2026-03-27

### 🎨 Improvements
- Updated app icon with a fresh, bright style across all sizes

### 🔧 Infrastructure
- Added automated release and build workflow

[Unreleased]: https://github.com/ruanxingbaozi/launchpro/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/ruanxingbaozi/launchpro/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ruanxingbaozi/launchpro/releases/tag/v0.1.0
