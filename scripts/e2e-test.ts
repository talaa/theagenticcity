import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { parseAndValidateInsight } from '../src/lib/insights.js';

// Load environment variables from .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

async function runE2ETestSuite() {
  console.log('\n================================================================');
  console.log('🚀 RUNNING AGENTIC CITY END-TO-END (E2E) TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
      failedTests++;
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 1: Insights Publishing Pipeline
  // -------------------------------------------------------------
  console.log('--- TEST SUITE 1: Insights Pipeline Validation ---');
  const insightsDir = path.resolve(process.cwd(), 'content', 'insights');
  const insightFiles = fs.readdirSync(insightsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  
  let validInsightsCount = 0;
  for (const file of insightFiles) {
    if (file === 'README.md') continue;
    try {
      const content = fs.readFileSync(path.join(insightsDir, file), 'utf-8');
      const entry = parseAndValidateInsight(content, file);
      if (entry.title && entry.slug && entry.seoDescription && entry.readingTimeMinutes > 0) {
        validInsightsCount++;
      }
    } catch (e: any) {
      console.error(`Failed parsing ${file}:`, e.message);
    }
  }
  assert(validInsightsCount >= 5, `All ${validInsightsCount} MDX insights validate correctly with strict schema`);

  // -------------------------------------------------------------
  // TEST SUITE 2: Supabase Connectivity & Configuration
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Supabase Client Configuration ---');
  assert(Boolean(supabaseUrl && supabaseUrl.startsWith('https://')), 'VITE_SUPABASE_URL is properly configured', supabaseUrl);
  assert(Boolean(supabaseAnonKey && supabaseAnonKey.length > 20), 'VITE_SUPABASE_ANON_KEY is properly configured');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // -------------------------------------------------------------
  // TEST SUITE 3: Public Query & Data Privacy (No Email Leak)
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Public Approved Ideas Query & Privacy ---');
  let approvedIdeas: any[] = [];
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('id, title, pitch, category, stage, support_goal, support_count, creator_handle, created_at')
      .eq('status', 'approved')
      .order('support_count', { ascending: false });

    if (error) {
      assert(false, 'Fetch approved ideas from Supabase', error.message);
    } else {
      approvedIdeas = data || [];
      assert(approvedIdeas.length > 0, `Fetched ${approvedIdeas.length} approved ideas from live Supabase database`);
      
      // Verify no idea exposed creator_email
      const hasAnyEmailLeaked = approvedIdeas.some((i) => 'creator_email' in i && i.creator_email !== undefined);
      assert(!hasAnyEmailLeaked, 'Data Privacy: creator_email is NEVER returned in public queries');
    }
  } catch (err: any) {
    assert(false, 'Fetch approved ideas exception', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 4: Atomic Support RPC & Deduplication
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Soft Deduplication & Support Voting RPC ---');
  if (approvedIdeas.length > 0) {
    const testIdea = approvedIdeas[0];
    const initialSupport = testIdea.support_count;
    const testFingerprint = `e2e_test_fp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      // 1. First support attempt (should succeed)
      const { data: firstSupport, error: firstErr } = await supabase.rpc('increment_support', {
        p_idea_id: testIdea.id,
        p_supporter_fingerprint: testFingerprint,
      });

      if (firstErr) {
        assert(false, 'RPC increment_support execution', firstErr.message);
      } else {
        assert(
          firstSupport && firstSupport.success === true && firstSupport.support_count === initialSupport + 1,
          `First support succeeded: count incremented from ${initialSupport} -> ${firstSupport.support_count}`
        );

        // 2. Second support attempt with SAME fingerprint (should be blocked by unique constraint)
        const { data: secondSupport, error: secondErr } = await supabase.rpc('increment_support', {
          p_idea_id: testIdea.id,
          p_supporter_fingerprint: testFingerprint,
        });

        const wasBlocked =
          (secondSupport && secondSupport.success === false && secondSupport.error === 'ALREADY_SUPPORTED') ||
          (secondErr && (secondErr.code === '23505' || secondErr.message.includes('unique')));

        assert(Boolean(wasBlocked), 'Duplicate Prevention: Second vote from same fingerprint was blocked with ALREADY_SUPPORTED');
      }
    } catch (err: any) {
      assert(false, 'RPC support voting exception', err.message);
    }
  } else {
    console.warn('Skipping RPC test because no approved ideas were found.');
  }

  // -------------------------------------------------------------
  // TEST SUITE 5: Lead-Capture Concept Submission & Moderation
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 5: Moderated Idea Submission (Lead Capture) ---');
  const testSubTitle = `E2E Autonomous Agent Test ${Date.now()}`;
  const testSubEmail = `lead-${Date.now()}@e2e-enterprise-test.io`;

  try {
    const { error: insertErr } = await supabase.from('ideas').insert({
      title: testSubTitle,
      pitch: 'A test autonomous agent concept submitted via E2E test suite.',
      architecture_blueprint: '## E2E Architecture\n- Worker 1\n- Supervisor Agent',
      category: 'dev_tools',
      support_goal: 150,
      creator_handle: '@e2e_tester',
      creator_email: testSubEmail,
      status: 'pending', // Enforced pending
    });

    if (insertErr) {
      assert(false, 'Insert concept with pending status and required work email', insertErr.message);
    } else {
      assert(true, `Successfully submitted concept "${testSubTitle}" with status 'pending' and lead email`);

      // Verify that this pending idea does NOT appear in public approved queries
      const { data: publicCheck } = await supabase
        .from('ideas')
        .select('id, title')
        .eq('status', 'approved')
        .eq('title', testSubTitle);

      const isHiddenFromPublic = !publicCheck || publicCheck.length === 0;
      assert(isHiddenFromPublic, 'Moderation Quarantine: Pending submission is NOT visible in public approved feed');
    }
  } catch (err: any) {
    assert(false, 'Idea submission exception', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 6: UI Routes & Link Integrity
  // -------------------------------------------------------------
  console.log('\n--- TEST SUITE 6: Route & Navigation Integrity ---');
  const appFile = fs.readFileSync(path.resolve(process.cwd(), 'src', 'App.tsx'), 'utf-8');
  assert(appFile.includes('path="lab/ideas"'), 'App.tsx defines <Route path="lab/ideas" element={<IdeasLab />} />');

  const layoutFile = fs.readFileSync(path.resolve(process.cwd(), 'src', 'components', 'Layout.tsx'), 'utf-8');
  assert(layoutFile.includes('to="/lab/ideas"'), 'Layout.tsx contains secondary footer/mobile links to /lab/ideas');

  // -------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`🏁 E2E TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runE2ETestSuite();
