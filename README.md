# 🥐 Bakery Business Plan Calculator

A comprehensive web app for planning and analyzing your bakery business health. Calculate costs, margins, and get real-time health indicators.

## Features

- **User Authentication** - Signup/Login with Supabase Auth
- **Business Input Form** - Enter all your business costs and revenue
- **Health Dashboard** - Green/Yellow/Red indicators for:
  - Rent Ratio (<15% = 🟢, 15-20% = 🟡, >20% = 🔴)
  - Food Cost Ratio (<30% = 🟢, 30-35% = 🟡, >35% = 🔴)
  - Labor Cost Ratio (<30% = 🟢, 30-35% = 🟡, >35% = 🔴)
  - Utilities Ratio (<5% = 🟢, 5-8% = 🟡, >8% = 🔴)
  - Total Operating Cost (<85% = 🟢, 85-95% = 🟡, >95% = 🔴)
  - Profit Margin (>15% = 🟢, 5-15% = 🟡, <5% = 🔴)
- **Save/Load** - Save multiple business plans to your account

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- TypeScript

## Setup

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

\`\`\`sql
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
\`\`\`

3. Copy your Project URL and anon key from Settings > API

### 2. Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 3. Run Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

### 4. Deploy to Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project > Deploy from GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## License

MIT
