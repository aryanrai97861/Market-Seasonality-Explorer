# Market Seasonality Explorer

## Overview

This is a React application for visualizing financial market data through an interactive calendar interface. The application displays historical volatility, liquidity, and performance data across different time periods (daily, weekly, monthly) for cryptocurrency pairs, specifically designed for analyzing market seasonality patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between frontend, backend, and shared components:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, custom hooks for local state
- **API Integration**: Binance API for real-time cryptocurrency data

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animation**: Framer Motion for smooth transitions and interactions
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack React Query for caching and synchronization

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Development Setup**: Vite integration for hot module replacement
- **Database ORM**: Drizzle with PostgreSQL
- **Session Storage**: PostgreSQL-based session store

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Market Data Table**: Comprehensive market metrics including OHLCV data, volatility, liquidity, and performance indicators

## Data Flow

1. **External API Integration**: Binance API provides real-time and historical cryptocurrency data
2. **Data Processing**: Backend processes raw market data to calculate volatility levels, performance metrics, and liquidity indicators
3. **Calendar Visualization**: Frontend displays processed data in an interactive calendar format with color-coded volatility levels
4. **User Interactions**: Calendar cells respond to hover/click events, showing detailed tooltips and panels

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon serverless
- **UI Framework**: Radix UI primitives for accessible components
- **Animation**: Framer Motion for smooth user interactions
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod for schema validation
- **HTTP Client**: Native fetch API for external API calls

### External APIs
- **Binance API**: Free public API for cryptocurrency market data
  - Historical price data (candlestick/kline data)
  - 24-hour ticker statistics
  - Real-time price updates

## Deployment Strategy

The application is configured for deployment with the following considerations:

1. **Build Process**: 
   - Frontend built with Vite to `dist/public`
   - Backend compiled with esbuild to `dist/index.js`

2. **Environment Configuration**:
   - Development mode uses Vite dev server with HMR
   - Production serves static files through Express

3. **Database Setup**:
   - Drizzle migrations in `migrations/` directory
   - Database URL configured via environment variables
   - PostgreSQL dialect with connection pooling

4. **Static Assets**: 
   - Client assets served from `dist/public`
   - Development assets served through Vite middleware

The application prioritizes user experience with smooth animations, responsive design, and real-time data updates while maintaining a clean, accessible interface for exploring market seasonality patterns.

## Recent Changes

### July 23, 2025
- Added real-time WebSocket connection status indicator in the header with live/offline status
- Created comprehensive SymbolLegend component explaining all visual indicators:
  - Volatility indicators (low/medium/high with color coding)
  - Performance indicators (positive/negative/neutral trends)  
  - Liquidity indicators (volume levels with dot patterns)
- Enhanced header with connection status showing current trading pair and connectivity
- Improved keyboard navigation hints and user guidance
- Implemented Framer Motion animations throughout the legend for smooth user interactions