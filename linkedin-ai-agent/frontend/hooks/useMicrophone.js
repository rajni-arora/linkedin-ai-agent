'use client'

import { useState, useRef, useEffect } from 'react'

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const SILENCE_TIMEOUT_MS = 6000

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
  }

  const resetSilenceTimer = (recognition) => {
    clearSilenceTimer()
    silenceTimerRef.current = setTimeout(() => {
      recognition.stop()
    }, SILENCE_TIMEOUT_MS)
  }

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      resetSilenceTimer(recognition)
    }

    recognition.onresult = (event) => {
      resetSilenceTimer(recognition)
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setTranscript(final || interim)
    }

    recognition.onend = () => {
      clearSilenceTimer()
      setIsRecording(false)
    }

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error)
      }
      clearSilenceTimer()
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    clearSilenceTimer()
    recognitionRef.current?.stop()
  }

  return { isRecording, startRecording, stopRecording, transcript, isSupported }
}
