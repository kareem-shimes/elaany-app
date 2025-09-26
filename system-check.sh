#!/bin/bash

# Quick system detection script
echo "🔍 System Information:"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '\"')"
echo "Architecture: $(uname -m)"
echo ""

echo "📦 Available package managers:"
command -v apt >/dev/null 2>&1 && echo "✅ apt (Debian/Ubuntu)"
command -v yum >/dev/null 2>&1 && echo "✅ yum (CentOS/RHEL)"
command -v dnf >/dev/null 2>&1 && echo "✅ dnf (Fedora/CentOS 8+)"
echo ""

echo "🔧 Current software versions:"
node --version 2>/dev/null && echo "✅ Node.js already installed" || echo "❌ Node.js not installed"
npm --version 2>/dev/null && echo "✅ npm already installed" || echo "❌ npm not installed"
nginx -v 2>/dev/null && echo "✅ Nginx already installed" || echo "❌ Nginx not installed"
pm2 --version 2>/dev/null && echo "✅ PM2 already installed" || echo "❌ PM2 not installed"
