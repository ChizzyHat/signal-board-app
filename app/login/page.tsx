'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  async function signInWithEmail() {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the magic link.')
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Signal Board</h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to access your pipeline.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm"
          />
          <button
            onClick={signInWithEmail}
            disabled={loading || !email}
            className="w-full py-2 bg-white text-black font-medium rounded disabled:opacity-50 text-sm"
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex-1 h-px bg-gray-800" />
          <span>or</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full py-2 bg-gray-900 border border-gray-800 rounded text-sm hover:bg-gray-800"
        >
          Continue with Google
        </button>

        {message && (
          <p className="text-sm text-gray-300 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}