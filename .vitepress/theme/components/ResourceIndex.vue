<template>
  <div class="resource-index">
    <div class="header">
      <h1 class="title">Resources</h1>
      <div class="meta" v-if="sorted.length">
        <span>{{ sorted.length }} total</span>
      </div>
    </div>

    <div class="filters" ref="filtersEl">
      <div class="filter-field" :data-open="openDropdown === 'category'">
        <span class="filter-label">Category</span>
        <button class="select-button" type="button" @click="toggleDropdown('category')">
          <span>{{ selectedCategoryLabel }}</span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <ul v-if="openDropdown === 'category'" class="dropdown" role="listbox" aria-label="Filter by category"
          @keydown.escape.stop.prevent="closeDropdown">
          <li>
            <button class="option" type="button" :aria-selected="activeCategory === ''"
              @click="selectOption('category', '')">
              <span>All categories</span>
            </button>
          </li>
          <li v-for="cat in categories" :key="cat.key">
            <button class="option" type="button" :aria-selected="activeCategory === cat.key"
              @click="selectOption('category', cat.key)">
              <span>{{ cat.label }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="filter-field" :data-open="openDropdown === 'author'">
        <span class="filter-label">Author</span>
        <button class="select-button" type="button" @click="toggleDropdown('author')">
          <span>{{ selectedAuthorLabel }}</span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <ul v-if="openDropdown === 'author'" class="dropdown" role="listbox" aria-label="Filter by author"
          @keydown.escape.stop.prevent="closeDropdown">
          <li>
            <button class="option" type="button" :aria-selected="activeAuthor === ''"
              @click="selectOption('author', '')">
              <span>All authors</span>
            </button>
          </li>
          <li v-for="author in authors" :key="author">
            <button class="option" type="button" :aria-selected="activeAuthor === author"
              @click="selectOption('author', author)">
              <span>{{ author || "Unknown" }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <ul v-if="sorted.length" class="resource-list">
      <li v-for="item in sorted" :key="item.path" class="resource-row">
        <a :href="link(item.path)" class="resource-link">
          <img class="thumb" :src="thumbUrl(item)" :alt="`Thumbnail for ${item.title}`" @error="onThumbError($event)" />
          <div class="content">
            <div class="title-line">
              <span class="title">{{ item.title }}</span>
              <span class="score">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" />
                  <path
                    d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" />
                </svg>
                {{ displayScore(item) }}
              </span>
            </div>
            <div class="meta-row">
              <span>{{ categoryLabel(item.category) }}</span>
              <span v-if="item.author">· {{ item.author }}</span>
            </div>
            <p v-if="item.useful" class="useful">{{ item.useful }}</p>
            <div class="votes-row">
              <span class="pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" />
                  <path
                    d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" />
                </svg>
                Weekly {{ item.votes_weekly ?? 0 }}
              </span>
              <span class="pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" />
                  <path
                    d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" />
                </svg>
                Monthly {{ item.votes_monthly ?? 0 }}
              </span>
              <span class="pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" />
                  <path
                    d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" />
                </svg>
                All-time {{ item.votes_all_time ?? 0 }}
              </span>
            </div>
          </div>
        </a>
      </li>
    </ul>

    <div v-else class="empty">No resources yet.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vitepress";
import resourcesData from "../../resources.json";

const CATEGORY_LABELS: Record<string, string> = {
  tools: "Tools & Software",
  learning: "Learning Resources",
  development: "Development",
  design: "Design & Creativity",
  research: "Research & Knowledge",
  building: "Building & Making",
  self: "Philosophy & Self",
  business: "Business & Strategy",
  community: "Community & Collaboration",
  misc: "Misc / Other",
};

type ResourceEntry = {
  title: string;
  path: string;
  category?: string | null;
  author?: string | null;
  createdAt?: string | null;
  link?: string | null;
  useful?: string | null;
  thumb?: string | null;
  votes_weekly?: number;
  votes_monthly?: number;
  votes_all_time?: number;
  discord_thread_id?: string | null;
};

type ResourcesPayload = { items: ResourceEntry[]; __meta?: { generated_at?: string; count?: number } };

const payload = (resourcesData as ResourcesPayload) || { items: [] };
const resources = ref<ResourceEntry[]>(Array.isArray(payload) ? (payload as any) : payload.items || []);
const activeCategory = ref("");
const activeAuthor = ref("");
const openDropdown = ref<DropdownName>(null);
const filtersEl = ref<HTMLElement | null>(null);

const lastUpdated = payload.__meta?.generated_at
  ? new Date(payload.__meta.generated_at).toLocaleString()
  : null;

const categories = computed(() =>
  Array.from(new Set(resources.value.map((r) => r.category).filter(Boolean)))
    .map((key) => ({ key, label: CATEGORY_LABELS[key!] || key || "" }))
    .sort((a, b) => a.label.localeCompare(b.label))
);

const authors = computed(() =>
  Array.from(new Set(resources.value.map((r) => r.author).filter(Boolean))).sort()
);

const selectedCategoryLabel = computed(() => (activeCategory.value ? categoryLabel(activeCategory.value) : "All categories"));
const selectedAuthorLabel = computed(() => (activeAuthor.value ? activeAuthor.value : "All authors"));

const filtered = computed(() =>
  resources.value.filter(
    (r) =>
      (!activeCategory.value || r.category === activeCategory.value) &&
      (!activeAuthor.value || r.author === activeAuthor.value)
  )
);

const sorted = computed(() =>
  [...filtered.value].sort((a, b) => (b.votes_all_time ?? 0) - (a.votes_all_time ?? 0) || a.title.localeCompare(b.title))
);

const link = (path: string) => withBase(path);
const displayScore = (item: ResourceEntry) => item.votes_all_time ?? 0;
const categoryLabel = (key?: string | null) => (key ? CATEGORY_LABELS[key] || key : "");

type DropdownName = "category" | "author" | null;

function toggleDropdown(name: DropdownName) {
  openDropdown.value = openDropdown.value === name ? null : name;
}

function closeDropdown() {
  openDropdown.value = null;
}

function selectOption(type: Exclude<DropdownName, null>, value: string) {
  if (type === "category") activeCategory.value = value;
  if (type === "author") activeAuthor.value = value;
  closeDropdown();
}

function handleClickOutside(event: MouseEvent) {
  if (!filtersEl.value) return;
  if (!filtersEl.value.contains(event.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function thumbUrl(item: ResourceEntry) {
  if (item.thumb) return item.thumb;
  if (item.link) return `https://v1.opengraph.11ty.dev/${encodeURIComponent(item.link)}/small/`;
  return "";
}

function onThumbError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = "";
  img.style.backgroundColor = "var(--vp-c-bg-soft)";
}
</script>

<style scoped>
.resource-index {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.meta {
  display: inline-flex;
  gap: 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  font-weight: 500;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.filter-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-family: var(--vp-font-family-base, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
}

.filter-label {
  font-weight: 650;
  font-size: 0.96rem;
  color: var(--vp-c-text-1);
}

.select-button {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: linear-gradient(180deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
  font-size: 1rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease;
}

.select-button:hover {
  border-color: var(--vp-c-brand-1, #3e63dd);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.select-button:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1, #3e63dd);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1, #3e63dd) 24%, transparent);
}

.filter-field[data-open="true"] .select-button svg {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 20;
}

.dropdown li+li {
  border-top: 1px solid color-mix(in srgb, var(--vp-c-border) 70%, transparent);
}

.option {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.95rem;
  background: var(--vp-c-bg-soft);
  border: none;
  font: inherit;
  color: var(--vp-c-text-1);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s ease, transform 0.1s ease, color 0.12s ease;
}

.option:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1, #3e63dd) 8%, var(--vp-c-bg-soft) 92%);
  color: var(--vp-c-text-1);
}

.option[aria-selected="true"] {
  background: color-mix(in srgb, var(--vp-c-brand-1, #3e63dd) 12%, var(--vp-c-bg-soft) 88%);
  font-weight: 700;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}


.resource-row {
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.16s ease, box-shadow 0.18s ease, transform 0.12s ease, background-color 0.18s ease;
}

.resource-row:hover,
.resource-row:focus-within {
  border-color: var(--vp-c-brand-1, #3e63dd);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--vp-c-brand-1, #3e63dd) 6%, rgba(0, 0, 0, 0.04) 94%);
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 98%, var(--vp-c-brand-1, #3e63dd) 2%);
}

@media (prefers-color-scheme: dark) {
  .resource-row:hover,
  .resource-row:focus-within {
    box-shadow: 0 6px 18px color-mix(in srgb, var(--vp-c-brand-1, #3e63dd) 7%, rgba(0, 0, 0, 0.16) 93%);
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--vp-c-bg-soft) 97%, var(--vp-c-brand-1, #3e63dd) 3%);
  }
}

.resource-link {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.85rem;
  text-decoration: none;
  color: inherit;
  align-items: flex-start;
}

.resource-link:hover .title,
.resource-link:focus-visible .title {
  color: var(--vp-c-text-1);
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: contain;
  background-color: var(--vp-c-bg-soft);
  border: none;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.title-line .title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
}

.score {
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.useful {
  margin-top: 0.3rem;
  margin-bottom: 0.15rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.45;
}

.vp-doc li+li {
  margin-top: 0px !important;
}

.votes-row {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.1rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.45rem;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.pill svg {
  width: 14px;
  height: 14px;
  color: var(--vp-c-text-2);
}

.empty {
  padding: 0.75rem 1rem;
  border: 1px dashed var(--vp-c-border);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}
</style>
