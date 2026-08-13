import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

export function Ovi() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-layer');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <PageMeta
        title="OVI AI Voice Case Study — Agentic City"
        description="Case study detailing OVI AI Voice: real-time voice synthesis agents with controllable emotion, pacing, and multi-speaker orchestration."
      />

      <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex-1">
        {/* Breadcrumb / Back link */}
        <div className="mb-10 reveal-layer">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-terminal-sm text-on-surface-variant hover:text-secondary transition-colors font-terminal-sm"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>BACK TO SELECTED WORK</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="mb-20 reveal-layer">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl">graphic_eq</span>
            </div>
            <div>
              <span className="font-terminal-sm text-xs text-secondary tracking-widest block uppercase">CASE STUDY // 02</span>
              <h1 className="font-headline-lg text-4xl md:text-5xl text-on-surface">OVI AI Voice</h1>
            </div>
          </div>

          <p className="font-body-lg text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed mb-8">
            Real-time voice synthesis agents with controllable emotion, pacing, and multi-speaker orchestration.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-terminal-sm border border-secondary/20">Voice Agents</span>
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-terminal-sm border border-secondary/20">Real-time Streaming</span>
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-terminal-sm border border-secondary/20">Emotion Modulation</span>
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-terminal-sm border border-secondary/20">Multi-Speaker Graph</span>
          </div>

          {/* Hero Visual Placeholder */}
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-secondary/20 relative overflow-hidden bg-gradient-to-b from-secondary/5 to-transparent">
            <div className="aspect-video w-full rounded-2xl bg-surface-container-high border border-glass-border flex flex-col items-center justify-center p-6 text-center">
              <span className="material-symbols-outlined text-secondary/40 text-6xl mb-4">mic</span>
              <p className="font-terminal-sm text-sm text-on-surface-variant max-w-md">
                {"{{TODO: real copy — Screenshot / Audio Visualizer / Audio Sample Player for OVI AI Voice}}"}
              </p>
            </div>
          </div>
        </section>

        {/* Grid Content: Problem & Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Problem */}
          <div className="lg:col-span-6 reveal-layer">
            <div className="glass-panel p-8 md:p-10 rounded-2xl h-full border border-glass-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary text-2xl">error</span>
                <h2 className="font-headline-md text-2xl text-on-surface">The Challenge</h2>
              </div>
              <p className="font-body-md text-on-surface-variant text-base leading-relaxed mb-6">
                Conversational AI voice agents often sound robotic, exhibit high latency turn-taking, and lack granular control over emotional cadence, interruptions, and context switching across multi-turn dialogs.
              </p>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-glass-border text-xs font-terminal-sm text-secondary">
                {"{{TODO: real copy — Detailed latency metrics and client voice interaction challenges}}"}
              </div>
            </div>
          </div>

          {/* Approach */}
          <div className="lg:col-span-6 reveal-layer">
            <div className="glass-panel p-8 md:p-10 rounded-2xl h-full border border-glass-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">neurology</span>
                <h2 className="font-headline-md text-2xl text-on-surface">The Solution & Architecture</h2>
              </div>
              <p className="font-body-md text-on-surface-variant text-base leading-relaxed mb-6">
                We built an ultra-low latency streaming voice engine using WebSockets and streaming audio buffers. An emotion director node injects prosody and vocal emotion tags in real-time while maintaining turn-taking state across multiple concurrent voice actors.
              </p>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-glass-border text-xs font-terminal-sm text-primary">
                {"{{TODO: real copy — Diagram of audio stream pipeline, VAD (Voice Activity Detection), and LLM response loop}}"}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Key Metrics */}
        <section className="mb-20 reveal-layer">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-secondary/20">
            <span className="font-label-caps text-xs text-secondary tracking-widest block mb-4">IMPACT & RESULTS</span>
            <h2 className="font-headline-md text-3xl text-on-surface mb-8">Performance & Key Metrics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-surface-container-low border border-glass-border text-center">
                <div className="font-headline-xl text-3xl md:text-4xl text-secondary mb-2">&lt; 350ms</div>
                <div className="font-terminal-sm text-xs text-on-surface-variant uppercase">Glass-to-Glass Latency</div>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 font-terminal-sm">{"{{TODO: real copy — Replace placeholder metric with verified data}}"}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container-low border border-glass-border text-center">
                <div className="font-headline-xl text-3xl md:text-4xl text-primary mb-2">12+</div>
                <div className="font-terminal-sm text-xs text-on-surface-variant uppercase">Dynamic Emotion Modes</div>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 font-terminal-sm">{"{{TODO: real copy — Replace placeholder metric with verified data}}"}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container-low border border-glass-border text-center">
                <div className="font-headline-xl text-3xl md:text-4xl text-surface-tint mb-2">99.9%</div>
                <div className="font-terminal-sm text-xs text-on-surface-variant uppercase">Audio Stream Stability</div>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 font-terminal-sm">{"{{TODO: real copy — Replace placeholder metric with verified data}}"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-glass-border text-xs font-terminal-sm text-on-surface-variant">
              {"{{TODO: real copy — Add client quote / voice implementation outcome here}}"}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="reveal-layer text-center">
          <div className="glass-panel p-10 md:p-14 rounded-3xl border border-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">
              Building real-time voice agents or audio infrastructure?
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-xl mx-auto mb-8">
              We design and deploy real-time voice agent graphs with full control over emotion, interruption handling, and custom TTS integration.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-on-secondary font-label-caps text-label-caps rounded-full hover:shadow-[0_0_25px_rgba(254,183,0,0.4)] transition-all"
            >
              <span>BOOK A STRATEGY CALL ABOUT A SIMILAR BUILD</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
