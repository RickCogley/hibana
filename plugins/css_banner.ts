// import type { Site } from "lume/core.ts";
import type { Site } from "../types/lume.ts";

export interface CssBannerOptions {
  message: string;
}

/**
 * A Lume plugin that prepends a CSS comment banner to all .css files.
 */
export default function cssBanner(options: CssBannerOptions) {
  function addBanner(content: string): string {
    const banner = `/* ${options.message} */`;
    return banner + "\n" + content;
  }

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
