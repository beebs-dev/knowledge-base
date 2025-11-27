#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const fg = require("fast-glob");
const matter = require("gray-matter");
const ogs = require("open-graph-scraper");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_PATH = path.join(ROOT, ".vitepress", "resources.json");
const VOTES_PATH = path.join(ROOT, "data", "votes.json");

async function generateResourcesJson() {
  const files = await fg(["**/*.md"], {
    cwd: CONTENT_DIR,
    dot: false,
    ignore: [".vitepress/**", "**/node_modules/**"]
  });

  const entries = [];
  const voteStats = await loadVoteStats();

  for (const file of files) {
    const basename = path.basename(file);
    if (["index.md", "categories.md", "authors.md"].includes(basename)) continue;

    const absolutePath = path.join(CONTENT_DIR, file);
    const raw = await fs.readFile(absolutePath, "utf8");
    const parsed = matter(raw);

    const slug = normalizeSlug(file);
    const title = parsed.data.title || slug;

    const { thumb, favicon } = await resolveThumb(parsed.data.link);
    const stats = voteStats.get(parsed.data.discord_thread_id) || null;

    entries.push({
      title,
      path: `/${slug}`,
      category: parsed.data.category || null,
      author: parsed.data.author || null,
      createdAt: parsed.data.createdAt || null,
      link: parsed.data.link || null,
      thumb,
      favicon,
      votes_weekly: stats ? stats.weekly : parsed.data.votes_weekly ?? 0,
      votes_monthly: stats ? stats.monthly : parsed.data.votes_monthly ?? 0,
      votes_all_time: stats ? stats.all : parsed.data.votes_all_time ?? 0,
      discord_thread_id: parsed.data.discord_thread_id || null
    });
  }

  entries.sort((a, b) => a.title.localeCompare(b.title));

  const payload = {
    __meta: {
      generated_at: new Date().toISOString(),
      count: entries.length,
    },
    items: entries,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2));

  return payload;
}

async function resolveThumb(link) {
  if (!link) return { thumb: null, favicon: null };

  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(link)}&sz=128`;

  try {
    const { result } = await ogs({ url: link, timeout: 5000 });
    const ogImage = Array.isArray(result.ogImage) ? result.ogImage[0] : result.ogImage;
    const ogUrl = ogImage?.url || result.twitterImage?.url || null;
    return { thumb: ogUrl, favicon };
  } catch (error) {
    return { thumb: null, favicon };
  }
}

async function loadVoteStats() {
  try {
    const raw = await fs.readFile(VOTES_PATH, "utf8");
    const data = JSON.parse(raw);
    const now = Math.floor(Date.now() / 1000);
    const weekAgo = now - 7 * 24 * 60 * 60;
    const monthAgo = now - 30 * 24 * 60 * 60;

    const stats = new Map();
    for (const [threadId, entry] of Object.entries(data)) {
      const votes = entry.votes || [];
      const weekly = votes.filter((v) => v.timestamp >= weekAgo).length;
      const monthly = votes.filter((v) => v.timestamp >= monthAgo).length;
      stats.set(threadId, {
        weekly,
        monthly,
        all: votes.length,
      });
    }
    return stats;
  } catch (error) {
    return new Map();
  }
}

function normalizeSlug(file) {
  const withoutExt = file.replace(/\\/g, "/").replace(/\.md$/, "");
  return withoutExt.replace(/\/$/, "");
}

if (require.main === module) {
  generateResourcesJson().catch((error) => {
    console.error("Failed to generate resources.json", error);
    process.exitCode = 1;
  });
}

module.exports = { generateResourcesJson };
