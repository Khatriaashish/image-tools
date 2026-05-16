````
# Chitramingle - AI Image Editor

Chitramingle is a full-stack image editing app built with Next.js, Convex, Clerk, and Fabric.js.
It lets users upload images, edit them on a canvas, apply AI-powered transformations, and export results.

## Features

### Core Editing
- Resize canvas
- Crop image
- Adjust controls (brightness, contrast, etc.)
- Add and style text overlays

### AI Tools
- AI background removal (ImageKit transform)
- AI image extension / outpainting-style expansion
- AI retouch and upscale presets

### User & Project Management
- Clerk authentication (sign up/sign in)
- Project creation, saving, and loading
- Dashboard with project cards and editor routing

### Plans & Limits
- Free plan limits:
  - 3 projects
  - 20 exports / month
  - 2 AI uses total
- Pro plan:
  - Unlimited projects
  - Unlimited exports
  - Unlimited AI tool access

### Billing
- Clerk billing integration for plan upgrades
- Upgrade modal and pricing section wired to Clerk checkout

## Tech Stack

- Next.js 15
- React 19
- Convex (database + functions)
- Clerk (auth + billing)
- Fabric.js (canvas editor)
- ImageKit (image hosting + transformations)
- Tailwind CSS + shadcn/ui
- Unsplash API (background image search)

## Environment Variables

Create `.env.local` in the project root:

```dotenv
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_JWT_ISSUER_DOMAIN=

# Clerk billing
NEXT_PUBLIC_CLERK_BILLING_ENABLED=true
NEXT_PUBLIC_CLERK_BILLING_PLAN_ID_PRO=

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=

# Unsplash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
````
