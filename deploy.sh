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
    echo "⚠️  No .env.production file found. Creating default one..."
    cat > .env.production << EOF
# Production Environment Variables
# PostgreSQL running on localhost (same machine as Docker)
DATASOURCE_PASSWORD=your_database_password
DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/household
EOF
    echo "❗ Please update .env.production with your actual database password before deploying!"
fi

# Build the frontend
echo "🔨 Building Next.js frontend..."
docker-compose build frontend

# Pull/Build backend - Skip if image doesn't exist
echo "🔨 Preparing Spring backend..."
if docker images | grep -q "household-backend"; then
    echo "✅ Spring backend image found"
else
    echo "⚠️  Spring backend image not found. Please build it first:"
    echo "    docker build -t household-backend:latest /path/to/your/spring/app"
    echo "    Or provide the image via docker pull if it's in a registry"
    echo "🚀 Continuing with frontend-only deployment..."
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Clean up any orphaned containers that might be using the ports
echo "🧹 Cleaning up any conflicting containers..."
docker container prune -f
docker network prune -f

# Remove any containers that might be using our ports
echo "🔍 Checking for port conflicts..."
CONFLICTING_CONTAINERS=$(docker ps -q --filter "publish=3000" --filter "publish=8081" --filter "publish=8090")
if [ ! -z "$CONFLICTING_CONTAINERS" ]; then
    echo "⚠️  Found containers using our ports. Stopping them..."
    docker stop $CONFLICTING_CONTAINERS
    docker rm $CONFLICTING_CONTAINERS
fi

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
