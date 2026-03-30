<div align="center">

# LaunchPro

**A lightweight cross-platform project manager for developers**

[![GitHub release](https://img.shields.io/github/v/release/king-jingxiang/LaunchPro?style=flat-square)](https://github.com/king-jingxiang/LaunchPro/releases)
[![GitHub license](https://img.shields.io/github/license/king-jingxiang/LaunchPro?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#cross-platform-support)

**English** · [简体中文](./README.zh-CN.md)

</div>

---

LaunchPro is a fast, minimal desktop app that helps developers manage all their local projects in one place. Quickly browse, organize, and open any project with your favorite IDE or editor — all from a clean, native-feeling interface.

## Features

- **Project Management** — Add, edit, delete, and organize projects by tags and notes
- **One-click Open** — Open any project instantly with your preferred tool (VS Code, Cursor, WebStorm, Vim, terminal, etc.)
- **Custom Tools** — Configure any IDE or shell command as a launch tool, and bind it as the default per project
- **Recent History** — Track last-opened timestamps so you always know what you worked on
- **Tool Management** — Built-in presets plus fully customizable user-defined tools
- **Theming** — Light / Dark / System theme support
- **System Tray** — Runs quietly in the tray, always one click away
- **Local Storage** — All data stored locally via tauri-plugin-store, no cloud, no account needed

## Screenshots

> _Screenshots coming soon_

## Cross-Platform Support

LaunchPro is built with [Tauri v2](https://tauri.app), providing true native binaries for all major desktop platforms:

| Platform | Supported | Package Format |
|----------|-----------|---------------|
| macOS (10.15+) | ✅ | `.dmg`, `.app` |
| Windows (10+) | ✅ | `.msi`, `.exe` |
| Linux | ✅ | `.deb`, `.AppImage`, `.rpm` |

## Installation

### Download Pre-built Binary (Recommended)

1. Go to [Releases](https://github.com/king-jingxiang/LaunchPro/releases)
2. Download the installer for your platform:
   - **macOS**: `LaunchPro_x.x.x_aarch64.dmg` (Apple Silicon) or `LaunchPro_x.x.x_x64.dmg` (Intel)
   - **Windows**: `LaunchPro_x.x.x_x64-setup.exe` or `LaunchPro_x.x.x_x64_en-US.msi`
   - **Linux**: `LaunchPro_x.x.x_amd64.deb` or `LaunchPro_x.x.x_amd64.AppImage`
3. Install and run

> **macOS Note**: On first launch, if you see a security warning, go to **System Settings → Privacy & Security** and click **Open Anyway**.
>
> **"LaunchPro.app is damaged" Error**: If you encounter this error on macOS, run the following command in Terminal to remove the quarantine attribute:
> ```bash
> sudo xattr -d com.apple.quarantine /Applications/LaunchPro.app
> ```

### Build from Source

#### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8
- [Rust](https://rustup.rs/) (latest stable)
- Platform build dependencies for Tauri: see [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

#### Steps

```bash
# 1. Clone the repository
git clone https://github.com/king-jingxiang/LaunchPro.git
cd LaunchPro

# 2. Install frontend dependencies
pnpm install

# 3. Start development mode (hot reload)
pnpm tauri dev

# 4. Build production binary
pnpm tauri build
```

The built artifacts will be in `src-tauri/target/release/bundle/`.

## Development

```bash
# Start dev server with hot reload
pnpm tauri dev

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build frontend only
pnpm build
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Desktop Runtime | Tauri 2 |
| Backend | Rust |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui |
| State Management | Zustand 5 |
| Persistence | tauri-plugin-store |
| Notifications | Sonner |

## Project Structure

```
LaunchPro/
├── src/                   # React frontend
│   ├── components/        # UI components
│   │   ├── project/       # Project list & cards
│   │   ├── tool/          # Tool management
│   │   ├── settings/      # Settings panel
│   │   ├── layout/        # Sidebar & main layout
│   │   └── ui/            # Base UI primitives
│   ├── stores/            # Zustand state stores
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & Tauri commands
│   └── types/             # TypeScript types
└── src-tauri/             # Rust backend
    └── src/
        ├── commands.rs    # Tauri command handlers
        ├── tray.rs        # System tray logic
        └── lib.rs         # App entry & plugin setup
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=king-jingxiang/LaunchPro&type=Date)](https://star-history.com/#king-jingxiang/LaunchPro&Date)
