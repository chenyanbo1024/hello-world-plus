package repository

import (
	"context"

	"gorm.io/gorm"

	"blog/internal/model"
)

// ArticleRepositoryInterface defines the interface for article data access
type ArticleRepositoryInterface interface {
	GetAll(ctx context.Context, published *bool) ([]model.Article, error)
	GetByID(ctx context.Context, id uint64) (*model.Article, error)
	GetBySlug(ctx context.Context, slug string) (*model.Article, error)
}

// ArticleRepository implements ArticleRepositoryInterface
type ArticleRepository struct {
	db *gorm.DB
}

// NewArticleRepository creates a new ArticleRepository
func NewArticleRepository(db *gorm.DB) ArticleRepositoryInterface {
	return &ArticleRepository{db: db}
}

// GetAll retrieves all articles, optionally filtered by publication status
func (r *ArticleRepository) GetAll(ctx context.Context, published *bool) ([]model.Article, error) {
	var articles []model.Article

	query := r.db.WithContext(ctx)

	if published != nil {
		query = query.Where("is_published = ?", *published)
	}

	err := query.Order("published_at DESC").Find(&articles).Error
	if err != nil {
		return nil, err
	}

	return articles, nil
}

// GetByID retrieves a single article by its ID
func (r *ArticleRepository) GetByID(ctx context.Context, id uint64) (*model.Article, error) {
	var article model.Article

	err := r.db.WithContext(ctx).First(&article, id).Error
	if err != nil {
		return nil, err
	}

	return &article, nil
}

// GetBySlug retrieves a single article by its slug
func (r *ArticleRepository) GetBySlug(ctx context.Context, slug string) (*model.Article, error) {
	var article model.Article

	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&article).Error
	if err != nil {
		return nil, err
	}

	return &article, nil
}
