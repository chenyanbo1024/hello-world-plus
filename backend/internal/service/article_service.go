package service

import (
	"context"
	"errors"

	"blog/internal/model"
	"blog/internal/repository"
)

// ArticleServiceInterface defines the interface for article business logic
type ArticleServiceInterface interface {
	GetAll(ctx context.Context, published *bool) ([]model.ArticleSummaryResponse, error)
	GetByID(ctx context.Context, id uint64) (*model.ArticleResponse, error)
	GetBySlug(ctx context.Context, slug string) (*model.ArticleResponse, error)
	Search(ctx context.Context, query string, page, limit int) (*model.SearchResponse, error)
}

// ArticleService implements ArticleServiceInterface
type ArticleService struct {
	repo repository.ArticleRepositoryInterface
}

// NewArticleService creates a new ArticleService
func NewArticleService(repo repository.ArticleRepositoryInterface) ArticleServiceInterface {
	return &ArticleService{repo: repo}
}

// GetAll retrieves all articles and returns them as summary responses
func (s *ArticleService) GetAll(ctx context.Context, published *bool) ([]model.ArticleSummaryResponse, error) {
	articles, err := s.repo.GetAll(ctx, published)
	if err != nil {
		return nil, err
	}

	summaries := make([]model.ArticleSummaryResponse, len(articles))
	for i, article := range articles {
		summaries[i] = article.ToSummaryResponse()
	}

	return summaries, nil
}

// GetByID retrieves a single article by ID
func (s *ArticleService) GetByID(ctx context.Context, id uint64) (*model.ArticleResponse, error) {
	article, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := article.ToResponse()
	return &response, nil
}

// GetBySlug retrieves a single article by slug
func (s *ArticleService) GetBySlug(ctx context.Context, slug string) (*model.ArticleResponse, error) {
	article, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	if article == nil {
		return nil, errors.New("article not found")
	}

	response := article.ToResponse()
	return &response, nil
}

// Search searches articles by query with pagination
func (s *ArticleService) Search(ctx context.Context, query string, page, limit int) (*model.SearchResponse, error) {
	articles, total, err := s.repo.Search(ctx, query, page, limit)
	if err != nil {
		return nil, err
	}

	summaries := make([]model.ArticleSummaryResponse, len(articles))
	for i, article := range articles {
		summaries[i] = article.ToSummaryResponse()
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	return &model.SearchResponse{
		Data: summaries,
		Meta: model.SearchMeta{
			Query:      query,
			Total:      total,
			Page:       page,
			Limit:      limit,
			TotalPages: totalPages,
		},
	}, nil
}
