# Market Seasonality Explorer

A sophisticated React application for visualizing cryptocurrency market data through an interactive calendar interface with dark theme, CodeCraft-inspired gradients, and real-time WebSocket connections.

## Features

### Core Features (Implemented)
- 📊 **Interactive Calendar**: Daily, weekly, and monthly views with smooth transitions and market indicators
- 🔄 **Real-time Data**: Live WebSocket connection to Binance API for orderbook and price data
- 🟢🟡🔴 **Volatility Heatmap**: Calendar cells color-coded by volatility (Low/Medium/High)
- 💧 **Liquidity Indicators**: Volume and liquidity visualized using dots/bars in calendar cells
- 📈📉 **Performance Metrics**: Price change and returns visualized with up/down/neutral indicators
- 🗓️ **Multi-Timeframe Support**: Switch between daily, weekly, and monthly aggregation
- 🖱️ **Interactive Features**: Hover tooltips, click for detail, date range selection, filters, and zoom
- 🧑‍💻 **Keyboard Navigation**: Full arrow/enter/escape navigation support
- 🧩 **Data Dashboard Panel**: Detailed info panel for selected dates/periods (OHLC, volume, volatility, benchmarks, technicals)
- 📱 **Responsive Design**: Fully touch-friendly and optimized for mobile/tablet/desktop
- ♿ **Accessibility**: Keyboard navigation and screen reader support

### Bonus/Advanced Features
- 📤 **Export Functionality**: Export calendar data as CSV (PDF/Image: see below)
- 🎨 **Custom Color Schemes**: Default, high contrast, and colorblind-friendly themes
- ⚖️ **Data Comparison**: Side-by-side comparison of different symbols or time periods
- 🚨 **Alert System**: Set alerts for volatility/performance thresholds
- 🔍 **Historical Patterns**: Highlight recurring patterns and anomalies (statistical detection)
- 🔄 **Integration Ready**: Modular for future API/data integration
- 🌀 **Animation Effects**: Smooth transitions and UI feedback

#### Export Notes
- CSV export is fully supported and downloadable.
- PDF/Image export options are present but may not trigger a download in all browsers. If you need these, check for DOM element `calendar-export-root` or use CSV for best compatibility.

## Local Development Setup

### Prerequisites

- **Node.js 18+** and npm (required for both client and server)
- **Modern web browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- (Optional) [Git](https://git-scm.com/) for cloning

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd MarketSeasonalityExplorer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm install --save-dev cross-env
   ```
   > Ensure your `package.json` includes:
   > ```json
   > "dev": "cross-env NODE_ENV=development tsx server/index.ts",
   > ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local as needed (see below for variables)
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5000](or as configured).


### Production Build

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:
The `.env.local` should never be commited on environment with API keys or sensitive data.

```env
NODE_ENV=development
HOST=localhost
PORT=3000
VITE_API_URL=http://localhost:3001/api
```

### Available Scripts

- `npm run dev` — Start full-stack development server (client + API)
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run check` — TypeScript type checking

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

### Binance WebSocket & REST API
- **Orderbook Data**: Real-time via Binance WebSocket
- **Ticker/Kline Data**: Historical and real-time price/volume/volatility
- **Supported Symbols**: BTC/USDT, ETH/USDT, ADA/USDT, SOL/USDT (expandable)

### Data Processing
- **Volatility Levels**: Low (<2%), Medium (2-5%), High (>5%)
- **Performance Indicators**: Price change % and direction
- **Liquidity Metrics**: Volume and orderbook depth
- **Anomaly Detection**: Statistical outlier and recurrence detection

## Calendar & Dashboard Views

### Daily View
- Traditional calendar grid with detailed market indicators for each day
- Intraday volatility, volume, and performance shown per cell

### Weekly View
- Aggregated weekly summaries: average volatility, total volume, performance

### Monthly View
- Monthly overview: trends, liquidity patterns, performance highlights

### Dashboard Panel
- Detailed stats (OHLC, volume, volatility, technicals, benchmarks) for selected date/range
- Quick stats and anomaly/alert highlights

## Visual Indicators & Themes

### Volatility
- 🟢 Circle: Low (<2%)
- 🟡 Lightning: Medium (2-5%)
- 🔴 Activity: High (>5%)

### Performance
- 📈 Up: Strong positive (>2%)
- 📉 Down: Strong negative (<-2%)
- ⚫ Dot: Neutral (-2% to 2%)

### Liquidity
- •, ••, •••: Low/Medium/High volume

### Color Schemes
- Default, High Contrast, Colorblind Friendly (toggle in UI)

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

---


## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.
