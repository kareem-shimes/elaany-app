#!/bin/bash

# Deployment script for Hostinger VPS
echo "🚀 Starting deployment to Hostinger VPS..."

# Build the application
echo "📦 Building application..."
npm run build

# Create deployment package
echo "📝 Creating deployment package..."
tar -czf deploy.tar.gz \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.ts \
  ecosystem.config.js

echo "✅ Deployment package created: deploy.tar.gz"
echo "🔑 Now connect to your VPS with: ssh root@92.112.192.245"
echo "📤 Upload the package and follow the server setup steps"
