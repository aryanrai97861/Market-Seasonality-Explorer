# Localhost Development Setup Guide

This guide will help you run the Market Seasonality Explorer on your local machine.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

## Setup Instructions

### 1. Environment Configuration

The application is already configured to support localhost development. The server will automatically detect the environment and adjust accordingly.

### 2. Current Configuration

The application is set up with the following localhost-friendly defaults:

**Server Configuration** (`server/index.ts`):
- Host: `localhost` (configurable via `HOST` environment variable)
- Port: `5000` (configurable via `PORT` environment variable)
- Development mode with hot reload support

**Environment Variables** (`.env.local`):
```env
NODE_ENV=development
HOST=localhost
PORT=3000
VITE_API_URL=http://localhost:3001/api
```

### 3. Running the Application

#### Option 1: Full-Stack Development (Recommended)
```bash
# This runs both frontend and backend together
npm run dev
```
Access the application at: `http://localhost:5000`

#### Option 2: Separate Frontend/Backend
If you want to run frontend and backend separately:

**Terminal 1 - Backend:**
```bash
HOST=localhost PORT=3001 npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`

### 4. Local Development Features

When running on localhost, you get:

✅ **Hot Module Replacement (HMR)**: Instant updates when you save files
✅ **Real-time WebSocket**: Live cryptocurrency data from Binance API
✅ **Development Logging**: Detailed console output for debugging
✅ **Source Maps**: Easy debugging in browser dev tools
✅ **TypeScript Checking**: Real-time type checking and error reporting

### 5. Accessing the Application

Once running, you can access:

- **Main Application**: `http://localhost:5000`
- **API Endpoints**: `http://localhost:5000/api`
- **WebSocket Connection**: Automatically handled by the application

### 6. Available API Endpoints

- `GET /api/health` - Health check
- `GET /api/market-data` - Market data for calendar
- WebSocket connections handled automatically

### 7. Troubleshooting

#### Port Already in Use
If port 5000 is already in use:
```bash
PORT=3000 npm run dev
```

#### Host Resolution Issues
If you have issues with localhost:
```bash
HOST=127.0.0.1 npm run dev
```

#### Clear Node Modules
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 8. Development Workflow

1. **Start the development server**: `npm run dev`
2. **Open your browser**: Navigate to `http://localhost:5000`
3. **Make changes**: Edit files in `client/src/` or `server/`
4. **See updates**: Changes appear automatically thanks to HMR
5. **Debug**: Use browser dev tools with source maps

### 9. Production Build (Local)

To test the production build locally:
```bash
npm run build
npm start
```

### 10. Network Access

To access the application from other devices on your network:
```bash
HOST=0.0.0.0 PORT=5000 npm run dev
```
Then access via your computer's IP address: `http://192.168.1.x:5000`

## Features Available in Localhost Mode

All features work identically in localhost mode:

- 📊 Interactive calendar with daily/weekly/monthly views
- 🔄 Real-time WebSocket data from Binance API
- 🎨 Full dark theme with CodeCraft gradients
- ⚡ Live market indicators and symbols
- 📱 Responsive design for all screen sizes
- ⌨️ Keyboard navigation support
- 🔍 Symbol legend and tooltips

## Next Steps

1. Explore the calendar views (Daily, Weekly, Monthly)
2. Try keyboard navigation with arrow keys
3. Check the WebSocket connection status in the header
4. Examine the symbol legend to understand market indicators
5. Test different cryptocurrency pairs (BTC, ETH, ADA, SOL)

Happy coding! 🚀