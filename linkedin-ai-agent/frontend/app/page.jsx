'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import PostForm from './components/PostForm'
import PostPreview from './components/PostPreview'
import { useGenerate } from '../hooks/useGenerate'
import { createClient } from '../lib/supabase/client'

export default function Page() {
  const router = useRouter()
  const { post, isStreaming, isDone, error, generate, reset } = useGenerate()
  const [lastParams, setLastParams] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleGenerate = (params) => {
    setLastParams(params)
    generate(params)
  }

  const handleRegenerate = () => {
    if (lastParams) {
      reset()
      generate(lastParams)
    }
  }

  return (
    <div className="min-h-screen bg-linkedin-bg">
      {/* Top Nav */}
      <header className="bg-white border-b border-linkedin-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-linkedin-blue">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-linkedin-text text-lg leading-none">LinkedIn AI Agent</h1>
            <p className="text-[10px] text-linkedin-muted mt-0.5">Powered by Claude AI</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {userEmail && (
              <span className="hidden sm:block text-xs text-linkedin-muted truncate max-w-[180px]">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-medium text-linkedin-muted
                         hover:text-linkedin-text px-2.5 py-1.5 rounded-lg border border-linkedin-border
                         hover:border-linkedin-text transition-all"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          {/* Left — Form */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="font-display text-xl text-linkedin-text">Create Post</h2>
              <p className="text-xs text-linkedin-muted mt-1">Fill in your parameters and let Claude write for you</p>
            </div>
            <PostForm onGenerate={handleGenerate} isStreaming={isStreaming} />
          </div>

          {/* Right — Preview */}
          <div className="lg:sticky lg:top-20">
            <PostPreview
              post={post}
              isStreaming={isStreaming}
              isDone={isDone}
              error={error}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-linkedin-muted/50">
        LinkedIn AI Agent · Built with FastAPI + Claude + React
      </footer>
    </div>
  )
}
