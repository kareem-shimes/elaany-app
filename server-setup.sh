#!/bin/bash

# Server setup script for Hostinger VPS
echo "🔧 Setting up Hostinger VPS for Next.js deployment..."

# Detect OS and use appropriate package manager
echo "� Detecting operating system..."
if command -v apt >/dev/null 2>&1; then
    echo "📦 Detected Debian/Ubuntu - using apt..."
    apt update && apt upgrade -y
    
    # Install Node.js
    echo "🟢 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    
    # Install nginx
    echo "🌐 Installing Nginx..."
    apt install -y nginx
    
elif command -v yum >/dev/null 2>&1; then
    echo "📦 Detected CentOS/RHEL - using yum..."
    yum update -y
    
    # Install Node.js
    echo "🟢 Installing Node.js 20..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs
    
    # Install nginx
    echo "🌐 Installing Nginx..."
    yum install -y epel-release
    yum install -y nginx
    
elif command -v dnf >/dev/null 2>&1; then
    echo "📦 Detected Fedora/CentOS 8+ - using dnf..."
    dnf update -y
    
    # Install Node.js
    echo "🟢 Installing Node.js 20..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs
    
    # Install nginx
    echo "🌐 Installing Nginx..."
    dnf install -y nginx
    
else
    echo "❌ Unsupported package manager. Please install Node.js and nginx manually."
    exit 1
fi

# Install PM2 globally
echo "⚙️ Installing PM2..."
npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/elaany-app
cd /var/www/elaany-app

# Start and enable nginx
echo "🔄 Starting Nginx..."
systemctl start nginx
systemctl enable nginx

echo "✅ VPS setup complete!"
echo "📤 Now upload your deploy.tar.gz file to /var/www/elaany-app/"
