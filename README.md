[中文](README.zh-CN.md) | **English**

# Personal Blog System

A full-stack personal blog system for AI/ML technical content, built with React and Go.

## Features

- 📝 Article management with Markdown support
- 🔍 Full-text search functionality
- 📖 Table of contents navigation
- 🌙 Dark/Light theme toggle
- 📱 Responsive design
- 🔗 SEO-friendly URLs (slug-based)
- 🚀 Fast and modern tech stack
- 🐳 Docker deployment ready

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 8** for fast development and building
- **Tailwind CSS 4** for styling
- **React Router 7** for routing
- **date-fns** for date formatting

### Backend
- **Go 1.22** with Gin framework
- **GORM** for MySQL ORM
- **Swagger** for API documentation
- **Layered architecture** (Handler → Service → Repository)

### Infrastructure
- **MySQL 5.7** for data persistence
- **Nginx** for serving frontend and reverse proxy
- **Docker Compose** for container orchestration

## Project Structure

```
.
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # UI components (Card, Tag, Modal, etc.)
│   │   │   ├── features/   # Domain components (ArticleCard, etc.)
│   │   │   └── layout/     # Layout components (Header, Footer)
│   │   ├── contexts/       # React contexts (Theme)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── services/       # API service layer
│   └── package.json
├── backend/                 # Go backend application
│   ├── cmd/server/         # Entry point
│   ├── internal/
│   │   ├── config/         # Configuration management
│   │   ├── handler/        # HTTP handlers
│   │   ├── middleware/     # HTTP middleware
│   │   ├── model/          # GORM models
│   │   ├── repository/     # Data access layer
│   │   ├── router/         # Route definitions
│   │   └── service/        # Business logic layer
│   ├── scripts/            # Database initialization
│   ├── docs/swagger/       # Generated Swagger docs
│   ├── Makefile
│   └── go.mod
└── deploy/                  # Deployment configurations
    ├── docker-compose.yml
    ├── frontend.Dockerfile
    ├── backend.Dockerfile
    └── nginx.conf
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Go 1.22+
- MySQL 5.7+
- Docker and Docker Compose (optional)

### Local Development

#### 1. Clone the repository

```bash
git clone <repository-url>
cd hello-world-plus
```

#### 2. Setup Backend

```bash
# Create MySQL database
mysql -u root -p < backend/scripts/init.sql

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Run backend
cd backend
make run
```

The backend server will start at `http://localhost:8080`
Swagger API docs available at `http://localhost:8080/swagger/index.html`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

### Docker Deployment

```bash
# Create environment file
cp backend/.env.example .env
# Edit .env with your desired configuration

# Start all services
docker-compose -f deploy/docker-compose.yml up -d
```

The application will be available at `http://localhost`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/articles` | List articles (supports `?published=true/false`) |
| GET | `/api/v1/articles/:id` | Get article by ID |
| GET | `/api/v1/articles/slug/:slug` | Get article by slug |
| GET | `/api/v1/articles/search` | Search articles (`?q=keyword&page=1&limit=10`) |

## Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Article list with pagination |
| `/article/:slug` | ArticleDetailPage | Full article content with TOC |
| `/about` | AboutPage | About author page |
| `/search` | SearchPage | Search articles |

## Development Commands

### Frontend (in `frontend/`)

```bash
npm run dev      # Start development server
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (in `backend/`)

```bash
make run     # Run server directly
make build   # Build binary to bin/server
make test    # Run Go tests
make swag    # Regenerate Swagger docs
make dev     # Regenerate Swagger and run server
```

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | `8080` |
| `GIN_MODE` | Gin mode (debug/release) | `debug` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | `blog_db` |
| `CORS_ALLOWED_ORIGINS` | CORS origins | `http://localhost:5173` |

## Architecture Highlights

### Backend Architecture

The backend follows a clean layered architecture:

1. **Handler Layer** - HTTP request handling and validation
2. **Service Layer** - Business logic implementation
3. **Repository Layer** - Database operations
4. **Model Layer** - Data structures with GORM

Dependency injection is used to connect layers, making the code testable and maintainable.

### Frontend Architecture

The frontend uses a component-based architecture:

- **Common Components** - Reusable UI elements (Button, Card, Tag, etc.)
- **Feature Components** - Domain-specific components (ArticleCard, ArticleList, etc.)
- **Layout Components** - Page structure (Header, Footer, Layout)
- **Service Interfaces** - API abstraction with mock support

## Database Schema

### Articles Table

| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT | Primary key |
| slug | VARCHAR(255) | URL-friendly identifier (unique) |
| title | VARCHAR(255) | Article title |
| excerpt | TEXT | Short description |
| content | LONGTEXT | Full article content |
| cover_image | VARCHAR(500) | Cover image URL |
| author_name | VARCHAR(100) | Author name |
| author_avatar | VARCHAR(500) | Author avatar URL |
| author_bio | VARCHAR(500) | Author biography |
| tags | JSON | Array of tags |
| category | VARCHAR(100) | Article category |
| reading_time | INT | Estimated reading time (minutes) |
| is_published | BOOLEAN | Publication status |
| published_at | DATETIME | Publication timestamp |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
