/** Shared helpers for native `<dialog>` light-dismiss fallbacks (Safari lacks `closedby`). */

export function supportsClosedBy(): boolean {
  return typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype;
}

export function supportsInvokerCommands(): boolean {
  return typeof HTMLButtonElement !== 'undefined' && 'commandForElement' in HTMLButtonElement.prototype;
}

/** Close when the click lands on the backdrop (outside the dialog’s content box). */
export function attachLightDismissFallback(
  dialog: HTMLDialogElement,
  close: () => void,
): () => void {
  if (supportsClosedBy()) {
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) close();
    };
    dialog.addEventListener('click', onClick);
    return () => dialog.removeEventListener('click', onClick);
  }

  const onClick = (event: MouseEvent) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inBox =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!inBox) close();
  };
  dialog.addEventListener('click', onClick);
  return () => dialog.removeEventListener('click', onClick);
}

export function openModal(dialog: HTMLDialogElement): void {
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

export function closeModal(dialog: HTMLDialogElement): void {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}
