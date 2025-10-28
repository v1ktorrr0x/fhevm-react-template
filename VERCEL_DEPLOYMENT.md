# Vercel Deployment Guide

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel

## Deployment Steps

### 1. Import Project to Vercel

1. Visit https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your GitHub repository: `v1ktorrr0x/fhevm-react-template`
4. Click "Import"

### 2. Configure Project Settings

**Framework Preset:** Next.js

**Root Directory:** `packages/nextjs`

**Build Settings:**
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Environment Variables:**
None required for basic deployment

### 3. Configure Branch Deployment

In Vercel project settings:

**Production Branch:** `vercel-deployment`

This ensures:
- `vercel-deployment` branch deploys to production
- `bounty-submission` branch remains clean for PR
- `main` branch for ongoing development

### 4. Deploy

Click "Deploy" button in Vercel dashboard.

Deployment will:
1. Install dependencies with pnpm
2. Build the Next.js application
3. Deploy to Vercel CDN
4. Provide deployment URL

## Post-Deployment

### Access Your Application

Your application will be available at:
- Production: `https://your-project.vercel.app`
- Preview: Automatic preview URLs for each commit

### Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Environment Variables (If Needed)

For production deployment with specific configurations:

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `NEXT_PUBLIC_SEPOLIA_RPC_URL` (if using custom RPC)
   - `NEXT_PUBLIC_CHAIN_ID` (if needed)

## Vercel CLI Deployment (Alternative)

### Install Vercel CLI

```bash
pnpm add -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy

```bash
# From project root
cd packages/nextjs
vercel
```

Follow the prompts to configure deployment.

### Deploy to Production

```bash
vercel --prod
```

## Branch Strategy

**Current Setup:**
- `main` - Development branch
- `bounty-submission` - Clean branch for Zama bounty PR
- `vercel-deployment` - Production deployment branch

**Workflow:**
1. Develop on `main`
2. Merge stable changes to `vercel-deployment` for production
3. Keep `bounty-submission` clean for official submission

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:
- Missing dependencies
- TypeScript errors
- Environment variables not set

### Application Not Loading

Verify:
- Build completed successfully
- No runtime errors in browser console
- Network requests are successful

### FHEVM Client Issues

Note: Vercel deployment connects to Sepolia testnet by default. Ensure:
- Wallet is connected
- Correct network selected (Sepolia)
- Contract is deployed to Sepolia

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Last Updated:** October 27, 2025
