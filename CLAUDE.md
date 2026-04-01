# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog system with a React frontend and Go backend, focused on AI/ML technical content.

## Development Commands

### Frontend (in `frontend/`)

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (in `backend/`)

```bash
make run     # Run the server directly
make build   # Build binary to bin/server
make test    # Run Go tests
make swag    # Regenerate Swagger docs
make dev     # Regenerate Swagger and run server
```

## Architecture

### Frontend Stack
- **React 19** with TypeScript, Vite 8, Tailwind CSS 4
- **React Router** for routing: `/` (home), `/article/:slug` (detail), `/about`
- **API Layer**: Service interfaces (`IArticleService`, `IProfileService`) with real implementations calling `/api/v1/*`
- **Vite proxy** forwards `/api` requests to backend at `localhost:8080`

### Backend Stack
- **Go 1.22** with Gin framework, GORM ORM, MySQL database
- **Swagger** docs at `/swagger/index.html`
- **Layered Architecture**:
  - `cmd/server/main.go` - Entry point, wires dependencies
  - `internal/handler/` - HTTP handlers
  - `internal/service/` - Business logic interfaces and implementations
  - `internal/repository/` - Data access interfaces and implementations
  - `internal/model/` - GORM models and response DTOs
  - `internal/middleware/` - CORS middleware
  - `internal/router/` - Route definitions

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/articles` | List articles (?published=true/false) |
| GET | `/api/v1/articles/:id` | Get article by ID |
| GET | `/api/v1/articles/slug/:slug` | Get article by slug |
| GET | `/health` | Health check |

### Data Flow

1. Frontend service calls (e.g., `articleService.getAll()`)
2. Vite proxy forwards to backend
3. Handler receives request, calls service
4. Service applies business logic, calls repository
5. Repository queries MySQL via GORM
6. Response flows back through layers

## Environment Setup

Backend requires a MySQL database. Copy `backend/.env.example` to `backend/.env` and configure:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `SERVER_PORT` (default: 8080)
- `CORS_ALLOWED_ORIGINS` (default: http://localhost:5173)

Initialize the database with `backend/scripts/init.sql`.
