import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PageMeta } from '../components/PageMeta';

const getTodayDate = () => new Date().toISOString().split('T')[0];

interface AgentState {
  agentName: string;
  version: string;
  owner: string;
  date: string;
  purpose: string;
  persona: string;
  users: string;
  objective: string;
  knowledge: string;
  tools: string;
  memory: string;
  decision: string;
  constraints: string;
  communication: string;
}

interface SkillState {
  skillName: string;
  version: string;
  parentAgent: string;
  date: string;
  purpose: string;
  trigger: string;
  input: string;
  output: string;
  steps: string;
  tools: string;
  error: string;
  testing: string;
}

export function AgentCanvasTool() {
  const [activeTab, setActiveTab] = useState<'agent' | 'skill'>('agent');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const [agentData, setAgentData] = useState<AgentState>({
    agentName: '',
    version: 'v1.0',
    owner: '',
    date: getTodayDate(),
    purpose: '',
    persona: '',
    users: '',
    objective: '',
    knowledge: '',
    tools: '',
    memory: '',
    decision: '',
    constraints: '',
    communication: '',
  });

  const [skillData, setSkillData] = useState<SkillState>({
    skillName: '',
    version: 'v1.0',
    parentAgent: '',
    date: getTodayDate(),
    purpose: '',
    trigger: '',
    input: '',
    output: '',
    steps: '',
    tools: '',
    error: '',
    testing: '',
  });

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedAgent = localStorage.getItem('agentic_city_agent_canvas');
      if (savedAgent) setAgentData(JSON.parse(savedAgent));

      const savedSkill = localStorage.getItem('agentic_city_skill_canvas');
      if (savedSkill) setSkillData(JSON.parse(savedSkill));
    } catch (err) {
      console.warn('Could not load canvas state from localStorage', err);
    }
  }, []);

  // Save agent state on change
  useEffect(() => {
    try {
      localStorage.setItem('agentic_city_agent_canvas', JSON.stringify(agentData));
    } catch (err) {
      // ignore
    }
  }, [agentData]);

  // Save skill state on change
  useEffect(() => {
    try {
      localStorage.setItem('agentic_city_skill_canvas', JSON.stringify(skillData));
    } catch (err) {
      // ignore
    }
  }, [skillData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    try {
      setIsExporting(true);
      showToast('Generating PDF...');

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#faf8f5',
        logging: false,
      });

      // ── Multi-page A4 landscape PDF ──
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();   // ~841.9 pt
      const pdfH = pdf.internal.pageSize.getHeight();  // ~595.3 pt
      const margin = 18;

      const printW = pdfW - margin * 2;
      const printScale = printW / canvas.width;
      const printH = canvas.height * printScale;
      const pageContentH = pdfH - margin * 2;
      const totalPages = Math.ceil(printH / pageContentH);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const srcY = (page * pageContentH) / printScale;
        const srcH = Math.min(pageContentH / printScale, canvas.height - srcY);

        const slice = document.createElement('canvas');
        slice.width  = canvas.width;
        slice.height = Math.ceil(srcH);
        const ctx = slice.getContext('2d')!;
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

        pdf.addImage(slice.toDataURL('image/png'), 'PNG', margin, margin, printW, srcH * printScale);
      }

      const fileName = activeTab === 'agent' ? 'Agent_Definition_Canvas.pdf' : 'Skill_Definition_Canvas.pdf';
      pdf.save(fileName);
      showToast(`PDF downloaded (${totalPages} page${totalPages > 1 ? 's' : ''})!`);
    } catch (err) {
      console.error('PDF export failed', err);
      showToast('PDF export failed — please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearClick = () => {
    setConfirmOpen(true);
  };

  const executeClear = () => {
    if (activeTab === 'agent') {
      setAgentData({
        agentName: '',
        version: 'v1.0',
        owner: '',
        date: getTodayDate(),
        purpose: '',
        persona: '',
        users: '',
        objective: '',
        knowledge: '',
        tools: '',
        memory: '',
        decision: '',
        constraints: '',
        communication: '',
      });
      localStorage.removeItem('agentic_city_agent_canvas');
    } else {
      setSkillData({
        skillName: '',
        version: 'v1.0',
        parentAgent: '',
        date: getTodayDate(),
        purpose: '',
        trigger: '',
        input: '',
        output: '',
        steps: '',
        tools: '',
        error: '',
        testing: '',
      });
      localStorage.removeItem('agentic_city_skill_canvas');
    }
    setConfirmOpen(false);
    showToast(`${activeTab === 'agent' ? 'Agent' : 'Skill'} canvas cleared`);
  };

  const updateAgentField = (field: keyof AgentState, val: string) => {
    setAgentData((prev) => ({ ...prev, [field]: val }));
  };

  const updateSkillField = (field: keyof SkillState, val: string) => {
    setSkillData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <>
      <PageMeta
        title="Agent & Skills Canvas Tool — Agentic City"
        description="Interactive blueprint designer and single-page A4 landscape PDF exporter for AI Agent and Skill definitions."
      />

      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #faf8f5 !important;
            color: #1a1a1a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, .no-print {
            display: none !important;
          }
          .canvas-print-wrapper {
            margin: 0 !important;
            padding: 4mm 6mm !important;
            width: 297mm !important;
            height: 210mm !important;
            box-sizing: border-box !important;
          }
          .canvas-card {
            background: #faf8f5 !important;
            border: 1px solid #dcd3c3 !important;
            box-shadow: none !important;
            border-radius: 12px !important;
          }
        }
      `}</style>

      <div className="w-full flex-1 flex flex-col min-h-screen bg-background text-on-surface pb-16">
        {/* Top Control Bar */}
        <div className="no-print sticky top-20 z-40 bg-background/90 backdrop-blur-xl border-b border-glass-border py-3.5 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center text-primary font-label-caps font-bold">
                AC
              </div>
              <h1 className="font-headline-md text-lg text-on-surface">Agent & Skills Canvas Studio</h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Tab Selector */}
              <div className="flex p-1 rounded-xl bg-surface-container border border-glass-border">
                <button
                  onClick={() => setActiveTab('agent')}
                  className={`px-4 py-2 rounded-lg font-label-caps text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'agent'
                      ? 'bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  Agent Canvas
                </button>
                <button
                  onClick={() => setActiveTab('skill')}
                  className={`px-4 py-2 rounded-lg font-label-caps text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'skill'
                      ? 'bg-secondary text-on-secondary font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">extension</span>
                  Skill Canvas
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleClearClick}
                className="px-4 py-2 rounded-xl border border-glass-border font-label-caps text-xs text-on-surface hover:bg-black/5 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Clear current canvas"
              >
                <span className="material-symbols-outlined text-[16px]">cleaning_services</span>
                Clear
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-caps text-xs font-bold hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Export single-page A4 PDF snapshot"
              >
                <span className="material-symbols-outlined text-[16px]">{isExporting ? 'sync' : 'picture_as_pdf'}</span>
                {isExporting ? 'Generating PDF...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Hint Bar */}
        <div className="no-print max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop mt-6">
          <div className="glass-panel p-3.5 px-5 rounded-xl border border-glass-border flex items-center gap-3 text-xs font-body-md text-on-surface-variant">
            <span className={`material-symbols-outlined text-base ${activeTab === 'agent' ? 'text-primary' : 'text-secondary'}`}>lightbulb</span>
            <span>
              {activeTab === 'agent'
                ? 'Fill out your agent architecture blueprint below. Hit Export PDF to download a pixel-perfect 1-page A4 landscape PDF file.'
                : 'Define modular skill boundaries with input/output schemas and error triggers. Hit Export PDF for clean technical handoffs.'}
            </span>
          </div>
        </div>

        {/* Canvas Main Container */}
        <div className="canvas-print-wrapper max-w-[1440px] w-full mx-auto px-margin-mobile md:px-margin-desktop mt-6 flex-1">
          <div
            ref={canvasRef}
            className="canvas-card bg-[#faf8f5] rounded-2xl border border-[#dcd3c3] overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-[#1a1a1a]"
          >
            {/* Header Section */}
            <div data-canvas-header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[#dfd7c8]">
              <div>
                <h2 className="font-headline-lg text-2xl md:text-3xl text-[#1a1a1a] font-bold tracking-tight">
                  {activeTab === 'agent' ? 'Agent Definition Canvas' : 'Skill Definition Canvas'}
                </h2>
                <p className="font-body-md text-xs md:text-sm text-[#706a60] mt-1">
                  {activeTab === 'agent'
                    ? 'A structured blueprint for designing, aligning, and documenting an autonomous AI agent'
                    : 'A structured blueprint for designing, documenting, and validating a reusable agent skill'}
                </p>
              </div>

              {/* Meta Inputs Header Row */}
              <div data-canvas-meta className="flex items-center gap-4 text-right flex-wrap md:flex-nowrap justify-end shrink-0">
                {activeTab === 'agent' ? (
                  <>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Agent Name</label>
                      <input
                        type="text"
                        placeholder="e.g. ResearchMate"
                        value={agentData.agentName}
                        onChange={(e) => updateAgentField('agentName', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[120px]"
                      />
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Version</label>
                      <input
                        type="text"
                        placeholder="v1.0"
                        value={agentData.version}
                        onChange={(e) => updateAgentField('version', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[50px]"
                      />
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Owner</label>
                      <input
                        type="text"
                        placeholder="Team / Person"
                        value={agentData.owner}
                        onChange={(e) => updateAgentField('owner', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[110px]"
                      />
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Date</label>
                      <input
                        type="text"
                        value={agentData.date}
                        onChange={(e) => updateAgentField('date', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[90px]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Skill Name</label>
                      <input
                        type="text"
                        placeholder="e.g. WebSearch"
                        value={skillData.skillName}
                        onChange={(e) => updateSkillField('skillName', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[120px]"
                      />
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Version</label>
                      <input
                        type="text"
                        placeholder="v1.0"
                        value={skillData.version}
                        onChange={(e) => updateSkillField('version', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[50px]"
                      />
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Parent Agent</label>
                      <input
                        type="text"
                        placeholder="Which agent?"
                        value={skillData.parentAgent}
                        onChange={(e) => updateSkillField('parentAgent', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[110px]"
                      />
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <label className="font-mono text-[9px] uppercase text-[#8a8377] font-bold tracking-wider">Date</label>
                      <input
                        type="text"
                        value={skillData.date}
                        onChange={(e) => updateSkillField('date', e.target.value)}
                        className="bg-transparent border-b border-dashed border-[#b8ae9d] py-0.5 text-xs font-body-md text-[#1a1a1a] focus:outline-none text-left md:text-right w-[90px]"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Grid Canvas Content */}
            {activeTab === 'agent' ? (
              <div data-canvas-grid className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-[#dfd7c8] border-t border-b border-[#dfd7c8] bg-white/40">
                {/* Column 1: Purpose & Scope (Rows 1 & 2) */}
                <div className="md:col-span-1 md:row-span-2 p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[220px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">track_changes</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Purpose & Scope</span>
                  </div>
                  <textarea
                    placeholder="What problem does this agent solve? What is its reason for existing? Define boundaries of what it should and should not do."
                    value={agentData.purpose}
                    onChange={(e) => updateAgentField('purpose', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 2 Row 1: Persona */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">face</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Persona / Role</span>
                  </div>
                  <textarea
                    placeholder="Who is this agent? Expert researcher? Define personality traits, expertise level, and tone."
                    value={agentData.persona}
                    onChange={(e) => updateAgentField('persona', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 3 Row 1: Target Users */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Target Users</span>
                  </div>
                  <textarea
                    placeholder="Who interacts with this agent? Skill levels, goals, and contexts of use."
                    value={agentData.users}
                    onChange={(e) => updateAgentField('users', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 4 Row 1: Core Objective */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">flag</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Core Objective</span>
                  </div>
                  <textarea
                    placeholder="Single most important outcome. How do you measure success?"
                    value={agentData.objective}
                    onChange={(e) => updateAgentField('objective', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 2 Row 2: Knowledge Base */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">menu_book</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Knowledge Base</span>
                  </div>
                  <textarea
                    placeholder="Documents, APIs, databases, domain glossaries. How is knowledge updated?"
                    value={agentData.knowledge}
                    onChange={(e) => updateAgentField('knowledge', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 3 Row 2: Tools & Capabilities */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">build</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Tools & Capabilities</span>
                  </div>
                  <textarea
                    placeholder="Web search, code interpreter, API integrations, file tools, databases."
                    value={agentData.tools}
                    onChange={(e) => updateAgentField('tools', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 4 Row 2: Memory Strategy */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">memory</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Memory Strategy</span>
                  </div>
                  <textarea
                    placeholder="Short-term conversation buffer size? Long-term vector store / session state?"
                    value={agentData.memory}
                    onChange={(e) => updateAgentField('memory', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Decision Framework (Cols 1 & 2) */}
                <div className="md:col-span-2 p-4 md:p-5 flex flex-col min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">account_tree</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Decision Framework & Workflow</span>
                  </div>
                  <textarea
                    placeholder="Reasoning chain, planning approach, multi-step logic, routing rules, when to seek human approval vs act autonomously."
                    value={agentData.decision}
                    onChange={(e) => updateAgentField('decision', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Guardrails & Constraints (Col 3) */}
                <div className="p-4 md:p-5 flex flex-col border-t md:border-t-0 border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">shield</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Guardrails & Constraints</span>
                  </div>
                  <textarea
                    placeholder="What must it NEVER do? Refusal rules, rate limits, token caps, compliance guidelines."
                    value={agentData.constraints}
                    onChange={(e) => updateAgentField('constraints', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Communication Style (Col 4) */}
                <div className="p-4 md:p-5 flex flex-col border-t md:border-t-0 border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Communication Style</span>
                  </div>
                  <textarea
                    placeholder="Tone, formality, verbosity, structured vs narrative formatting, error admission style."
                    value={agentData.communication}
                    onChange={(e) => updateAgentField('communication', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div data-canvas-grid className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-[#dfd7c8] border-t border-b border-[#dfd7c8] bg-white/40">
                {/* Column 1: Skill Purpose (Rows 1 & 2) */}
                <div className="md:col-span-1 md:row-span-2 p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[220px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Skill Purpose & Description</span>
                  </div>
                  <textarea
                    placeholder="What does this skill do in one sentence? Why is it needed as a distinct capability?"
                    value={skillData.purpose}
                    onChange={(e) => updateSkillField('purpose', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 2 Row 1: Trigger Conditions */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">tune</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Trigger Conditions</span>
                  </div>
                  <textarea
                    placeholder="When does this activate? User intent patterns, keywords, confidence thresholds."
                    value={skillData.trigger}
                    onChange={(e) => updateSkillField('trigger', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 3 Row 1: Input Schema */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">login</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Input Schema</span>
                  </div>
                  <textarea
                    placeholder="Parameters required: field names, types, required/optional, examples (JSON schema format)."
                    value={skillData.input}
                    onChange={(e) => updateSkillField('input', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 2 Row 2: Output Schema */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">logout</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Output Schema</span>
                  </div>
                  <textarea
                    placeholder="What does it return? Field names, return types, success/failure payload format."
                    value={skillData.output}
                    onChange={(e) => updateSkillField('output', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Column 3 Row 2: Execution Steps */}
                <div className="p-4 md:p-5 flex flex-col border-b border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Execution Steps</span>
                  </div>
                  <textarea
                    placeholder="Step-by-step workflow: 1) Validate input, 2) Execute tool, 3) Format response..."
                    value={skillData.steps}
                    onChange={(e) => updateSkillField('steps', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Dependencies & Tools (Col 1) */}
                <div className="p-4 md:p-5 flex flex-col min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">build</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Dependencies & Tools</span>
                  </div>
                  <textarea
                    placeholder="External APIs, libraries, auth requirements, rate limits, required credentials."
                    value={skillData.tools}
                    onChange={(e) => updateSkillField('tools', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Error Handling (Col 2) */}
                <div className="p-4 md:p-5 flex flex-col border-t md:border-t-0 border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">bug_report</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Error Handling</span>
                  </div>
                  <textarea
                    placeholder="Timeouts, rate limits, API failures. Retry strategy and user fallback message."
                    value={skillData.error}
                    onChange={(e) => updateSkillField('error', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Testing & Validation (Col 3) */}
                <div className="p-4 md:p-5 flex flex-col border-t md:border-t-0 border-[#dfd7c8] min-h-[140px]">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#f3e8d7] text-[#8c6f2d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">science</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#3d3830] uppercase tracking-wider">Testing & Validation</span>
                  </div>
                  <textarea
                    placeholder="Happy path test case, edge cases, failure scenarios, target latency SLA."
                    value={skillData.testing}
                    onChange={(e) => updateSkillField('testing', e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs font-body-md text-[#1a1a1a] placeholder:text-[#9c9488] resize-none focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Footer Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#706a60]">
              <span>
                {activeTab === 'agent' ? 'AGENT DEFINITION CANVAS — CONFIDENTIAL' : 'SKILL DEFINITION CANVAS — CONFIDENTIAL'}
              </span>
              <span>Fill all fields → Export PDF → Share with team</span>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmOpen && (
          <div className="no-print fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-panel p-6 md:p-8 rounded-2xl max-w-sm w-full border border-glass-border shadow-2xl bg-surface-container">
              <h3 className="font-headline-md text-lg text-on-surface mb-2">Confirm Clear</h3>
              <p className="font-body-md text-xs text-on-surface-variant mb-6">
                Are you sure you want to clear all fields on the active {activeTab === 'agent' ? 'Agent' : 'Skill'} canvas?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-glass-border font-label-caps text-xs text-on-surface hover:bg-black/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeClear}
                  className="px-4 py-2 rounded-xl bg-soft-red text-white font-label-caps text-xs font-bold hover:shadow-[0_0_15px_rgba(255,77,77,0.4)] transition-all cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-surface-container-highest border border-primary/40 text-primary px-6 py-2.5 rounded-xl font-terminal-sm text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            {toastMessage}
          </div>
        )}
      </div>

      {/* ── Off-screen print snapshot (always mounted, hidden) ── */}
      <div
        style={{ position: 'fixed', top: 0, left: '-99999px', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <div
          ref={printRef}
          style={{
            width: '1400px',
            minHeight: '960px',
            background: '#faf8f5',
            border: '1px solid #dcd3c3',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            color: '#1a1a1a',
            fontFamily: 'inherit',
          }}
        >
          {/* Header: title + description, plain divs, no responsive classes */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid #dfd7c8' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {activeTab === 'agent' ? 'Agent Definition Canvas' : 'Skill Definition Canvas'}
              </div>
              <div style={{ fontSize: '13px', color: '#706a60', marginTop: '4px' }}>
                {activeTab === 'agent'
                  ? 'A structured blueprint for designing, aligning, and documenting an autonomous AI agent'
                  : 'A structured blueprint for designing, documenting, and validating a reusable agent skill'}
              </div>
            </div>
            {/* Meta fields as plain text divs — NOT <input>, this is the fix */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-end' }}>
              {(activeTab === 'agent'
                ? [
                    ['Agent Name', agentData.agentName || 'e.g. ResearchMate', !agentData.agentName],
                    ['Version', agentData.version || 'v1.0', !agentData.version],
                    ['Owner', agentData.owner || 'Team / Person', !agentData.owner],
                    ['Date', agentData.date, false],
                  ]
                : [
                    ['Skill Name', skillData.skillName || 'e.g. WebSearch', !skillData.skillName],
                    ['Version', skillData.version || 'v1.0', !skillData.version],
                    ['Parent Agent', skillData.parentAgent || 'Which agent?', !skillData.parentAgent],
                    ['Date', skillData.date, false],
                  ]
              ).map(([label, value, muted]) => (
                <div key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8a8377', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontSize: '12px', color: muted ? '#9c9488' : '#1a1a1a', borderBottom: '1px dashed #b8ae9d', paddingBottom: '2px' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: unconditional CSS grid, always desktop layout */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activeTab === 'agent' ? 4 : 3}, minmax(0,1fr))`, flexGrow: 1, borderTop: '1px solid #dfd7c8', borderBottom: '1px solid #dfd7c8', background: 'rgba(255,255,255,0.4)' }}>
            {(activeTab === 'agent'
              ? [
                  { label: 'Purpose & Scope', value: agentData.purpose, gridRow: '1 / span 2', gridColumn: '1', minHeight: '220px' },
                  { label: 'Persona / Role', value: agentData.persona, minHeight: '140px' },
                  { label: 'Target Users', value: agentData.users, minHeight: '140px' },
                  { label: 'Core Objective', value: agentData.objective, minHeight: '140px' },
                  { label: 'Knowledge Base', value: agentData.knowledge, minHeight: '140px' },
                  { label: 'Tools & Capabilities', value: agentData.tools, minHeight: '140px' },
                  { label: 'Memory Strategy', value: agentData.memory, minHeight: '140px' },
                  { label: 'Decision Framework & Workflow', value: agentData.decision, gridColumn: '1 / span 2', minHeight: '140px' },
                  { label: 'Guardrails & Constraints', value: agentData.constraints, minHeight: '140px' },
                  { label: 'Communication Style', value: agentData.communication, minHeight: '140px' },
                ]
              : [
                  { label: 'Skill Purpose & Description', value: skillData.purpose, gridRow: '1 / span 2', gridColumn: '1', minHeight: '220px' },
                  { label: 'Trigger Conditions', value: skillData.trigger, minHeight: '140px' },
                  { label: 'Input Schema', value: skillData.input, minHeight: '140px' },
                  { label: 'Output Schema', value: skillData.output, minHeight: '140px' },
                  { label: 'Execution Steps', value: skillData.steps, minHeight: '140px' },
                  { label: 'Dependencies & Tools', value: skillData.tools, minHeight: '140px' },
                  { label: 'Error Handling', value: skillData.error, minHeight: '140px' },
                  { label: 'Testing & Validation', value: skillData.testing, minHeight: '140px' },
                ]
            ).map((cell, i) => (
              <div key={cell.label} style={{ gridRow: cell.gridRow, gridColumn: cell.gridColumn, minHeight: cell.minHeight, padding: '20px', borderLeft: cell.gridColumn === '1' ? 'none' : '1px solid #dfd7c8', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3d3830', marginBottom: '12px' }}>{cell.label}</div>
                <div style={{ fontSize: '12px', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: cell.value ? '#1a1a1a' : '#9c9488' }}>{cell.value || ''}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace', color: '#706a60' }}>
            <span>{activeTab === 'agent' ? 'AGENT DEFINITION CANVAS — CONFIDENTIAL' : 'SKILL DEFINITION CANVAS — CONFIDENTIAL'}</span>
            <span>Fill all fields → Export PDF → Share with team</span>
          </div>
        </div>
      </div>
    </>
  );
}
