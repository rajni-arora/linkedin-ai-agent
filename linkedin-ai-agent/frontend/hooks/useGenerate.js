'use client'

import { useState, useCallback } from 'react'

export function useGenerate() {
  const [post, setPost] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState(null)

  const generate = useCallback(async (formData) => {
    setPost('')
    setIsDone(false)
    setError(null)
    setIsStreaming(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Failed to generate post')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          try {
            const parsed = JSON.parse(raw)
            if (parsed.event === 'done') {
              setIsDone(true)
              setIsStreaming(false)
            } else if (parsed.event === 'error') {
              throw new Error(parsed.message)
            } else if (parsed.text !== undefined) {
              setPost(prev => prev + parsed.text)
            }
          } catch (parseErr) {
            // ignore malformed chunks
          }
        }
      }
    } catch (err) {
      setError(err.message)
      setIsStreaming(false)
    }
  }, [])

  const reset = useCallback(() => {
    setPost('')
    setIsDone(false)
    setError(null)
    setIsStreaming(false)
  }, [])

  return { post, isStreaming, isDone, error, generate, reset }
}
