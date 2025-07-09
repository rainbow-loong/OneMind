# 本地开发环境搭建指南

> **版本**: 1.0
> **目标**: 为贡献者提供一份清晰、可复现的本地开发环境配置手册。

---

## 1. 概述

“心阳”项目采用前后端分离的现代Web架构，并依赖第三方服务来加速开发。为了在您的本地机器上成功运行本项目，您需要配置好以下几个关键部分：

*   **前端**: 基于 [Taro](https://taro.zone/) 和 React 的多端应用。
*   **后端**: 基于 [Supabase](https://supabase.com/) 的后端即服务 (BaaS)。
*   **AI模型**: 调用外部大语言模型API（如 DeepSeek, 千问等）。

---

## 2. 依赖软件

在开始之前，请确保您的电脑上已经安装了以下软件：

*   [**Node.js**](https://nodejs.org/) (建议使用 v16 或更高版本)
*   [**Git**](https://git-scm.com/)
*   [**pnpm**](https://pnpm.io/) (我们推荐使用 pnpm 进行包管理，以确保依赖版本的一致性)
*   您选择的代码编辑器 (推荐 [VS Code](https://code.visualstudio.com/))

---

## 3. 配置步骤

### **第1步：获取代码**

1.  **Fork 项目**: 在 GitHub 上，访问 [“心阳”项目主仓库](https://github.com/InnerSun-Project/InnerSun-doc)，点击右上角的 "Fork" 按钮，将项目复刻到您自己的账户下。
2.  **Clone 代码**: 将您复刻的仓库克隆到本地。
    ```bash
    git clone https://github.com/YOUR_USERNAME/InnerSun.git
    cd InnerSun
    ```
3.  **安装依赖**: 使用 `pnpm` 安装所有项目依赖。
    ```bash
    pnpm install
    ```

### **第2步：配置 Supabase 后端**

Supabase 为我们提供了数据库、用户认证、云函数等一系列后端服务。

1.  **创建 Supabase 项目**:
    *   访问 [Supabase 官网](https://supabase.com/) 并注册一个账户。
    *   创建一个新的项目（免费套餐足以满足开发需求）。
2.  **获取 API 密钥**:
    *   在您的 Supabase 项目仪表盘中，进入 "Project Settings" -> "API"。
    *   您需要找到并复制以下两个关键信息：
        *   **Project URL**
        *   **Project API keys** 下的 `anon` `public` 密钥。
3.  **配置数据库**:
    *   我们项目的数据库表结构定义位于 `supabase/migrations` 目录下。您需要将这些迁移文件应用到您的 Supabase 项目中。
    *   (详细的数据库迁移指南将在后续版本中提供)。

### **第3步：配置环境变量**

1.  **创建 `.env` 文件**: 在项目的根目录下，复制 `.env.example` 文件并重命名为 `.env`。
    ```bash
    cp .env.example .env
    ```
2.  **填写环境变量**: 打开 `.env` 文件，填入您在上一步中获取到的信息。
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    # AI Model API
    AI_PROVIDER=deepseek
    DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
    ```

---

## 4. 运行项目

完成以上所有配置后，您就可以运行前端项目了。我们以微信小程序为例：

```bash
pnpm run dev:weapp
```

此命令将启动 Taro 的编译进程。您可以使用微信开发者工具，打开项目根目录下的 `dist` 文件夹，即可看到运行效果。

---

## 5. 未来规划：Docker 一键启动

我们深知手动配置环境的繁琐。为了进一步降低贡献门槛，我们正在规划一套基于 Docker 的一键启动方案。

*   **目标**: 贡献者在安装 Docker 后，只需在项目根目录运行 `docker-compose up`，即可自动拉取镜像、启动本地的 Supabase 服务、并运行前端应用。
*   **状态**: 规划中，欢迎有经验的社区成员参与贡献！

如果您在环境搭建过程中遇到任何问题，请随时在 [GitHub Discussions](https://github.com/InnerSun-Project/InnerSun-doc/discussions) 中向我们提问。