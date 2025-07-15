#!/bin/bash

echo "Setting up HODLearn Mobile App..."

# Install Expo CLI globally
echo "Installing Expo CLI..."
npm install -g @expo/cli

# Clean up any previous installation
echo "Cleaning up previous installation..."
rm -rf node_modules package-lock.json

# Install dependencies with legacy peer deps to handle version conflicts
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Mobile app setup complete!"
    echo "To start the app, run: expo start"
else
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi