/**
 * @file This file contains a Lume plugin for injecting a CSS comment banner.
 * @author Rick Cogley (refactored)
 * @see Original implementation from https://github.com/oscarotero in https://lume.land/docs/advanced/plugins/#simple-plugin-example.
 */

import type { Site } from "../types/lume.ts";

/**
 * Options interface for the CSS Banner plugin.
 */
export interface CssBannerOptions {
  /** The message string to be prepended as a CSS comment banner. */
  message: string;
}

/**
 * A Lume plugin that prepends a CSS comment banner to all .css files.
 *
 * This is useful for adding copyright information, build details, or
 * other metadata to the top of your generated CSS files.
 *
 * @param options - Configuration options for the CSS banner, including the message.
 * @returns A Lume plugin function that processes CSS pages.
 *
 * @example
 * // In your Lume _config.ts:
 * import lume from "lume/mod.ts";
 * import { cssBanner, shuffle } from "hibana/mod.ts";
 *
 * const site = lume();
 *
 * site.use(cssBanner({
 * message: "===css jokes are always in style===",
 * }));
 *
 * export default site;
 */
export default function cssBanner(options: CssBannerOptions) {
  /**
   * Prepends the configured banner message to the given CSS content.
   * @param content - The original CSS content.
   * @returns The CSS content with the banner prepended.
   */
  function addBanner(content: string): string {
    const banner = `/* ${options.message} */`;
    return banner + "\n" + content;
  }

  /**
   * The plugin function that processes CSS pages.
   * @param site - The Lume site instance.
   */
  return (site: Site) => {
    site.process([".css"], (pages) => {
      for (const page of pages) {
        if (typeof page.content === "string") {
          page.content = addBanner(page.content);
        }
      }
    });
  };
}
