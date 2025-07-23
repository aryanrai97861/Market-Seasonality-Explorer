#!/bin/bash

# Market Seasonality Explorer - Localhost Setup Script
echo "🚀 Starting Market Seasonality Explorer on localhost..."
echo

# Create localhost environment configuration
cat > .env.local << EOF
NODE_ENV=development
HOST=localhost
PORT=3000
VITE_API_URL=http://localhost:3001/api
EOF

echo "✅ Created .env.local with localhost configuration"

# Display configuration
echo
echo "📋 Configuration:"
echo "   HOST: localhost"
echo "   PORT: 3000"
echo "   MODE: development"
echo "   API: http://localhost:3001/api"

echo
echo "🌐 Starting development server..."
echo "   Application will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo

# Start the development server with localhost configuration
export HOST=localhost
export PORT=3000
export NODE_ENV=development

npm run dev