import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2, Zap } from 'lucide-react';

export default function VoiceConsole() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

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
        if (res.isFinal) {
          setTranscript((prev) => (prev + ' ' + res[0].transcript).trim());
        } else {
          interim += res[0].transcript;
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

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      r.stop();
      setListening(false);
    } else {
      setTranscript('');
      r.start();
      setListening(true);
    }
  };

  return (
    <section className="relative z-10 mx-auto -mt-16 w-full max-w-5xl px-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-100/80">
              <Zap className="h-3.5 w-3.5" />
              Realtime Voice Console
            </div>
            <p className="min-h-[64px] whitespace-pre-wrap text-base leading-relaxed text-cyan-50/90">
              {transcript || 'Tap the mic and start speaking…'}
              <span id="interim-text" className="opacity-60" />
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={toggle}
              className={`group relative grid h-20 w-20 place-items-center rounded-2xl border border-white/10 p-0 transition active:scale-95 ${
                listening ? 'bg-rose-500/70' : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-label={listening ? 'Stop listening' : 'Start listening'}
            >
              {listening ? (
                <Square className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/30" />
            </button>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-cyan-100/70">
              <Volume2 className="h-3.5 w-3.5" />
              {listening ? 'Listening…' : 'Idle'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
