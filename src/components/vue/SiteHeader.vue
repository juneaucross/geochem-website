<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import {
  attachLightDismissFallback,
  closeModal,
  openModal,
  supportsInvokerCommands,
} from '../../lib/dialog';

export interface NavItem {
  label: string;
  href: string;
}

const props = defineProps<{
  brand: string;
  nav: NavItem[];
}>();

const headerRef = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLDialogElement | null>(null);
const menuExpanded = ref(false);
const solid = ref(false);
const currentId = ref(props.nav[0]?.href?.replace(/^#/, '') || '');

const sectionIds = computed(() =>
  props.nav.map((item) => item.href.replace(/^#/, '')).filter(Boolean),
);

function syncExpanded() {
  menuExpanded.value = Boolean(dialogRef.value?.open);
}

function openMenu() {
  const dialog = dialogRef.value;
  if (!dialog) return;
  openModal(dialog);
  syncExpanded();
}

function closeMenu() {
  const dialog = dialogRef.value;
  if (!dialog) return;
  closeModal(dialog);
  syncExpanded();
}

function onOpenClick(event: MouseEvent) {
  if (supportsInvokerCommands()) {
    queueMicrotask(syncExpanded);
    return;
  }
  event.preventDefault();
  openMenu();
}

function onCloseClick(event: MouseEvent) {
  if (supportsInvokerCommands()) {
    queueMicrotask(syncExpanded);
    return;
  }
  event.preventDefault();
  closeMenu();
}

function onNavAnchorClick() {
  closeMenu();
}

function setCurrent(id: string) {
  currentId.value = id;
}

function isCurrent(href: string) {
  return href === `#${currentId.value}`;
}

let solidObserver: IntersectionObserver | null = null;
let spyObserver: IntersectionObserver | null = null;
let detachLightDismiss: (() => void) | null = null;
let onScrollFallback: (() => void) | null = null;

onMounted(() => {
  const header = headerRef.value;
  const dialog = dialogRef.value;
  const hero = document.querySelector('#home');

  if (dialog) {
    dialog.addEventListener('close', syncExpanded);
    detachLightDismiss = attachLightDismissFallback(dialog, closeMenu);
  }

  if (header instanceof HTMLElement && hero instanceof HTMLElement) {
    const setSolid = (value: boolean) => {
      solid.value = value;
    };

    if ('IntersectionObserver' in window) {
      solidObserver = new IntersectionObserver(
        ([entry]) => {
          setSolid(!entry.isIntersecting);
        },
        {
          rootMargin: `-${header.offsetHeight + 8}px 0px 0px 0px`,
          threshold: 0,
        },
      );
      solidObserver.observe(hero);
    } else {
      onScrollFallback = () => {
        setSolid(window.scrollY > Math.max(48, hero.offsetHeight * 0.08));
      };
      onScrollFallback();
      window.addEventListener('scroll', onScrollFallback, { passive: true });
    }
  }

  const sections = sectionIds.value
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (sections.length && 'IntersectionObserver' in window) {
    const ratios = new Map<string, number>();
    const navOffset = () => (headerRef.value?.offsetHeight || 64) + 12;

    spyObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }
        let bestId = sections[0].id;
        let bestRatio = -1;
        for (const section of sections) {
          const ratio = ratios.get(section.id) || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        }
        if (bestRatio > 0) setCurrent(bestId);
      },
      {
        rootMargin: `-${navOffset()}px 0px -45% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    );

    for (const section of sections) spyObserver.observe(section);
  } else if (sections.length) {
    setCurrent(sections[0].id);
  }

  void nextTick(syncExpanded);
});

onUnmounted(() => {
  solidObserver?.disconnect();
  spyObserver?.disconnect();
  detachLightDismiss?.();
  dialogRef.value?.removeEventListener('close', syncExpanded);
  if (onScrollFallback) {
    window.removeEventListener('scroll', onScrollFallback);
  }
});
</script>

<template>
  <header
    id="site-header"
    ref="headerRef"
    class="site-header"
    :class="{ 'is-solid': solid }"
  >
    <div class="site-header__bar">
      <p class="brand">
        <a href="#home" id="brand-link">{{ brand }}</a>
      </p>

      <nav class="site-nav site-nav--desktop" aria-label="Primary">
        <ul id="nav-list">
          <li v-for="item in nav" :key="item.href">
            <a
              :href="item.href"
              :aria-current="isCurrent(item.href) ? 'true' : undefined"
            >{{ item.label }}</a>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        class="nav-toggle"
        id="nav-open"
        commandfor="nav-dialog"
        command="show-modal"
        aria-controls="nav-dialog"
        :aria-expanded="menuExpanded ? 'true' : 'false'"
        aria-haspopup="dialog"
        @click="onOpenClick"
      >
        <span class="nav-toggle__label">Menu</span>
        <svg
          class="nav-toggle__icon"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            fill="currentColor"
            d="M4 7h16v1.5H4V7zm0 4.25h16v1.5H4v-1.5zM4 15.5h16V17H4v-1.5z"
          />
        </svg>
      </button>
    </div>
  </header>

  <!--
    Modal via showModal(): native focus trap + Esc.
    closedby="any": light-dismiss where supported; JS fallback otherwise.
  -->
  <dialog
    id="nav-dialog"
    ref="dialogRef"
    class="nav-dialog"
    closedby="any"
    aria-labelledby="nav-dialog-title"
  >
    <div class="nav-dialog__panel">
      <div class="nav-dialog__head">
        <h2 id="nav-dialog-title" class="nav-dialog__title">Menu</h2>
        <button
          type="button"
          class="nav-dialog__close"
          id="nav-close"
          commandfor="nav-dialog"
          command="close"
          @click="onCloseClick"
        >
          Close
        </button>
      </div>
      <nav class="site-nav site-nav--mobile" aria-label="Primary mobile">
        <ul id="nav-list-mobile">
          <li v-for="item in nav" :key="`m-${item.href}`">
            <a
              :href="item.href"
              :aria-current="isCurrent(item.href) ? 'true' : undefined"
              @click="onNavAnchorClick"
            >{{ item.label }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </dialog>
</template>
