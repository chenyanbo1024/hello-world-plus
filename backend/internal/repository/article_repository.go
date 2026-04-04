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
	Search(ctx context.Context, query string, page, limit int) ([]model.Article, int64, error)
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

// Search retrieves articles matching the search query with pagination
func (r *ArticleRepository) Search(ctx context.Context, query string, page, limit int) ([]model.Article, int64, error) {
	var articles []model.Article
	var total int64

	searchPattern := "%" + query + "%"

	db := r.db.WithContext(ctx).Model(&model.Article{}).
		Where("is_published = ?", true).
		Where("title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ? OR category LIKE ? OR author_name LIKE ?",
			searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := db.Order("published_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&articles).Error; err != nil {
		return nil, 0, err
	}

	return articles, total, nil
}
