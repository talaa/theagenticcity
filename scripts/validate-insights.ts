import fs from 'node:fs';
import path from 'node:path';
import { parseAndValidateInsight } from '../src/lib/insights.js';

function validateAllInsights() {
  const contentDir = path.resolve(process.cwd(), 'content', 'insights');

  console.log(`[Insights Validator] Checking directory: ${contentDir}`);

  if (!fs.existsSync(contentDir)) {
    console.error(`[Insights Validator Error] Directory not found: ${contentDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));

  if (files.length === 0) {
    console.warn(`[Insights Validator Warning] No .mdx or .md files found in ${contentDir}`);
    return;
  }

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    if (file === 'README.md') continue;

    try {
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      parseAndValidateInsight(rawContent, file);
      console.log(`  ✓ ${file} [VALID]`);
      passed++;
    } catch (err: any) {
      console.error(`\n==================================================`);
      console.error(`❌ BUILD VALIDATION FAILED: Malformed frontmatter in '${file}'`);
      console.error(err.message || err);
      console.error(`==================================================\n`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`[Insights Validator] Validation failed for ${failed} file(s). Halting build.`);
    process.exit(1);
  }

  console.log(`\n[Insights Validator] Successfully validated ${passed} insight file(s)!\n`);
}

validateAllInsights();
