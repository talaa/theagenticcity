-- ==============================================================================
-- Agentic City - Community Ideas Lab Schema & Moderation Pipeline
-- ==============================================================================

-- 1. Ideas Table
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pitch text not null,                      -- short summary, shown on card
  architecture_blueprint text,              -- longer detail, shown in detail modal
  category text not null,                   -- enterprise_ops | creative_media | dev_tools | fintech_risk | healthcare_bio | customer_success
  stage text not null default 'concept',    -- concept | prototyping | validated | production_ready
  support_goal integer not null default 100,
  support_count integer not null default 0,
  creator_handle text,
  creator_email text not null,              -- required, never displayed publicly
  status text not null default 'pending',   -- pending | approved | rejected
  created_at timestamptz not null default now()
);

-- 2. Idea Supports (Soft-fingerprint deduplication) Table
create table if not exists idea_supports (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  supporter_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (idea_id, supporter_fingerprint)
);

-- 3. Indexes for fast filtering & sorting
create index if not exists idx_ideas_status on ideas(status);
create index if not exists idx_ideas_category on ideas(category);
create index if not exists idx_ideas_stage on ideas(stage);
create index if not exists idx_ideas_support_count on ideas(support_count desc);
create index if not exists idx_idea_supports_idea_id on idea_supports(idea_id);

-- 4. Public View for Approved Ideas (Never exposes creator_email)
create or replace view approved_ideas as
select
  id,
  title,
  pitch,
  architecture_blueprint,
  category,
  stage,
  support_goal,
  support_count,
  creator_handle,
  created_at
from ideas
where status = 'approved';

-- 5. Atomic Support Function (RPC)
create or replace function increment_support(
  p_idea_id uuid,
  p_supporter_fingerprint text
)
returns json
language plpgsql
security definer
as $$
declare
  v_new_count integer;
  v_idea_status text;
begin
  -- Check if idea exists and is approved
  select status into v_idea_status from ideas where id = p_idea_id;
  if v_idea_status is null then
    return json_build_object('success', false, 'error', 'Idea not found');
  end if;

  if v_idea_status != 'approved' then
    return json_build_object('success', false, 'error', 'Cannot support an unapproved idea');
  end if;

  -- Insert supporter record (will fail unique constraint if duplicate)
  begin
    insert into idea_supports (idea_id, supporter_fingerprint)
    values (p_idea_id, p_supporter_fingerprint);
  exception when unique_violation then
    return json_build_object('success', false, 'error', 'ALREADY_SUPPORTED', 'message', 'You have already supported this idea');
  end;

  -- Increment support count on idea
  update ideas
  set support_count = support_count + 1
  where id = p_idea_id
  returning support_count into v_new_count;

  return json_build_object(
    'success', true,
    'idea_id', p_idea_id,
    'support_count', v_new_count
  );
end;
$$;

-- 6. Row-Level Security (RLS) Setup
alter table ideas enable row level security;
alter table idea_supports enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public can view approved ideas" on ideas;
drop policy if exists "Public can submit pending ideas" on ideas;
drop policy if exists "Public can insert supports" on idea_supports;

-- Ideas policies:
-- Only approved ideas can be read anonymously
create policy "Public can view approved ideas"
  on ideas for select
  using (status = 'approved');

-- Anyone can submit a concept (enforced to 'pending' status by default)
create policy "Public can submit pending ideas"
  on ideas for insert
  with check (status = 'pending');

-- Supports policies:
create policy "Public can insert supports"
  on idea_supports for insert
  with check (true);

-- 7. Seed Initial Approved Ideas (Enterprise Multi-Agent Concepts)
insert into ideas (title, pitch, architecture_blueprint, category, stage, support_goal, support_count, creator_handle, creator_email, status)
values
(
  'Autonomous Compliance & Audit Swarm',
  'Continuous compliance verification agent swarm that autonomously scans cloud IAM policies, codebase commits, and vendor SOC2 controls with real-time audit trails.',
  '## System Architecture

The Autonomous Compliance & Audit Swarm consists of three specialized agent tiers:
1. **Collector Droid**: Continuously monitors AWS/GCP IAM roles, Terraform states, and Git pull requests for security regressions.
2. **Policy Evaluator Agent**: Maps observed changes against SOC2 Type II, ISO 27001, and HIPAA control libraries using vector-indexed policy rules.
3. **Remediation & Evidence Agent**: Drafts automated pull requests for misconfigurations and generates cryptographic audit trail hashes for auditor sign-off.

### Tool Integrations
- Cloud Provider IAM APIs (AWS STS, Google Cloud IAM)
- GitHub / GitLab Webhook & PR API
- Jira / Linear ticketing bridge for human-in-the-loop exception approvals.',
  'enterprise_ops',
  'validated',
  250,
  184,
  '@alex_systems',
  'alex@enterprise-cloud.io',
  'approved'
),
(
  'Multi-Modal Video Director & Timeline Synthesizer',
  'An orchestration graph of vision, audio, and pacing agents that converts raw script drafts into timed multi-track video timelines with automated B-roll sourcing.',
  '## System Architecture

Built on top of the Text2Clip orchestration paradigm:
1. **Script Breakdown Agent**: Splits narration into atomic beats, mood markers, and timing estimates.
2. **Asset Retrieval Droid**: Queries enterprise media libraries, vector image stores, and stock APIs for semantic video matches.
3. **Pacing & Audio Sync Agent**: Aligns voice-over phoneme timings with keyframe cuts and audio ducking.
4. **Export Worker**: Assembles JSON timeline manifest for Adobe Premiere / DaVinci Resolve or headless FFmpeg rendering.

### Tech Stack
- Whisper / OVI Voice API for phoneme timing
- Vector-indexed enterprise asset database
- OpenTimelineIO manifest generator.',
  'creative_media',
  'prototyping',
  200,
  142,
  '@elena_creative',
  'elena@studio-synth.tv',
  'approved'
),
(
  'Self-Healing CI/CD DevOps Agent',
  'An agentic watchdog that detects failing build pipelines, pinpoints flaky tests or dependency version conflicts, and generates targeted patch pull requests.',
  '## System Architecture

1. **Log Parser Agent**: Analyzes stack traces and Docker build logs using semantic error classifiers.
2. **Context Inspector**: Retrieves recent commit diffs, lockfile modifications, and environment config variables.
3. **Sandboxed Patch Generator**: Spawns an isolated test container to reproduce the failure and iterates on code/dependency fixes until all unit tests pass.
4. **PR Author Agent**: Formats detailed markdown explanation with root-cause analysis and attaches test results.

### Guardrails
- Cannot merge directly to protected branches.
- Requires senior engineering sign-off on PR review.',
  'dev_tools',
  'concept',
  300,
  95,
  '@devops_mark',
  'mark@devops-core.tech',
  'approved'
),
(
  'Real-Time Counterparty Risk & Credit Radar',
  'Multi-agent financial intelligence network evaluating supplier solvency, market volatility exposure, and dynamic credit scoring for CFO teams.',
  '## System Architecture

1. **SEC & News Sentinel**: Scrapes 10-K, 8-K filings, and regulatory notices across global exchanges.
2. **Balance Sheet Analyst**: Extracts structured cash flow, debt maturity schedules, and liquidity ratios.
3. **Predictive Risk Agent**: Computes dynamic credit score adjustments and alerts procurement teams prior to supplier disruptions.

### Integrations
- SEC EDGAR API & Bloomberg Market Feeds
- NetSuite / SAP ERP Accounts Payable ledgers.',
  'fintech_risk',
  'concept',
  150,
  68,
  '@fin_intel',
  'intel@risk-radar.fi',
  'approved'
),
(
  'Clinical Trial Protocol Feasibility Agent',
  'Translates FDA/EMA trial protocol documents into quantifiable patient recruitment criteria and site eligibility matrices.',
  '## System Architecture

1. **Protocol Extraction Engine**: Deconstructs inclusion/exclusion criteria into standardized SNOMED CT and ICD-10 ontologies.
2. **Cohort Matcher**: Queries anonymized EHR repositories to estimate patient pool feasibility.
3. **Regulatory Deviation Flag**: Identifies protocol bottlenecks that historically caused trial amendments.

### Safety & Compliance
- Zero PII ingestion (operates solely on de-identified metadata).
- Full auditability of extracted medical logic.',
  'healthcare_bio',
  'prototyping',
  200,
  127,
  '@dr_chen_ai',
  'chen@bio-trials.org',
  'approved'
),
(
  'Autonomous Account Health & Retention Agent',
  'Monitors product usage telemetry, Zendesk tickets, and customer email sentiment to proactively trigger retention playbooks for enterprise CS teams.',
  '## System Architecture

1. **Telemetry Ingestion Agent**: Tracks daily active seat trends, feature adoption drop-offs, and API rate limit spikes.
2. **Sentiment & Ticket Analyzer**: Classifies customer frustration signals and SLA breaches in CRM conversations.
3. **Action Recommender**: Generates custom executive business review summaries and recommended feature training modules.

### Integrations
- Salesforce / HubSpot CRM
- Zendesk / Intercom support streams
- Segment / Mixpanel product analytics.',
  'customer_success',
  'validated',
  100,
  89,
  '@sarah_cs',
  'sarah@growth-cs.io',
  'approved'
)
on conflict do nothing;
