import React, { useState, useEffect } from 'react';
import { Idea, CATEGORY_LABELS, STAGE_CONFIG, IdeaStage } from '../types/idea';
import { supportIdea } from '../lib/ideasApi';
import { trackIdeaSupported } from '../lib/analytics';
import { getLocallySupportedIdeas } from '../lib/fingerprint';

interface IdeaDetailModalProps {
  idea: Idea | null;
  onClose: () => void;
  onSupportSuccess?: (ideaId: string, newCount: number) => void;
}

const STAGES: IdeaStage[] = ['concept', 'prototyping', 'validated', 'production_ready'];

export function IdeaDetailModal({ idea, onClose, onSupportSuccess }: IdeaDetailModalProps) {
  if (!idea) return null;

  const [supportCount, setSupportCount] = useState(idea.support_count);
  const [isSupporting, setIsSupporting] = useState(false);
  const [hasSupported, setHasSupported] = useState(() => getLocallySupportedIdeas().has(idea.id));
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    setSupportCount(idea.support_count);
    setHasSupported(getLocallySupportedIdeas().has(idea.id));
    setFeedbackMessage(null);
  }, [idea]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const categoryInfo = CATEGORY_LABELS[idea.category] || {
    label: idea.category,
    icon: 'hub',
    description: '',
  };

  const percentage = Math.min(100, Math.round((supportCount / Math.max(1, idea.support_goal)) * 100));
  const currentStageIndex = STAGES.indexOf(idea.stage);

  const handleSupport = async () => {
    if (hasSupported || isSupporting) return;

    setIsSupporting(true);
    setFeedbackMessage(null);

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
        if (result.support_count > 0) {
          setSupportCount(result.support_count);
        }
      } else {
        setSupportCount(previousCount);
        setHasSupported(false);
        setFeedbackMessage(result.error || 'Failed to support.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#faf8f5]/95 overflow-hidden flex flex-col shadow-2xl border border-glass-border animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 md:p-8 pb-4 flex items-start justify-between border-b border-glass-border">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-terminal-sm text-xs">
                <span className="material-symbols-outlined text-[15px]">{categoryInfo.icon}</span>
                <span>{categoryInfo.label}</span>
              </span>
              {idea.creator_handle && (
                <span className="font-terminal-sm text-xs text-on-surface-variant">
                  Architect: <strong className="text-on-surface">{idea.creator_handle}</strong>
                </span>
              )}
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface leading-tight">
              {idea.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center text-on-surface hover:bg-black/5 transition-colors cursor-pointer shrink-0 ml-4"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Executive Summary */}
          <div>
            <h4 className="font-terminal-sm text-xs uppercase tracking-wider text-secondary-fixed-dim font-semibold mb-2">
              Concept Summary & Problem
            </h4>
            <p className="font-body-lg text-on-surface text-base md:text-lg leading-relaxed">
              {idea.pitch}
            </p>
          </div>

          {/* Stage Progression Track */}
          <div className="rounded-2xl p-5 bg-surface-container-low border border-glass-border/60">
            <h4 className="font-terminal-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-4">
              Development Lifecycle Stage
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STAGES.map((stgKey, idx) => {
                const stg = STAGE_CONFIG[stgKey];
                const isActive = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stgKey}
                    className={`rounded-xl p-3 border transition-all ${
                      isCurrent
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : isActive
                        ? 'bg-white/80 border-glass-border text-on-surface'
                        : 'bg-black/5 border-transparent text-on-surface-variant/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-terminal-sm text-[10px] opacity-70">0{idx + 1}</span>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                    </div>
                    <div className="text-xs font-headline-md">{stg.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architecture Blueprint */}
          {idea.architecture_blueprint && (
            <div>
              <h4 className="font-terminal-sm text-xs uppercase tracking-wider text-secondary-fixed-dim font-semibold mb-3">
                Agent Architecture & Technical Specification
              </h4>
              <div className="rounded-2xl p-6 bg-surface-container-lowest border border-glass-border font-body-md text-sm leading-relaxed text-on-surface whitespace-pre-line space-y-4">
                {idea.architecture_blueprint}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Support Bar */}
        <div className="p-6 md:p-8 pt-4 bg-surface-container-low border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2">
            <div className="flex items-center justify-between text-xs font-terminal-sm mb-1.5">
              <span className="text-on-surface-variant">
                <strong className="text-on-surface font-semibold">{supportCount}</strong> / {idea.support_goal} Supported
              </span>
              <span className="text-primary font-semibold">{percentage}% of goal</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary-fixed-dim to-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            {feedbackMessage && (
              <p className="mt-1.5 text-[11px] font-terminal-sm text-primary">
                {feedbackMessage}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-glass-border text-on-surface font-label-caps text-xs hover:bg-black/5 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSupport}
              disabled={isSupporting || hasSupported}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-label-caps text-xs transition-all shadow-md ${
                hasSupported
                  ? 'bg-primary/15 text-primary border border-primary/30 cursor-default'
                  : 'bg-primary text-on-primary hover:shadow-[0_0_20px_rgba(140,111,45,0.4)] active:scale-95 cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {hasSupported ? 'check_circle' : 'thumb_up'}
              </span>
              <span>{hasSupported ? 'Concept Supported' : 'Support This Idea'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
