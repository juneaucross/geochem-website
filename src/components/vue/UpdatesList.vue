<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

export interface UpdateLink {
  label: string;
  href: string;
}

export interface UpdateEntry {
  date: string;
  label: string;
  text: string;
  links?: UpdateLink[];
}

/** Matches `.about-layout` side-feed breakpoint in base.css */
const FEED_MQ = '(min-width: 56rem)';

const props = withDefaults(
  defineProps<{
    entries: UpdateEntry[];
    /** How many entries stay visible before “Show more” on narrow viewports. */
    visibleCount?: number;
  }>(),
  { visibleCount: 2 },
);

const hydrated = ref(false);
const isDesktopFeed = ref(false);
/** Start expanded for SSR / no-JS; narrow viewports collapse after hydrate. */
const expanded = ref(true);
const morePanelRef = ref<HTMLElement | null>(null);

let mediaQuery: MediaQueryList | null = null;

const visible = computed(() => {
  if (isDesktopFeed.value) return props.entries;
  return props.entries.slice(0, props.visibleCount);
});

const earlier = computed(() => {
  if (isDesktopFeed.value) return [];
  return props.entries.slice(props.visibleCount);
});

const moreStart = computed(() => props.entries.length - props.visibleCount);

const showToggle = computed(
  () => hydrated.value && !isDesktopFeed.value && earlier.value.length > 0,
);

const toggleLabel = computed(() => {
  if (expanded.value) return 'Show less';
  const n = earlier.value.length;
  return n === 1 ? 'Show more (1 earlier update)' : `Show more (${n} earlier updates)`;
});

const previewClamped = computed(
  () => hydrated.value && !isDesktopFeed.value && !expanded.value,
);

/**
 * Vue treats `hidden` as boolean — set via DOM API.
 * Prefer `until-found` when supported (Find-in-page); otherwise plain `hidden`.
 */
function syncPanelHidden() {
  const panel = morePanelRef.value;
  if (!panel) return;
  if (!hydrated.value || isDesktopFeed.value || expanded.value) {
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

function onFeedMqChange(event: MediaQueryListEvent) {
  applyFeedMode(event.matches);
}

function applyFeedMode(matches: boolean) {
  isDesktopFeed.value = matches;
  if (matches) {
    expanded.value = true;
    return;
  }
  if (!hydrated.value || !earlier.value.length) return;
  expanded.value = false;
}

watch([hydrated, expanded, isDesktopFeed], async () => {
  await nextTick();
  syncPanelHidden();
});

onMounted(async () => {
  hydrated.value = true;

  mediaQuery = window.matchMedia(FEED_MQ);
  applyFeedMode(mediaQuery.matches);
  mediaQuery.addEventListener('change', onFeedMqChange);

  await nextTick();
  syncPanelHidden();
});

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', onFeedMqChange);
});
</script>

<template>
  <div
    id="updates-body"
    class="updates-feed"
    :class="{ 'updates-feed--preview': previewClamped }"
    :tabindex="isDesktopFeed ? 0 : undefined"
    :aria-label="isDesktopFeed ? 'Lab updates, scrollable list' : undefined"
  >
    <ol class="timeline" reversed>
      <li
        v-for="(entry, index) in visible"
        :key="`v-${entry.date}-${index}`"
        class="timeline__item"
      >
        <time class="timeline__date" :datetime="entry.date || undefined">
          {{ entry.label }}
        </time>
        <div class="timeline__body">
          <p>{{ entry.text }}</p>
          <p v-if="entry.links?.length" class="link-row">
            <template v-for="(link, i) in entry.links" :key="link.href">
              <template v-if="i > 0"> · </template>
              <a :href="link.href">{{ link.label }}</a>
            </template>
          </p>
        </div>
      </li>
    </ol>

    <template v-if="earlier.length">
      <!-- Toggle only after hydrate so no-JS keeps every entry visible with no dead control. -->
      <button
        v-if="showToggle"
        type="button"
        class="btn disclosure-toggle"
        :aria-expanded="expanded ? 'true' : 'false'"
        aria-controls="updates-more"
        @click="toggle"
      >
        {{ toggleLabel }}
      </button>

      <div
        id="updates-more"
        ref="morePanelRef"
        class="timeline-more"
        @beforematch="onBeforeMatch"
      >
        <ol class="timeline timeline--more" reversed :start="moreStart">
          <li
            v-for="(entry, index) in earlier"
            :key="`h-${entry.date}-${index}`"
            class="timeline__item"
          >
            <time class="timeline__date" :datetime="entry.date || undefined">
              {{ entry.label }}
            </time>
            <div class="timeline__body">
              <p>{{ entry.text }}</p>
              <p v-if="entry.links?.length" class="link-row">
                <template v-for="(link, i) in entry.links" :key="link.href">
                  <template v-if="i > 0"> · </template>
                  <a :href="link.href">{{ link.label }}</a>
                </template>
              </p>
            </div>
          </li>
        </ol>
      </div>
    </template>
  </div>
</template>
