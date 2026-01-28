'use client'

import { useEffect, useState } from 'react'
import { supabase, BusinessPlan } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { getRentRatioStatus, getFoodCostRatioStatus, getLaborCostRatioStatus, getUtilitiesRatioStatus, getTotalOperatingCostStatus, getProfitMarginStatus, getOverallHealthScore, formatCurrency, formatPercentage, HealthStatus } from '@/lib/utils'

const StatusIndicator = ({ status }: { status: HealthStatus }) => {
  const emojis = { green: '🟢', yellow: '🟡', red: '🔴' }
  return <span className="text-2xl">{emojis[status]}</span>
}

const MetricCard = ({ title, value, ratio, status, benchmark }: { title: string; value: string; ratio: string; status: HealthStatus; benchmark: string }) => (
  <div className="bg-white rounded-xl p-5 card-shadow">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-sm font-medium text-amber-800">{title}</h3>
      <StatusIndicator status={status} />
    </div>
    <div className="text-2xl font-bold text-amber-900 mb-1">{value}</div>
    <div className="text-lg font-semibold text-amber-700">{ratio}</div>
    <div className="text-xs text-amber-500 mt-2">{benchmark}</div>
  </div>
)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedPlans, setSavedPlans] = useState<BusinessPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [monthlyRent, setMonthlyRent] = useState(3000)
  const [monthlyRevenue, setMonthlyRevenue] = useState(25000)
  const [foodCosts, setFoodCosts] = useState(6500)
  const [laborCosts, setLaborCosts] = useState(7000)
  const [utilities, setUtilities] = useState(1000)
  const [otherExpenses, setOtherExpenses] = useState(1500)
  const [startupCosts, setStartupCosts] = useState(50000)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      await loadSavedPlans(user.id)
      setLoading(false)
    }
    checkUser()
  }, [router])

  const loadSavedPlans = async (userId: string) => {
    const { data, error } = await supabase.from('business_plans').select('*').eq('user_id', userId).order('updated_at', { ascending: false })
    if (!error && data) setSavedPlans(data)
  }

  const loadPlan = (plan: BusinessPlan) => {
    setSelectedPlanId(plan.id || null)
    setBusinessName(plan.business_name)
    setMonthlyRent(plan.monthly_rent)
    setMonthlyRevenue(plan.monthly_revenue)
    setFoodCosts(plan.food_costs)
    setLaborCosts(plan.labor_costs)
    setUtilities(plan.utilities)
    setOtherExpenses(plan.other_expenses)
    setStartupCosts(plan.startup_costs)
  }

  const savePlan = async () => {
    if (!user || !businessName.trim()) { setMessage({ type: 'error', text: 'Please enter a business name' }); return }
    setSaving(true); setMessage(null)
    const planData = { user_id: user.id, business_name: businessName, monthly_rent: monthlyRent, monthly_revenue: monthlyRevenue, food_costs: foodCosts, labor_costs: laborCosts, utilities, other_expenses: otherExpenses, startup_costs: startupCosts, updated_at: new Date().toISOString() }
    try {
      if (selectedPlanId) {
        const { error } = await supabase.from('business_plans').update(planData).eq('id', selectedPlanId)
        if (error) throw error
        setMessage({ type: 'success', text: 'Plan updated!' })
      } else {
        const { error } = await supabase.from('business_plans').insert([planData])
        if (error) throw error
        setMessage({ type: 'success', text: 'Plan saved!' })
      }
      await loadSavedPlans(user.id)
    } catch (err: unknown) { setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' }) }
    finally { setSaving(false) }
  }

  const deletePlan = async (planId: string) => {
    if (!confirm('Delete this plan?')) return
    const { error } = await supabase.from('business_plans').delete().eq('id', planId)
    if (!error && user) { await loadSavedPlans(user.id); if (selectedPlanId === planId) newPlan() }
  }

  const newPlan = () => { setSelectedPlanId(null); setBusinessName(''); setMonthlyRent(3000); setMonthlyRevenue(25000); setFoodCosts(6500); setLaborCosts(7000); setUtilities(1000); setOtherExpenses(1500); setStartupCosts(50000) }

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) return <div className="min-h-screen flex items-center justify-center gradient-bg"><div className="animate-pulse text-2xl text-amber-700">Loading...</div></div>

  const totalOperatingCosts = monthlyRent + foodCosts + laborCosts + utilities + otherExpenses
  const monthlyProfit = monthlyRevenue - totalOperatingCosts
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0
  const rentRatio = monthlyRevenue > 0 ? (monthlyRent / monthlyRevenue) * 100 : 0
  const foodRatio = monthlyRevenue > 0 ? (foodCosts / monthlyRevenue) * 100 : 0
  const laborRatio = monthlyRevenue > 0 ? (laborCosts / monthlyRevenue) * 100 : 0
  const utilitiesRatio = monthlyRevenue > 0 ? (utilities / monthlyRevenue) * 100 : 0
  const totalCostRatio = monthlyRevenue > 0 ? (totalOperatingCosts / monthlyRevenue) * 100 : 0
  const breakEvenMonths = monthlyProfit > 0 ? Math.ceil(startupCosts / monthlyProfit) : Infinity
  const overallHealth = getOverallHealthScore(monthlyRent, foodCosts, laborCosts, utilities, otherExpenses, monthlyRevenue)

  return (
    <main className="min-h-screen gradient-bg">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="text-3xl">🥐</span><h1 className="text-xl font-bold text-amber-900">Bakery Planner</h1></div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-amber-700">{user?.email}</span>
            <button onClick={handleSignOut} className="text-sm text-amber-600 hover:text-amber-700">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {message && <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl card-shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-amber-900">Business Details</h2>
                <button onClick={newPlan} className="text-sm text-amber-600 hover:text-amber-700">+ New Plan</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Bakery" className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                {[{ label: 'Monthly Rent ($)', value: monthlyRent, setter: setMonthlyRent }, { label: 'Expected Monthly Revenue ($)', value: monthlyRevenue, setter: setMonthlyRevenue }, { label: 'Monthly Food/Ingredient Costs ($)', value: foodCosts, setter: setFoodCosts }, { label: 'Monthly Labor/Staff Costs ($)', value: laborCosts, setter: setLaborCosts }, { label: 'Monthly Utilities ($)', value: utilities, setter: setUtilities }, { label: 'Other Monthly Expenses ($)', value: otherExpenses, setter: setOtherExpenses }, { label: 'Initial Startup/Equipment Costs ($)', value: startupCosts, setter: setStartupCosts }].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-amber-800 mb-1">{field.label}</label>
                    <input type="number" value={field.value} onChange={(e) => field.setter(Number(e.target.value))} className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                ))}
                <button onClick={savePlan} disabled={saving} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 rounded-xl transition-colors">
                  {saving ? 'Saving...' : selectedPlanId ? 'Update Plan' : 'Save Plan'}
                </button>
              </div>
            </div>
            {savedPlans.length > 0 && (
              <div className="bg-white rounded-2xl card-shadow p-6">
                <h2 className="text-lg font-bold text-amber-900 mb-4">Saved Plans</h2>
                <div className="space-y-2">
                  {savedPlans.map((plan) => (
                    <div key={plan.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedPlanId === plan.id ? 'border-amber-500 bg-amber-50' : 'border-amber-200 hover:border-amber-300'}`}>
                      <div className="flex items-center justify-between">
                        <button onClick={() => loadPlan(plan)} className="flex-1 text-left">
                          <div className="font-medium text-amber-900">{plan.business_name}</div>
                          <div className="text-xs text-amber-600">{formatCurrency(plan.monthly_revenue)}/mo</div>
                        </button>
                        <button onClick={() => deletePlan(plan.id!)} className="text-red-400 hover:text-red-600 ml-2">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl p-8 text-center card-shadow ${overallHealth.status === 'green' ? 'bg-green-50' : overallHealth.status === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <h2 className="text-lg font-medium text-amber-800 mb-2">Overall Business Health</h2>
              <div className="flex items-center justify-center gap-4">
                <span className="text-6xl">{overallHealth.status === 'green' ? '🟢' : overallHealth.status === 'yellow' ? '🟡' : '🔴'}</span>
                <div>
                  <div className={`text-5xl font-bold ${overallHealth.status === 'green' ? 'text-green-600' : overallHealth.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{overallHealth.score}%</div>
                  <div className="text-sm text-amber-700">Health Score</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              <MetricCard title="Rent Ratio" value={formatCurrency(monthlyRent)} ratio={formatPercentage(rentRatio)} status={getRentRatioStatus(monthlyRent, monthlyRevenue)} benchmark="Ideal: <15%" />
              <MetricCard title="Food Cost Ratio" value={formatCurrency(foodCosts)} ratio={formatPercentage(foodRatio)} status={getFoodCostRatioStatus(foodCosts, monthlyRevenue)} benchmark="Ideal: <30%" />
              <MetricCard title="Labor Cost Ratio" value={formatCurrency(laborCosts)} ratio={formatPercentage(laborRatio)} status={getLaborCostRatioStatus(laborCosts, monthlyRevenue)} benchmark="Ideal: <30%" />
              <MetricCard title="Utilities Ratio" value={formatCurrency(utilities)} ratio={formatPercentage(utilitiesRatio)} status={getUtilitiesRatioStatus(utilities, monthlyRevenue)} benchmark="Ideal: <5%" />
              <MetricCard title="Total Operating Cost" value={formatCurrency(totalOperatingCosts)} ratio={formatPercentage(totalCostRatio)} status={getTotalOperatingCostStatus(monthlyRent, foodCosts, laborCosts, utilities, otherExpenses, monthlyRevenue)} benchmark="Ideal: <85%" />
              <MetricCard title="Profit Margin" value={formatCurrency(monthlyProfit)} ratio={formatPercentage(profitMargin)} status={getProfitMarginStatus(monthlyRent, foodCosts, laborCosts, utilities, otherExpenses, monthlyRevenue)} benchmark="Ideal: >15%" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h3 className="text-lg font-bold text-amber-900 mb-4">Monthly Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-amber-700">Revenue</span><span className="font-semibold text-amber-900">{formatCurrency(monthlyRevenue)}</span></div>
                  <div className="flex justify-between"><span className="text-amber-700">Total Costs</span><span className="font-semibold text-amber-900">-{formatCurrency(totalOperatingCosts)}</span></div>
                  <hr className="border-amber-200" />
                  <div className="flex justify-between"><span className="text-amber-700 font-medium">Net Profit</span><span className={`font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(monthlyProfit)}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h3 className="text-lg font-bold text-amber-900 mb-4">Startup Investment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-amber-700">Initial Investment</span><span className="font-semibold text-amber-900">{formatCurrency(startupCosts)}</span></div>
                  <div className="flex justify-between"><span className="text-amber-700">Monthly Profit</span><span className="font-semibold text-amber-900">{formatCurrency(monthlyProfit)}</span></div>
                  <hr className="border-amber-200" />
                  <div className="flex justify-between"><span className="text-amber-700 font-medium">Break-even Time</span><span className={`font-bold ${breakEvenMonths <= 24 ? 'text-green-600' : breakEvenMonths <= 36 ? 'text-yellow-600' : 'text-red-600'}`}>{breakEvenMonths === Infinity ? 'Never' : `${breakEvenMonths} months`}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
