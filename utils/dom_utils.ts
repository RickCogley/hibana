/**
 * Utility function to load an external vendor script.
 * @param src The URL of the script to load.
 * @param attributes Optional attributes to set on the script tag.
 * @param callback Optional callback function to execute once the script is loaded.
 */
export function loadVendorScript(src: string, attributes: { [key: string]: string } = {}, callback?: () => void): void {
  const script = document.createElement("script");
  script.src = src;
  Object.entries(attributes).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  script.onload = callback || null;
  document.head.appendChild(script);
}

/**
 * Traps focus within a given container element.
 * Useful for modal dialogs to prevent users from tabbing outside the modal.
 * @param container The HTMLElement within which to trap focus.
 */
export function trapFocus(container: HTMLElement): void {
  // Select all focusable elements within the container
  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const focusables: NodeListOf<HTMLElement> = container.querySelectorAll(focusableSelectors);

  if (focusables.length === 0) {
    // console.warn("No focusable elements found in container:", container);
    return;
  }

  const firstFocusable: HTMLElement = focusables[0];
  const lastFocusable: HTMLElement = focusables[focusables.length - 1];

  container.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  // Set focus to the first focusable element when trapFocus is activated
  firstFocusable.focus();
}