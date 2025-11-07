import { Bot, Shield, Sparkles, Workflow } from "lucide-react";

const items = [
  {
    icon: Sparkles,
    title: "Glassmorphic Design",
    desc: "Floating panes, subtle bloom and bokeh, and a dark neon palette for a truly futuristic vibe.",
  },
  {
    icon: Bot,
    title: "Voice-First Control",
    desc: "Speak naturally to trigger workflows, launch apps, or query knowledge in real time.",
  },
  {
    icon: Workflow,
    title: "Automation Ready",
    desc: "Link voice intents to actions, scripts, and APIs for a real desktop copilot.",
  },
  {
    icon: Shield,
    title: "Privacy Friendly",
    desc: "All processing stays on your device unless you explicitly connect external AI services.",
  },
];

export default function Features() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl transition hover:bg-white/15"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/40 to-indigo-500/40 text-white shadow-inner shadow-white/10">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cyan-100/80">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
