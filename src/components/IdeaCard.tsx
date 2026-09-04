import React, { useState } from 'react';
import { Idea, CATEGORY_LABELS, STAGE_CONFIG } from '../types/idea';
import { supportIdea } from '../lib/ideasApi';
import { trackIdeaSupported } from '../lib/analytics';
import { getLocallySupportedIdeas } from '../lib/fingerprint';

interface IdeaCardProps {
  idea: Idea;
  onSelect: (idea: Idea) => void;
  onSupportSuccess?: (ideaId: string, newCount: number) => void;
}

export function IdeaCard({ idea, onSelect, onSupportSuccess }: IdeaCardProps) {
  const [supportCount, setSupportCount] = useState(idea.support_count);
  const [isSupporting, setIsSupporting] = useState(false);
  const [hasSupported, setHasSupported] = useState(() => getLocallySupportedIdeas().has(idea.id));
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const categoryInfo = CATEGORY_LABELS[idea.category] || {
    label: idea.category,
    icon: 'hub',
    description: '',
  };

  const stageInfo = STAGE_CONFIG[idea.stage] || {
    label: idea.stage,
    step: 1,
    color: 'text-on-surface-variant',
  };

  const percentage = Math.min(100, Math.round((supportCount / Math.max(1, idea.support_goal)) * 100));

  const handleSupport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSupported || isSupporting) return;

    setIsSupporting(true);
    setFeedbackMessage(null);

    // Optimistic UI update
    const previousCount = supportCount;
    setSupportCount(previousCount + 1);
    setHasSupported(true);

    try {
      const result = await supportIdea(idea.id);
      if (result.success) {
        setSupportCount(result.support_count);
        onSupportSuccess?.(idea.id, result.support_count);
        trackIdeaSupported(idea.id, idea.title, result.support_count);
      } else if (result.alreadySupported) {
        setFeedbackMessage("You've already supported this idea");
        // Reconcile
        if (result.support_count > 0) {
          setSupportCount(result.support_count);
        }
      } else {
        // Rollback optimistic update on real error
        setSupportCount(previousCount);
        setHasSupported(false);
        setFeedbackMessage(result.error || 'Failed to support. Please try again.');
      }
    } catch {
      setSupportCount(previousCount);
      setHasSupported(false);
      setFeedbackMessage('Failed to connect.');
    } finally {
      setIsSupporting(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(idea)}
      className="glass-panel rounded-2xl p-6 md:p-7 flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-terminal-sm text-xs">
            <span className="material-symbols-outlined text-[15px]">{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/5 border border-glass-border font-terminal-sm text-[11px] text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>
            <span>{stageInfo.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-headline-md text-xl text-on-surface group-hover:text-primary transition-colors mb-2.5 leading-snug">
          {idea.title}
        </h3>

        {/* Short Pitch */}
        <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">
          {idea.pitch}
        </p>
      </div>

      {/* Bottom Section: Progress & Support Action */}
      <div className="pt-4 border-t border-glass-border/60">
        {/* Support Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-terminal-sm mb-1.5">
            <span className="text-on-surface-variant">
              <strong className="text-on-surface font-semibold">{supportCount}</strong> / {idea.support_goal} Supported
            </span>
            <span className="text-primary font-semibold">{percentage}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary-fixed-dim to-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs font-terminal-sm text-on-surface-variant">
            {idea.creator_handle && (
              <span className="opacity-80 truncate max-w-[120px]">{idea.creator_handle}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSupport}
              disabled={isSupporting || hasSupported}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-label-caps text-xs transition-all ${
                hasSupported
                  ? 'bg-primary/15 text-primary border border-primary/30 cursor-default'
                  : 'bg-primary text-on-primary hover:shadow-[0_0_15px_rgba(140,111,45,0.35)] active:scale-95 cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {hasSupported ? 'check_circle' : 'thumb_up'}
              </span>
              <span>{hasSupported ? 'Supported' : 'Support'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
          <p className="mt-2 text-[11px] font-terminal-sm text-primary animate-in fade-in">
            {feedbackMessage}
          </p>
        )}
      </div>
    </div>
  );
}
