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

## Testing & Test Setup

### Why Automated Testing?
Automated tests ensure your core logic and UI components work as intended, catch regressions early, and provide confidence for refactoring and adding new features. This project uses unit tests for critical logic and React components, supporting robust, maintainable development.

### Frameworks Used
- **Jest**: JavaScript/TypeScript test runner and assertion library.
- **React Testing Library**: For testing React components in a way that simulates user interaction.
- **ts-jest**: TypeScript preprocessor for Jest.
- **identity-obj-proxy**: Stub CSS imports in tests.

### Setup
Testing dependencies are already included in `devDependencies`. If you need to reinstall:
```bash
npm install --save-dev jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy @babel/preset-env @babel/preset-react babel-jest
```

### Running Tests
To run all tests:
```bash
npx jest
```
Or add to your `package.json` scripts:
```json
"scripts": {
  "test": "jest"
}
```
Then run:
```bash
npm test
```

### What is Tested?
- **Critical logic functions** (e.g., volatility level calculation in `binance-api.ts`)
- **Core React components** (e.g., `CalendarCell`)
- Example edge cases and data scenarios

### Test File Examples
- `client/src/lib/date-utils.test.ts`: Tests volatility level logic using `BinanceAPI.calculateVolatilityLevel`.
- `client/src/components/calendar/CalendarCell.test.tsx`: Tests rendering, selection, and volatility class logic for a calendar cell.

### Configuration
- Jest is configured in `jest.config.cjs` to handle TypeScript, React, CSS modules, and aliases.
- Babel is used to support modern JS/JSX features if needed.

### Troubleshooting
If you see errors about JSX or TypeScript, ensure you have the correct dev dependencies and configuration files. See the comments in `jest.config.cjs` for more.


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
