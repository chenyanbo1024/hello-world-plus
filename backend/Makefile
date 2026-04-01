.PHONY: run build test swag dev

run:
	go run cmd/server/main.go

build:
	go build -o bin/server cmd/server/main.go

test:
	go test ./...

swag:
	swag init -g cmd/server/main.go -o docs/swagger

dev: swag run
