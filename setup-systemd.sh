#!/bin/bash

# Household App System Startup Setup Script
set -e

echo "🏠 Setting up Household App for system startup..."

# Configuration
APP_DIR="/opt/household-app"
SERVICE_NAME="household-app"
CURRENT_USER=$(whoami)

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root or with sudo"
    echo "Usage: sudo ./setup-systemd.sh"
    exit 1
fi

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

# Create application directory
echo "📁 Creating application directory at $APP_DIR..."
mkdir -p $APP_DIR

# Copy application files
echo "📋 Copying application files..."
cp -r ./* $APP_DIR/
chown -R $CURRENT_USER:docker $APP_DIR

# Make deploy script executable
chmod +x $APP_DIR/deploy.sh

# Copy systemd service file
echo "⚙️  Installing systemd service..."
cp household-app.service /etc/systemd/system/

# Reload systemd daemon
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload

# Enable the service to start on boot
echo "🚀 Enabling service to start on boot..."
systemctl enable $SERVICE_NAME

# Start the service now
echo "▶️  Starting the service..."
systemctl start $SERVICE_NAME

# Check service status
echo "📊 Checking service status..."
systemctl status $SERVICE_NAME --no-pager

echo ""
echo "✅ Setup complete!"
echo ""
echo "Service commands:"
echo "  Start:   sudo systemctl start $SERVICE_NAME"
echo "  Stop:    sudo systemctl stop $SERVICE_NAME"
echo "  Restart: sudo systemctl restart $SERVICE_NAME"
echo "  Status:  sudo systemctl status $SERVICE_NAME"
echo "  Logs:    sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "🌍 Application will be available at: http://your-server-ip:8090"
echo ""
echo "Note: Make sure to update .env.production with your actual database password!"
