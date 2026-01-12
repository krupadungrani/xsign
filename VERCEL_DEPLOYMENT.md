# Vercel Deployment Guide for XSign

This guide explains how to deploy your XSign application to Vercel with both frontend and backend (as serverless functions).

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Neon PostgreSQL Database** - Get free database at [console.neon.tech](https://console.neon.tech)
4. **Vercel Blob Storage** - For PDF file uploads

---

## Step 1: Prepare Your Database (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string (DATABASE_URL)
4. It should look like:
   ```
   postgres://username:password@ep-xxx.region.neon.tech/xsign?sslmode=require
   ```

---

## Step 2: Set Up Vercel Blob Storage

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** tab
3. Click **Create Database** or **Create Blob**
4. Follow the prompts to create a Blob store
5. Copy the `BLOB_READ_WRITE_TOKEN` from settings

---

## Step 3: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/xsign.git
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
5. Click **Deploy**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel
```

---

## Step 5: Configure Environment Variables

After deployment, go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | All |
| `BLOB_READ_WRITE_TOKEN` | Your Vercel Blob token | All |

---

## Step 6: Run Database Migrations

Your database tables should be created automatically by Drizzle ORM when the API routes first run. If you need to manually create tables:

1. Go to Neon Console
2. Open the SQL Editor
3. Run the migrations from `migrations/` folder

Or use Drizzle Kit:
```bash
npx drizzle-kit push
```

---

## Step 7: Test Your Deployment

1. Visit your Vercel deployment URL
2. Try registering a new user
3. Try logging in
4. Try uploading a PDF document
5. Try creating and applying a signature

---

## File Structure for Vercel

```
xsign/
├── api/                    # Vercel Serverless Functions
│   ├── _utils.ts          # Shared utilities
│   ├── auth/
│   │   ├── register.ts    # POST /api/auth/register
│   │   └── login.ts       # POST /api/auth/login
│   ├── documents/
│   │   ├── upload.ts      # POST /api/documents/upload
│   │   └── list.ts        # GET /api/documents/list
│   ├── signatures/
│   │   ├── create.ts      # POST /api/signatures/create
│   │   ├── list.ts        # GET /api/signatures/list
│   │   └── apply.ts       # POST /api/signatures/apply
│   └── health.ts          # GET /api/health
├── client/                # Frontend (React + Vite)
│   ├── src/
│   └── index.html
├── server/                # Backend (Express - for local dev)
├── shared/                # Shared schemas and types
├── vercel.json            # Vercel configuration
├── package.json
└── vite.config.ts
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/signatures/list?userId=xxx` | GET | List user signatures |
| `/api/signatures/create` | POST | Create signature |
| `/api/signatures/apply` | POST | Apply signature to document |
| `/api/documents/list?userId=xxx` | GET | List user documents |
| `/api/documents/upload` | POST | Upload PDF document |

---

## Troubleshooting

### "DATABASE_URL must be set"
- Ensure you've added `DATABASE_URL` in Vercel Environment Variables
- Redeploy after adding variables

### "Connection refused" errors
- Neon database might be sleeping.访问 it once in Neon Console to wake it up.
- Consider upgrading to Neon paid plan for always-on databases

### CORS errors
- The `vercel.json` includes CORS headers for API routes
- If using separate frontend domain, update `vercel.json`

### PDF uploads failing
- Make sure Vercel Blob is set up
- Check blob token has read/write permissions
- File size limit is 4.5MB by default on Vercel Blob

---

## Development vs Production

### Local Development
```bash
npm run dev
```
- Uses Express server on port 5000
- Frontend at http://localhost:5173
- Database connection via `DATABASE_URL`

### Vercel Production
- Frontend served from CDN
- API routes as serverless functions
- Automatic scaling

---

## Notes

1. **File Upload Size**: Vercel Blob has 4.5MB default limit. For larger files, consider S3.
2. **Serverless Timeouts**: API functions timeout after 10-60 seconds (configurable).
3. **Database Connections**: Each serverless function opens its own DB connection.
4. **Cold Starts**: First request after inactivity may be slower.

---

## Success! 🎉

Once deployed, your app will be available at:
- **Frontend**: `https://xsign.vercel.app`
- **API**: `https://xsign.vercel.app/api/*`

