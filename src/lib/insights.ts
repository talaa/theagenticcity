import { InsightEntry, InsightFrontmatter, InsightType } from '../types/insight';

const REQUIRED_FIELDS = ['title', 'slug', 'type', 'publishDate', 'excerpt', 'seoDescription'] as const;
const VALID_TYPES: InsightType[] = ['video', 'podcast', 'infographic', 'article'];
const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Parses simple YAML string block into JavaScript object.
 */
export function parseYamlFrontmatter(yamlString: string, filename: string = 'unknown'): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlString.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let rawValue = line.slice(colonIndex + 1).trim();

    // Parse value
    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      // Array parser e.g. ["orchestration", "performance"]
      const inner = rawValue.slice(1, -1).trim();
      if (!inner) {
        result[key] = [];
      } else {
        result[key] = inner
          .split(',')
          .map((item) => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
    } else if (rawValue === 'true') {
      result[key] = true;
    } else if (rawValue === 'false') {
      result[key] = false;
    } else {
      // Strip outer quotes if present
      if ((rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
        rawValue = rawValue.slice(1, -1);
      }
      result[key] = rawValue;
    }
  }

  return result;
}

/**
 * Validates frontmatter against strict schema rules.
 * Throws clean error if malformed.
 */
export function validateFrontmatter(fm: Record<string, any>, filename: string = 'unknown'): asserts fm is InsightFrontmatter {
  // 1. Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (fm[field] === undefined || fm[field] === null || String(fm[field]).trim() === '') {
      throw new Error(`[Insights Validation Error] File '${filename}': Missing or empty required frontmatter field '${field}'`);
    }
  }

  // 2. Validate type
  if (!VALID_TYPES.includes(fm.type as InsightType)) {
    throw new Error(
      `[Insights Validation Error] File '${filename}': Invalid type '${fm.type}'. Must be one of: ${VALID_TYPES.join(', ')}`
    );
  }

  // 3. Validate slug format (kebab-case)
  if (!KEBAB_CASE_REGEX.test(fm.slug)) {
    throw new Error(
      `[Insights Validation Error] File '${filename}': Invalid slug '${fm.slug}'. Slug must be lowercase kebab-case (e.g. 'my-sample-slug').`
    );
  }

  // 4. Validate seoDescription length (<= 160 chars)
  if (typeof fm.seoDescription === 'string' && fm.seoDescription.length > 160) {
    throw new Error(
      `[Insights Validation Error] File '${filename}': 'seoDescription' exceeds 160 characters (current length: ${fm.seoDescription.length}).`
    );
  }
}

/**
 * Parses full raw Markdown/MDX string into an InsightEntry.
 */
export function parseAndValidateInsight(rawContent: string, filename: string = 'unknown'): InsightEntry {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`[Insights Parse Error] File '${filename}': Missing or invalid YAML frontmatter header delimited by '---'.`);
  }

  const yamlBlock = match[1];
  const body = match[2].trim();

  const fm = parseYamlFrontmatter(yamlBlock, filename);

  // Set default fallback author & seoTitle if omitted
  if (!fm.author) fm.author = 'Agentic City Team';
  if (!fm.seoTitle) fm.seoTitle = `${fm.title} | Agentic City Insights`;
  if (!Array.isArray(fm.tags)) fm.tags = [];

  validateFrontmatter(fm, filename);

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    ...(fm as unknown as InsightFrontmatter),
    body,
    readingTimeMinutes,
  };
}

/**
 * Reads all insight entries dynamically at build/runtime in Vite.
 */
export function getAllInsights(): InsightEntry[] {
  // Query raw contents of all mdx/md files in content/insights/
  const modules = import.meta.glob<{ default: string }>('../../content/insights/*.{md,mdx}', {
    query: '?raw',
    eager: true,
  });

  const entries: InsightEntry[] = [];
  const seenSlugs = new Set<string>();

  for (const filepath in modules) {
    // Ignore README.md documentation file
    if (filepath.toLowerCase().includes('readme')) continue;

    try {
      const rawContent = (modules[filepath] as any)?.default || (modules[filepath] as unknown as string);
      if (typeof rawContent === 'string' && rawContent.trim()) {
        const entry = parseAndValidateInsight(rawContent, filepath);
        if (!seenSlugs.has(entry.slug)) {
          seenSlugs.add(entry.slug);
          entries.push(entry);
        }
      }
    } catch (err) {
      console.warn(`[Insights Warning] Skipping non-insight file '${filepath}':`, err);
    }
  }

  // Sort newest first by publishDate
  return entries.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

/**
 * Get a single insight entry by slug.
 */
export function getInsightBySlug(slug: string): InsightEntry | null {
  const all = getAllInsights();
  return all.find((item) => item.slug === slug) || null;
}
