package handler

import (
	"log"

	"github.com/gin-gonic/gin"
)

// respondError logs the internal error and returns a generic message to client
func respondError(c *gin.Context, status int, message string, err error) {
	if err != nil {
		log.Printf("[ERROR] %s: %v", message, err)
	}
	c.JSON(status, gin.H{"error": message})
}
