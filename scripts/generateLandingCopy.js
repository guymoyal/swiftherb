#!/usr/bin/env node
/**
 * Generate landing-page copy for Admitad entries in content/admitad-landings.json.
 * Idempotent: only fills entries where content == null AND a gotolink exists.
 * Failures leave content null (page falls back to program description).
 *
 * swiftherb flavor: health/pharma compliance — the system prompt forbids medical
 * or therapeutic claims (supplements/pharmacy copy must stay honest).
 *
 * Usage: pnpm partners:copy
 * Env: DEEPSEEK_API_KEY, optional COPY_LANGUAGE (default "en"), COPY_DELAY_MS (default 1000),
 *      COPY_CONCURRENCY (parallel DeepSeek calls, default 4)
 */
const fs = require('fs');
const path = require('path');

// Minimal .env loader (repo has no dotenv dependency; KEY=value lines only).
for (const file of ['.env', '.env.local']) {
  const p = path.join(__dirname, '..', file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DATA_FILE = path.join(__dirname, '..', 'content', 'admitad-landings.json');
const LANGUAGE = process.env.COPY_LANGUAGE || 'en';

const REQUIRED_KEYS = [
  'headline', 'subheadline', 'intro', 'benefits', 'howItWorks', 'faq',
  'ctaLabel', 'metaTitle', 'metaDescription',
];

async function callDeepSeekJson(systemPrompt, userPrompt) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!response.ok) {
    throw new Error(`DeepSeek API ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from DeepSeek');
  return JSON.parse(text);
}

function buildPrompts(entry) {
  const p = entry.program;
  const systemPrompt = [
    'You write conversion-focused but honest affiliate landing-page copy.',
    'Never invent prices, discounts, or guarantees not present in the input.',
    'Never make medical or therapeutic claims; never state or imply that any product',
    'diagnoses, treats, cures, or prevents a disease or condition. For supplements and',
    'health products, describe the brand and shopping experience, not health outcomes.',
    `Write in language: ${LANGUAGE}.`,
    'Respond with a single JSON object with EXACTLY these keys:',
    'headline (string, <=70 chars), subheadline (string, <=140 chars), intro (string, 2-3 sentences),',
    'benefits (array of 4-6 {title, description}), howItWorks (array of 3-5 strings),',
    'faq (array of 4-6 {question, answer}), ctaLabel (string, <=30 chars),',
    'metaTitle (string, <=60 chars), metaDescription (string, <=155 chars).',
  ].join(' ');
  const userPrompt = [
    `Brand/program: ${p.name}`,
    `Official site: ${p.siteUrl || 'unknown'}`,
    `Categories: ${(p.categories || []).map((c) => c.name).join(', ') || 'unknown'}`,
    `Program description (may contain HTML, treat as source material):`,
    String(p.description || '').slice(0, 4000),
    '',
    'Write landing page copy that helps a visitor decide to click through to this brand.',
    'The page is on a herbal & wellness shopping guide (swiftherb.com); keep the tone',
    'professional, warm, and helpful — a knowledgeable friend, not a hype machine.',
  ].join('\n');
  return { systemPrompt, userPrompt };
}

function validateContent(c) {
  for (const k of REQUIRED_KEYS) {
    if (c[k] === undefined || c[k] === null || c[k] === '') return `missing key: ${k}`;
  }
  if (!Array.isArray(c.benefits) || c.benefits.length < 3) return 'benefits must be an array of 3+';
  if (!Array.isArray(c.howItWorks) || c.howItWorks.length < 2) return 'howItWorks must be an array of 2+';
  if (!Array.isArray(c.faq) || c.faq.length < 3) return 'faq must be an array of 3+';
  return null;
}

async function main() {
  if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY is required (set in .env.local).');
  const payload = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const targets = (payload.entries || []).filter((e) => !e.content && e.admitad?.gotolink);
  console.log(`[copy] entries: ${payload.entries?.length ?? 0}; needing copy: ${targets.length}`);

  const delay = Number(process.env.COPY_DELAY_MS) || 1000;
  const concurrency = Math.max(1, Number(process.env.COPY_CONCURRENCY) || 4);
  let ok = 0;
  let done = 0;
  const failed = [];

  const saveProgress = () =>
    fs.writeFileSync(DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  let next = 0;
  const worker = async () => {
    while (next < targets.length) {
      const entry = targets[next];
      next += 1;
      const { systemPrompt, userPrompt } = buildPrompts(entry);
      try {
        const content = await callDeepSeekJson(systemPrompt, userPrompt);
        const problem = validateContent(content);
        if (problem) throw new Error(`invalid copy (${problem})`);
        entry.content = { ...content, language: LANGUAGE, generatedAt: new Date().toISOString() };
        ok += 1;
      } catch (err) {
        failed.push(`${entry.program.name}: ${err.message.slice(0, 120)}`);
        console.log(`[copy] ✗ ${entry.program.name}: ${err.message.slice(0, 120)}`);
      }
      done += 1;
      // Periodic save so an interrupted long run keeps its progress (script is idempotent).
      if (done % 25 === 0) {
        saveProgress();
        console.log(`[copy] progress: ${done}/${targets.length} (${ok} ok)`);
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));

  saveProgress();
  console.log(`[copy] done: ${ok} generated, ${failed.length} failed.`);
  if (failed.length) console.log(failed.map((f) => `  - ${f}`).join('\n'));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
