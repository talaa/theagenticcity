import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { PageMeta } from '../components/PageMeta';
import { getInsightBySlug } from '../lib/insights';

export function InsightDetail() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getInsightBySlug(slug) : null;

  // Reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entryItem) => {
          if (entryItem.isIntersecting) {
            entryItem.target.classList.add('is-revealed');
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
  }, [entry]);

  if (!entry) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center flex-1">
        <PageMeta title="Insight Not Found — Agentic City" description="The requested insight entry could not be found." />
        <span className="material-symbols-outlined text-primary/40 text-6xl mb-4">error_outline</span>
        <h1 className="font-headline-lg text-3xl text-on-surface mb-4">Insight Entry Not Found</h1>
        <p className="font-body-md text-on-surface-variant mb-8">
          The insight entry for <code className="text-primary font-terminal-sm">{slug}</code> does not exist or may have been moved.
        </p>
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary-fixed rounded-full font-label-caps text-xs hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>RETURN TO ALL INSIGHTS</span>
        </Link>
      </div>
    );
  }

  // Construct Structured Data (JSON-LD) dynamically based on entry type
  const getJsonLd = () => {
    const baseUrl = 'https://agenticcity.ai';
    const pageUrl = `${baseUrl}/insights/${entry.slug}`;

    if (entry.type === 'video') {
      return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        'name': entry.title,
        'description': entry.seoDescription,
        'thumbnailUrl': entry.thumbnail ? `${baseUrl}${entry.thumbnail}` : undefined,
        'uploadDate': entry.publishDate,
        'embedUrl': entry.videoUrl,
        'author': {
          '@type': 'Person',
          'name': entry.author,
        },
      };
    }

    if (entry.type === 'podcast') {
      return {
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        'name': entry.title,
        'description': entry.seoDescription,
        'datePublished': entry.publishDate,
        'url': pageUrl,
        'author': {
          '@type': 'Person',
          'name': entry.author,
        },
        'associatedMedia': {
          '@type': 'MediaObject',
          'contentUrl': entry.podcastEmbedUrl,
        },
      };
    }

    // Default for article and infographic
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': entry.title,
      'description': entry.seoDescription,
      'datePublished': entry.publishDate,
      'author': {
        '@type': 'Person',
        'name': entry.author,
      },
      'image': entry.infographicImage || entry.thumbnail ? `${baseUrl}${entry.infographicImage || entry.thumbnail}` : undefined,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': pageUrl,
      },
    };
  };

  const getTypeBadge = () => {
    switch (entry.type) {
      case 'video':
        return { label: 'VIDEO BREAKDOWN', icon: 'smart_display', color: 'bg-primary/10 text-primary border-primary/30' };
      case 'podcast':
        return { label: 'PODCAST EPISODE', icon: 'mic', color: 'bg-secondary/10 text-secondary border-secondary/30' };
      case 'infographic':
        return { label: 'INFOGRAPHIC BLUEPRINT', icon: 'analytics', color: 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim border-tertiary-fixed-dim/30' };
      case 'article':
        return { label: 'TECHNICAL ARTICLE', icon: 'article', color: 'bg-surface-tint/10 text-surface-tint border-surface-tint/30' };
    }
  };

  const badge = getTypeBadge();

  return (
    <>
      <PageMeta title={entry.seoTitle} description={entry.seoDescription} />

      {/* JSON-LD Script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd()) }}
      />

      <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 reveal-layer">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 font-terminal-sm text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>BACK TO ALL INSIGHTS</span>
          </Link>
        </div>

        {/* Entry Header */}
        <header className="mb-12 reveal-layer">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3.5 py-1 rounded-full font-terminal-sm text-xs border flex items-center gap-1.5 ${badge.color}`}>
              <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
              <span>{badge.label}</span>
            </span>

            <span className="text-xs font-terminal-sm text-on-surface-variant">•</span>
            <span className="text-xs font-terminal-sm text-on-surface-variant">{entry.publishDate}</span>
            <span className="text-xs font-terminal-sm text-on-surface-variant">•</span>
            <span className="text-xs font-terminal-sm text-on-surface-variant">BY {entry.author.toUpperCase()}</span>
            <span className="text-xs font-terminal-sm text-on-surface-variant">•</span>
            <span className="text-xs font-terminal-sm text-primary">{entry.readingTimeMinutes} MIN READ</span>
          </div>

          <h1 className="font-headline-lg text-3xl md:text-5xl text-on-surface mb-6 leading-tight max-w-4xl">
            {entry.title}
          </h1>

          <p className="font-body-lg text-lg md:text-xl text-primary-fixed max-w-3xl leading-relaxed mb-6">
            {entry.excerpt}
          </p>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-surface-container-high border border-glass-border font-terminal-sm text-xs text-on-surface-variant">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Media Player / Hero Visual Section per Type */}
        <section className="mb-16 reveal-layer">
          {/* VIDEO TYPE */}
          {entry.type === 'video' && entry.videoUrl && (
            <div className="glass-panel p-4 md:p-6 rounded-3xl border border-primary/30 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-glass-border shadow-2xl">
                <iframe
                  src={entry.videoUrl}
                  title={entry.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* PODCAST TYPE */}
          {entry.type === 'podcast' && entry.podcastEmbedUrl && (
            <div className="glass-panel p-6 rounded-3xl border border-secondary/30 bg-gradient-to-b from-secondary/5 to-transparent">
              <div className="w-full rounded-2xl overflow-hidden border border-glass-border">
                <iframe
                  src={entry.podcastEmbedUrl}
                  title={entry.title}
                  width="100%"
                  height="152"
                  className="border-0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* INFOGRAPHIC TYPE */}
          {entry.type === 'infographic' && entry.infographicImage && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-tertiary-fixed-dim/30 relative overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-terminal-sm text-xs text-tertiary-fixed-dim uppercase tracking-widest">
                  HIGH-RESOLUTION BLUEPRINT MAP
                </span>
                <a
                  href={entry.infographicImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-terminal-sm text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <span>VIEW FULL RESOLUTION</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
              <div className="w-full rounded-2xl overflow-hidden border border-glass-border bg-surface-container-lowest">
                <img
                  src={entry.infographicImage}
                  alt={entry.title}
                  className="w-full h-auto object-contain max-h-[900px] mx-auto"
                />
              </div>
            </div>
          )}
        </section>

        {/* Written Article / Full Transcript Section */}
        <section className="mb-16 reveal-layer">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-glass-border max-w-4xl">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-glass-border">
              <span className="material-symbols-outlined text-primary text-xl">
                {entry.transcript ? 'description' : 'subject'}
              </span>
              <h2 className="font-headline-md text-lg text-primary uppercase tracking-wider font-terminal-sm">
                {entry.transcript ? 'FULL TRANSCRIPT & WRITTEN NOTES' : 'TECHNICAL ANALYSIS & COPY'}
              </h2>
            </div>

            <MarkdownRenderer content={entry.body} />
          </div>
        </section>

        {/* Optional LinkedIn Discussion Callout (No Native Comments) */}
        {entry.linkedinDiscussionUrl && (
          <section className="mb-16 reveal-layer max-w-4xl">
            <a
              href={entry.linkedinDiscussionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-6 md:p-8 rounded-3xl border border-primary/20 hover:border-primary/60 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">chat</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg text-on-surface group-hover:text-primary transition-colors">
                    Discuss this insight on LinkedIn
                  </h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">
                    Join the conversation, ask questions, or share your team&apos;s implementation experience.
                  </p>
                </div>
              </div>
              <span className="font-terminal-sm text-xs text-primary px-4 py-2 rounded-full border border-primary/40 group-hover:bg-primary group-hover:text-on-primary-fixed transition-all flex items-center gap-1.5 shrink-0">
                <span>OPEN LINKEDIN THREAD</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </span>
            </a>
          </section>
        )}

        {/* Persistent Bottom CTA */}
        <section className="reveal-layer text-center">
          <div className="glass-panel p-10 md:p-14 rounded-3xl border border-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">
              Ready to automate your agentic operations?
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-xl mx-auto mb-8">
              We help media, enterprise, and technical teams design and deploy custom multi-agent orchestrators and tool-calling graphs into production.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-on-secondary font-label-caps text-label-caps rounded-full hover:shadow-[0_0_25px_rgba(254,183,0,0.4)] transition-all"
            >
              <span>BOOK A STRATEGY CALL</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
