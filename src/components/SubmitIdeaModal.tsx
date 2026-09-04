import React, { useState, useEffect } from 'react';
import { IdeaCategory, CATEGORY_LABELS } from '../types/idea';
import { submitIdea } from '../lib/ideasApi';
import { trackIdeaSubmitted } from '../lib/analytics';

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: IdeaCategory[] = [
  'enterprise_ops',
  'creative_media',
  'dev_tools',
  'fintech_risk',
  'healthcare_bio',
  'customer_success',
];

export function SubmitIdeaModal({ isOpen, onClose }: SubmitIdeaModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    architecture_blueprint: '',
    category: 'enterprise_ops' as IdeaCategory,
    support_goal: 100,
    creator_handle: '',
    creator_email: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await submitIdea({
        title: formData.title,
        pitch: formData.pitch,
        architecture_blueprint: formData.architecture_blueprint,
        category: formData.category,
        support_goal: Number(formData.support_goal) || 100,
        creator_handle: formData.creator_handle,
        creator_email: formData.creator_email,
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to submit concept.');
      }

      trackIdeaSubmitted({
        title: formData.title,
        category: formData.category,
        hasBlueprint: Boolean(formData.architecture_blueprint?.trim()),
        supportGoal: Number(formData.support_goal) || 100,
        creatorEmail: formData.creator_email,
      });

      setStatus('success');
      setFormData({
        title: '',
        pitch: '',
        architecture_blueprint: '',
        category: 'enterprise_ops',
        support_goal: 100,
        creator_handle: '',
        creator_email: '',
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred while submitting your concept.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#faf8f5]/95 overflow-hidden flex flex-col shadow-2xl border border-glass-border animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 pb-4 flex items-start justify-between border-b border-glass-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed-dim/15 text-primary font-terminal-sm text-xs mb-2">
              <span className="material-symbols-outlined text-[14px]">science</span>
              <span>COMMUNITY LAB SUBMISSION</span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface">
              Submit an Agent Venture Concept
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

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {status === 'success' ? (
            <div className="flex flex-col items-center text-center py-8 px-4 gap-5 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_25px_rgba(140,111,45,0.25)]">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-headline-md text-2xl text-on-surface">Concept In Review</h3>
                <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                  Thanks — your concept is in review and will appear here once approved by the Agentic City moderation team.
                </p>
                <p className="font-terminal-sm text-xs text-on-surface-variant/70 pt-2">
                  We review submissions daily to maintain enterprise-grade signal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  onClose();
                }}
                className="mt-4 px-8 py-3 bg-primary text-on-primary font-label-caps text-xs rounded-full hover:shadow-[0_0_20px_rgba(140,111,45,0.3)] transition-all cursor-pointer"
              >
                Return to Community Lab
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-body-md flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Concept Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Cross-Border Tax Arbitrage Swarm"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-transparent border-b border-glass-border py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md placeholder:text-on-surface-variant/40"
                  disabled={status === 'loading'}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Domain Category <span className="text-primary">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as IdeaCategory }))}
                  className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary cursor-pointer"
                  disabled={status === 'loading'}
                >
                  {CATEGORIES.map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {CATEGORY_LABELS[catKey].label} — {CATEGORY_LABELS[catKey].description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pitch */}
              <div className="flex flex-col gap-1.5">
                <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Executive Pitch (1-2 Sentences) <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize what problem this autonomous agent solves and what human workflow it eliminates."
                  value={formData.pitch}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pitch: e.target.value }))}
                  className="bg-transparent border-b border-glass-border py-2 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md placeholder:text-on-surface-variant/40 resize-none"
                  disabled={status === 'loading'}
                ></textarea>
              </div>

              {/* Architecture Blueprint */}
              <div className="flex flex-col gap-1.5">
                <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                  <span>Architecture Blueprint & Tools (Optional)</span>
                  <span className="text-[10px] text-on-surface-variant/60">Markdown Supported</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline the agent graph, subagent roles, memory stores, safety guardrails, and required tool integrations."
                  value={formData.architecture_blueprint}
                  onChange={(e) => setFormData((prev) => ({ ...prev, architecture_blueprint: e.target.value }))}
                  className="bg-surface-container-lowest border border-glass-border rounded-xl p-3.5 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md text-sm placeholder:text-on-surface-variant/40 resize-y"
                  disabled={status === 'loading'}
                ></textarea>
              </div>

              {/* Support Goal & Creator Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                    Community Support Goal
                  </label>
                  <input
                    type="number"
                    min={25}
                    max={1000}
                    value={formData.support_goal}
                    onChange={(e) => setFormData((prev) => ({ ...prev, support_goal: parseInt(e.target.value, 10) || 100 }))}
                    className="bg-transparent border-b border-glass-border py-2 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md"
                    disabled={status === 'loading'}
                  />
                  <span className="text-[10px] font-terminal-sm text-on-surface-variant/60">Target support votes to validate</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                    Creator Public Handle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @sarah_systems"
                    value={formData.creator_handle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, creator_handle: e.target.value }))}
                    className="bg-transparent border-b border-glass-border py-2 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md placeholder:text-on-surface-variant/40"
                    disabled={status === 'loading'}
                  />
                  <span className="text-[10px] font-terminal-sm text-on-surface-variant/60">Displayed on the public card</span>
                </div>
              </div>

              {/* Creator Email (Required Lead Capture) */}
              <div className="rounded-2xl p-4 bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-terminal-sm text-xs text-primary uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                    <span>Creator Work Email (Required)</span>
                  </label>
                  <span className="text-[10px] font-terminal-sm text-on-surface-variant">Never displayed publicly</span>
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.creator_email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, creator_email: e.target.value }))}
                  className="bg-surface-container-lowest border border-glass-border rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md placeholder:text-on-surface-variant/40 text-sm"
                  disabled={status === 'loading'}
                />
                <p className="text-[11px] font-body-md text-on-surface-variant leading-snug">
                  Used by our team to notify you upon approval and coordinate prototype sprints.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-glass-border text-on-surface font-label-caps text-xs hover:bg-black/5 transition-colors cursor-pointer"
                  disabled={status === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-on-primary font-label-caps text-xs rounded-full hover:shadow-[0_0_20px_rgba(140,111,45,0.35)] transition-all cursor-pointer disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Concept for Review</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
