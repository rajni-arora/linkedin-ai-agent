'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
      })
    }

    setLoading(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-linkedin-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex items-center justify-center w-9 h-9 rounded bg-linkedin-blue">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-linkedin-text text-lg leading-none">LinkedIn AI Agent</h1>
            <p className="text-[10px] text-linkedin-muted mt-0.5">Powered by Claude AI</p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8">
          {done ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 text-xl">
                ✓
              </div>
              <h2 className="font-display text-xl text-linkedin-text">Check your email</h2>
              <p className="text-sm text-linkedin-muted">
                We sent a confirmation link to <span className="font-medium text-linkedin-text">{email}</span>.
                Click it to activate your account.
              </p>
              <Link href="/login" className="mt-2 text-sm text-linkedin-blue font-medium hover:text-linkedin-darkblue">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl text-linkedin-text mb-1">Create account</h2>
              <p className="text-sm text-linkedin-muted mb-6">Start generating LinkedIn posts with AI</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-linkedin-muted/60" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Jane Smith"
                      className="input-base pl-9"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-linkedin-muted/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-base pl-9"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-linkedin-muted/60" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-base pl-9"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm
                             bg-linkedin-blue text-white transition-all duration-150
                             hover:bg-linkedin-darkblue active:scale-[0.98]
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-1"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>

        {!done && (
          <p className="text-center text-sm text-linkedin-muted mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-linkedin-blue font-medium hover:text-linkedin-darkblue">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
