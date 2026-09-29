# PALASH AI - Deployment Guide

## 1. Local Development (Full Stack)
```bash
# Clone the repository
cd palash-ai

# Install backend & frontend dependencies
npm install

# Start development server
npm run dev
# Server boots on port 3000 (binds to 0.0.0.0:3000)
```

## 2. Docker Deployment
```bash
# Build and run containers
docker-compose -f docker/docker-compose.yml up --build -d
```

## 3. Mobile Deployment (Expo / React Native)
```bash
cd mobile
npm install
npx expo run:android
```
