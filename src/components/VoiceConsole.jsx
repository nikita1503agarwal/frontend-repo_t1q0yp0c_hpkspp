import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2, VolumeX, Zap } from 'lucide-react';

// Compute backend URL: use env if provided, otherwise default to same host on port 8000
const DEFAULT_BACKEND = (typeof window !== 'undefined')
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : '';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND;

// Simple intent matcher to make Jarvis respond without a backend
function getLocalResponse(input) {
  const text = input.toLowerCase();
  const now = new Date();

  if (/hello|hi|hey/.test(text)) return "Hello. How can I assist you today?";
  if (/who are you|your name/.test(text)) return "I'm Jarvis, your voice‑first desktop copilot.";
  if (/time/.test(text)) return `It's ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
  if (/date|day/.test(text)) return `Today is ${now.toLocaleDateString()}.`;
  if (/open (settings|preferences)/.test(text)) return "Opening settings. (This is a demo action.)";
  if (/help|what can you do/.test(text)) return "You can ask for time, date, or say hello. More skills coming soon.";
  return null; // let AI handle unknowns
}

export default function VoiceConsole() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [useAI] = useState(true);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const resumeAfterSpeakRef = useRef(false);

  // Initialize SpeechRecognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      // If TTS is currently speaking, ignore mic input to prevent feedback loops
      if (isSpeakingRef.current) return;

      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript;
        if (res.isFinal) {
          const finalText = text.trim();
          if (!finalText) continue;
          setTranscript((prev) => (prev + ' ' + finalText).trim());
          handleResponse(finalText);
        } else {
          interim += text;
        }
      }
      const interimEl = document.getElementById('interim-text');
      if (interimEl) interimEl.textContent = interim;
    };

    recognition.onend = () => {
      // Auto-restart only if still listening and not paused due to TTS
      if (listening && !isSpeakingRef.current) {
        try { recognition.start(); } catch (_) {}
      }
    };

    recognitionRef.current = recognition;
  }, [listening]);

  const handleResponse = async (finalText) => {
    // 1) Try local intents first
    const local = getLocalResponse(finalText);
    if (local) {
      setLastResponse(local);
      speak(local);
      return;
    }

    // 2) Otherwise call backend Gemini if enabled
    if (useAI && BACKEND_URL) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/jarvis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: finalText })
        });
        const data = await res.json();
        const reply = data?.reply || "";
        if (reply) {
          setLastResponse(reply);
          speak(reply);
          return;
        }
      } catch (e) {
        console.error('Gemini error', e);
      }
    }

    // 3) Fallback echo
    const echo = `Got it: ${finalText}`;
    setLastResponse(echo);
    speak(echo);
  };

  const speak = (text) => {
    if (!ttsEnabled) return;
    if (!('speechSynthesis' in window)) return;

    const r = recognitionRef.current;
    // Mark as speaking BEFORE stopping recognition to avoid race where onend restarts
    isSpeakingRef.current = true;

    // Remember if we should resume listening after speaking
    resumeAfterSpeakRef.current = !!(r && listening);

    // Stop listening while speaking to avoid self-hearing loops
    if (r && listening) {
      try { r.stop(); } catch (_) {}
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 1.0;
    utter.pitch = 1.0;

    utter.onend = () => {
      // speaking finished
      // Small delay before resuming to let microphones settle
      if (resumeAfterSpeakRef.current && r) {
        setTimeout(() => {
          isSpeakingRef.current = false;
          if (!listening) return; // user might have stopped meanwhile
          try { r.start(); } catch (_) {}
        }, 250);
      } else {
        isSpeakingRef.current = false;
      }
    };

    try { window.speechSynthesis.cancel(); } catch (_) {}
    window.speechSynthesis.speak(utter);
  };

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      try { r.stop(); } catch (_) {}
      setListening(false);
      // Also stop any ongoing speech
      if (window.speechSynthesis) try { window.speechSynthesis.cancel(); } catch (_) {}
      isSpeakingRef.current = false;
    } else {
      setTranscript('');
      setLastResponse('');
      try { r.start(); } catch (_) {}
      setListening(true);
    }
  };

  const toggleTts = () => {
    setTtsEnabled((v) => !v);
    if (window.speechSynthesis) try { window.speechSynthesis.cancel(); } catch (_) {}
  };

  const recognitionSupported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <section className="relative z-10 mx-auto -mt-16 w-full max-w-5xl px-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-100/80">
              <Zap className="h-3.5 w-3.5" />
              Realtime Voice Console
            </div>

            {!recognitionSupported && (
              <p className="mb-3 text-sm text-rose-200/90">Your browser does not support the Web Speech API. Try Chrome or Edge.</p>
            )}

            <div className="space-y-3">
              <p className="min-h-[64px] whitespace-pre-wrap text-base leading-relaxed text-cyan-50/90">
                {transcript || 'Tap the mic and start speaking…'}
                <span id="interim-text" className="opacity-60" />
              </p>
              {lastResponse && (
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-cyan-50/90">
                  <span className="mr-2 rounded-md bg-cyan-400/20 px-2 py-0.5 text-xs font-medium text-cyan-100">Jarvis</span>
                  {lastResponse}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggle}
                className={`group relative grid h-20 w-20 place-items-center rounded-2xl border border-white/10 p-0 transition active:scale-95 ${
                  listening ? 'bg-rose-500/70' : 'bg-white/10 hover:bg-white/20'
                }`}
                aria-label={listening ? 'Stop listening' : 'Start listening'}
                disabled={!recognitionSupported}
              >
                {listening ? (
                  <Square className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/30" />
              </button>

              <button
                onClick={toggleTts}
                className={`grid h-12 w-12 place-items-center rounded-xl border border-white/10 text-white transition ${
                  ttsEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 hover:bg-white/10'
                }`}
                aria-label={ttsEnabled ? 'Mute voice' : 'Unmute voice'}
              >
                {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-cyan-100/70">
              {listening ? (isSpeakingRef.current ? 'Speaking…' : 'Listening…') : 'Idle'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
