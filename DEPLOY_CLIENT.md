# Client Deployment Guide

## Overview

The HODLearn client is deployed as a **static SPA** served by nginx inside a Docker container. The client connects to a separate API server configured via `VITE_API_BASE_URL`.

## Architecture

```
GitHub Actions (build) → Docker image (nginx + static files) → EC2 instance
```

## GitHub Secrets Required

| Secret | Description | Example |
|---|---|---|
| `PROD_API_BASE_URL` | Production API URL | `https://api.hodlearn.com` |
| `STAGING_API_BASE_URL` | Staging API URL | `https://staging-api.hodlearn.com` |
| `PROD_EC2_HOST` | Production EC2 public IP/hostname | `54.x.x.x` |
| `STAGING_EC2_HOST` | Staging EC2 public IP/hostname | `3.x.x.x` |
| `EC2_USER` | SSH user on EC2 | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH key for EC2 access | (PEM key contents) |

## Deployment Flow

1. Push to `develop` → deploys to **staging** EC2
2. Push to `main` → deploys to **production** EC2

The workflow:
- Builds the Vite SPA with the correct `VITE_API_BASE_URL`
- Packages it into a Docker image (nginx serving static files)
- Transfers the image to EC2 via SCP
- Loads and runs the container on port 80

## EC2 Setup (One-Time)

```bash
# Install Docker
sudo apt update && sudo apt install -y docker.io
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Open port 80
# (Configure in AWS Security Group: allow TCP 80 from 0.0.0.0/0)
```

## Local Testing

```bash
# Build and run locally
docker build --build-arg VITE_API_BASE_URL=http://localhost:5000 -t hodlearn-client .
docker run -p 3000:80 hodlearn-client

# Open http://localhost:3000
```

## Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: node → vite build → nginx |
| `nginx.conf` | SPA routing, gzip, cache headers |
| `.dockerignore` | Excludes server/, node_modules, etc. |
| `.github/workflows/deploy.yml` | CI/CD pipeline |
| `client/src/lib/api.ts` | API base URL configuration |
