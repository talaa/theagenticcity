import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import chapter2Bg from '../assets/chapter2_bg.jpg';
import { PageMeta } from '../components/PageMeta';

export function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, { threshold: 0.15 });

    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <PageMeta
        title="Agentic City — Autonomous AI Agent Workforce Consultancy"
        description="Agentic City turns autonomous AI agents into reliable business infrastructure — strategy, architecture, and production systems."
      />

      <main className="w-full flex-1">
        <div className="flex flex-col w-full h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth" id="scroll-container">

          {/* ========== CHAPTER 01 — HERO ========== */}
          <section id="hero" className="scroll-section min-h-screen w-full relative flex items-center snap-start"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHL8AuOo4cCmLasMb8GqmiVnonhi0qn4GVQlFcoaERLcj8SscmEQOHoUgcB0yXQWkQWjhaZzRmWcayTNSeE0tQX1ku5cdkAE5swEbpq_Ey1IC5xNJ8W9RvlFjkAvSJVXsnpTFs9hpjvsVkUFDHtY-wI5teWSztHDPsgvnrR5Pebxsu4Jn49oSZOiQM8n5xYd3iKBQkFqrk_0XP_1oVRo0lyk6DdT7VSVP7TFTJ9ZUvyia3tPZhrrqXNQ')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30"></div>
            
            {/* Decorative rings */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 border border-primary/20 rounded-full animate-float-ring"></div>
              <div className="absolute top-1/3 right-1/3 w-64 h-64 border border-secondary/15 rounded-full animate-float-ring" style={{ animationDelay: '-2s' }}></div>
            </div>

            <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-[1440px] mx-auto">
              <div className="max-w-3xl reveal-layer">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-8">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-caps text-label-caps text-primary tracking-widest">AI CONSULTANCY</span>
                </div>

                <h1 className="font-headline-xl text-[42px] md:text-headline-xl text-on-surface mb-6 leading-[1.05]">
                  We design & deploy<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-surface-tint text-glow-primary">agentic workforces</span>
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl border-l-2 border-primary pl-6 py-3 mb-10">
                  Agentic City is the consultancy that turns autonomous AI agents into reliable business infrastructure — strategy, architecture, and production systems.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 relative z-20">
                  <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-label-caps text-label-caps rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.45)] transition-all">
                    BOOK STRATEGY CALL
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                  <a href="#work" onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-glass-border text-on-surface font-label-caps text-label-caps rounded-full hover:bg-white/5 transition-all">
                    VIEW SELECTED WORK
                  </a>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal-layer" style={{ transitionDelay: '0.4s' }}>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">SCROLL</span>
              <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent"></div>
            </div>
          </section>

          {/* ========== CHAPTER 02 — SERVICES ========== */}
          <section id="services" className="scroll-section min-h-screen w-full relative flex items-center snap-start py-24 bg-cover bg-center"
            style={{ backgroundImage: `url("${chapter2Bg}")` }}>
            
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/75 pointer-events-none"></div>
            <div className="absolute inset-0 bg-secondary/5 pointer-events-none"></div>

            <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
              <div className="mb-16 reveal-layer">
                <span className="font-label-caps text-label-caps text-secondary tracking-widest block mb-4">CHAPTER 02 // CAPABILITIES</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface max-w-2xl">
                  Full-stack agentic consulting
                </h2>
                <p className="font-body-lg text-on-surface-variant mt-4 max-w-2xl">
                  We don’t just prototype agents. We design the operating system of your autonomous workforce.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Service 1 */}
                <div className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">architecture</span>
                  </div>
                  <h3 className="font-headline-md text-xl text-on-surface mb-3">Agent Strategy & Architecture</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    Opportunity mapping, multi-agent system design, governance frameworks, and ROI modeling before a single line of code is written.
                  </p>
                </div>

                {/* Service 2 */}
                <div className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-primary/30 transition-all" style={{ transitionDelay: '0.1s' }}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
                  </div>
                  <h3 className="font-headline-md text-xl text-on-surface mb-3">Custom Agent Development</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    Production-grade agents for research, operations, creative production, customer workflows, and internal knowledge systems.
                  </p>
                </div>

                {/* Service 3 */}
                <div className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-primary/30 transition-all" style={{ transitionDelay: '0.2s' }}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary">hub</span>
                  </div>
                  <h3 className="font-headline-md text-xl text-on-surface mb-3">Orchestration & Integration</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    Connecting agents to your existing stack (CRMs, data lakes, internal tools) with reliable memory, tools, and human-in-the-loop controls.
                  </p>
                </div>

                {/* Service 4 */}
                <div className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-secondary/30 transition-all" style={{ transitionDelay: '0.15s' }}>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/25 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary">monitoring</span>
                  </div>
                  <h3 className="font-headline-md text-xl text-on-surface mb-3">Evaluation & Observability</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    Continuous evaluation harnesses, tracing, cost control, and safety layers so your agentic systems remain trustworthy at scale.
                  </p>
                </div>

                {/* Service 5 */}
                <div className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-secondary/30 transition-all" style={{ transitionDelay: '0.25s' }}>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/25 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary">groups</span>
                  </div>
                  <h3 className="font-headline-md text-xl text-on-surface mb-3">Team Enablement</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    Training your internal teams to design, prompt, evaluate, and govern agents long after our engagement ends.
                  </p>
                </div>

                {/* Service 6 */}
                <div className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-secondary/30 transition-all" style={{ transitionDelay: '0.35s' }}>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/25 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary">rocket_launch</span>
                  </div>
                  <h3 className="font-headline-md text-xl text-on-surface mb-3">Rapid Pilot → Production</h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                    4–8 week focused pilots that prove value, then a clear path to hardened production systems with SLAs.
                  </p>
                </div>
              </div>

              {/* Tool Feature Banner Card */}
              <div className="reveal-layer glass-panel p-6 md:p-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background/80 to-secondary/10 flex flex-col md:flex-row items-center justify-between gap-6" style={{ transitionDelay: '0.4s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">build</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-terminal-sm text-xs text-primary uppercase tracking-wider font-semibold">Interactive Tool</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-terminal-sm">Free Studio</span>
                    </div>
                    <h3 className="font-headline-md text-lg text-on-surface">Agent & Skills Canvas Studio</h3>
                    <p className="font-body-md text-on-surface-variant text-xs md:text-sm">
                      Design, document, and print A4 landscape blueprints for AI agents and reusable skills.
                    </p>
                  </div>
                </div>
                <Link
                  to="/tools/agent-canvas"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-caps text-label-caps rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  OPEN CANVAS TOOL
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

            </div>
          </section>

          {/* ========== CHAPTER 03 — SELECTED WORK ========== */}
          <section id="work" className="scroll-section min-h-screen w-full relative flex items-center snap-start py-24"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdRAwPSsX1_e6kE5fGTb9IIFmbc-Fn7YWjIr8y31JjJgodfKgQMtjI7UNSm_g6iCKzDUgOgcH3i3-v3NzWmAbHRWNY8Ag3K0-HCOw0CKACNPVK8xglPzvUe2phFTUhrfRIZ0-GDOJy3OiSGHHVJRPQgKb6SN6ZhzSA4VCAYz-tfVEKF7n_fQB-b8mf-cqZddxZYGDD2VbL-y4HII5NAf2ZdzFaXSFh1qzCE5O0Zxt9paQK7bbLe6Rbeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            
            <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 reveal-layer">
                  <span className="font-label-caps text-label-caps text-secondary tracking-widest block mb-4">CHAPTER 03 // SELECTED WORK</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
                    Systems we’ve put into the world
                  </h2>
                  <p className="font-body-md text-on-surface-variant mb-8">
                    Real agentic products and infrastructure built for production environments — not demos.
                  </p>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-primary font-label-caps text-label-caps hover:gap-3 transition-all relative z-20">
                    DISCUSS A SIMILAR BUILD
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Case 1 - Text2Clip Link */}
                  <Link
                    to="/work/text2clip"
                    className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-primary/50 hover:bg-white/10 transition-all flex flex-col justify-between block relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                          <span className="material-symbols-outlined text-primary">movie_edit</span>
                        </div>
                        <span className="font-terminal-sm text-xs text-primary/70">CASE 01</span>
                      </div>
                      <h3 className="font-headline-md text-xl text-on-surface mb-2 group-hover:text-primary transition-colors">Text2Clip</h3>
                      <p className="font-body-md text-on-surface-variant text-sm mb-5">
                        Multi-agent system that turns natural language into fully structured, multi-track video timelines.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-terminal-sm">Video Agents</span>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-terminal-sm">Timeline Gen</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-label-caps text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all pt-2 border-t border-glass-border">
                      <span>View case study</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </Link>

                  {/* Case 2 - OVI AI Voice Link */}
                  <Link
                    to="/work/ovi"
                    className="glass-panel p-8 rounded-2xl reveal-layer group hover:border-secondary/50 hover:bg-white/10 transition-all flex flex-col justify-between block relative overflow-hidden"
                    style={{ transitionDelay: '0.1s' }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-11 h-11 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center group-hover:bg-secondary/20 group-hover:scale-105 transition-all">
                          <span className="material-symbols-outlined text-secondary">graphic_eq</span>
                        </div>
                        <span className="font-terminal-sm text-xs text-secondary/70">CASE 02</span>
                      </div>
                      <h3 className="font-headline-md text-xl text-on-surface mb-2 group-hover:text-secondary transition-colors">OVI AI Voice</h3>
                      <p className="font-body-md text-on-surface-variant text-sm mb-5">
                        Real-time voice synthesis agents with controllable emotion, pacing, and multi-speaker orchestration.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-terminal-sm">Voice Agents</span>
                        <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-terminal-sm">Real-time</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-label-caps text-secondary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all pt-2 border-t border-glass-border">
                      <span>View case study</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </Link>

                  {/* Case 3 - full width (Unchanged) */}
                  <div className="sm:col-span-2 glass-panel p-8 rounded-2xl reveal-layer" style={{ transitionDelay: '0.2s' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">offline_bolt</span>
                          </div>
                          <span className="font-terminal-sm text-xs text-primary/70">CASE 03 — CORE SYSTEM</span>
                        </div>
                        <h3 className="font-headline-md text-xl text-on-surface mb-2">Aura Engine</h3>
                        <p className="font-body-md text-on-surface-variant text-sm max-w-lg">
                          The crystalline orchestration layer that coordinates hundreds of specialized agents with shared memory, tool use, and safety constraints.
                        </p>
                      </div>
                      <div className="flex gap-6 shrink-0">
                        <div className="text-center">
                          <div className="font-terminal-sm text-primary text-xs mb-1">UPTIME</div>
                          <div className="font-headline-md text-on-surface text-2xl">99.99%</div>
                        </div>
                        <div className="text-center">
                          <div className="font-terminal-sm text-secondary text-xs mb-1">NODES</div>
                          <div className="font-headline-md text-on-surface text-2xl">14.2M</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== CHAPTER 04 — TWO PATHS ========== */}
          <section id="method" className="scroll-section min-h-screen w-full relative flex items-center justify-center snap-start py-24"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_rXZcWkTVoGDbIXxbj6OWOgI6W3oHIEd4JxbEkdErvULeF_awPuQkAhQF2Xp6mXsjH3sAtZplNFRbaVqUw7RebVTvuSxxxTK_RRu4NOT5fTRhmOa2-plFJE4o2VaDAGvvI1d5iUKGdgIfz37CNTj19-mqdKfBUpSBvnidzkQD_OaB6Qi9oT5h0z3SDTLXpFvyNcYqutUMbe4uMIUNiwvQLeiTTOFl3Yi7wjjzYBZ-tlOsWTHrt1C_JQ')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            
            <div className="absolute inset-0 bg-background/85"></div>

            <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto">
              {/* Header */}
              <div className="text-center mb-16 reveal-layer">
                <span className="font-label-caps text-label-caps text-secondary tracking-widest block mb-4">CHAPTER 04 // OUR METHOD</span>
                <h2 className="font-headline-lg text-4xl md:text-5xl text-on-surface mb-2">
                  Two Paths to
                </h2>
                <h2 className="font-headline-lg text-4xl md:text-5xl mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-surface-tint text-glow-primary">Agentic Transformation</span>
                </h2>
                <p className="font-body-lg text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                  Whether you orchestrate from the executive suite or automate from the ground up, our dual-axis methodology ensures seamless integration of AI workforces into your operational DNA.
                </p>
              </div>

              {/* Two Path Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Path A: Strategic — Top-Down */}
                <div className="reveal-layer rounded-3xl p-8 md:p-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,245,230,0.95))', border: '1px solid rgba(197,160,89,0.25)', boxShadow: '0 20px 50px -15px rgba(140,111,45,0.12)' }}>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(140,111,45,0.1)', border: '1px solid rgba(140,111,45,0.2)' }}>
                    <span className="material-symbols-outlined text-primary text-3xl">account_tree</span>
                  </div>

                  <span className="font-label-caps text-xs tracking-[0.2em] block mb-3" style={{ color: '#8c6f2d' }}>PATH A: STRATEGIC</span>
                  <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                    Top-Down<br/>Transformation
                  </h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-8">
                    Driven by management consultation, this path identifies high-leverage job roles and orchestrates sweeping workflow optimizations across departments.
                  </p>

                  {/* Steps */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(140,111,45,0.06)', border: '1px solid rgba(140,111,45,0.1)' }}>
                      <span className="material-symbols-outlined text-primary text-xl">work</span>
                      <div>
                        <span className="font-terminal-sm text-[10px] text-primary/70 uppercase tracking-[0.15em] block">Step 01</span>
                        <span className="font-headline-md text-base text-on-surface">Job Mapping</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(140,111,45,0.06)', border: '1px solid rgba(140,111,45,0.1)' }}>
                      <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
                      <div>
                        <span className="font-terminal-sm text-[10px] text-primary/70 uppercase tracking-[0.15em] block">Step 02</span>
                        <span className="font-headline-md text-base text-on-surface">ROI Analysis</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(140,111,45,0.06)', border: '1px solid rgba(140,111,45,0.1)' }}>
                      <span className="material-symbols-outlined text-primary text-xl">groups</span>
                      <div>
                        <span className="font-terminal-sm text-[10px] text-primary/70 uppercase tracking-[0.15em] block">Step 03</span>
                        <span className="font-headline-md text-base text-on-surface">Organizational Alignment</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Path B: Tactical — Bottom-Up */}
                <div className="reveal-layer rounded-3xl p-8 md:p-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,252,240,0.95), rgba(255,248,225,0.95))', border: '1px solid rgba(197,160,89,0.3)', boxShadow: '0 20px 50px -15px rgba(140,111,45,0.12)', transitionDelay: '0.15s' } as React.CSSProperties}>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.25)' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#c5a059' }}>auto_awesome</span>
                  </div>

                  <span className="font-label-caps text-xs tracking-[0.2em] block mb-3" style={{ color: '#c5a059' }}>PATH B: TACTICAL</span>
                  <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                    Bottom-Up<br/>Transformation
                  </h3>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-8">
                    Focusing on the granular level, this path analyzes individual recurring tasks and atomic actions that can be directly and immediately agentified.
                  </p>

                  {/* Steps */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.15)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: '#c5a059' }}>search_insights</span>
                      <div>
                        <span className="font-terminal-sm text-[10px] uppercase tracking-[0.15em] block" style={{ color: 'rgba(197,160,89,0.7)' }}>Step 01</span>
                        <span className="font-headline-md text-base text-on-surface">Task Mining</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.15)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: '#c5a059' }}>integration_instructions</span>
                      <div>
                        <span className="font-terminal-sm text-[10px] uppercase tracking-[0.15em] block" style={{ color: 'rgba(197,160,89,0.7)' }}>Step 02</span>
                        <span className="font-headline-md text-base text-on-surface">Tool Integration</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.15)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: '#c5a059' }}>rocket_launch</span>
                      <div>
                        <span className="font-terminal-sm text-[10px] uppercase tracking-[0.15em] block" style={{ color: 'rgba(197,160,89,0.7)' }}>Step 03</span>
                        <span className="font-headline-md text-base text-on-surface">Rapid Prototyping</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ========== CHAPTER 05 — CONTACT / CTA ========== */}
          <section id="contact" className="scroll-section min-h-screen w-full relative flex items-center snap-start py-24"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD59rlfLu2qa0hIgeHy8sMslzSF6E0jo5okUlLT1Dtnutp-zF9KOsgqlZDRDAkCYsmYDx11-0O6l7YlmJL1tej9p36HYIr8b4b1MMgTEc4Ai0dLv-IOka3a9T9g8GfdMzeCQevdM8KXCothuWvAVdDsRgc7swMlyFcLJ_FRD5PKm79JrF7iJwURejeYCK5SNcN7OrwVO1TzfBvoPqTE06W4XBtKabLdN7xj0R0peDLjQ--4tSWEj6VrLQ')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30"></div>

            <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="w-full lg:w-1/2 reveal-layer">
                  <span className="font-label-caps text-secondary mb-4 block">CHAPTER 05 // THE ATRIUM</span>
                  <h2 className="font-headline-xl text-4xl md:text-6xl text-on-surface mb-6 leading-tight">
                    Ready to build your<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed">agentic advantage?</span>
                  </h2>
                  <p className="font-body-md text-on-surface-variant max-w-md text-lg mb-8">
                    Tell us about the workflows you want to automate. We’ll respond within one business day with a clear point of view.
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      30-minute strategy call
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      No generic decks — tailored to your stack
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      Clear next-step recommendation
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-5/12 reveal-layer" style={{ transitionDelay: '0.15s' }}>
                  <div className="glass-panel p-8 md:p-10 rounded-[28px] relative overflow-hidden border-t border-l border-white/15">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-secondary">calendar_month</span>
                        <h3 className="font-headline-md text-xl text-on-surface">Request a Strategy Call</h3>
                      </div>

                      <form className="flex flex-col gap-5 relative z-20" onSubmit={e => { e.preventDefault(); alert('Form submitted — connect this to your backend or Cal.com / Typeform.'); }}>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">Name</label>
                          <input className="bg-transparent border-b border-glass-border py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-on-surface-variant/40" placeholder="Alex Rivera" type="text" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">Work Email</label>
                          <input className="bg-transparent border-b border-glass-border py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-on-surface-variant/40" placeholder="alex@company.com" type="email" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">What are you looking to build?</label>
                          <textarea className="bg-transparent border-b border-glass-border py-3 text-on-surface focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-on-surface-variant/40 resize-none" rows={3} placeholder="e.g. Research agents + internal knowledge system"></textarea>
                        </div>
                        <button type="submit" className="w-full mt-2 bg-secondary text-on-secondary font-label-caps py-4 rounded-xl hover:shadow-[0_0_25px_rgba(197,160,89,0.35)] transition-all flex justify-center items-center gap-2 group cursor-pointer">
                          <span>BOOK STRATEGY CALL</span>
                          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
