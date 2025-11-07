import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2, VolumeX, Zap } from 'lucide-react';

// Simple intent matcher to make Jarvis respond without a backend
function getResponse(input) {
  const text = input.toLowerCase();
  const now = new Date();

  if (/hello|hi|hey/.test(text)) return "Hello. How can I assist you today?";
  if (/who are you|your name/.test(text)) return "I'm Jarvis, your voice‑first desktop copilot.";
  if (/time/.test(text)) return `It's ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
  if (/date|day/.test(text)) return `Today is ${now.toLocaleDateString()}.`;
  if (/open (settings|preferences)/.test(text)) return "Opening settings. (This is a demo action.)";
  if (/help|what can you do/.test(text)) return "You can ask for time, date, or say hello. More skills coming soon.";

  // Default fallback echoes the last command briefly
  return `Got it: ${input.trim()}`;
}

export default function VoiceConsole() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript;
        if (res.isFinal) {
          const finalText = text.trim();
          setTranscript((prev) => (prev + ' ' + finalText).trim());
          const reply = getResponse(finalText);
          setLastResponse(reply);
          speak(reply);
        } else {
          interim += text;
        }
      }
      const interimEl = document.getElementById('interim-text');
      if (interimEl) interimEl.textContent = interim;
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [listening]);

  const speak = (text) => {
    if (!ttsEnabled) return;
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      r.stop();
      setListening(false);
    } else {
      setTranscript('');
      setLastResponse('');
      r.start();
      setListening(true);
    }
  };

  const toggleTts = () => {
    setTtsEnabled((v) => !v);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
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
              {listening ? 'Listening…' : 'Idle'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
