package main

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"blog/internal/config"
	_ "blog/docs/swagger"
	"blog/internal/handler"
	"blog/internal/repository"
	"blog/internal/router"
	"blog/internal/service"
)

// @title           Blog API
// @version         1.0
// @description     A personal blog system API built with Go and Gin
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.email  support@blog.example.com

// @license.name  MIT
// @license.url   https://opensource.org/licenses/MIT

// @host      localhost:8080
// @BasePath  /api/v1
func main() {
	// Load configuration
	if err := config.LoadConfig(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database connection
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.AppConfig.DBUser,
		config.AppConfig.DBPassword,
		config.AppConfig.DBHost,
		config.AppConfig.DBPort,
		config.AppConfig.DBName,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connected successfully")

	// Initialize layers (dependency injection)
	articleRepo := repository.NewArticleRepository(db)
	articleSvc := service.NewArticleService(articleRepo)
	handler.InitArticleService(articleSvc)

	// Setup router
	r := router.SetupRouter(config.AppConfig.CORSOrigins)

	// Start server
	serverAddr := ":" + config.AppConfig.ServerPort
	log.Printf("Server starting on %s", serverAddr)
	log.Printf("Swagger documentation available at http://localhost:%s/swagger/index.html", config.AppConfig.ServerPort)

	if err := r.Run(serverAddr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
