# 个人博客系统

一个基于 React 和 Go 构建的全栈个人博客系统，专注于 AI/ML 技术内容。

## 功能特性

- 📝 文章管理，支持 Markdown
- 🔍 全文搜索功能
- 📖 目录导航
- 🌙 深色/浅色主题切换
- 📱 响应式设计
- 🔗 SEO 友好的 URL（基于 slug）
- 🚀 快速现代的技术栈
- 🐳 支持 Docker 部署

## 技术栈

### 前端
- **React 19** + TypeScript
- **Vite 8** 快速开发和构建
- **Tailwind CSS 4** 样式框架
- **React Router 7** 路由管理
- **date-fns** 日期格式化

### 后端
- **Go 1.22** + Gin 框架
- **GORM** MySQL ORM
- **Swagger** API 文档
- **分层架构** (Handler → Service → Repository)

### 基础设施
- **MySQL 5.7** 数据持久化
- **Nginx** 前端服务和反向代理
- **Docker Compose** 容器编排

## 项目结构

```
.
├── frontend/                # React 前端应用
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   │   ├── common/     # UI 组件 (Card, Tag, Modal 等)
│   │   │   ├── features/   # 业务组件 (ArticleCard 等)
│   │   │   └── layout/     # 布局组件 (Header, Footer)
│   │   ├── contexts/       # React contexts (主题)
│   │   ├── hooks/          # 自定义 hooks
│   │   ├── pages/          # 页面组件
│   │   └── services/       # API 服务层
│   └── package.json
├── backend/                 # Go 后端应用
│   ├── cmd/server/         # 程序入口
│   ├── internal/
│   │   ├── config/         # 配置管理
│   │   ├── handler/        # HTTP 处理器
│   │   ├── middleware/     # HTTP 中间件
│   │   ├── model/          # GORM 模型
│   │   ├── repository/     # 数据访问层
│   │   ├── router/         # 路由定义
│   │   └── service/        # 业务逻辑层
│   ├── scripts/            # 数据库初始化
│   ├── docs/swagger/       # 生成的 Swagger 文档
│   ├── Makefile
│   └── go.mod
└── deploy/                  # 部署配置
    ├── docker-compose.yml
    ├── frontend.Dockerfile
    ├── backend.Dockerfile
    └── nginx.conf
```

## 快速开始

### 环境要求

- Node.js 18+ 和 npm
- Go 1.22+
- MySQL 5.7+
- Docker 和 Docker Compose（可选）

### 本地开发

#### 1. 克隆仓库

```bash
git clone <repository-url>
cd hello-world-plus
```

#### 2. 配置后端

```bash
# 创建 MySQL 数据库
mysql -u root -p < backend/scripts/init.sql

# 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env，填入你的数据库凭据

# 运行后端
cd backend
make run
```

后端服务将在 `http://localhost:8080` 启动
Swagger API 文档地址：`http://localhost:8080/swagger/index.html`

#### 3. 配置前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

### Docker 部署

```bash
# 创建环境变量文件
cp backend/.env.example .env
# 编辑 .env 配置你需要的参数

# 启动所有服务
docker-compose -f deploy/docker-compose.yml up -d
```

应用将在 `http://localhost` 可用

## API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api/v1/articles` | 文章列表（支持 `?published=true/false`） |
| GET | `/api/v1/articles/:id` | 根据 ID 获取文章 |
| GET | `/api/v1/articles/slug/:slug` | 根据 slug 获取文章 |
| GET | `/api/v1/articles/search` | 搜索文章（`?q=关键词&page=1&limit=10`） |

## 前端路由

| 路径 | 组件 | 描述 |
|------|------|------|
| `/` | HomePage | 文章列表（分页） |
| `/article/:slug` | ArticleDetailPage | 文章详情（含目录） |
| `/about` | AboutPage | 关于作者页面 |
| `/search` | SearchPage | 搜索文章 |

## 开发命令

### 前端（在 `frontend/` 目录下）

```bash
npm run dev      # 启动开发服务器
npm run build    # 类型检查并构建生产版本
npm run lint     # 运行 ESLint
npm run preview  # 预览生产构建
```

### 后端（在 `backend/` 目录下）

```bash
make run     # 直接运行服务器
make build   # 构建二进制文件到 bin/server
make test    # 运行 Go 测试
make swag    # 重新生成 Swagger 文档
make dev     # 重新生成 Swagger 并运行服务器
```

## 环境变量

### 后端

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `SERVER_PORT` | 服务器端口 | `8080` |
| `GIN_MODE` | Gin 模式 (debug/release) | `debug` |
| `DB_HOST` | MySQL 主机 | `localhost` |
| `DB_PORT` | MySQL 端口 | `3306` |
| `DB_USER` | MySQL 用户 | `root` |
| `DB_PASSWORD` | MySQL 密码 | - |
| `DB_NAME` | 数据库名 | `blog_db` |
| `CORS_ALLOWED_ORIGINS` | CORS 允许的源 | `http://localhost:5173` |

## 架构亮点

### 后端架构

后端采用清晰的分层架构：

1. **Handler 层** - HTTP 请求处理和验证
2. **Service 层** - 业务逻辑实现
3. **Repository 层** - 数据库操作
4. **Model 层** - GORM 数据结构

使用依赖注入连接各层，使代码可测试且易于维护。

### 前端架构

前端采用组件化架构：

- **通用组件** - 可复用的 UI 元素（Button、Card、Tag 等）
- **业务组件** - 领域特定组件（ArticleCard、ArticleList 等）
- **布局组件** - 页面结构（Header、Footer、Layout）
- **服务接口** - API 抽象层，支持 mock 数据

## 数据库结构

### 文章表 (articles)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键 |
| slug | VARCHAR(255) | URL 友好的标识符（唯一） |
| title | VARCHAR(255) | 文章标题 |
| excerpt | TEXT | 简短描述 |
| content | LONGTEXT | 完整文章内容 |
| cover_image | VARCHAR(500) | 封面图片 URL |
| author_name | VARCHAR(100) | 作者名称 |
| author_avatar | VARCHAR(500) | 作者头像 URL |
| author_bio | VARCHAR(500) | 作者简介 |
| tags | JSON | 标签数组 |
| category | VARCHAR(100) | 文章分类 |
| reading_time | INT | 预计阅读时间（分钟） |
| is_published | BOOLEAN | 发布状态 |
| published_at | DATETIME | 发布时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 最后更新时间 |

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎贡献！请随时提交 Pull Request。
