#!/bin/bash
# Render build script

echo "🚀 Starting Render build process..."

# Navigate to server directory
cd server

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migration
echo "🗄️ Running database migrations..."
npx prisma db push

# Build the application
echo "🏗️ Building NestJS application..."
npm run build

echo "✅ Build completed successfully!"
