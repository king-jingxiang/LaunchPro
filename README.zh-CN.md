<div align="center">

# ProManager

**面向开发者的轻量级跨平台项目管理工具**

[![GitHub release](https://img.shields.io/github/v/release/king-jingxiang/ProManager?style=flat-square)](https://github.com/king-jingxiang/ProManager/releases)
[![GitHub license](https://img.shields.io/github/license/king-jingxiang/ProManager?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#跨平台支持)

[English](./README.md) · **简体中文**

</div>

---

ProManager 是一款快速、简洁的桌面应用，帮助开发者在一个地方统一管理所有本地项目。快速浏览、整理并用你喜欢的 IDE 或编辑器打开任意项目 —— 界面干净，体验原生。

## 功能特性

- **项目管理** — 添加、编辑、删除项目，支持标签和备注分类整理
- **一键打开** — 用你偏好的工具（VS Code、Cursor、WebStorm、Vim、终端等）即时打开任意项目
- **自定义工具** — 将任意 IDE 或 Shell 命令配置为启动工具，并为每个项目单独绑定默认工具
- **最近记录** — 记录最后打开时间，随时掌握最近的工作状态
- **工具管理** — 内置预设工具 + 完全自定义的用户工具
- **主题支持** — 浅色 / 深色 / 跟随系统三种主题
- **系统托盘** — 静默驻留托盘，随时一键唤起
- **本地存储** — 所有数据通过 tauri-plugin-store 存储在本地，无需云端，无需账号

## 截图预览

> _截图即将上线_

## 跨平台支持

ProManager 基于 [Tauri v2](https://tauri.app) 构建，为所有主流桌面平台提供真正的原生二进制包：

| 平台 | 支持状态 | 安装包格式 |
|------|----------|-----------|
| macOS (10.15+) | ✅ | `.dmg`、`.app` |
| Windows (10+) | ✅ | `.msi`、`.exe` |
| Linux | ✅ | `.deb`、`.AppImage`、`.rpm` |

## 安装

### 下载预构建包（推荐）

1. 前往 [Releases](https://github.com/king-jingxiang/ProManager/releases) 页面
2. 根据你的平台下载对应安装包：
   - **macOS**：`ProManager_x.x.x_aarch64.dmg`（Apple Silicon）或 `ProManager_x.x.x_x64.dmg`（Intel）
   - **Windows**：`ProManager_x.x.x_x64-setup.exe` 或 `ProManager_x.x.x_x64_en-US.msi`
   - **Linux**：`pro-manager_x.x.x_amd64.deb` 或 `pro-manager_x.x.x_amd64.AppImage`
3. 安装并运行

> **macOS 提示**：首次启动如遇安全警告，请前往 **系统设置 → 隐私与安全性**，点击 **仍要打开**。

### 从源码构建

#### 环境依赖

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8
- [Rust](https://rustup.rs/)（最新稳定版）
- Tauri 平台构建依赖：参见 [Tauri 前置条件](https://tauri.app/start/prerequisites/)

#### 构建步骤

```bash
# 1. 克隆仓库
git clone https://github.com/king-jingxiang/ProManager.git
cd pro-manager

# 2. 安装前端依赖
pnpm install

# 3. 启动开发模式（热重载）
pnpm tauri dev

# 4. 构建生产包
pnpm tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`。

## 开发

```bash
# 启动开发服务器（热重载）
pnpm tauri dev

# 类型检查
pnpm tsc --noEmit

# 代码检查
pnpm lint

# 仅构建前端
pnpm build
```

## 技术栈

| 层级 | 技术 |
|------|------|
| UI 框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 桌面运行时 | Tauri 2 |
| 后端 | Rust |
| 样式 | Tailwind CSS 4 |
| UI 组件 | Radix UI + shadcn/ui |
| 状态管理 | Zustand 5 |
| 数据持久化 | tauri-plugin-store |
| 通知 | Sonner |

## 项目结构

```
pro-manager/
├── src/                   # React 前端
│   ├── components/        # UI 组件
│   │   ├── project/       # 项目列表与卡片
│   │   ├── tool/          # 工具管理
│   │   ├── settings/      # 设置面板
│   │   ├── layout/        # 侧边栏与主布局
│   │   └── ui/            # 基础 UI 原语
│   ├── stores/            # Zustand 状态仓库
│   ├── hooks/             # 自定义 React Hooks
│   ├── lib/               # 工具函数与 Tauri 命令
│   └── types/             # TypeScript 类型定义
└── src-tauri/             # Rust 后端
    └── src/
        ├── commands.rs    # Tauri 命令处理
        ├── tray.rs        # 系统托盘逻辑
        └── lib.rs         # 应用入口与插件注册
```

## 贡献指南

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的功能分支（`git checkout -b feature/amazing-feature`）
3. 提交你的改动（`git commit -m 'Add some amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

## 开源协议

MIT License — 详见 [LICENSE](LICENSE)。

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=king-jingxiang/ProManager&type=Date)](https://star-history.com/#king-jingxiang/ProManager&Date)
