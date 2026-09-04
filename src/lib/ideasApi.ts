import { supabase, isSupabaseConfigured } from './supabase';
import { Idea, SubmitIdeaInput, SupportIdeaResult } from '../types/idea';
import { getSupporterFingerprint, recordLocallySupportedIdea, getLocallySupportedIdeas } from './fingerprint';

// Seeded enterprise ideas for fallback / offline state
const INITIAL_SEEDED_IDEAS: Idea[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Autonomous Compliance & Audit Swarm',
    pitch: 'Continuous compliance verification agent swarm that autonomously scans cloud IAM policies, codebase commits, and vendor SOC2 controls with real-time audit trails.',
    architecture_blueprint: `## System Architecture

The Autonomous Compliance & Audit Swarm consists of three specialized agent tiers:
1. **Collector Droid**: Continuously monitors AWS/GCP IAM roles, Terraform states, and Git pull requests for security regressions.
2. **Policy Evaluator Agent**: Maps observed changes against SOC2 Type II, ISO 27001, and HIPAA control libraries using vector-indexed policy rules.
3. **Remediation & Evidence Agent**: Drafts automated pull requests for misconfigurations and generates cryptographic audit trail hashes for auditor sign-off.

### Tool Integrations
- Cloud Provider IAM APIs (AWS STS, Google Cloud IAM)
- GitHub / GitLab Webhook & PR API
- Jira / Linear ticketing bridge for human-in-the-loop exception approvals.`,
    category: 'enterprise_ops',
    stage: 'validated',
    support_goal: 250,
    support_count: 184,
    creator_handle: '@alex_systems',
    created_at: '2026-08-10T12:00:00Z',
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    title: 'Multi-Modal Video Director & Timeline Synthesizer',
    pitch: 'An orchestration graph of vision, audio, and pacing agents that converts raw script drafts into timed multi-track video timelines with automated B-roll sourcing.',
    architecture_blueprint: `## System Architecture

Built on top of the Text2Clip orchestration paradigm:
1. **Script Breakdown Agent**: Splits narration into atomic beats, mood markers, and timing estimates.
2. **Asset Retrieval Droid**: Queries enterprise media libraries, vector image stores, and stock APIs for semantic video matches.
3. **Pacing & Audio Sync Agent**: Aligns voice-over phoneme timings with keyframe cuts and audio ducking.
4. **Export Worker**: Assembles JSON timeline manifest for Adobe Premiere / DaVinci Resolve or headless FFmpeg rendering.

### Tech Stack
- Whisper / OVI Voice API for phoneme timing
- Vector-indexed enterprise asset database
- OpenTimelineIO manifest generator.`,
    category: 'creative_media',
    stage: 'prototyping',
    support_goal: 200,
    support_count: 142,
    creator_handle: '@elena_creative',
    created_at: '2026-08-14T09:30:00Z',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'Self-Healing CI/CD DevOps Agent',
    pitch: 'An agentic watchdog that detects failing build pipelines, pinpoints flaky tests or dependency version conflicts, and generates targeted patch pull requests.',
    architecture_blueprint: `## System Architecture

1. **Log Parser Agent**: Analyzes stack traces and Docker build logs using semantic error classifiers.
2. **Context Inspector**: Retrieves recent commit diffs, lockfile modifications, and environment config variables.
3. **Sandboxed Patch Generator**: Spawns an isolated test container to reproduce the failure and iterates on code/dependency fixes until all unit tests pass.
4. **PR Author Agent**: Formats detailed markdown explanation with root-cause analysis and attaches test results.

### Guardrails
- Cannot merge directly to protected branches.
- Requires senior engineering sign-off on PR review.`,
    category: 'dev_tools',
    stage: 'concept',
    support_goal: 300,
    support_count: 95,
    creator_handle: '@devops_mark',
    created_at: '2026-08-18T14:15:00Z',
  },
  {
    id: '8d2f0a1e-3c4b-5a6e-7f8a-9b0c1d2e3f4a',
    title: 'Real-Time Counterparty Risk & Credit Radar',
    pitch: 'Multi-agent financial intelligence network evaluating supplier solvency, market volatility exposure, and dynamic credit scoring for CFO teams.',
    architecture_blueprint: `## System Architecture

1. **SEC & News Sentinel**: Scrapes 10-K, 8-K filings, and regulatory notices across global exchanges.
2. **Balance Sheet Analyst**: Extracts structured cash flow, debt maturity schedules, and liquidity ratios.
3. **Predictive Risk Agent**: Computes dynamic credit score adjustments and alerts procurement teams prior to supplier disruptions.

### Integrations
- SEC EDGAR API & Bloomberg Market Feeds
- NetSuite / SAP ERP Accounts Payable ledgers.`,
    category: 'fintech_risk',
    stage: 'concept',
    support_goal: 150,
    support_count: 68,
    creator_handle: '@fin_intel',
    created_at: '2026-08-20T16:00:00Z',
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    title: 'Clinical Trial Protocol Feasibility Agent',
    pitch: 'Translates FDA/EMA trial protocol documents into quantifiable patient recruitment criteria and site eligibility matrices.',
    architecture_blueprint: `## System Architecture

1. **Protocol Extraction Engine**: Deconstructs inclusion/exclusion criteria into standardized SNOMED CT and ICD-10 ontologies.
2. **Cohort Matcher**: Queries anonymized EHR repositories to estimate patient pool feasibility.
3. **Regulatory Deviation Flag**: Identifies protocol bottlenecks that historically caused trial amendments.

### Safety & Compliance
- Zero PII ingestion (operates solely on de-identified metadata).
- Full auditability of extracted medical logic.`,
    category: 'healthcare_bio',
    stage: 'prototyping',
    support_goal: 200,
    support_count: 127,
    creator_handle: '@dr_chen_ai',
    created_at: '2026-08-24T11:45:00Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    title: 'Autonomous Account Health & Retention Agent',
    pitch: 'Monitors product usage telemetry, Zendesk tickets, and customer email sentiment to proactively trigger retention playbooks for enterprise CS teams.',
    architecture_blueprint: `## System Architecture

1. **Telemetry Ingestion Agent**: Tracks daily active seat trends, feature adoption drop-offs, and API rate limit spikes.
2. **Sentiment & Ticket Analyzer**: Classifies customer frustration signals and SLA breaches in CRM conversations.
3. **Action Recommender**: Generates custom executive business review summaries and recommended feature training modules.

### Integrations
- Salesforce / HubSpot CRM
- Zendesk / Intercom support streams
- Segment / Mixpanel product analytics.`,
    category: 'customer_success',
    stage: 'validated',
    support_goal: 100,
    support_count: 89,
    creator_handle: '@sarah_cs',
    created_at: '2026-08-28T08:20:00Z',
  },
];

// Fallback in-memory storage for when Supabase is not configured
let localFallbackIdeas: Idea[] = [...INITIAL_SEEDED_IDEAS];

/**
 * Fetch approved ideas only.
 * Columns explicitly requested do NOT include creator_email.
 */
export async function fetchApprovedIdeas(): Promise<Idea[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id, title, pitch, architecture_blueprint, category, stage, support_goal, support_count, creator_handle, created_at')
        .eq('status', 'approved')
        .order('support_count', { ascending: false });

      if (error) {
        console.warn('[Supabase ideas fetch error, using fallback]', error);
        return localFallbackIdeas;
      }

      if (data && data.length > 0) {
        return data as Idea[];
      }
    } catch (err) {
      console.warn('[Supabase connection failed, using fallback]', err);
    }
  }

  // Fallback to seeded data
  return localFallbackIdeas;
}

/**
 * Support an idea (casts one vote per browser fingerprint).
 * Uses Postgres RPC increment_support or handles duplicate constraints.
 */
export async function supportIdea(ideaId: string): Promise<SupportIdeaResult> {
  const fingerprint = getSupporterFingerprint();
  const locallySupported = getLocallySupportedIdeas();

  // Fast client-side check
  if (locallySupported.has(ideaId)) {
    return {
      success: false,
      idea_id: ideaId,
      support_count: 0,
      alreadySupported: true,
      error: "You've already supported this idea on this browser.",
    };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Call Postgres RPC increment_support
      const { data, error } = await supabase.rpc('increment_support', {
        p_idea_id: ideaId,
        p_supporter_fingerprint: fingerprint,
      });

      if (error) {
        // Unique constraint violation check
        if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('ALREADY_SUPPORTED')) {
          recordLocallySupportedIdea(ideaId);
          return {
            success: false,
            idea_id: ideaId,
            support_count: 0,
            alreadySupported: true,
            error: "You've already supported this idea.",
          };
        }
        throw error;
      }

      if (data) {
        if (!data.success && data.error === 'ALREADY_SUPPORTED') {
          recordLocallySupportedIdea(ideaId);
          return {
            success: false,
            idea_id: ideaId,
            support_count: 0,
            alreadySupported: true,
            error: "You've already supported this idea.",
          };
        }

        recordLocallySupportedIdea(ideaId);
        return {
          success: true,
          idea_id: ideaId,
          support_count: data.support_count,
        };
      }
    } catch (err: any) {
      console.error('[Supabase support error]', err);
      // If network fails, return error
      return {
        success: false,
        idea_id: ideaId,
        support_count: 0,
        error: err.message || 'Failed to register support. Please try again.',
      };
    }
  }

  // Fallback behavior when Supabase is not connected
  recordLocallySupportedIdea(ideaId);
  const target = localFallbackIdeas.find((i) => i.id === ideaId);
  if (target) {
    target.support_count += 1;
    return {
      success: true,
      idea_id: ideaId,
      support_count: target.support_count,
    };
  }

  return {
    success: true,
    idea_id: ideaId,
    support_count: 1,
  };
}

/**
 * Submits a new agent venture idea into the moderated pending queue.
 * Requires creator_email for lead capture.
 */
export async function submitIdea(input: SubmitIdeaInput): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!input.title?.trim() || !input.pitch?.trim() || !input.creator_email?.trim()) {
    return { success: false, error: 'Please provide Title, Pitch, and Creator Email.' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.creator_email.trim())) {
    return { success: false, error: 'Please provide a valid work email address.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('ideas').insert({
        title: input.title.trim(),
        pitch: input.pitch.trim(),
        architecture_blueprint: input.architecture_blueprint?.trim() || null,
        category: input.category,
        support_goal: input.support_goal || 100,
        creator_handle: input.creator_handle?.trim() || null,
        creator_email: input.creator_email.trim(),
        status: 'pending', // Always pending for manual moderation
      });

      if (error) {
        console.error('[Supabase idea submission error]', error);
        return { success: false, error: error.message || 'Failed to submit idea.' };
      }

      return {
        success: true,
        message: 'Thanks — your concept is in review and will appear here once approved.',
      };
    } catch (err: any) {
      console.error('[Submission exception]', err);
      return { success: false, error: err.message || 'Network error occurred.' };
    }
  }

  // Fallback: log to console in dev mode
  console.log('[Mock Idea Submitted - Status: Pending]', {
    ...input,
    status: 'pending',
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    message: 'Thanks — your concept is in review and will appear here once approved.',
  };
}
