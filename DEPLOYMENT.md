# Deployment Guide for Roadmap.AI

This guide will help you deploy your Next.js application to **Vercel**, the recommended platform for Next.js apps.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account to host your code.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.
3.  **Supabase Database**: Your database is already on Supabase, so it's ready for production!

---

## Step 1: Push Code to GitHub

Since your project is not yet a git repository, follow these steps in your terminal:

1.  **Initialize Git:**
    ```bash
    git init
    ```

2.  **Create a `.gitignore` file** (if not already present) to exclude node_modules and env files:
    ```bash
    # I will create this for you automatically in the next step if needed
    echo "node_modules" > .gitignore
    echo ".env" >> .gitignore
    echo ".next" >> .gitignore
    ```

3.  **Commit your code:**
    ```bash
    git add .
    git commit -m "Initial commit - Roadmap.AI MVP"
    ```

4.  **Create a new repository on GitHub:**
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `roadmap-ai`.
    *   Click **Create repository**.

5.  **Push to GitHub:**
    *   Copy the commands shown under "…or push an existing repository from the command line".
    *   It will look something like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/roadmap-ai.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Deploy to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `roadmap-ai` repository and click **"Import"**.

---

## Step 3: Configure Environment Variables

**CRITICAL STEP:** You must add your environment variables to Vercel for the app to work.

In the "Configure Project" screen on Vercel, look for **"Environment Variables"**. Add the following key-value pairs (copy them from your local `.env` file):

| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:Suprovo2003%40@db.bbxtozlbxxxzswkfawoc.supabase.co:5432/postgres` |
| `GROQ_API_KEY` | `gsk_...` (Your Groq API Key) |
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` (Vercel will provide this, or just use the default) |
| `NEXTAUTH_SECRET` | `random-secret-key-123` (Or generate a new strong secret) |

*Note: Do NOT add `GEMINI_API_KEY` since we switched to Groq.*

---

## Step 4: Finish Deployment

1.  Click **"Deploy"**.
2.  Wait for Vercel to build your project (usually takes 1-2 minutes).
3.  Once done, you will see a "Congratulations!" screen with a link to your live site.

---

## Step 5: Post-Deployment Database Check

Since your database is already hosted on Supabase, it should work immediately. However, if you make changes to your Prisma schema in the future, remember to run this command locally to update the production database:

```bash
npx prisma db push
```

## Troubleshooting

*   **Build Failed?** Check the "Logs" tab in Vercel. Common issues are type errors or missing dependencies.
*   **Database Error?** Double-check your `DATABASE_URL` in Vercel Environment Variables.
*   **AI Not Working?** Ensure `GROQ_API_KEY` is correctly set in Vercel.

**Enjoy your live Roadmap.AI app! 🚀**
