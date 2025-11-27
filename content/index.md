# Wiki Index

Filter by category or author to get to the right page fast.

<div class="filters">
  <label>
    Category
    <select v-model="activeCategory">
      <option value="">All categories</option>
      <option v-for="[key, label] in categoryEntries" :key="key" :value="key">
        {{ label }}
      </option>
    </select>
  </label>

  <label>
    Author
    <select v-model="activeAuthor">
      <option value="">All authors</option>
      <option v-for="name in authors" :key="name">{{ name }}</option>
    </select>
  </label>
</div>

<div v-if="filteredPages.length === 0" class="empty">
  No entries yet. To add, share them in <a href="https://beebs.dev/discord">Discord</a> in the #resources channel.
</div>

<ul v-else class="page-list">
  <li v-for="page in filteredPages" :key="page.url">
    <a :href="withBase(page.url)">{{ page.title }}</a>
    <span class="meta">{{ categoryLabel(page.category) }}</span>
    <span class="meta" v-if="page.author">· {{ page.author }}</span>
    <span class="meta" v-if="page.createdAt">· {{ formatDate(page.createdAt) }}</span>
  </li>
</ul>

<p class="helper">
  To add or update entries, share them in <a href="https://beebs.dev/discord">Discord</a> in the #resources channel and we'll publish them for you.
</p>

## Community Resource Votes

<ClientOnly>
  <ResourceIndex />
</ClientOnly>

<script setup lang="ts">
import { computed, ref } from "vue";
import { withBase } from "vitepress";

const CATEGORY_LABELS: Record<string, string> = {
  tools: "Tools & Software",
  learning: "Learning Resources",
  development: "Development",
  design: "Design & Creativity",
  research: "Research & Knowledge",
  building: "Building & Making",
  self: "Philosophy and Self",
  business: "Business & Strategy",
  community: "Community & Collaboration",
  misc: "Misc / Other",
};

const EXCLUDE_PATHS = new Set([
  "./index.md",
  "./categories.md",
  "./authors.md",
]);

const pathToUrl = (path: string) => path.replace(/^\.\//, "/").replace(/\.md$/, "");

const pages = Object.entries(import.meta.glob("./*.md", { eager: true }))
  .filter(([path]) => !EXCLUDE_PATHS.has(path))
  .map(([path, mod]) => {
    const pageData = (mod as any).__pageData || {};
    const fm = (mod as any).frontmatter || pageData.frontmatter || {};
    return {
      title: fm.title || pageData.title || "Untitled",
      category: fm.category || "misc",
      author: fm.author || "Unknown",
      createdAt: fm.createdAt || null,
      url: pathToUrl(path),
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const categoryEntries = Object.entries(CATEGORY_LABELS);
const authors = computed(() =>
  Array.from(new Set(pages.map((p) => p.author).filter(Boolean))).sort()
);

const activeCategory = ref("");
const activeAuthor = ref("");

const filteredPages = computed(() =>
  pages.filter(
    (p) =>
      (!activeCategory.value || p.category === activeCategory.value) &&
      (!activeAuthor.value || p.author === activeAuthor.value)
  )
);

const categoryLabel = (key: string) => CATEGORY_LABELS[key] || key;

const formatDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-weight: 600;
  font-size: 0.95rem;
}

select {
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.page-list {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0;
  display: grid;
  gap: 0.5rem;
}

.page-list a {
  font-weight: 700;
}

.meta {
  margin-left: 0.35rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.helper {
  margin-top: 1.5rem;
  color: var(--vp-c-text-2);
}

.empty {
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-2);
}
</style>
