'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-pulse text-2xl text-amber-700">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6"><span className="text-6xl">🥐</span></div>
          <h1 className="text-5xl font-bold text-amber-900 mb-4">Bakery Business Planner</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Calculate your bakery&apos;s financial health with our comprehensive business plan calculator.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl card-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Health Dashboard</h3>
            <p className="text-amber-700">Visual indicators show the health of each cost ratio with green, yellow, and red signals.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl card-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Cost Analysis</h3>
            <p className="text-amber-700">Track rent, food costs, labor, utilities, and more to understand where your money goes.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl card-shadow">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Save & Compare</h3>
            <p className="text-amber-700">Save multiple business plans to your account and compare different scenarios.</p>
          </div>
        </div>

        <div className="text-center">
          {user ? (
            <Link href="/dashboard" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg">
              Go to Dashboard →
            </Link>
          ) : (
            <div className="space-x-4">
              <Link href="/auth" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg">
                Get Started Free
              </Link>
              <Link href="/auth" className="inline-block bg-white hover:bg-amber-50 text-amber-700 font-semibold py-4 px-8 rounded-xl text-lg transition-colors border-2 border-amber-300">
                Sign In
              </Link>
            </div>
          )}
        </div>

        <div className="mt-20 bg-white p-8 rounded-2xl card-shadow">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Industry Benchmarks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-1">&lt;15%</div>
              <div className="text-sm text-green-700">Ideal Rent Ratio</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-1">&lt;30%</div>
              <div className="text-sm text-green-700">Ideal Food Cost</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-1">&gt;15%</div>
              <div className="text-sm text-green-700">Healthy Profit Margin</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
