import { Settings, Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/60 to-cyan-400/60 shadow-inner shadow-white/10">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-cyan-200/90">Jarvis</p>
              <h1 className="-mt-0.5 text-lg font-semibold text-white">Ultra Assistant</h1>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/20">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
