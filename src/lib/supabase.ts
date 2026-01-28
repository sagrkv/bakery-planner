import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BusinessPlan = {
  id?: string
  user_id?: string
  business_name: string
  monthly_rent: number
  monthly_revenue: number
  food_costs: number
  labor_costs: number
  utilities: number
  other_expenses: number
  startup_costs: number
  created_at?: string
  updated_at?: string
}
