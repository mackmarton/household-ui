# 🏠 Household Management Application

A modern, full-stack household management system built with Next.js and Spring Boot. Manage recipes, shopping lists, dishwashing schedules, and more - all in one convenient application.

![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Supported-blue?style=flat-square&logo=docker)

## ✨ Features

- 🍳 **Recipe Management** - Add, edit, and organize your favorite recipes
- 🛒 **Smart Shopping Cart** - Automatically generate shopping lists from recipes
- 🍽️ **Dishwashing Scheduler** - Track and manage dishwashing duties
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌐 **Multilingual** - Hungarian language support
- 🔒 **Production Ready** - Docker deployment with Nginx reverse proxy

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL database

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd household-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.production .env.local
   # Edit .env.local with your development settings
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Production Deployment

### Docker Deployment (Recommended)

1. **Update environment variables**
   ```bash
   # Edit .env.production with your production settings
   DATASOURCE_PASSWORD=your_actual_password
   DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/household
   ```

2. **Deploy with Docker Compose**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Access your application**
   - Main Application: `http://your-server:8090`
   - API Documentation: `http://your-server:8090/api`

### System Service Setup

For automatic startup with your Linux server:

```bash
chmod +x setup-systemd.sh
sudo ./setup-systemd.sh
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Next.js UI    │    │  Spring Boot    │
│    Port 8090    │◄──►│    Port 3000    │◄──►│   Port 8081     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   PostgreSQL    │
                                               │    Database     │
                                               └─────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 15.4.4 with App Router
- React 19.1.0 with TypeScript
- Tailwind CSS v4
- React Hook Form with Zod validation
- Axios for API communication

**Backend:**
- Spring Boot (separate repository)
- PostgreSQL database
- RESTful API design

**Infrastructure:**
- Docker & Docker Compose
- Nginx reverse proxy
- Systemd service management

## 📱 Application Modules

### 🍳 Recipes
- Create and edit recipes with ingredients
- Manage recipe availability and shopping status
- Weight-based ingredient tracking

### 🛒 Shopping Cart
- Automatic list generation from recipes
- Manual item addition with instant cart updates
- Real-time availability tracking

### 🍽️ Dishwashing
- Schedule and track dishwashing duties
- Household member management

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── recipes/           # Recipe management
│   ├── shopping-cart/     # Shopping list functionality
│   └── dishwashing/       # Dishwashing scheduler
├── components/            # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API client
└── types/                # TypeScript type definitions
```

### API Integration

The application communicates with a Spring Boot backend through a well-defined REST API. See `household-swagger.json` for complete API documentation.

## 🐛 Service Management

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Systemd Commands (Production)
```bash
# Start service
sudo systemctl start household-app

# Check status
sudo systemctl status household-app

# View logs
sudo journalctl -u household-app -f

# Restart service
sudo systemctl restart household-app
```

## 🔒 Environment Configuration

### Required Environment Variables

```bash
# Database Configuration
DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/household
DATASOURCE_PASSWORD=your_database_password

# Application Configuration
SERVER_PORT=8081
SPRING_PROFILES_ACTIVE=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8090
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the application logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Check systemd service status: `sudo systemctl status household-app`

---

**Built with ❤️ for efficient household management**
