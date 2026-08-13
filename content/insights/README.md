# Agentic City Insights Publishing Pipeline

This folder (`content/insights/`) serves as the single source of truth for all published insights, videos, podcasts, infographics, and technical articles on Agentic City.

---

## 1. Core Architectural Principle: Content-as-Data

Every piece of content published on `/insights` is represented as a single structured Markdown (`.md`) or MDX (`.mdx`) file containing YAML frontmatter metadata and a body containing article copy or full media transcripts.

- **No Database**: Content lives in Git version control.
- **No Admin CMS / UI Required**: Publishing is simply committing a file.
- **Unified Interface**: Humans, automated scripts, CI/CD pipelines, and AI agentic systems publish through the **exact same mechanism**—committing a correctly formatted `.mdx` file.

---

## 2. File Location & Naming Convention

All entries MUST be placed in `content/insights/` and use a lowercase kebab-case slug filename matching the `slug` frontmatter property:

```text
content/insights/<slug>.mdx
```

### Examples

- `content/insights/agent-latency-prompt-caching.mdx`
- `content/insights/building-multi-agent-orchestrators.mdx`
- `content/insights/enterprise-agent-architecture-map.mdx`

---

## 3. Content Schema (YAML Frontmatter)

Every file MUST start with a valid YAML frontmatter header enclosed in `---` delimiters.

### Complete Schema Reference

```yaml
---
title: "How We Cut Agent Latency 40% With Prompt Caching"
slug: "agent-latency-prompt-caching"
type: "video"            # Required. One of: "video" | "podcast" | "infographic" | "article"
publishDate: "2026-08-01" # Required. ISO date format YYYY-MM-DD
author: "Tamer"          # Optional. Defaults to "Agentic City Team"
excerpt: "One-sentence summary shown on index cards and meta tags." # Required.
tags: ["orchestration", "performance"] # Optional string array.
thumbnail: "/content-assets/agent-latency-thumb.jpg" # Optional image URL.
seoTitle: "How We Cut Agent Latency 40% | Agentic City Insights" # Optional.
seoDescription: "Under 160 chars, distinct from excerpt if needed for SEO." # Required, max 160 chars.

# Type-Specific Fields:
videoUrl: "https://www.youtube.com/embed/..."       # Optional. For type: video
podcastEmbedUrl: "https://open.spotify.com/embed/..." # Optional. For type: podcast
infographicImage: "/content-assets/full-infographic.png" # Optional. For type: infographic
transcript: true          # Optional boolean. If true, body content is full transcript.
linkedinDiscussionUrl: "https://www.linkedin.com/posts/..." # Optional LinkedIn post URL.
---

Body content goes here — full transcript, article text, or infographic supporting copy.
```

### Mandatory Schema Rules (Build-Time Enforced)

- **Required Fields**: `title`, `slug`, `type`, `publishDate`, `excerpt`, `seoDescription`.
- **`type`**: MUST be one of `"video"`, `"podcast"`, `"infographic"`, `"article"`.
- **`slug`**: MUST be lowercase kebab-case only (e.g. `my-insight-slug`, matching `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`).
- **`seoDescription`**: MUST NOT exceed 160 characters.

---

## 4. Manual Publishing Workflow

1. Create a new file in `content/insights/<slug>.mdx`.
2. Fill out the YAML frontmatter and body text following the schema above.
3. If using static image assets (e.g., for `thumbnail` or `infographicImage`), place optimized image files in `public/content-assets/`.
4. Run local validation and build:

   ```bash
   npm run build
   # or
   bun run build
   ```

5. Commit and push the file to the repository. The deployment pipeline will automatically publish the new entry.

---

## 5. Automated / Agentic Publishing Workflow

Any automated script, AI agent, Zapier/Make.com integration, or GitHub Action can publish content to `/insights` without touching React component code or calling custom administrative APIs.

### Agentic Publishing Protocol

1. **Target Folder**: `content/insights/`
2. **File Generation**: Produce a `.mdx` file conforming strictly to the frontmatter schema above.
3. **Commit Mechanism**: Use standard Git operations (e.g. GitHub API `createOrUpdateFileContents`, PR merge, or direct git push).
4. **No Auth/API Keys Required**: No separate CMS credentials or admin tokens are needed. Git write permissions to the repository are the sole publishing credential required.

---

## 6. Build-Time Safety Net & Validation

To guarantee that automated or manual entries never break the production website or output malformed SEO metadata, a build-time validator runs automatically during `npm run build` / `bun run build`:

- Validation Script: `scripts/validate-insights.ts`
- If any file in `content/insights/` fails frontmatter schema rules, **the build fails immediately with a clear error traceback**, halting deployment before malformed code reaches production.
