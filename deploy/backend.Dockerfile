# Stage 1: Build
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files first for better caching
COPY go.mod go.sum ./
ENV GOPROXY=https://goproxy.cn,direct
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o bin/server cmd/server/main.go

# Stage 2: Runtime
FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata

# Set timezone to China
ENV TZ=Asia/Shanghai

# Copy binary and docs from builder
COPY --from=builder /app/bin/server .
COPY --from=builder /app/docs ./docs

# Expose port
EXPOSE 8080

# Run
CMD ["./server"]
