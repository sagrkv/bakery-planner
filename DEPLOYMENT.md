# 🚀 Deployment Guide for Bakery Business Planner

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Name: `bakery-planner`
4. Password: Choose a secure password
5. Region: Pick closest to you
6. Wait for project to be created (~2 minutes)

## Step 2: Set Up Database

In Supabase Dashboard, go to **SQL Editor** and run:

```sql
CREATE TABLE IF NOT EXISTS business_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  monthly_rent DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  food_costs DECIMAL(12,2) NOT NULL DEFAULT 0,
  labor_costs DECIMAL(12,2) NOT NULL DEFAULT 0,
  utilities DECIMAL(12,2) NOT NULL DEFAULT 0,
  other_expenses DECIMAL(12,2) NOT NULL DEFAULT 0,
  startup_costs DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON business_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON business_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON business_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON business_plans FOR DELETE USING (auth.uid() = user_id);
```

## Step 3: Get Your Keys

Go to **Settings** > **API** and copy:
- Project URL
- anon public key

## Step 4: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. **New Project** > **Deploy from GitHub repo** > select `bakery-planner`
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Wait for deployment
6. Generate domain in Settings

## Step 5: Configure Auth

In Supabase **Authentication** > **URL Configuration**:
- Site URL: your Railway URL
- Redirect URLs: add `https://your-app.railway.app/api/auth/callback`

## Done! 🎉
