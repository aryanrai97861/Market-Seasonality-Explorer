#!/usr/bin/env node

/**
 * Localhost Development Helper Script
 * Configures the application to run on localhost with proper settings
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync } from 'fs';

console.log('🚀 Starting Market Seasonality Explorer on localhost...\n');

// Create localhost environment configuration
const envConfig = `NODE_ENV=development
HOST=localhost
PORT=3000
VITE_API_URL=http://localhost:3001/api
`;

// Write environment configuration
writeFileSync('.env.local', envConfig);
console.log('✅ Created .env.local with localhost configuration');

// Display configuration
console.log('\n📋 Configuration:');
console.log('   HOST: localhost');
console.log('   PORT: 3000');
console.log('   MODE: development');
console.log('   API: http://localhost:3001/api');

console.log('\n🌐 Starting development server...');

// Start the development server with localhost configuration
const serverProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    HOST: 'localhost',
    PORT: '3000',
    NODE_ENV: 'development'
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down localhost server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

serverProcess.on('close', (code) => {
  console.log(`\n📊 Server process exited with code ${code}`);
  process.exit(code);
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});