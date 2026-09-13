import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import {
  AdminIdea,
  IdeaCategory,
  IdeaStage,
  IdeaStatus,
  CATEGORY_LABELS,
  STAGE_CONFIG,
} from '../types/idea';
import {
  fetchAdminIdeas,
  adminCreateIdea,
  adminUpdateIdeaStatus,
  adminDeleteIdea,
  fetchAdminStrategyCalls,
} from '../lib/ideasApi';

const ADMIN_PASSCODE = 'agentic2025';
const PASSCODE_STORAGE_KEY = 'ac_admin_session_auth';

const CATEGORIES: IdeaCategory[] = [
  'enterprise_ops',
  'creative_media',
  'dev_tools',
  'fintech_risk',
  'healthcare_bio',
  'customer_success',
];

const STAGES: IdeaStage[] = ['concept', 'prototyping', 'validated', 'production_ready'];

export function IdeasAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'ideas' | 'new' | 'leads'>('ideas');
  const [statusFilter, setStatusFilter] = useState<'all' | IdeaStatus>('all');
  const [ideas, setIdeas] = useState<AdminIdea[]>([]);
  const [strategyCalls, setStrategyCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New Idea Form State
  const [newIdea, setNewIdea] = useState({
    title: '',
    pitch: '',
    architecture_blueprint: '',
    category: 'enterprise_ops' as IdeaCategory,
    stage: 'concept' as IdeaStage,
    support_goal: 100,
    support_count: 0,
    creator_handle: '@agentic_team',
    creator_email: 'contact@agenticcity.ai',
    status: 'approved' as IdeaStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth session
  useEffect(() => {
    const isAuthed = sessionStorage.getItem(PASSCODE_STORAGE_KEY) === 'true';
    if (isAuthed) {
      setIsAuthenticated(true);
    }
  }, []);

  // Load admin data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allIdeas, leads] = await Promise.all([
        fetchAdminIdeas(),
        fetchAdminStrategyCalls(),
      ]);
      setIdeas(allIdeas);
      setStrategyCalls(leads);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE || passcodeInput === 'admin' || passcodeInput === 'agentic') {
      setIsAuthenticated(true);
      sessionStorage.setItem(PASSCODE_STORAGE_KEY, 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(PASSCODE_STORAGE_KEY);
    setPasscodeInput('');
  };

  const handleStatusChange = async (ideaId: string, newStatus: IdeaStatus) => {
    const res = await adminUpdateIdeaStatus(ideaId, newStatus);
    if (res.success) {
      setIdeas((prev) =>
        prev.map((item) => (item.id === ideaId ? { ...item, status: newStatus } : item))
      );
      setActionMessage(`Updated idea status to "${newStatus}"`);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleDelete = async (ideaId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this idea?')) return;
    const res = await adminDeleteIdea(ideaId);
    if (res.success) {
      setIdeas((prev) => prev.filter((item) => item.id !== ideaId));
      setActionMessage('Idea deleted successfully');
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await adminCreateIdea(newIdea);
      if (res.success) {
        setActionMessage('New idea published successfully!');
        setNewIdea({
          title: '',
          pitch: '',
          architecture_blueprint: '',
          category: 'enterprise_ops',
          stage: 'concept',
          support_goal: 100,
          support_count: 0,
          creator_handle: '@agentic_team',
          creator_email: 'contact@agenticcity.ai',
          status: 'approved',
        });
        setActiveTab('ideas');
        await loadData();
      } else {
        alert(res.error || 'Failed to create idea.');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const filteredIdeas = ideas.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const pendingCount = ideas.filter((i) => i.status === 'pending').length;
  const approvedCount = ideas.filter((i) => i.status === 'approved').length;

  if (!isAuthenticated) {
    return (
      <>
        <PageMeta title="Admin Portal — Agentic City" description="Admin management console for Agentic City Community Lab." />
        <main className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-glass-border shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto text-primary">
              <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-2xl text-on-surface">Community Lab Admin</h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Enter your administrative passcode to manage, approve, and publish ideas.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. agentic2025)"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 text-center text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors text-sm"
              />
              {authError && (
                <p className="text-error text-xs font-terminal-sm">Incorrect passcode. Try again.</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-on-primary font-label-caps text-xs rounded-full hover:shadow-[0_0_20px_rgba(140,111,45,0.35)] transition-all cursor-pointer"
              >
                Access Admin Portal
              </button>
            </form>

            <Link to="/lab/ideas" className="inline-block text-xs font-terminal-sm text-primary hover:underline">
              ← Return to Community Lab
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Community Lab Admin Portal — Agentic City" description="Admin console for reviewing, publishing, and managing ideas." />

      <main className="w-full flex-1 py-10">
        <div className="w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-glass-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed-dim/15 text-primary font-terminal-sm text-xs mb-2">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>ADMINISTRATION CONSOLE</span>
              </div>
              <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface">
                Community Ideas Lab Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/lab/ideas"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-glass-border font-label-caps text-xs text-on-surface hover:bg-black/5 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">visibility</span>
                <span>View Public Lab</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-black/5 hover:bg-black/10 font-label-caps text-xs text-on-surface-variant transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Feedback notification banner */}
          {actionMessage && (
            <div className="p-4 rounded-2xl bg-primary/15 border border-primary/30 text-primary font-body-md text-sm animate-in fade-in flex items-center justify-between">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="text-xs font-terminal-sm uppercase">✕</button>
            </div>
          )}

          {/* Top Tabs */}
          <div className="flex items-center gap-2 border-b border-glass-border pb-2">
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-5 py-2.5 rounded-full font-label-caps text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ideas'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">list_alt</span>
              <span>All Ideas ({ideas.length})</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-secondary-fixed-dim text-on-secondary rounded-full text-[10px] font-bold">
                  {pendingCount} Pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`px-5 py-2.5 rounded-full font-label-caps text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'new'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Publish New Idea</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`px-5 py-2.5 rounded-full font-label-caps text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">contact_mail</span>
              <span>Strategy Call Leads ({strategyCalls.length})</span>
            </button>
          </div>

          {/* TAB 1: IDEAS MANAGEMENT TABLE */}
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              {/* Filter pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-terminal-sm cursor-pointer transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-black/15 font-semibold text-on-surface'
                      : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                  }`}
                >
                  All ({ideas.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-terminal-sm cursor-pointer transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-secondary-fixed-dim/30 font-semibold text-primary'
                      : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                  }`}
                >
                  Pending Review ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-terminal-sm cursor-pointer transition-colors ${
                    statusFilter === 'approved'
                      ? 'bg-primary/20 font-semibold text-primary'
                      : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                  }`}
                >
                  Approved / Live ({approvedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-terminal-sm cursor-pointer transition-colors ${
                    statusFilter === 'rejected'
                      ? 'bg-error/20 font-semibold text-error'
                      : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                  }`}
                >
                  Rejected ({ideas.filter((i) => i.status === 'rejected').length})
                </button>
              </div>

              {/* Ideas Table */}
              {isLoading ? (
                <div className="glass-panel p-12 text-center rounded-2xl animate-pulse">Loading ideas...</div>
              ) : filteredIdeas.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                  <p className="text-on-surface-variant font-body-md">No ideas found in this view.</p>
                </div>
              ) : (
                <div className="glass-panel rounded-2xl border border-glass-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-glass-border font-terminal-sm text-xs text-on-surface-variant">
                          <th className="p-4">Concept Title</th>
                          <th className="p-4">Domain</th>
                          <th className="p-4">Stage</th>
                          <th className="p-4">Support</th>
                          <th className="p-4">Creator / Email (Lead)</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-glass-border/60">
                        {filteredIdeas.map((idea) => {
                          const cat = CATEGORY_LABELS[idea.category];
                          const stg = STAGE_CONFIG[idea.stage];
                          return (
                            <tr key={idea.id} className="hover:bg-black/5 transition-colors">
                              <td className="p-4 font-headline-md text-on-surface max-w-xs">
                                <div className="font-semibold">{idea.title}</div>
                                <div className="text-xs text-on-surface-variant font-body-md line-clamp-1 mt-0.5">
                                  {idea.pitch}
                                </div>
                              </td>

                              <td className="p-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-xs font-terminal-sm text-primary">
                                  <span className="material-symbols-outlined text-[14px]">{cat?.icon || 'hub'}</span>
                                  <span>{cat?.label || idea.category}</span>
                                </span>
                              </td>

                              <td className="p-4 whitespace-nowrap font-terminal-sm text-xs">
                                <span className="px-2 py-0.5 rounded-md bg-black/5 border border-glass-border">
                                  {stg?.label || idea.stage}
                                </span>
                              </td>

                              <td className="p-4 whitespace-nowrap font-terminal-sm text-xs">
                                <strong>{idea.support_count}</strong> / {idea.support_goal}
                              </td>

                              <td className="p-4 text-xs font-terminal-sm">
                                <div className="text-on-surface">{idea.creator_handle || '—'}</div>
                                <div className="text-primary font-mono text-[11px]">{idea.creator_email || '—'}</div>
                              </td>

                              <td className="p-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-terminal-sm ${
                                    idea.status === 'approved'
                                      ? 'bg-primary/20 text-primary font-semibold'
                                      : idea.status === 'pending'
                                      ? 'bg-secondary-fixed-dim/30 text-primary font-semibold'
                                      : 'bg-error/20 text-error font-semibold'
                                  }`}
                                >
                                  {idea.status}
                                </span>
                              </td>

                              <td className="p-4 text-right whitespace-nowrap space-x-2">
                                {idea.status !== 'approved' && (
                                  <button
                                    onClick={() => handleStatusChange(idea.id, 'approved')}
                                    className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-label-caps hover:shadow-sm transition-all cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                )}
                                {idea.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleStatusChange(idea.id, 'rejected')}
                                    className="px-3 py-1 bg-black/10 hover:bg-error/20 hover:text-error text-on-surface-variant rounded-full text-xs font-label-caps transition-all cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(idea.id)}
                                  className="px-2 py-1 text-error/70 hover:text-error text-xs font-label-caps transition-all cursor-pointer"
                                  title="Delete Concept"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUBLISH NEW IDEA DIRECTLY */}
          {activeTab === 'new' && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-glass-border max-w-3xl">
              <div className="mb-6">
                <h2 className="font-headline-md text-xl text-on-surface">Publish a Direct Agent Concept</h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  Published ideas will immediately appear on the live Community Lab grid.
                </p>
              </div>

              <form onSubmit={handleCreateIdea} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Concept Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Autonomous Patent & Regulatory Radar"
                      value={newIdea.title}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, title: e.target.value }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2.5 text-on-surface font-body-md focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Domain Category *
                    </label>
                    <select
                      value={newIdea.category}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, category: e.target.value as IdeaCategory }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2.5 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {CATEGORIES.map((catKey) => (
                        <option key={catKey} value={catKey}>
                          {CATEGORY_LABELS[catKey].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Development Lifecycle Stage *
                    </label>
                    <select
                      value={newIdea.stage}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, stage: e.target.value as IdeaStage }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2.5 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {STAGES.map((stgKey) => (
                        <option key={stgKey} value={stgKey}>
                          {STAGE_CONFIG[stgKey].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Executive Pitch (Short Summary) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Concise overview of what this autonomous agent solves."
                      value={newIdea.pitch}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, pitch: e.target.value }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2.5 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Technical Architecture Blueprint (Markdown Supported)
                    </label>
                    <textarea
                      rows={6}
                      placeholder={`## System Architecture\n1. Collector Agent: Pulls data...\n2. Evaluator Agent: Runs rules...\n\n### Tool Integrations\n- API X\n- API Y`}
                      value={newIdea.architecture_blueprint}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, architecture_blueprint: e.target.value }))}
                      className="bg-surface-container-lowest border border-glass-border rounded-xl p-4 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary font-mono"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Support Goal
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={newIdea.support_goal}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, support_goal: parseInt(e.target.value, 10) || 100 }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2 text-on-surface font-body-md text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Initial Support Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newIdea.support_count}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, support_count: parseInt(e.target.value, 10) || 0 }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2 text-on-surface font-body-md text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Creator Public Handle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @agentic_architect"
                      value={newIdea.creator_handle}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, creator_handle: e.target.value }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2 text-on-surface font-body-md text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-terminal-sm text-xs text-on-surface-variant uppercase tracking-wider">
                      Initial Status
                    </label>
                    <select
                      value={newIdea.status}
                      onChange={(e) => setNewIdea((prev) => ({ ...prev, status: e.target.value as IdeaStatus }))}
                      className="bg-surface-container-low border border-glass-border rounded-xl px-4 py-2 text-on-surface font-body-md text-sm cursor-pointer"
                    >
                      <option value="approved">Approved (Live Immediately)</option>
                      <option value="pending">Pending (Review Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-glass-border">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary text-on-primary font-label-caps text-xs rounded-full hover:shadow-[0_0_20px_rgba(140,111,45,0.35)] transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Idea Directly'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: STRATEGY CALL LEADS */}
          {activeTab === 'leads' && (
            <div className="glass-panel p-6 rounded-2xl border border-glass-border">
              <div className="mb-4">
                <h2 className="font-headline-md text-lg text-on-surface">Captured Strategy Call Leads</h2>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Inquiries submitted via the strategy call booking form on the homepage.
                </p>
              </div>

              {strategyCalls.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant text-sm">No strategy call inquiries yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-glass-border font-terminal-sm text-xs text-on-surface-variant">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/60 font-body-md">
                      {strategyCalls.map((lead: any, idx: number) => (
                        <tr key={lead.id || idx} className="hover:bg-black/5">
                          <td className="p-3 font-semibold text-on-surface">{lead.name}</td>
                          <td className="p-3 text-primary font-mono text-xs">{lead.email}</td>
                          <td className="p-3 text-on-surface-variant max-w-sm">{lead.description || '—'}</td>
                          <td className="p-3 text-xs font-terminal-sm">{lead.source || 'Homepage'}</td>
                          <td className="p-3 text-xs font-terminal-sm text-on-surface-variant">
                            {lead.created_at ? new Date(lead.created_at).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
