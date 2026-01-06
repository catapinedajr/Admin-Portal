# HODLearn Production Deployment Guide

This document provides step-by-step instructions for deploying HODLearn to a production AWS environment.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Build & Deploy](#build--deploy)
5. [AI Integration Setup](#ai-integration-setup)
6. [Stripe Integration](#stripe-integration)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## System Requirements

### Server Requirements
- **Node.js**: v20.x or later
- **npm**: v10.x or later
- **PostgreSQL**: v15.x or later (Neon serverless compatible)
- **Memory**: Minimum 1GB RAM (2GB+ recommended)
- **Storage**: Minimum 10GB for application and logs

### AWS Services (Recommended)
- **EC2** or **ECS/Fargate**: Application hosting
- **RDS** or **Neon**: PostgreSQL database
- **ALB**: Load balancer with HTTPS termination
- **Route 53**: DNS management
- **ACM**: SSL/TLS certificates
- **S3**: Static asset storage (optional)
- **CloudWatch**: Logging and monitoring

---

## Environment Variables

### Required Variables

Create a `.env` file or configure these in your AWS environment:

```bash
# Database Configuration (Required)
DATABASE_URL=postgresql://username:password@host:5432/database_name?sslmode=require

# Session Configuration (Required)
SESSION_SECRET=your-secure-random-string-minimum-32-chars

# Application Configuration
NODE_ENV=production
PORT=5000

# Anthropic AI Integration (Required for AI Features)
# Replace with your production Anthropic API key
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Stripe Integration (Required for Payments)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key

# Admin Configuration
ADMIN_EMAIL=admin@hodlearn.com
ADMIN_PASSWORD=your-secure-admin-password
```

### Optional Variables

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# CORS (if API is accessed from different domain)
CORS_ORIGIN=https://app.hodlearn.com

# CoinGecko API (for Bitcoin price - free tier)
COINGECKO_API_KEY=your-api-key-if-using-pro-tier
```

---

## Database Setup

### 1. Create PostgreSQL Database

```sql
CREATE DATABASE hodlearn_production;
CREATE USER hodlearn_app WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE hodlearn_production TO hodlearn_app;
```

### 2. Run Database Migrations

From the project root:

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push

# Verify tables were created
npm run db:studio
```

### 3. Database Schema

The application uses Drizzle ORM with the following core tables:
- `users` - User accounts and authentication
- `user_progress` - Learning progress tracking
- `content_days` - Daily curriculum content
- `content_lessons`, `content_quizzes`, `content_questions` - Educational content
- `wallet_transactions` - HODLearn Points transactions
- `subscriptions` - Stripe subscription data
- `admin_users` - Admin portal authentication

---

## Build & Deploy

### Local Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment (Recommended)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
```

Build and push:

```bash
docker build -t hodlearn:latest .
docker tag hodlearn:latest your-ecr-repo.amazonaws.com/hodlearn:latest
docker push your-ecr-repo.amazonaws.com/hodlearn:latest
```

### AWS ECS Task Definition

```json
{
  "family": "hodlearn",
  "containerDefinitions": [
    {
      "name": "hodlearn-app",
      "image": "your-ecr-repo.amazonaws.com/hodlearn:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..." },
        { "name": "STRIPE_SECRET_KEY", "valueFrom": "arn:aws:secretsmanager:..." },
        { "name": "ANTHROPIC_API_KEY", "valueFrom": "arn:aws:secretsmanager:..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/hodlearn",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## AI Integration Setup

### Anthropic Claude API

The application uses Anthropic Claude for:
1. **Content Generation** - AI-powered curriculum content creation
2. **Social Media Drafts** - Automated social post generation

#### Configuration Steps:

1. Create an account at [console.anthropic.com](https://console.anthropic.com)

2. Generate a production API key

3. Set environment variable:
```bash
ANTHROPIC_API_KEY=sk-ant-your-production-api-key
```

4. **Important**: The Replit development environment uses `AI_INTEGRATIONS_ANTHROPIC_API_KEY`. For production, the code automatically falls back to `ANTHROPIC_API_KEY`.

#### Code Reference

The AI integration is configured in `server/admin-routes.ts`:

```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
});
```

#### API Usage Limits

Monitor your Anthropic API usage to avoid unexpected costs:
- Content generation uses Claude 3.5 Sonnet
- Each content generation request uses ~2,000-4,000 tokens
- Recommended: Set up usage alerts in Anthropic console

---

## Stripe Integration

### 1. Configure Stripe Dashboard

1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live Mode**
3. Copy your live API keys

### 2. Set Up Webhooks

Create a webhook endpoint pointing to:
```
https://your-domain.com/api/stripe/webhook
```

Subscribe to these events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

### 3. Environment Variables

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### 4. Create Products in Stripe

The application expects these products:
- **HODLearn Pro Monthly** - Monthly subscription
- **HODLearn Pro Annual** - Annual subscription

---

## Post-Deployment Checklist

### Security

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Database uses SSL connection (`?sslmode=require`)
- [ ] Environment variables stored in AWS Secrets Manager
- [ ] Rate limiting configured
- [ ] CORS configured for your domains only
- [ ] Admin password changed from default

### Functionality

- [ ] User registration and login works
- [ ] Stripe checkout completes successfully
- [ ] Daily content loads correctly
- [ ] AI content generation works
- [ ] Admin portal accessible at `/admin`
- [ ] HODLearn Points wallet displays correctly
- [ ] Bitcoin price updates from CoinGecko

### Admin Portal Access

Default admin credentials (change immediately):
- **URL**: `https://your-domain.com/admin`
- **Email**: `admin@hodlearn.com`
- **Password**: `admin123`

**IMPORTANT**: Change these credentials immediately after first login via the admin settings.

### Performance

- [ ] Response times under 200ms for API calls
- [ ] Page load under 3 seconds
- [ ] Database queries optimized (check for N+1 queries)
- [ ] Static assets served with proper cache headers

---

## Monitoring & Maintenance

### Recommended CloudWatch Alarms

```yaml
- Alarm: HighErrorRate
  Metric: 5xx errors > 1% over 5 minutes
  
- Alarm: HighLatency
  Metric: p99 latency > 1 second
  
- Alarm: DatabaseConnections
  Metric: Connection count > 80% of max
  
- Alarm: MemoryUsage
  Metric: Memory > 85% for 5 minutes
```

### Log Locations

- **Application logs**: CloudWatch `/ecs/hodlearn`
- **Database logs**: RDS Performance Insights
- **ALB access logs**: S3 bucket

### Database Backups

- **Automated**: RDS automated backups (7-day retention recommended)
- **Manual**: Before major releases
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Health Check Endpoint

The application provides a health check at:
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-06T12:00:00Z"
}
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Errors**
```
Error: connect ECONNREFUSED
```
- Verify `DATABASE_URL` is correct
- Check security group allows inbound connections
- Verify SSL mode is enabled

**2. Stripe Webhook Failures**
```
Webhook signature verification failed
```
- Verify `STRIPE_WEBHOOK_SECRET` matches dashboard
- Check webhook URL is publicly accessible
- Verify HTTPS is properly configured

**3. AI Content Generation Fails**
```
Error: 401 Unauthorized
```
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API key is active in Anthropic console
- Verify billing is set up in Anthropic account

**4. Session Not Persisting**
```
User logged out unexpectedly
```
- Verify `SESSION_SECRET` is consistent across instances
- Check PostgreSQL session store is configured
- Verify cookie domain settings for multi-subdomain setups

---

## Support

For technical issues:
1. Check application logs in CloudWatch
2. Review database query performance
3. Verify all environment variables are set
4. Contact development team with error details

---

*Last updated: January 2025*
