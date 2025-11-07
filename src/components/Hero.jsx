import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4Zh-Q6DWWp5yPnQf/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/90 backdrop-blur-xl">
          Glassmorphic • Voice-First • AI
        </span>
        <h2 className="mt-6 bg-gradient-to-br from-white via-cyan-100 to-cyan-300 bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl">
          Meet Jarvis — your ultra‑futuristic desktop copilot
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-cyan-100/80 sm:text-lg">
          Speak naturally. Watch the interface ripple with living glass while real‑time AI executes your commands.
        </p>
      </div>
    </section>
  );
}
