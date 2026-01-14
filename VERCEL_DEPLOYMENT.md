# Deploying to Vercel

## Step 1: Set Up Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name:** `NEXT_PUBLIC_CONVEX_URL`
   - **Value:** Your Convex deployment URL (e.g., `https://your-project.convex.cloud`)
   - **Environment:** Select all environments (Production, Preview, Development)

## Step 2: Get Your Convex URL

If you haven't deployed your Convex backend yet:

1. Run locally: `npx convex dev`
2. This will show your Convex URL in the terminal
3. Copy that URL and add it to Vercel as described above

Or if you want to deploy Convex to production:

1. Run: `npx convex deploy --prod`
2. This will give you a production URL
3. Use that URL in Vercel

## Step 3: Redeploy

After adding the environment variable, trigger a new deployment:
- Push a new commit, or
- Go to Vercel dashboard → **Deployments** → Click the three dots on the latest deployment → **Redeploy**

## Important Notes

- The `NEXT_PUBLIC_CONVEX_URL` environment variable is required for the app to work
- Make sure to add it to all environments (Production, Preview, Development)
- The Convex backend must be deployed before the frontend can connect to it
