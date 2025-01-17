export function autofocus(node: HTMLElement) {
  function handleKeydown(e: KeyboardEvent) {
    if (node === document.activeElement) {
      return;
    }
    if (e.key.match(/\w/g)) {
      node.focus();
    }
  }
  window.addEventListener("keydown", handleKeydown);
  return {
    destroy() {
      window.removeEventListener("keydown", handleKeydown);
    },
  };
}
