import { useState, useEffect, useMemo } from 'react';
import { PageMeta } from '../components/PageMeta';
import { Idea, IdeaCategory, IdeaStage, CATEGORY_LABELS, STAGE_CONFIG } from '../types/idea';
import { fetchApprovedIdeas } from '../lib/ideasApi';
import { IdeaCard } from '../components/IdeaCard';
import { IdeaDetailModal } from '../components/IdeaDetailModal';
import { SubmitIdeaModal } from '../components/SubmitIdeaModal';
import { trackIdeaViewed, trackIdeaModalOpened } from '../lib/analytics';

type SortOption = 'most_supported' | 'recently_added';

const ALL_CATEGORIES: { key: 'all' | IdeaCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All Domains', icon: 'apps' },
  { key: 'enterprise_ops', label: 'Enterprise Ops', icon: 'hub' },
  { key: 'creative_media', label: 'Creative & Media', icon: 'movie_edit' },
  { key: 'dev_tools', label: 'Developer Tools', icon: 'terminal' },
  { key: 'fintech_risk', label: 'FinTech & Risk', icon: 'trending_up' },
  { key: 'healthcare_bio', label: 'Healthcare & Bio', icon: 'biotech' },
  { key: 'customer_success', label: 'Customer Success', icon: 'support_agent' },
];

const STAGE_FILTERS: { key: 'all' | IdeaStage; label: string }[] = [
  { key: 'all', label: 'All Stages' },
  { key: 'concept', label: 'Concept' },
  { key: 'prototyping', label: 'Prototyping' },
  { key: 'validated', label: 'Validated' },
  { key: 'production_ready', label: 'Production Ready' },
];

export function IdeasLab() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | IdeaCategory>('all');
  const [selectedStage, setSelectedStage] = useState<'all' | IdeaStage>('all');
  const [sortBy, setSortBy] = useState<SortOption>('most_supported');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeModalIdea, setActiveModalIdea] = useState<Idea | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Load approved ideas on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchApprovedIdeas();
        if (isMounted) {
          setIdeas(data);
        }
      } catch (err) {
        console.error('Failed to load lab ideas:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((idea) => idea.category === selectedCategory);
    }

    // Stage filter
    if (selectedStage !== 'all') {
      result = result.filter((idea) => idea.stage === selectedStage);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.pitch.toLowerCase().includes(q) ||
          (idea.architecture_blueprint && idea.architecture_blueprint.toLowerCase().includes(q)) ||
          (idea.creator_handle && idea.creator_handle.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'most_supported') {
      result.sort((a, b) => b.support_count - a.support_count);
    } else if (sortBy === 'recently_added') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [ideas, selectedCategory, selectedStage, searchQuery, sortBy]);

  // Track filter changes
  useEffect(() => {
    trackIdeaViewed(selectedCategory, selectedStage, filteredIdeas.length);
  }, [selectedCategory, selectedStage, filteredIdeas.length]);

  const handleOpenDetailModal = (idea: Idea) => {
    setActiveModalIdea(idea);
    trackIdeaModalOpened(idea.id, idea.title, idea.category);
  };

  const handleSupportSuccess = (ideaId: string, newCount: number) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === ideaId ? { ...item, support_count: newCount } : item))
    );
    if (activeModalIdea && activeModalIdea.id === ideaId) {
      setActiveModalIdea((prev) => (prev ? { ...prev, support_count: newCount } : null));
    }
  };

  return (
    <>
      <PageMeta
        title="Community Ideas Lab — Agentic City"
        description="A community space for exploring autonomous agent venture concepts. Support ideas you'd want to see built, or submit your own for review."
      />

      <main className="w-full flex-1 py-12 md:py-16">
        <div className="w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
          {/* Header Section */}
          <div className="mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed-dim/15 border border-secondary-fixed-dim/30 text-primary font-terminal-sm text-xs mb-5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="tracking-widest uppercase">COMMUNITY LAB // AGENT VENTURES</span>
            </div>

            <h1 className="font-headline-xl text-3xl md:text-5xl text-on-surface mb-4 leading-tight">
              Explore & Support <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-surface-tint">
                Autonomous Agent Concepts
              </span>
            </h1>

            <p className="font-body-lg text-on-surface-variant text-base md:text-lg leading-relaxed">
              A community space for exploring agent venture concepts. Support ideas you'd want to see built, or submit your own for review.
            </p>
          </div>

          {/* Controls Bar: Categories, Filters, Search & Submit CTA */}
          <div className="space-y-6 mb-10">
            {/* Top Row: Category Tabs & Submit Button */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-glass-border pb-4">
              {/* Category Filter Horizontal Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full font-label-caps text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-low border border-glass-border text-on-surface-variant hover:text-on-surface hover:bg-black/5'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary font-label-caps text-xs rounded-full hover:shadow-[0_0_20px_rgba(197,160,89,0.35)] transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Submit Concept</span>
              </button>
            </div>

            {/* Bottom Row: Search, Stage Filter & Sort Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search concepts, tools, or architects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-glass-border rounded-xl text-sm font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs font-terminal-sm"
                  >
                    clear
                  </button>
                )}
              </div>

              {/* Stage Filter & Sort Options */}
              <div className="flex items-center gap-3">
                {/* Stage Dropdown */}
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as 'all' | IdeaStage)}
                  className="bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 text-xs font-terminal-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  {STAGE_FILTERS.map((stg) => (
                    <option key={stg.key} value={stg.key}>
                      Stage: {stg.label}
                    </option>
                  ))}
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 text-xs font-terminal-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="most_supported">Sort: Most Supported</option>
                  <option value="recently_added">Sort: Recently Added</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ideas Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
                  <div className="h-5 w-28 bg-black/10 rounded-full"></div>
                  <div className="h-7 w-3/4 bg-black/10 rounded-md"></div>
                  <div className="h-16 w-full bg-black/10 rounded-md"></div>
                  <div className="h-2 w-full bg-black/10 rounded-full pt-4"></div>
                </div>
              ))}
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onSelect={handleOpenDetailModal}
                  onSupportSuccess={handleSupportSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-2xl">search_off</span>
              </div>
              <h3 className="font-headline-md text-xl text-on-surface">No matching concepts found</h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Try adjusting your category filters or search query to explore other autonomous agent blueprints.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStage('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2 bg-surface-container-low border border-glass-border rounded-full font-label-caps text-xs text-on-surface hover:bg-black/5 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Idea Detail Modal */}
      <IdeaDetailModal
        idea={activeModalIdea}
        onClose={() => setActiveModalIdea(null)}
        onSupportSuccess={handleSupportSuccess}
      />

      {/* Submit Idea Modal */}
      <SubmitIdeaModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </>
  );
}
