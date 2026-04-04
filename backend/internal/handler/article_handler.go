package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	_ "blog/internal/model"
	"blog/internal/service"
)

var articleService service.ArticleServiceInterface

// InitArticleService initializes the article service
func InitArticleService(svc service.ArticleServiceInterface) {
	articleService = svc
}

// GetArticles godoc
// @Summary      Get article list
// @Description  Get all articles with optional filter by publication status
// @Tags         articles
// @Accept       json
// @Produce      json
// @Param        published  query     bool  false  "Filter by published status"
// @Success      200        {array}   model.ArticleSummaryResponse
// @Failure      500        {object}  map[string]string
// @Router       /api/v1/articles [get]
func GetArticles(c *gin.Context) {
	publishedStr := c.Query("published")

	var published *bool
	if publishedStr != "" {
		val, err := strconv.ParseBool(publishedStr)
		if err == nil {
			published = &val
		}
	}

	articles, err := articleService.GetAll(c.Request.Context(), published)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, articles)
}

// GetArticleByID godoc
// @Summary      Get article by ID
// @Description  Get a single article by its numeric ID
// @Tags         articles
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "Article ID"
// @Success      200  {object}  model.ArticleResponse
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Router       /api/v1/articles/{id} [get]
func GetArticleByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article ID"})
		return
	}

	article, err := articleService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}

	c.JSON(http.StatusOK, article)
}

// GetArticleBySlug godoc
// @Summary      Get article by slug
// @Description  Get a single article by its URL-friendly slug
// @Tags         articles
// @Accept       json
// @Produce      json
// @Param        slug  path      string  true  "Article slug"
// @Success      200   {object}  model.ArticleResponse
// @Failure      404   {object}  map[string]string
// @Router       /api/v1/articles/slug/{slug} [get]
func GetArticleBySlug(c *gin.Context) {
	slug := c.Param("slug")

	article, err := articleService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}

	c.JSON(http.StatusOK, article)
}

// SearchArticles godoc
// @Summary      Search articles
// @Description  Search articles by keyword in title, excerpt, content, tags, and category
// @Tags         articles
// @Accept       json
// @Produce      json
// @Param        q     query     string  true   "Search keyword"
// @Param        page  query     int     false  "Page number"  default(1)
// @Param        limit query     int     false  "Items per page"  default(10)
// @Success      200   {object}  model.SearchResponse
// @Failure      400   {object}  map[string]string
// @Failure      500   {object}  map[string]string
// @Router       /api/v1/articles/search [get]
func SearchArticles(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "search query is required"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	result, err := articleService.Search(c.Request.Context(), query, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
