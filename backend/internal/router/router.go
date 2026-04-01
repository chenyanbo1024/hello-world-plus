package router

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"blog/internal/handler"
	"blog/internal/middleware"
)

// SetupRouter creates and configures the Gin router
func SetupRouter(corsOrigins string) *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(middleware.CORS(corsOrigins))

	// Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		articles := v1.Group("/articles")
		{
			articles.GET("", handler.GetArticles)
			articles.GET("/slug/:slug", handler.GetArticleBySlug)
			articles.GET("/:id", handler.GetArticleByID)
		}
	}

	return r
}
