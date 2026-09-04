<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  attachLightDismissFallback,
  closeModal,
  openModal,
  supportsInvokerCommands,
} from '../../lib/dialog';

const PLACEHOLDER_SRC = `${import.meta.env.BASE_URL}assets/img/media-placeholder.svg`;

const dialogRef = ref<HTMLDialogElement | null>(null);
const imageSrc = ref('');
const imageAlt = ref('');
const captionText = ref('');

let returnFocus: HTMLElement | null = null;
let detachLightDismiss: (() => void) | null = null;

function openLightbox(src: string, alt: string, caption: string) {
  imageSrc.value = src || PLACEHOLDER_SRC;
  imageAlt.value = alt || '';
  captionText.value = caption || '';
  const dialog = dialogRef.value;
  if (!dialog) return;
  openModal(dialog);
}

function closeLightbox() {
  const dialog = dialogRef.value;
  if (!dialog) return;
  closeModal(dialog);
}

function onCloseClick(event: MouseEvent) {
  if (supportsInvokerCommands()) return;
  event.preventDefault();
  closeLightbox();
}

function onDialogClose() {
  imageSrc.value = '';
  imageAlt.value = '';
  captionText.value = '';
  const el = returnFocus;
  returnFocus = null;
  if (el && typeof el.focus === 'function') {
    el.focus({ preventScroll: true });
  }
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const trigger = target.closest('[data-lightbox-src]');
  if (!(trigger instanceof HTMLElement) || !document.contains(trigger)) return;
  event.preventDefault();
  returnFocus = trigger;
  openLightbox(
    trigger.getAttribute('data-lightbox-src') || '',
    trigger.getAttribute('data-lightbox-alt') || '',
    trigger.getAttribute('data-lightbox-caption') || '',
  );
}

onMounted(() => {
  const dialog = dialogRef.value;
  if (dialog) {
    dialog.addEventListener('close', onDialogClose);
    detachLightDismiss = attachLightDismissFallback(dialog, closeLightbox);
  }
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
  detachLightDismiss?.();
  dialogRef.value?.removeEventListener('close', onDialogClose);
});
</script>

<template>
  <!--
    Native modal: showModal() traps focus; Esc + closedby="any" dismiss.
    Triggers stay in static Astro markup (data-lightbox-*).
  -->
  <dialog
    id="lightbox-dialog"
    ref="dialogRef"
    class="lightbox"
    closedby="any"
    aria-labelledby="lightbox-caption"
  >
    <div class="lightbox__panel">
      <button
        type="button"
        class="lightbox__close"
        id="lightbox-close"
        commandfor="lightbox-dialog"
        command="close"
        @click="onCloseClick"
      >
        Close
      </button>
      <img
        id="lightbox-image"
        class="lightbox__image"
        :src="imageSrc || undefined"
        :alt="imageAlt"
        width="1200"
        height="800"
        decoding="async"
        fetchpriority="low"
      />
      <p id="lightbox-caption" class="lightbox__caption">{{ captionText }}</p>
    </div>
  </dialog>
</template>
