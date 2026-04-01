package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

// StringArray is a custom type for storing string slices as JSON in MySQL
type StringArray []string

// Value implements driver.Valuer for database storage
func (s StringArray) Value() (driver.Value, error) {
	if s == nil {
		return nil, nil
	}
	return json.Marshal(s)
}

// Scan implements sql.Scanner for database retrieval
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = nil
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, s)
}

// Article GORM model
type Article struct {
	ID           uint64      `gorm:"primaryKey;autoIncrement" json:"id"`
	Slug         string      `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`
	Title        string      `gorm:"type:varchar(255);not null" json:"title"`
	Excerpt      string      `gorm:"type:text;not null" json:"excerpt"`
	Content      string      `gorm:"type:longtext;not null" json:"content"`
	CoverImage   *string     `gorm:"type:varchar(500)" json:"coverImage"`
	AuthorName   string      `gorm:"type:varchar(100);not null" json:"-"`
	AuthorAvatar *string     `gorm:"type:varchar(500)" json:"-"`
	AuthorBio    *string     `gorm:"type:varchar(500)" json:"-"`
	Tags         StringArray `gorm:"type:json" json:"tags"`
	Category     string      `gorm:"type:varchar(100);default:'uncategorized'" json:"category"`
	ReadingTime  int         `gorm:"type:int unsigned;default:5" json:"readingTime"`
	IsPublished  bool        `gorm:"default:false" json:"-"`
	PublishedAt  *time.Time  `gorm:"type:datetime" json:"publishedAt"`
	CreatedAt    time.Time   `gorm:"autoCreateTime" json:"-"`
	UpdatedAt    time.Time   `gorm:"autoUpdateTime" json:"-"`
}

// TableName specifies the table name for GORM
func (Article) TableName() string {
	return "articles"
}

// Author struct for JSON response (matches frontend Author interface)
type Author struct {
	Name   string  `json:"name"`
	Avatar *string `json:"avatar,omitempty"`
	Bio    *string `json:"bio,omitempty"`
}

// ArticleResponse matches frontend Article type
type ArticleResponse struct {
	ID          string   `json:"id"`
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Excerpt     string   `json:"excerpt"`
	Content     string   `json:"content"`
	CoverImage  *string  `json:"coverImage,omitempty"`
	Author      Author   `json:"author"`
	PublishedAt string   `json:"publishedAt"`
	UpdatedAt   *string  `json:"updatedAt,omitempty"`
	ReadingTime int      `json:"readingTime"`
	Tags        []string `json:"tags"`
	Category    string   `json:"category"`
}

// ArticleSummaryResponse matches frontend ArticleSummary type
type ArticleSummaryResponse struct {
	ID          string   `json:"id"`
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Excerpt     string   `json:"excerpt"`
	CoverImage  *string  `json:"coverImage,omitempty"`
	PublishedAt string   `json:"publishedAt"`
	ReadingTime int      `json:"readingTime"`
	Tags        []string `json:"tags"`
	Category    string   `json:"category"`
}

// ToResponse converts Article model to ArticleResponse
func (a *Article) ToResponse() ArticleResponse {
	var updatedAt *string
	if !a.UpdatedAt.IsZero() && a.UpdatedAt.After(a.CreatedAt) {
		formatted := a.UpdatedAt.Format(time.RFC3339)
		updatedAt = &formatted
	}

	var publishedAt string
	if a.PublishedAt != nil {
		publishedAt = a.PublishedAt.Format(time.RFC3339)
	}

	return ArticleResponse{
		ID:         fmt.Sprintf("%d", a.ID),
		Slug:       a.Slug,
		Title:      a.Title,
		Excerpt:    a.Excerpt,
		Content:    a.Content,
		CoverImage: a.CoverImage,
		Author: Author{
			Name:   a.AuthorName,
			Avatar: a.AuthorAvatar,
			Bio:    a.AuthorBio,
		},
		PublishedAt: publishedAt,
		UpdatedAt:   updatedAt,
		ReadingTime: a.ReadingTime,
		Tags:        a.Tags,
		Category:    a.Category,
	}
}

// ToSummaryResponse converts Article model to ArticleSummaryResponse
func (a *Article) ToSummaryResponse() ArticleSummaryResponse {
	var publishedAt string
	if a.PublishedAt != nil {
		publishedAt = a.PublishedAt.Format(time.RFC3339)
	}

	return ArticleSummaryResponse{
		ID:          fmt.Sprintf("%d", a.ID),
		Slug:        a.Slug,
		Title:       a.Title,
		Excerpt:     a.Excerpt,
		CoverImage:  a.CoverImage,
		PublishedAt: publishedAt,
		ReadingTime: a.ReadingTime,
		Tags:        a.Tags,
		Category:    a.Category,
	}
}
