export type IdeaCategory =
  | 'enterprise_ops'
  | 'creative_media'
  | 'dev_tools'
  | 'fintech_risk'
  | 'healthcare_bio'
  | 'customer_success';

export type IdeaStage = 'concept' | 'prototyping' | 'validated' | 'production_ready';

export type IdeaStatus = 'pending' | 'approved' | 'rejected';

/**
 * Public Idea model returned to the frontend.
 * Note: `creator_email` is NEVER included in public responses.
 */
export interface Idea {
  id: string;
  title: string;
  pitch: string;
  architecture_blueprint?: string | null;
  category: IdeaCategory;
  stage: IdeaStage;
  support_goal: number;
  support_count: number;
  creator_handle?: string | null;
  created_at: string;
}

/**
 * Payload for submitting a new idea for review (email required for lead-capture).
 */
export interface SubmitIdeaInput {
  title: string;
  pitch: string;
  architecture_blueprint?: string;
  category: IdeaCategory;
  support_goal?: number;
  creator_handle?: string;
  creator_email: string;
}

export interface SupportIdeaResult {
  success: boolean;
  idea_id: string;
  support_count: number;
  alreadySupported?: boolean;
  error?: string;
}

export const CATEGORY_LABELS: Record<IdeaCategory, { label: string; icon: string; description: string }> = {
  enterprise_ops: {
    label: 'Enterprise Ops',
    icon: 'hub',
    description: 'Autonomous workflows, compliance, and internal operations infrastructure.',
  },
  creative_media: {
    label: 'Creative & Media',
    icon: 'movie_edit',
    description: 'Video generation, audio orchestration, and multi-modal creative production.',
  },
  dev_tools: {
    label: 'Developer Tools',
    icon: 'terminal',
    description: 'Self-healing code pipelines, debugging droids, and test generation swarms.',
  },
  fintech_risk: {
    label: 'FinTech & Risk',
    icon: 'trending_up',
    description: 'Counterparty radar, real-time risk intelligence, and automated ledger agents.',
  },
  healthcare_bio: {
    label: 'Healthcare & Bio',
    icon: 'biotech',
    description: 'Clinical trial feasibility, protocol extraction, and research synthesizers.',
  },
  customer_success: {
    label: 'Customer Success',
    icon: 'support_agent',
    description: 'Proactive retention monitors, CRM telemetry, and executive review synthesizers.',
  },
};

export const STAGE_CONFIG: Record<IdeaStage, { label: string; step: number; color: string }> = {
  concept: { label: 'Concept', step: 1, color: 'text-on-surface-variant' },
  prototyping: { label: 'Prototyping', step: 2, color: 'text-primary' },
  validated: { label: 'Validated', step: 3, color: 'text-secondary-fixed-dim' },
  production_ready: { label: 'Production Ready', step: 4, color: 'text-primary' },
};
