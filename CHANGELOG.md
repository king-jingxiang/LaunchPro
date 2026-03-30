# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
