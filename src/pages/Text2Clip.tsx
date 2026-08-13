import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

export function Text2Clip() {
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
        title="Text2Clip Case Study — Agentic City"
        description="Case study detailing Text2Clip: a multi-agent system that converts natural language prompts into structured multi-track video timelines."
      />

      <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex-1">
        {/* Breadcrumb / Back link */}
        <div className="mb-10 reveal-layer">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-terminal-sm text-on-surface-variant hover:text-primary transition-colors font-terminal-sm"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>BACK TO SELECTED WORK</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="mb-20 reveal-layer">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">movie_edit</span>
            </div>
            <div>
              <span className="font-terminal-sm text-xs text-primary tracking-widest block uppercase">CASE STUDY // 01</span>
              <h1 className="font-headline-lg text-4xl md:text-5xl text-on-surface">Text2Clip</h1>
            </div>
          </div>

          <p className="font-body-lg text-xl md:text-2xl text-primary-fixed max-w-3xl leading-relaxed mb-8">
            Multi-agent system that turns natural language into fully structured, multi-track video timelines.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-terminal-sm border border-primary/20">Video Agents</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-terminal-sm border border-primary/20">Timeline Gen</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-terminal-sm border border-primary/20">FFmpeg Orchestration</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-terminal-sm border border-primary/20">Multi-Track Synthesis</span>
          </div>

          {/* Hero Visual Placeholder */}
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
            <div className="aspect-video w-full rounded-2xl bg-surface-container-high border border-glass-border flex flex-col items-center justify-center p-6 text-center">
              <span className="material-symbols-outlined text-primary/40 text-6xl mb-4">video_settings</span>
              <p className="font-terminal-sm text-sm text-on-surface-variant max-w-md">
                {"{{TODO: real copy — Screenshot / Interactive demo of Text2Clip timeline engine}}"}
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
                <span className="material-symbols-outlined text-secondary text-2xl">warning</span>
                <h2 className="font-headline-md text-2xl text-on-surface">The Challenge</h2>
              </div>
              <p className="font-body-md text-on-surface-variant text-base leading-relaxed mb-6">
                Traditional video editing requires hours of tedious manual timeline cutting, audio synchronization, lower-third graphic alignment, and clip selection. Single LLM prompts fail to output deterministic multi-track video timelines consistently without breaking JSON schemas or timestamp logic.
              </p>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-glass-border text-xs font-terminal-sm text-secondary">
                {"{{TODO: real copy — Additional specific client pain points and original workflow bottlenecks}}"}
              </div>
            </div>
          </div>

          {/* Approach */}
          <div className="lg:col-span-6 reveal-layer">
            <div className="glass-panel p-8 md:p-10 rounded-2xl h-full border border-glass-border">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">account_tree</span>
                <h2 className="font-headline-md text-2xl text-on-surface">The Solution & Architecture</h2>
              </div>
              <p className="font-body-md text-on-surface-variant text-base leading-relaxed mb-6">
                We designed a modular multi-agent graph with specialized roles: a Script Director agent decomposes text into scenes, an Asset Retrieval agent matches visual B-roll, an Audio Engineer agent handles ducking/music, and a Renderer agent compiles non-linear edit (NLE) JSON timelines.
              </p>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-glass-border text-xs font-terminal-sm text-primary">
                {"{{TODO: real copy — Full architecture diagram and agent inter-communication details}}"}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Key Metrics */}
        <section className="mb-20 reveal-layer">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-primary/20">
            <span className="font-label-caps text-xs text-primary tracking-widest block mb-4">IMPACT & RESULTS</span>
            <h2 className="font-headline-md text-3xl text-on-surface mb-8">Performance & Key Metrics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-surface-container-low border border-glass-border text-center">
                <div className="font-headline-xl text-3xl md:text-4xl text-primary mb-2">10x</div>
                <div className="font-terminal-sm text-xs text-on-surface-variant uppercase">Faster Timeline Drafting</div>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 font-terminal-sm">{"{{TODO: real copy — Replace placeholder metric with verified data}}"}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container-low border border-glass-border text-center">
                <div className="font-headline-xl text-3xl md:text-4xl text-secondary mb-2">99.4%</div>
                <div className="font-terminal-sm text-xs text-on-surface-variant uppercase">Deterministic NLE Output</div>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 font-terminal-sm">{"{{TODO: real copy — Replace placeholder metric with verified data}}"}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-container-low border border-glass-border text-center">
                <div className="font-headline-xl text-3xl md:text-4xl text-surface-tint mb-2">Sub-30s</div>
                <div className="font-terminal-sm text-xs text-on-surface-variant uppercase">Average Generation Latency</div>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 font-terminal-sm">{"{{TODO: real copy — Replace placeholder metric with verified data}}"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-glass-border text-xs font-terminal-sm text-on-surface-variant">
              {"{{TODO: real copy — Add client quote / testimonial block here}}"}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="reveal-layer text-center">
          <div className="glass-panel p-10 md:p-14 rounded-3xl border border-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">
              Need a custom video or multi-modal agent stack?
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-xl mx-auto mb-8">
              We help media, creative, and enterprise teams deploy custom video generation and timeline orchestration pipelines into production.
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
