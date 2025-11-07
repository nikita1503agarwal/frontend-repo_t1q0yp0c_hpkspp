import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VoiceConsole from './components/VoiceConsole';
import Features from './components/Features';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#070b12] [background-image:radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.15),rgba(0,0,0,0)),radial-gradient(800px_400px_at_80%_10%,rgba(99,102,241,0.12),rgba(0,0,0,0))]">
      <Navbar />
      <Hero />
      <VoiceConsole />
      <Features />
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 text-center text-sm text-cyan-100/60">
        Built for voice. Designed with glass. Welcome to the future.
      </footer>
    </div>
  );
}

export default App;
