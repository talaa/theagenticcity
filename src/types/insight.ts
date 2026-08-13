export type InsightType = 'video' | 'podcast' | 'infographic' | 'article';

export interface InsightFrontmatter {
  title: string;
  slug: string;
  type: InsightType;
  publishDate: string;
  author: string;
  excerpt: string;
  tags?: string[];
  thumbnail?: string;
  seoTitle: string;
  seoDescription: string;
  // Type-specific fields
  videoUrl?: string;
  podcastEmbedUrl?: string;
  infographicImage?: string;
  transcript?: boolean;
  linkedinDiscussionUrl?: string;
}

export interface InsightEntry extends InsightFrontmatter {
  body: string;
  readingTimeMinutes?: number;
}
