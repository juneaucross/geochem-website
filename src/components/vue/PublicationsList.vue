<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { doiLabel } from '../../lib/doi';

export interface PubItem {
  year: number;
  citation: string;
  doi: string | null;
  url?: string;
  status?: string;
  studentAuthors?: string[];
}

interface YearGroup {
  year: number;
  pubs: PubItem[];
  /** Anchor id once per year (visible first, then earlier-only years). */
  id?: string;
}

const props = withDefaults(
  defineProps<{
    items: PubItem[];
    /** How many newest publications stay visible before “Show more”. */
    visibleCount?: number;
  }>(),
  { visibleCount: 2 },
);

const hydrated = ref(false);
/** Start expanded for SSR / no-JS; collapse after hydrate. */
const expanded = ref(true);
const morePanelRef = ref<HTMLElement | null>(null);

const visible = computed(() => props.items.slice(0, props.visibleCount));
const earlier = computed(() => props.items.slice(props.visibleCount));

function groupByYear(items: PubItem[], claimedYears: Set<number>): YearGroup[] {
  const byYear = new Map<number, PubItem[]>();
  for (const item of items) {
    const group = byYear.get(item.year);
    if (group) {
      group.push(item);
    } else {
      byYear.set(item.year, [item]);
    }
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, pubs]) => {
      let id: string | undefined;
      if (!claimedYears.has(year)) {
        id = `publications-${year}`;
        claimedYears.add(year);
      }
      return { year, pubs, id };
    });
}

const visibleGroups = computed(() => groupByYear(visible.value, new Set()));

const earlierGroups = computed(() => {
  const claimed = new Set(visible.value.map((item) => item.year));
  return groupByYear(earlier.value, claimed);
});

const showToggle = computed(() => hydrated.value && earlier.value.length > 0);

const toggleLabel = computed(() => {
  if (expanded.value) return 'Show less';
  const n = earlier.value.length;
  return n === 1
    ? 'Show more (1 earlier publication)'
    : `Show more (${n} earlier publications)`;
});

/**
 * Vue treats `hidden` as boolean — set via DOM API.
 * Prefer `until-found` when supported (Find-in-page); otherwise plain `hidden`.
 */
function syncPanelHidden() {
  const panel = morePanelRef.value;
  if (!panel) return;
  if (!hydrated.value || expanded.value) {
    panel.removeAttribute('hidden');
    return;
  }
  if ('onbeforematch' in HTMLElement.prototype) {
    panel.setAttribute('hidden', 'until-found');
  } else {
    panel.setAttribute('hidden', '');
  }
}

function toggle() {
  expanded.value = !expanded.value;
}

function onBeforeMatch() {
  expanded.value = true;
}

watch([hydrated, expanded], async () => {
  await nextTick();
  syncPanelHidden();
});

onMounted(async () => {
  hydrated.value = true;

  if (earlier.value.length) {
    expanded.value = false;
  }

  await nextTick();
  syncPanelHidden();
});
</script>

<template>
  <div class="publications-list">
    <div
      v-for="group in visibleGroups"
      :id="group.id"
      :key="`v-${group.year}`"
      class="pub-year"
    >
      <h3 class="pub-year__title">{{ group.year }}</h3>
      <ol class="pub-list">
        <li v-for="(item, index) in group.pubs" :key="`v-${group.year}-${index}`" class="pub-item">
          {{ item.citation }}
          <template v-if="item.doi">
            {{ ' ' }}<a class="pub-doi" :href="item.doi">{{ doiLabel(item.doi) }}</a>
          </template>
          <template v-else-if="item.url">
            {{ ' ' }}<a :href="item.url">Link</a>
          </template>
        </li>
      </ol>
    </div>

    <template v-if="earlier.length">
      <!-- Toggle only after hydrate so no-JS keeps every entry visible with no dead control. -->
      <button
        v-if="showToggle"
        type="button"
        class="btn disclosure-toggle"
        :aria-expanded="expanded ? 'true' : 'false'"
        aria-controls="publications-more"
        @click="toggle"
      >
        {{ toggleLabel }}
      </button>

      <div
        id="publications-more"
        ref="morePanelRef"
        class="publications-more"
        @beforematch="onBeforeMatch"
      >
        <div
          v-for="group in earlierGroups"
          :id="group.id"
          :key="`h-${group.year}`"
          class="pub-year"
        >
          <h3 class="pub-year__title">{{ group.year }}</h3>
          <ol class="pub-list">
            <li
              v-for="(item, index) in group.pubs"
              :key="`h-${group.year}-${index}`"
              class="pub-item"
            >
              {{ item.citation }}
              <template v-if="item.doi">
                {{ ' ' }}<a class="pub-doi" :href="item.doi">{{ doiLabel(item.doi) }}</a>
              </template>
              <template v-else-if="item.url">
                {{ ' ' }}<a :href="item.url">Link</a>
              </template>
            </li>
          </ol>
        </div>
      </div>
    </template>
  </div>
</template>
