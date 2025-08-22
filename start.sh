#!/bin/bash
echo "🚀 Starting auth server..."
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la
echo "Server directory contents:"
ls -la server/
echo "Server dist directory contents:"
ls -la server/dist/ || echo "No dist directory found"
echo "Attempting to start server..."
cd server && node dist/main.js
