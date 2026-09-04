import posthog from 'posthog-js';

export interface AnalyticsProperties {
  [key: string]: any;
}

/**
 * Safely track a custom event in PostHog
 */
export function trackEvent(eventName: string, properties?: AnalyticsProperties) {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  } catch (err) {
    console.debug(`[Analytics] Failed to track event '${eventName}':`, err);
  }
}

/**
 * Identify a user in PostHog upon form submission or explicit action
 */
export function identifyUser(distinctId: string, userProperties?: AnalyticsProperties) {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.identify(distinctId, userProperties);
    }
  } catch (err) {
    console.debug(`[Analytics] Failed to identify user '${distinctId}':`, err);
  }
}

/**
 * Reset user identity (e.g. on logout/clear)
 */
export function resetUser() {
  try {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.reset();
    }
  } catch (err) {
    console.debug('[Analytics] Failed to reset user:', err);
  }
}

// ==========================================
// Specific Helper Functions
// ==========================================

export function trackStrategyCallCtaClicked(location: string, ctaText: string) {
  trackEvent('strategy_call_cta_clicked', {
    cta_location: location,
    cta_text: ctaText,
    destination_hash: '#contact',
  });
}

export function trackStrategyCallFormStarted(initialField: string) {
  trackEvent('strategy_call_form_started', {
    form_id: 'strategy_call_form',
    initial_field: initialField,
  });
}

export function trackStrategyCallSubmitted(data: {
  name: string;
  email: string;
  hasDescription: boolean;
  descriptionLength: number;
  source: string;
}) {
  // First identify user
  identifyUser(data.email.toLowerCase().trim(), {
    name: data.name,
    email: data.email.toLowerCase().trim(),
    has_requested_strategy_call: true,
    last_strategy_call_source: data.source,
  });

  // Track conversion event
  trackEvent('strategy_call_submitted', {
    has_description: data.hasDescription,
    description_length: data.descriptionLength,
    source: data.source,
  });
}

export function trackStrategyCallFailed(errorMessage: string) {
  trackEvent('strategy_call_failed', {
    form_id: 'strategy_call_form',
    error_message: errorMessage,
  });
}

export function trackChapterViewed(chapterId: string, chapterTitle: string) {
  trackEvent('chapter_viewed', {
    chapter_id: chapterId,
    chapter_title: chapterTitle,
  });
}

export function trackCaseStudyCardClicked(caseId: string, caseTitle: string) {
  trackEvent('case_study_card_clicked', {
    case_id: caseId,
    case_title: caseTitle,
  });
}

export function trackCaseStudyViewed(caseStudyName: string) {
  trackEvent('case_study_viewed', {
    case_study_name: caseStudyName,
  });
}

export function trackCanvasViewed(initialTab: 'agent' | 'skill', hasCachedState: boolean) {
  trackEvent('canvas_viewed', {
    initial_tab: initialTab,
    has_cached_state: hasCachedState,
  });
}

export function trackCanvasTabSwitched(fromTab: 'agent' | 'skill', toTab: 'agent' | 'skill') {
  trackEvent('canvas_tab_switched', {
    from_tab: fromTab,
    to_tab: toTab,
  });
}

export function trackCanvasFieldEdited(tab: 'agent' | 'skill', fieldName: string, filledFieldsCount: number) {
  trackEvent('canvas_field_edited', {
    tab,
    field_name: fieldName,
    filled_fields_count: filledFieldsCount,
  });
}

export function trackCanvasCleared(tab: 'agent' | 'skill') {
  trackEvent('canvas_cleared', {
    tab,
  });
}

export function trackCanvasPdfExportClicked(tab: 'agent' | 'skill', fieldsCompletedCount: number) {
  trackEvent('canvas_pdf_export_clicked', {
    tab,
    fields_completed_count: fieldsCompletedCount,
    is_blank: fieldsCompletedCount === 0,
  });
}

export function trackCanvasPdfExportCompleted(tab: 'agent' | 'skill', totalPages: number, durationMs: number) {
  trackEvent('canvas_pdf_export_completed', {
    tab,
    total_pages: totalPages,
    export_duration_ms: Math.round(durationMs),
  });
}

export function trackInsightsFilterChanged(filterType: string, resultCount: number) {
  trackEvent('insights_filter_changed', {
    filter_type: filterType,
    result_count: resultCount,
  });
}

export function trackInsightsTagClicked(tagName: string, action: 'select' | 'clear') {
  trackEvent('insights_tag_clicked', {
    tag_name: tagName,
    action,
  });
}

export function trackInsightArticleRead(slug: string, depthPercentage: number, readingTimeMinutes: number) {
  trackEvent('insight_article_read', {
    slug,
    scroll_depth_percentage: depthPercentage,
    reading_time_minutes: readingTimeMinutes,
  });
}

export function trackInsightMediaInteracted(slug: string, mediaType: 'youtube_video' | 'podcast_embed') {
  trackEvent('insight_media_interacted', {
    slug,
    media_type: mediaType,
  });
}

export function trackInsightInfographicExpanded(slug: string, imageUrl: string) {
  trackEvent('insight_infographic_expanded', {
    slug,
    image_url: imageUrl,
  });
}

export function trackLinkedinDiscussionClicked(slug: string, targetUrl: string) {
  trackEvent('linkedin_discussion_clicked', {
    slug,
    target_url: targetUrl,
  });
}

export function trackEmailContactClicked(location: string) {
  trackEvent('email_contact_clicked', {
    location,
  });
}

export function trackIdeaViewed(categoryFilter: string, stageFilter: string, resultCount: number) {
  trackEvent('lab_ideas_viewed', {
    category_filter: categoryFilter,
    stage_filter: stageFilter,
    result_count: resultCount,
  });
}

export function trackIdeaModalOpened(ideaId: string, ideaTitle: string, category: string) {
  trackEvent('lab_idea_modal_opened', {
    idea_id: ideaId,
    idea_title: ideaTitle,
    category,
  });
}

export function trackIdeaSupported(ideaId: string, ideaTitle: string, newSupportCount: number) {
  trackEvent('lab_idea_supported', {
    idea_id: ideaId,
    idea_title: ideaTitle,
    new_support_count: newSupportCount,
  });
}

export function trackIdeaSubmitted(data: {
  title: string;
  category: string;
  hasBlueprint: boolean;
  supportGoal: number;
  creatorEmail: string;
}) {
  identifyUser(data.creatorEmail.toLowerCase().trim(), {
    email: data.creatorEmail.toLowerCase().trim(),
    has_submitted_lab_idea: true,
    last_idea_category: data.category,
  });

  trackEvent('lab_idea_submitted', {
    title: data.title,
    category: data.category,
    has_blueprint: data.hasBlueprint,
    support_goal: data.supportGoal,
  });
}

