# Market Seasonality Explorer

A sophisticated React application for visualizing cryptocurrency market data through an interactive calendar interface with dark theme, CodeCraft-inspired gradients, and real-time WebSocket connections.

## Features

- 📊 **Interactive Calendar**: Daily, weekly, and monthly views with market indicators
- 🔄 **Real-time Data**: Live WebSocket connection to Binance API
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Dark Theme**: CodeCraft-inspired gradient styling with smooth animations
- ⚡ **Performance**: Optimized with React Query and efficient data caching
- 🎯 **Accessibility**: Keyboard navigation and screen reader support

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd market-seasonality-explorer
   npm install
   npm install --save-dev cross-env
   update your package.json with - "dev": "cross-env NODE_ENV=development tsx server/index.ts",
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`


### Production Build

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NODE_ENV=development
HOST=localhost
PORT=3000
VITE_API_URL=http://localhost:3001/api
```

### Available Scripts

- `npm run dev` - Start full-stack development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

## Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: TanStack Query, Custom hooks
- **Backend**: Express.js, TypeScript
- **Real-time**: WebSocket connections
- **Data**: Binance API integration

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Application pages
│   │   └── types/          # TypeScript type definitions
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
└── attached_assets/        # Static assets
```

## API Integration

### Binance WebSocket

The application connects to Binance's public WebSocket API for real-time market data:

- **Ticker Data**: 24hr ticker statistics
- **Kline Data**: Historical price data
- **Supported Symbols**: BTC/USDT, ETH/USDT, ADA/USDT, SOL/USDT

### Data Processing

Market data is processed to calculate:
- **Volatility Levels**: Low (<2%), Medium (2-5%), High (>5%)
- **Performance Indicators**: Price change percentages
- **Liquidity Metrics**: Trading volume analysis

## Calendar Views

### Daily View
Traditional month calendar with detailed market indicators on each date.

### Weekly View
Week-by-week organization for pattern analysis and trend identification.

### Monthly View
Aggregated statistics for each month with overview cards showing:
- Average volatility levels
- Performance summaries
- Total trading volumes
- Trading day counts

## Visual Indicators

### Volatility Symbols
- 🟢 Circle: Low volatility (<2%)
- 🟡 Lightning: Medium volatility (2-5%)
- 🔴 Activity: High volatility (>5%)

### Performance Symbols
- 📈 Trending Up: Strong positive (>2%)
- 📉 Arrow Down: Strong negative (<-2%)
- ⚫ Dot: Neutral (-2% to 2%)

### Liquidity Indicators
- • Single dot: Low volume (<$100M)
- •• Double dots: Medium volume ($100M-$1B)
- ••• Triple dots: High volume (>$1B)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.