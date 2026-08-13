import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { getAllInsights } from '../lib/insights';
import { InsightType } from '../types/insight';

export function InsightsIndex() {
  const allInsights = useMemo(() => getAllInsights(), []);
  const [selectedType, setSelectedType] = useState<InsightType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allInsights.forEach((item) => {
      item.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [allInsights]);

  // Filter items based on selected type & tag
  const filteredInsights = useMemo(() => {
    return allInsights.filter((item) => {
      const typeMatches = selectedType === 'all' || item.type === selectedType;
      const tagMatches = !selectedTag || (item.tags && item.tags.includes(selectedTag));
      return typeMatches && tagMatches;
    });
  }, [allInsights, selectedType, selectedTag]);

  // Setup scroll reveal animation observer
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
  }, [filteredInsights]);

  const getTypeBadge = (type: InsightType) => {
    switch (type) {
      case 'video':
        return { label: 'VIDEO', icon: 'smart_display', color: 'bg-primary/10 text-primary border-primary/30' };
      case 'podcast':
        return { label: 'PODCAST', icon: 'mic', color: 'bg-secondary/10 text-secondary border-secondary/30' };
      case 'infographic':
        return { label: 'INFOGRAPHIC', icon: 'analytics', color: 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim border-tertiary-fixed-dim/30' };
      case 'article':
        return { label: 'ARTICLE', icon: 'article', color: 'bg-surface-tint/10 text-surface-tint border-surface-tint/30' };
    }
  };

  return (
    <>
      <PageMeta
        title="Agentic City Insights — AI Podcasts, Videos & Technical Blueprints"
        description="Indexable technical insights, production podcasts, video breakdowns, and enterprise AI agent architecture infographics from Agentic City."
      />

      <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex-1">
        {/* Hero Section */}
        <section className="mb-14 reveal-layer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">dataset</span>
            </div>
            <div>
              <span className="font-terminal-sm text-xs text-primary tracking-widest block uppercase">KNOWLEDGE HUB</span>
              <h1 className="font-headline-lg text-4xl md:text-5xl text-on-surface">Agentic City Insights</h1>
            </div>
          </div>
          <p className="font-body-lg text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed">
            Technical deep-dives, video breakdowns, podcasts, and architecture blueprints for building production-grade AI agent systems.
          </p>
        </section>

        {/* Filter Controls */}
        <section className="mb-12 reveal-layer">
          <div className="glass-panel p-6 rounded-3xl border border-glass-border flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-terminal-sm text-xs text-on-surface-variant mr-2 uppercase">TYPE:</span>
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-full font-terminal-sm text-xs transition-all border ${
                  selectedType === 'all'
                    ? 'bg-primary text-on-primary-fixed font-bold border-primary shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                    : 'bg-surface-container-low text-on-surface-variant border-glass-border hover:border-primary/50'
                }`}
              >
                ALL ({allInsights.length})
              </button>
              {(['video', 'podcast', 'infographic', 'article'] as InsightType[]).map((type) => {
                const count = allInsights.filter((i) => i.type === type).length;
                const badge = getTypeBadge(type);
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full font-terminal-sm text-xs transition-all flex items-center gap-1.5 border ${
                      selectedType === type
                        ? 'bg-primary text-on-primary-fixed font-bold border-primary shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                        : 'bg-surface-container-low text-on-surface-variant border-glass-border hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{badge.icon}</span>
                    <span className="uppercase">{type}S</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-glass-border">
                <span className="font-terminal-sm text-xs text-on-surface-variant mr-1 uppercase">TAGS:</span>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="px-2.5 py-1 rounded-md bg-secondary/20 text-secondary border border-secondary/40 font-terminal-sm text-[11px] flex items-center gap-1 hover:bg-secondary/30"
                  >
                    <span>CLEAR TAG</span>
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full font-terminal-sm text-[11px] border transition-colors ${
                      selectedTag === tag
                        ? 'bg-primary/20 text-primary border-primary'
                        : 'bg-surface-container-lowest text-on-surface-variant/80 border-glass-border hover:text-on-surface'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content Cards Grid */}
        {filteredInsights.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-glass-border reveal-layer">
            <span className="material-symbols-outlined text-primary/40 text-5xl mb-3">search_off</span>
            <h3 className="font-headline-md text-xl text-on-surface mb-2">No insights found</h3>
            <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto mb-6">
              No content matches your selected type or tag criteria. Try resetting your active filters.
            </p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedTag(null);
              }}
              className="px-6 py-2.5 bg-primary text-on-primary-fixed rounded-full font-label-caps text-xs hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {filteredInsights.map((entry) => {
              const badge = getTypeBadge(entry.type);
              return (
                <article key={entry.slug} className="reveal-layer flex flex-col">
                  <Link
                    to={`/insights/${entry.slug}`}
                    className="glass-panel rounded-3xl overflow-hidden border border-glass-border hover:border-primary/50 transition-all duration-300 group flex flex-col h-full hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                  >
                    {/* Thumbnail Header */}
                    <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high border-b border-glass-border">
                      {entry.thumbnail ? (
                        <img
                          src={entry.thumbnail}
                          alt={entry.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-surface-container-high to-surface-container-lowest">
                          <span className="material-symbols-outlined text-primary/30 text-5xl mb-2">{badge.icon}</span>
                        </div>
                      )}

                      {/* Type Badge Overlay */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full font-terminal-sm text-[11px] border backdrop-blur-md flex items-center gap-1.5 ${badge.color}`}>
                          <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      {/* Date Overlay */}
                      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-glass-border text-[11px] font-terminal-sm text-on-surface-variant">
                        {entry.publishDate}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3 text-[11px] font-terminal-sm text-on-surface-variant">
                        <span>BY {entry.author.toUpperCase()}</span>
                        <span>•</span>
                        <span>{entry.readingTimeMinutes} MIN READ</span>
                      </div>

                      <h2 className="font-headline-md text-xl md:text-2xl text-on-surface group-hover:text-primary transition-colors mb-3 line-clamp-2">
                        {entry.title}
                      </h2>

                      <p className="font-body-md text-sm text-on-surface-variant line-clamp-3 leading-relaxed mb-6 flex-1">
                        {entry.excerpt}
                      </p>

                      {/* Tags & Action Link */}
                      <div className="pt-4 border-t border-glass-border/40 flex items-center justify-between gap-4 mt-auto">
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded bg-surface-container-low text-[10px] font-terminal-sm text-on-surface-variant">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <span className="font-terminal-sm text-xs text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                          <span>EXPLORE</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
