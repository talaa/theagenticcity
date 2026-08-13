import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AgentDrone } from './AgentDrone';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetHash: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetHash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', targetHash);
      }
    } else {
      e.preventDefault();
      navigate(`/${targetHash}`);
    }
  };

  const isHome = location.pathname === '/';
  const isTools = location.pathname.startsWith('/tools');
  const isInsights = location.pathname.startsWith('/insights');

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen overflow-x-hidden flex flex-col">
      {/* Agent Drones - Stopped on Tools page as requested */}
      {!isTools && (
        <>
          <AgentDrone variant="blue" label="DROID // 01" delayOffset={0} />
          <AgentDrone variant="red" label="DROID // 02" delayOffset={1500} />
        </>
      )}

      {/* ========== HEADER ========== */}
      <header className="fixed top-0 w-full z-50 bg-[#faf8f5]/85 backdrop-blur-xl border-b border-glass-border shadow-sm">
        <div className="h-20 w-full px-margin-mobile md:px-margin-desktop flex items-center justify-between max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo.png"
              alt="Agentic City"
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#hero"
              onClick={(e) => handleAnchorClick(e, '#hero')}
              className={`font-label-caps text-label-caps py-1 transition-colors ${
                isHome ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              HOME
            </a>
            <a
              href="#services"
              onClick={(e) => handleAnchorClick(e, '#services')}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-1"
            >
              SERVICES
            </a>
            <a
              href="#work"
              onClick={(e) => handleAnchorClick(e, '#work')}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-1"
            >
              WORK
            </a>
            <a
              href="#method"
              onClick={(e) => handleAnchorClick(e, '#method')}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-1"
            >
              APPROACH
            </a>
            <Link
              to="/insights"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-label-caps py-1 transition-colors ${
                isInsights ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              INSIGHTS
            </Link>
            <Link
              to="/tools/agent-canvas"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-label-caps py-1 transition-colors flex items-center gap-1.5 ${
                isTools ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-primary">build</span>
              TOOLS
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, '#contact')}
              className="hidden sm:inline-flex bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-label-caps text-label-caps hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all cursor-pointer shadow-md"
            >
              BOOK STRATEGY CALL
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-on-surface hover:bg-black/5 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#faf8f5]/95 backdrop-blur-2xl border-b border-glass-border px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            <a
              href="#hero"
              onClick={(e) => handleAnchorClick(e, '#hero')}
              className="font-label-caps text-label-caps text-on-surface py-2 border-b border-glass-border/50"
            >
              HOME
            </a>
            <a
              href="#services"
              onClick={(e) => handleAnchorClick(e, '#services')}
              className="font-label-caps text-label-caps text-on-surface-variant py-2 border-b border-glass-border/50"
            >
              SERVICES
            </a>
            <a
              href="#work"
              onClick={(e) => handleAnchorClick(e, '#work')}
              className="font-label-caps text-label-caps text-on-surface-variant py-2 border-b border-glass-border/50"
            >
              WORK
            </a>
            <a
              href="#method"
              onClick={(e) => handleAnchorClick(e, '#method')}
              className="font-label-caps text-label-caps text-on-surface-variant py-2 border-b border-glass-border/50"
            >
              APPROACH
            </a>
            <Link
              to="/insights"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-caps text-label-caps text-primary py-2 flex items-center gap-2 border-b border-glass-border/50"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">dataset</span>
              INSIGHTS & RESOURCES
            </Link>
            <Link
              to="/tools/agent-canvas"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-caps text-label-caps text-primary py-2 flex items-center gap-2 border-b border-glass-border/50"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">build</span>
              AGENT & SKILLS CANVAS TOOL
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, '#contact')}
              className="inline-flex justify-center items-center bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-caps text-label-caps mt-2 shadow-md"
            >
              BOOK STRATEGY CALL
            </a>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full pt-20 flex flex-col">
        <Outlet />
      </div>

      {/* Persistent Footer */}
      <footer className="w-full bg-surface-container-low border-t border-glass-border py-10">
        <div className="w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Agentic City" className="h-8 w-auto object-contain opacity-80" />
            <span className="font-terminal-sm text-terminal-sm text-on-surface-variant">© 2025 AGENTIC CITY. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6 relative z-20">
            <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="mailto:contact@agenticcity.ai" aria-label="Email Us"><span className="material-symbols-outlined">mail</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#" aria-label="Website"><span className="material-symbols-outlined">public</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#" aria-label="Social Handle"><span className="material-symbols-outlined">alternate_email</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
