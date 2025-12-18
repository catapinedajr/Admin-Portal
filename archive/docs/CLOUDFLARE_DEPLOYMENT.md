# Deploy HODLearn to Cloudflare with Your Domain

## Option 1: Cloudflare Pages (Recommended - Easiest)

### Step 1: Build Your App
```bash
# In your Replit project, run:
npm run build
```
This creates a `dist/` folder with your built app.

### Step 2: Download the Built App
1. Download the entire `dist/` folder from Replit
2. You'll get a zip file with your complete built app

### Step 3: Deploy to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Pages" in the sidebar
3. Click "Create a project"
4. Choose "Upload assets"
5. Upload your `dist/` folder
6. Enter your project name (e.g., "hodlearn")
7. Click "Create project"

### Step 4: Connect Your Domain
1. In your Cloudflare Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Cloudflare will automatically configure DNS

## Option 2: Cloudflare Workers (More Advanced)

If you want to deploy both frontend and backend to Cloudflare:

### Prerequisites
- Your database needs to be accessible from the internet
- You'll need to configure environment variables

### Steps
1. Convert your Express backend to Cloudflare Workers format
2. Deploy frontend to Pages, backend to Workers
3. Connect them through Routes

## Option 3: Hybrid Approach (Simplest for Full-Stack)

### Frontend on Cloudflare Pages + Backend on Railway/Render
1. Deploy frontend (React app) to Cloudflare Pages with your domain
2. Keep backend on Railway/Render with database
3. Update frontend API calls to point to your backend URL

## Database Considerations

Your PostgreSQL database will need to be:
- ✅ Keep on Neon (current setup) - works perfectly with Cloudflare
- ✅ Or migrate to Cloudflare D1 (their database service)

## Recommended Path for You

**Option 1 (Cloudflare Pages)** is perfect because:
- Your app is already optimized for static deployment
- Cloudflare handles SSL, CDN, and performance automatically
- Your domain integration is seamless
- Database on Neon continues working

Want me to walk you through the build process and help you prepare the files for upload?