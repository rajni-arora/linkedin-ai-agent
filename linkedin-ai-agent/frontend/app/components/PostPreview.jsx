'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw, ThumbsUp, MessageCircle, Share2, Send, Sparkles, Loader2 } from 'lucide-react'

function CharBadge({ count }) {
  const max = 3000
  const pct = Math.min(count / max, 1)
  const color = count > 2800 ? 'text-red-500' : count > 2000 ? 'text-amber-500' : 'text-linkedin-muted'
  return (
    <div className={`flex items-center gap-1.5 text-xs ${color}`}>
      <div className="w-24 h-1 bg-linkedin-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct > 0.93 ? 'bg-red-400' : pct > 0.67 ? 'bg-amber-400' : 'bg-linkedin-blue'}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      {count} / {max}
    </div>
  )
}

function VariantCard({ variant, onUse }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-linkedin-border bg-white hover:border-linkedin-blue/40 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-linkedin-blue bg-linkedin-lightblue px-2 py-0.5 rounded-full">
          {variant.strategy}
        </span>
      </div>
      <p className="text-xs text-linkedin-text leading-relaxed whitespace-pre-wrap line-clamp-[10]">
        {variant.content}
      </p>
      <button
        onClick={() => onUse(variant.content)}
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg
                   text-xs font-semibold border border-linkedin-blue text-linkedin-blue
                   hover:bg-linkedin-blue hover:text-white transition-all"
      >
        Use This
      </button>
    </div>
  )
}

export default function PostPreview({ post, isStreaming, isDone, error, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  const [activePost, setActivePost] = useState(post)
  const [isRefining, setIsRefining] = useState(false)
  const [variants, setVariants] = useState([])
  const [refineError, setRefineError] = useState(null)

  useEffect(() => {
    setActivePost(post)
    if (isStreaming) setVariants([])
  }, [post, isStreaming])

  const handleCopy = async () => {
    if (!activePost) return
    await navigator.clipboard.writeText(activePost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefine = async () => {
    setIsRefining(true)
    setVariants([])
    setRefineError(null)
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_post: activePost }),
      })
      if (!res.ok) throw new Error('Refinement failed')
      const data = await res.json()
      setVariants(data.variants)
    } catch (e) {
      setRefineError(e.message)
    } finally {
      setIsRefining(false)
    }
  }

  const handleUseVariant = (content) => {
    setActivePost(content)
    setVariants([])
  }

  const isEmpty = !activePost && !isStreaming && !error

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-linkedin-text text-sm">Preview</h2>
        <div className="flex items-center gap-2">
          {activePost && <CharBadge count={activePost.length} />}
          {isDone && (
            <>
              <button
                onClick={handleRefine}
                disabled={isRefining}
                className="flex items-center gap-1.5 text-xs font-medium text-white
                           bg-linkedin-blue hover:bg-linkedin-darkblue px-3 py-1.5 rounded-lg
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefining
                  ? <><Loader2 size={12} className="animate-spin" /> Refining...</>
                  : <><Sparkles size={12} /> Refine Post</>
                }
              </button>
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 text-xs text-linkedin-muted hover:text-linkedin-blue
                           px-3 py-1.5 rounded-lg border border-linkedin-border hover:border-linkedin-blue transition-all"
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </>
          )}
          <button
            onClick={handleCopy}
            disabled={!activePost}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                       border transition-all disabled:opacity-30 disabled:cursor-not-allowed
                       border-linkedin-border hover:border-linkedin-blue hover:text-linkedin-blue"
          >
            {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
      </div>

      {/* LinkedIn Card */}
      <div className="card overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] text-center p-8 gap-3">
            <div className="w-12 h-12 rounded-full bg-linkedin-lightblue flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-linkedin-blue">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <p className="text-linkedin-muted text-sm">Your generated post will appear here</p>
            <p className="text-linkedin-muted/60 text-xs">Fill in the form and hit Generate Post</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] p-8 gap-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-400 text-lg">!</div>
            <p className="text-red-500 text-sm font-medium">Generation failed</p>
            <p className="text-linkedin-muted text-xs text-center">{error}</p>
          </div>
        ) : (
          <div className="p-5">
            {/* Author row */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-linkedin-blue to-linkedin-darkblue
                              flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                You
              </div>
              <div>
                <p className="font-semibold text-linkedin-text text-sm leading-tight">Your Name</p>
                <p className="text-xs text-linkedin-muted leading-tight mt-0.5">Your Title · 1st</p>
                <p className="text-xs text-linkedin-muted/60 mt-0.5">Just now · 🌐</p>
              </div>
            </div>

            {/* Post body */}
            <div className={`post-preview-text text-sm text-linkedin-text leading-relaxed ${isStreaming ? 'streaming-cursor' : ''}`}>
              {activePost}
            </div>

            {/* Engagement bar */}
            {isDone && (
              <div className="mt-5 pt-3 border-t border-linkedin-border animate-fade-up">
                <div className="flex items-center justify-between text-xs text-linkedin-muted">
                  <span className="flex items-center gap-1">
                    <span className="text-base">👍❤️💡</span> Be the first to react
                  </span>
                </div>
                <div className="flex items-center justify-around mt-3 pt-2 border-t border-linkedin-border/50">
                  {[
                    { icon: ThumbsUp, label: 'Like' },
                    { icon: MessageCircle, label: 'Comment' },
                    { icon: Share2, label: 'Repost' },
                    { icon: Send, label: 'Send' },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                                 text-linkedin-muted hover:bg-linkedin-bg transition-colors">
                      <Icon size={14} />{label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variants section */}
      {isRefining && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-linkedin-muted animate-pulse">
          <Loader2 size={16} className="animate-spin text-linkedin-blue" />
          Generating 3 variants...
        </div>
      )}

      {refineError && (
        <p className="text-xs text-red-500 text-center">{refineError}</p>
      )}

      {variants.length > 0 && (
        <div className="animate-fade-up">
          <p className="text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-3">
            ✨ Refined Variants — pick one
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {variants.map((v) => (
              <VariantCard key={v.strategy} variant={v} onUse={handleUseVariant} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
