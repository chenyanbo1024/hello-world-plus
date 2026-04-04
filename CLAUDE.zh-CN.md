# CLAUDE.zh-CN.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概述

这是一个个人博客系统，前端使用 React，后端使用 Go，专注于 AI/ML 技术内容。

## 开发命令

### 前端 (在 `frontend/` 目录下)

```bash
npm run dev      # 启动开发服务器 (端口 5173)
npm run build    # 类型检查并构建生产版本
npm run lint     # 运行 ESLint
npm run preview  # 预览生产构建
```

### 后端 (在 `backend/` 目录下)

```bash
make run     # 直接运行服务器
make build   # 编译二进制文件到 bin/server
make test    # 运行 Go 测试
make swag    # 重新生成 Swagger 文档
make dev     # 重新生成 Swagger 并运行服务器
```

## 架构

### 前端技术栈
- **React 19** + TypeScript + Vite 8 + Tailwind CSS 4
- **React Router** 路由：`/` (首页)、`/article/:slug` (文章详情)、`/about`、`/search` (搜索结果)
- **API 层**：服务接口 (`IArticleService`, `IProfileService`)，实际实现调用 `/api/v1/*`
- **Vite 代理** 将 `/api` 请求转发到后端 `localhost:8080`
- **组件模式**：
  - `src/components/common/` - 可复用 UI 组件 (Card, Tag, SearchModal, ThemeToggle, BackToTop, LoadingSpinner)
  - `src/components/features/` - 领域特定组件 (ArticleCard, ArticleList, ArticleContent, TableOfContents)
  - `src/components/layout/` - 布局组件 (Header, Footer, Layout)
  - `src/hooks/` - 自定义 React Hooks，在 `index.ts` 中统一导出

### 后端技术栈
- **Go 1.22** + Gin 框架 + GORM ORM + MySQL 数据库
- **Swagger** 文档地址：`/swagger/index.html`
- **分层架构**：
  - `cmd/server/main.go` - 入口点，组装依赖
  - `internal/handler/` - HTTP 处理器 (依赖 service 接口)
  - `internal/service/` - 业务逻辑接口和实现 (依赖 repository 接口)
  - `internal/repository/` - 数据访问接口和实现 (依赖 GORM)
  - `internal/model/` - GORM 模型和响应 DTO，包含 `ToResponse()` 和 `ToSummaryResponse()` 转换方法
  - `internal/middleware/` - CORS 中间件
  - `internal/router/` - 路由定义

### API 端点

| 方法 | 路径 | 描述 |
|--------|------|-------------|
| GET | `/api/v1/articles` | 获取文章列表 (?published=true/false) |
| GET | `/api/v1/articles/:id` | 根据 ID 获取文章 |
| GET | `/api/v1/articles/slug/:slug` | 根据 slug 获取文章 |
| GET | `/api/v1/articles/search` | 搜索文章 (?q=关键词&page=1&limit=10) |
| GET | `/health` | 健康检查 |

### 数据流

1. 前端服务调用 (如 `articleService.getAll()`)
2. Vite 代理转发到后端
3. Handler 接收请求，调用 Service
4. Service 执行业务逻辑，调用 Repository
5. Repository 通过 GORM 查询 MySQL
6. 响应通过各层返回

## 环境配置

后端需要 MySQL 数据库。复制 `backend/.env.example` 到 `backend/.env` 并配置：
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `SERVER_PORT` (默认: 8080)
- `CORS_ALLOWED_ORIGINS` (默认: http://localhost:5173)

使用 `backend/scripts/init.sql` 初始化数据库。
