'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Loader2, Mic, MicOff } from 'lucide-react'
import { useMicrophone } from '../../hooks/useMicrophone'

const TONES = ['Professional', 'Inspirational', 'Storytelling', 'Thought Leadership', 'Casual', 'Humorous']

const FORMATS = [
  'Short hook (< 150 words)',
  'Listicle (numbered tips)',
  'Personal story',
  'Opinion / Hot take',
  'Achievement announcement',
]

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-linkedin-text font-medium">{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={`toggle-track w-10 h-6 ${checked ? 'bg-linkedin-blue' : 'bg-linkedin-border'}`}
      >
        <span className={`toggle-thumb absolute top-1 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
    </label>
  )
}

export default function PostForm({ onGenerate, isStreaming }) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const { isRecording, startRecording, stopRecording, transcript, isSupported } = useMicrophone()

  useEffect(() => {
    if (transcript) setTopic(transcript)
  }, [transcript])
  const [postFormat, setPostFormat] = useState('Short hook (< 150 words)')
  const [audience, setAudience] = useState('')
  const [includeCta, setIncludeCta] = useState(true)
  const [addEmojis, setAddEmojis] = useState(true)
  const [hashtagCount, setHashtagCount] = useState(3)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!topic.trim() || isStreaming) return
    onGenerate({
      topic,
      tone,
      post_format: postFormat,
      target_audience: audience,
      include_cta: includeCta,
      add_emojis: addEmojis,
      hashtag_count: hashtagCount,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Topic */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider">
            Topic / Idea *
          </label>
          {isSupported && (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg
                         border transition-all duration-150
                         ${isRecording
                           ? 'bg-red-50 border-red-300 text-red-500'
                           : 'bg-white border-linkedin-border text-linkedin-muted hover:border-linkedin-blue hover:text-linkedin-blue'
                         }`}
            >
              {isRecording && (
                <span className="absolute inset-0 rounded-lg border-2 border-red-400 animate-ping opacity-50" />
              )}
              {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
              {isRecording ? 'Listening...' : 'Voice'}
            </button>
          )}
        </div>
        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Why I quit a $200k job to build in public..."
          rows={3}
          className="input-base resize-none"
          required
        />
      </div>

      {/* Tone */}
      <div>
        <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-2">
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={`pill-btn text-xs ${tone === t ? 'pill-btn-active' : 'pill-btn-inactive'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Post Format */}
      <div>
        <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-1.5">
          Post Format
        </label>
        <select
          value={postFormat}
          onChange={e => setPostFormat(e.target.value)}
          className="input-base"
        >
          {FORMATS.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-1.5">
          Target Audience
        </label>
        <input
          type="text"
          value={audience}
          onChange={e => setAudience(e.target.value)}
          placeholder="e.g. Startup founders, CTOs, Job seekers..."
          className="input-base"
        />
      </div>

      {/* Hashtag Slider */}
      <div>
        <label className="block text-xs font-semibold text-linkedin-muted uppercase tracking-wider mb-2">
          Hashtags
          <span className="ml-2 text-linkedin-blue font-bold">{hashtagCount === 0 ? 'None' : hashtagCount}</span>
        </label>
        <input
          type="range"
          min={0}
          max={10}
          value={hashtagCount}
          onChange={e => setHashtagCount(Number(e.target.value))}
          className="w-full h-1.5 bg-linkedin-border rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-linkedin-blue [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-linkedin-muted/60 mt-1">
          <span>0</span><span>5</span><span>10</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3 p-4 bg-linkedin-bg rounded-lg border border-linkedin-border">
        <Toggle label="Include Call-to-Action" checked={includeCta} onChange={setIncludeCta} />
        <div className="border-t border-linkedin-border" />
        <Toggle label="Add Emojis" checked={addEmojis} onChange={setAddEmojis} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!topic.trim() || isStreaming}
        className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm
                   bg-linkedin-blue text-white transition-all duration-150
                   hover:bg-linkedin-darkblue active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isStreaming ? (
          <><Loader2 size={16} className="animate-spin" /> Generating...</>
        ) : (
          <><Sparkles size={16} /> Generate Post</>
        )}
      </button>
    </form>
  )
}
