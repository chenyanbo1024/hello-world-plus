package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort    string
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	CORSOrigins   string
	SwaggerUser   string
	SwaggerPass   string
}

var AppConfig *Config

func LoadConfig() error {
	// Load .env file if exists
	godotenv.Load()

	AppConfig = &Config{
		ServerPort:   getEnv("SERVER_PORT", "8080"),
		DBHost:       getEnv("DB_HOST", "localhost"),
		DBPort:       getEnv("DB_PORT", "3306"),
		DBUser:       getEnv("DB_USER", "root"),
		DBPassword:   getEnv("DB_PASSWORD", ""),
		DBName:       getEnv("DB_NAME", "blog_db"),
		CORSOrigins:  getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173"),
		SwaggerUser:  getEnv("SWAGGER_USERNAME", "admin"),
		SwaggerPass:  getEnv("SWAGGER_PASSWORD", ""),
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
