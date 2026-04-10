# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog system with React frontend and Go backend for AI/ML technical content.

## Development Commands

### Frontend (in `frontend/`)

```bash
npm run dev      # Start dev server (port 5173)
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

### Docker Deployment (in `deploy/`)

```bash
docker-compose -f deploy/docker-compose.yml up -d
```

## Architecture

### Frontend Stack
- **React 19** with TypeScript, Vite 8, Tailwind CSS 4
- **React Router**: `/` (home), `/article/:slug` (detail), `/about`, `/search`
- **API Layer**: Service interfaces (`IArticleService`, `IProfileService`) - articles use real API, profile uses mock data
- **Vite proxy** forwards `/api` to `localhost:8080`
- **Component Patterns**:
  - `src/components/common/` - Reusable UI (Card, Tag, SearchModal, ThemeToggle, BackToTop, LoadingSpinner)
  - `src/components/features/` - Domain components (ArticleCard, ArticleList, ArticleContent, TableOfContents, ProfileCard)
  - `src/components/layout/` - Layout (Header, Footer, Layout)
  - `src/hooks/` - Custom hooks with barrel export in `index.ts`

### Backend Stack
- **Go 1.22** with Gin, GORM, MySQL
- **Swagger** at `/swagger/index.html`
- **Layered Architecture**:
  - `cmd/server/main.go` - Entry point, dependency injection
  - `internal/handler/` - HTTP handlers
  - `internal/service/` - Business logic (interfaces + implementations)
  - `internal/repository/` - Data access (interfaces + implementations)
  - `internal/model/` - GORM models with `ToResponse()` / `ToSummaryResponse()` converters
  - `internal/middleware/` - CORS
  - `internal/router/` - Route definitions

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/articles` | List articles (?published=true/false) |
| GET | `/api/v1/articles/:id` | Get article by ID |
| GET | `/api/v1/articles/slug/:slug` | Get article by slug |
| GET | `/api/v1/articles/search` | Search (?q=keyword&page=1&limit=10) |
| GET | `/health` | Health check |

## Environment Setup

Backend requires MySQL. Copy `backend/.env.example` to `backend/.env`:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `SERVER_PORT` (default: 8080)
- `CORS_ALLOWED_ORIGINS` (default: http://localhost:5173)
- `SWAGGER_USERNAME`, `SWAGGER_PASSWORD` - Swagger Basic Auth credentials

Initialize database with `backend/scripts/init.sql`.
