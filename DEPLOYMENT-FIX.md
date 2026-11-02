# Vercel Deployment & Error Resolution Guide

This document details the deployment errors encountered with Vercel and GitHub CI/CD checks, their root causes, and how they were resolved.

---

## 🛑 Summary of Deployment Errors

When pushing to GitHub, Vercel reported:
> `Vercel - Deployment has failed — run this Vercel CLI command: npx vercel inspect dpl_5dMwe5hfbGcFmYyBvH6MD2TaSULg --logs`

---

## 🔍 Root Causes Identified

### 1. Node.js Version Incompatibility (Engine Mismatch)
- **Problem:** Root `package.json` and `frontend/package.json` specified `"node": ">=24"` / `"24.x"`. Vercel's build container runs Node.js `22.x` (or `20.x`), causing Vercel to reject the build due to engine version mismatch.
- **Fix:** 
  - Updated root `package.json` and `frontend/package.json` engines to `">=20"` to fully support Node.js 20, 22, and 24.
  - Explicitly pinned Vercel's runtime to Node.js `22.x` in `vercel.json` and `admin/vercel.json` via `"nodeVersion": "22.x"`.

### 2. Playwright Binary Download Timeouts during Installation
- **Problem:** Root `devDependencies` included `playwright`. During Vercel's root installation step (`npm ci`), Playwright's postinstall script attempted to download heavy browser binaries (Chromium, Firefox, WebKit), causing build slowdowns, network errors, or timeouts.
- **Fix:**
  - Configured `vercel.json` with `"installCommand": "npm ci --ignore-scripts"` to bypass root postinstall scripts.
  - Added `"PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD": "1"` in `vercel.json` environment variables to prevent unnecessary browser binary downloads.

---

## ⚙️ Updated Configuration Files

### `vercel.json` (Root - Storefront)
```json
{
  "nodeVersion": "22.x",
  "installCommand": "npm ci --ignore-scripts",
  "buildCommand": "npm ci --prefix frontend && npm run build --prefix frontend",
  "outputDirectory": "frontend/dist",
  "env": {
    "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD": "1"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `admin/vercel.json` (Admin Dashboard)
```json
{
  "nodeVersion": "22.x",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🚀 Environment Variables Required on Vercel

When deploying the frontend or admin dashboard on Vercel, make sure to configure the following environment variable in your Vercel project settings:

- `VITE_BACKEND_URL`: Set to your deployed backend API URL (e.g., `https://your-backend-api.onrender.com` or similar).

---

## 📋 What We Require from You (Next Steps)

1. **Verify GitHub Status:** Check your GitHub repository pull request / commit checks. The Vercel deployment check should now pass successfully (`All checks have passed`).
2. **Vercel Dashboard:** If you haven't already, ensure the environment variable `VITE_BACKEND_URL` is set in your Vercel project settings pointing to your live backend API.
3. **Admin Dashboard Project:** If deploying the admin dashboard separately on Vercel, create a second Vercel project pointing to the repository root with **Root Directory** set to `admin`.
