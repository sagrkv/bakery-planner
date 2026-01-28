-- Bakery Business Planner Database Schema
-- Run this in your Supabase SQL Editor

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

CREATE INDEX IF NOT EXISTS idx_business_plans_user_id ON business_plans(user_id);
