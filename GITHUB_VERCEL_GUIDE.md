
# Complete GitHub & Vercel Deployment Guide for Beginners

This guide walks you through deploying your XSign app to GitHub and Vercel step by step.

---

## 📋 Table of Contents

1. [Create GitHub Account](#1-create-github-account)
2. [Create GitHub Repository](#2-create-github-repository)
3. [Install Git](#3-install-git)
4. [Push Code to GitHub](#4-push-code-to-github)
5. [Create Neon Database](#5-create-neon-database)
6. [Deploy to Vercel](#6-deploy-to-vercel)
7. [Add Environment Variables](#7-add-environment-variables)
8. [Test Your App](#8-test-your-app)

---

## 1. Create GitHub Account

1. Go to https://github.com
2. Click "Sign up"
3. Fill in your details:
   - Enter your email
   - Create a password
   - Create a username
4. Verify your email
5. Complete the setup

---

## 2. Create GitHub Repository

1. After logging in, go to https://github.com/new
2. Repository name: `xsign`
3. Description: `Digital PDF signing application`
4. Keep it **Public**
5. ✅ Check "Add a README file"
6. Click "Create repository"

---

## 3. Install Git

**On Mac:**
```bash
# Git is usually pre-installed. Check:
git --version

# If not installed, install via Homebrew:
brew install git
```

**On Windows:**
1. Download from https://git-scm.com/download/win
2. Run the installer (use default settings)
3. Restart VS Code / Terminal

---

## 4. Push Code to GitHub

Open Terminal and run these commands one by one:

```bash
# Navigate to your project folder
cd /Users/krupadungrani/Downloads/Xsign-main

# Initialize git
git init

# Add all files
git add .

# Create a commit
git commit -m "Initial commit - XSign app ready for Vercel"

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/xsign.git

# Push to GitHub
git branch -M main
git push -u origin main
```

> ⚠️ **Important:** Replace `YOUR_USERNAME` with your actual GitHub username!

Example:
```
git remote add origin https://github.com/johndoe/xsign.git
```

If you get an error about "origin already exists", run:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/xsign.git
```

---

## 5. Create Neon Database

### What is Neon?
Neon is a cloud PostgreSQL database that works with Vercel.

### Steps:

1. **Go to Neon:** https://console.neon.tech
2. **Sign up** with GitHub (it's free)
3. **Click "Create Project"**
4. **Configure:**
   - Name: `xsign`
   - Region: Choose one closest to you (e.g., `US East`)
5. **Click "Create Project"**
6. **Copy the connection string:**
   
   You'll see something like:
   ```
   postgres://johndoe:AbCdEf123@ep-xyz-12345.us-east-1.aws.neon.tech/xsign?sslmode=require
   ```
   
   **Save this** - you'll need it for Vercel!

7. **Test the connection:**
   - Click "Query" in Neon dashboard
   - Run: `SELECT 1;`
   - If it works, your database is ready!

---

## 6. Deploy to Vercel

### What is Vercel?
Vercel is a hosting platform that automatically deploys your app and runs serverless functions.

### Steps:

1. **Go to Vercel:** https://vercel.com
2. **Sign up** with GitHub (it's free)
3. **Click "Add New..."** → **"Project"**
4. **Import your repository:**
   - Find "xsign" in the list
   - Click "Import"
5. **Configure deployment:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`
6. **Click "Deploy"**

Wait 1-2 minutes for deployment to complete!

---

## 7. Add Environment Variables

After deployment finishes:

1. **Go to Vercel Dashboard**
2. **Click on your "xsign" project**
3. **Click "Settings"** tab
4. **Click "Environment Variables"**
5. **Add these variables:**

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string (from step 5) | All |

6. **Click "Save"**
7. **Redeploy:**
   - Go to "Deployments" tab
   - Click the 3 dots on the latest deployment
   - Click "Redeploy"

---

## 8. Test Your App

1. **Click the URL** at the top of your Vercel deployment (looks like `https://xsign.vercel.app`)
2. **Test these features:**
   - [ ] Register a new user
   - [ ] Login with that user
   - [ ] Upload a PDF document
   - [ ] Create a signature
   - [ ] Apply the signature to the PDF

---

## 🔧 Troubleshooting

### "fatal: remote origin already exists"
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/xsign.git
```

### "Connection refused" to database
- Go to Neon console and wake up your database by running a query
- Or upgrade to Neon paid plan for always-on

### Page won't load
- Check Vercel deployment logs
- Make sure DATABASE_URL is set correctly

### Images/PDFs not loading
- File uploads require Vercel Blob (additional setup)

---

## 📁 What Gets Deployed

```
Your Vercel App:
├── Frontend (React) → https://xsign.vercel.app
├── API Routes (Serverless) → https://xsign.vercel.app/api/*
└── Database → Neon PostgreSQL
```

---

## 🎉 Congratulations!

Your XSign app is now live on the internet! Share your URL with friends!

---

## 📚 Useful Commands for Later

```bash
# Pull latest changes from GitHub
git pull origin main

# See what files changed
git status

# See your git history
git log --oneline

# Update Vercel after code changes
git add .
git commit -m "Your message"
git push
# Vercel auto-deploys!
```

---

## ❓ Need Help?

1. Check the error message in Vercel deployment logs
2. Search Google for the error
3. Ask in developer communities like Stack Overflow
4. Check the VERCEL_DEPLOYMENT.md file in your project

