# Setting Up Convex Backend

## Step 1: Connect to Convex

Run this command in your terminal (make sure you're in the project directory):

```bash
npx convex dev
```

This command will:

1. **Prompt you to log in** - You'll need to authenticate with Convex (GitHub, Google, or email)
2. **Create a new Convex project** - It will ask you to create or select a project
3. **Generate configuration files** - Creates `convex/_generated/` files
4. **Set up environment variables** - Creates/updates `.env.local` with `NEXT_PUBLIC_CONVEX_URL`

## Step 2: Keep the Convex Dev Server Running

After setup, `npx convex dev` will:
- Watch for changes to your Convex functions
- Sync your backend code to Convex
- Generate TypeScript types

**Keep this terminal window running** while developing.

## Step 3: Run Next.js Development Server

In a **new terminal window**, run:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## What Happens During Setup

- Convex will create a cloud database and file storage for your project
- All your schema, queries, and mutations will be deployed
- You'll get a unique URL like `https://your-project.convex.cloud`
- This URL is stored in `.env.local` as `NEXT_PUBLIC_CONVEX_URL`

## Troubleshooting

If you encounter issues:
- Make sure Node.js is installed (check with `node --version`)
- If using nvm, make sure it's loaded: `source ~/.nvm/nvm.sh`
- Check that you're logged in: `npx convex whoami`
