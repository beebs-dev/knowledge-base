#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const fg = require("fast-glob");
const matter = require("gray-matter");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_PATH = path.join(ROOT, ".vitepress", "resources.json");

async function generateResourcesJson() {
  const files = await fg(["**/*.md"], {
    cwd: CONTENT_DIR,
    dot: false,
    ignore: [".vitepress/**", "**/node_modules/**"]
  });

  const entries = [];

  for (const file of files) {
    const basename = path.basename(file);
    if (["index.md", "categories.md", "authors.md"].includes(basename)) continue;

    const absolutePath = path.join(CONTENT_DIR, file);
    const raw = await fs.readFile(absolutePath, "utf8");
    const parsed = matter(raw);

    const slug = normalizeSlug(file);
    const title = parsed.data.title || slug;

    entries.push({
      title,
      path: `/${slug}`,
      votes_weekly: parsed.data.votes_weekly ?? 0,
      votes_monthly: parsed.data.votes_monthly ?? 0,
      votes_all_time: parsed.data.votes_all_time ?? 0,
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
