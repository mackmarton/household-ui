#!/bin/bash

# Household App Deployment Script
set -e

echo "🏠 Deploying Household Management App..."

# Configuration
BACKEND_IMAGE="household-backend:latest"

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Load production environment variables
if [ -f .env.production ]; then
    echo "📋 Loading production environment variables..."
    export $(cat .env.production | xargs)
else
    echo "⚠️  No .env.production file found. Using default values."
fi

# Build the frontend
echo "🔨 Building Next.js frontend..."
docker-compose build frontend

# Pull/Build backend (update this section based on how you build your Spring app)
echo "🔨 Preparing Spring backend..."
# If you have a Dockerfile for your Spring app:
docker build -t $BACKEND_IMAGE /path/to/your/spring/app

# If you're using a pre-built JAR:
# docker build -f backend.Dockerfile -t $BACKEND_IMAGE .

echo "⚠️  Make sure your Spring Boot backend image '$BACKEND_IMAGE' is available"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the application
echo "🚀 Starting the application..."
docker-compose --env-file .env.production up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "📊 Checking service status..."
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8081"
echo "🌍 Nginx Proxy: http://localhost:8090"

# Show logs for debugging
echo "📋 Recent logs:"
docker-compose logs --tail=50
