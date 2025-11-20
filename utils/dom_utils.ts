/**
 * Utility function to load an external vendor script.
 * @param src The URL of the script to load.
 * @param attributes Optional attributes to set on the script tag.
 * @param callback Optional callback function to execute once the script is loaded.
 */
export function loadVendorScript(
  src: string,
  attributes: { [key: string]: string } = {},
  callback?: () => void,
): void {
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
  const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const focusables: NodeListOf<HTMLElement> = container.querySelectorAll(
    focusableSelectors,
  );

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

/**
 * Checks if the user prefers reduced motion based on their system settings.
 * Important for accessibility - animations should be disabled when this returns true.
 *
 * @returns {boolean} True if user prefers reduced motion
 *
 * @example
 * ```ts
 * import { prefersReducedMotion } from "hibana/utils/dom_utils.ts";
 *
 * if (!prefersReducedMotion()) {
 *   element.classList.add('animate-fade-in');
 * }
 * ```
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Operating systems that can be detected
 */
export type OS =
  | "windows-phone"
  | "android"
  | "ios"
  | "mac"
  | "windows"
  | "unknown";

/**
 * Detects the user's operating system from the user agent string.
 * Useful for platform-specific styling or functionality.
 *
 * @returns {OS} The detected operating system
 *
 * @example
 * ```ts
 * import { detectOS } from "hibana/utils/dom_utils.ts";
 *
 * const os = detectOS();
 * document.body.classList.add(`os-${os}`);
 * ```
 */
export function detectOS(): OS {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/windows phone/i.test(ua)) return "windows-phone";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
  if (/Mac/i.test(ua)) return "mac";
  if (/Win/i.test(ua)) return "windows";

  return "unknown";
}

/**
 * Adds OS detection class to document body.
 * Convenience function that automatically adds 'os-{platform}' class.
 *
 * @example
 * ```ts
 * import { addOSClass } from "hibana/utils/dom_utils.ts";
 *
 * // In your main.ts
 * addOSClass(); // Adds class like 'os-mac' or 'os-windows' to <body>
 * ```
 */
export function addOSClass(): void {
  const os = detectOS();
  if (os !== "unknown") {
    document.body.classList.add(`os-${os}`);
  }
}
