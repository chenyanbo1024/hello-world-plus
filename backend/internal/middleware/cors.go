package middleware

import (
	"github.com/gin-gonic/gin"
)

// CORS returns a middleware that handles Cross-Origin Resource Sharing
func CORS(allowedOrigins string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set CORS headers
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigins)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		// Handle preflight requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
