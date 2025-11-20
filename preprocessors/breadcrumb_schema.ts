/**
 * Breadcrumb Schema.org generator for Lume
 *
 * Automatically generates BreadcrumbList structured data based on URL paths.
 * Supports multilingual sites and follows Schema.org best practices.
 *
 * @module preprocessors/breadcrumb_schema
 * @author Rick Cogley
 * @license MIT
 *
 * @example
 * ```ts
 * // In _config.ts
 * import { breadcrumbSchema } from "hibana/preprocessors/breadcrumb_schema.ts";
 *
 * site.preprocess([".md"], breadcrumbSchema({
 *   baseUrl: "https://example.com",
 *   homeNames: {
 *     en: "Home",
 *     ja: "ホーム",
 *   },
 *   languages: ["en", "ja"],
 *   defaultLanguage: "ja",
 * }));
 * ```
 */

/**
 * Home page names for different languages
 */
export interface HomeNames {
  [lang: string]: string;
}

/**
 * Configuration options for breadcrumb schema generation
 */
export interface BreadcrumbSchemaOptions {
  /**
   * Base URL of the site (without trailing slash)
   * @example "https://example.com"
   */
  baseUrl: string;

  /**
   * Home page names for each language
   * @example { en: "Home", ja: "ホーム", es: "Inicio" }
   */
  homeNames: HomeNames;

  /**
   * List of supported language codes
   * @example ["en", "ja"]
   * @default []
   */
  languages?: string[];

  /**
   * Default language code
   * @example "en"
   * @default "en"
   */
  defaultLanguage?: string;

  /**
   * Whether to skip root pages (/ and /en/, /ja/, etc.)
   * @default true
   */
  skipRootPages?: boolean;

  /**
   * Minimum number of breadcrumb items required to generate schema
   * (Breadcrumb always includes Home, so 2 means Home + 1 other item)
   * @default 2
   */
  minItems?: number;
}

/**
 * Schema.org BreadcrumbList item
 */
interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

/**
 * Schema.org BreadcrumbList
 */
interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  "@id": string;
  itemListElement: BreadcrumbItem[];
}

/**
 * Creates a breadcrumb schema preprocessor
 *
 * This preprocessor:
 * 1. Parses the URL path into breadcrumb segments
 * 2. Creates Schema.org BreadcrumbList with proper @id and positioning
 * 3. Skips pages that already have custom breadcrumb schema
 * 4. Skips root pages (/ and language roots like /en/)
 * 5. Properly formats segment names (capitalizes, replaces hyphens with spaces)
 *
 * @param options - Configuration options
 * @returns Preprocessor function compatible with Lume's site.preprocess()
 *
 * @example
 * ```ts
 * const preprocessor = breadcrumbSchema({
 *   baseUrl: "https://example.com",
 *   homeNames: { en: "Home", ja: "ホーム" },
 *   languages: ["en", "ja"],
 * });
 * site.preprocess([".md"], preprocessor);
 * ```
 */
export default function breadcrumbSchema(
  options: BreadcrumbSchemaOptions,
): (pages: Lume.Page[]) => void {
  const {
    baseUrl,
    homeNames,
    languages = [],
    defaultLanguage = "en",
    skipRootPages = true,
    minItems = 2,
  } = options;

  return (pages: Lume.Page[]): void => {
    for (const page of pages) {
      const url = page.data.url;
      if (!url) continue;

      const lang = (page.data.lang as string) || defaultLanguage;

      // Skip if already has breadcrumb schema
      if (page.data.breadcrumbSchema) continue;

      // Check if this is a root page
      if (skipRootPages) {
        const isRootOrLangRoot = /^\/([a-z]{2}\/)?$/.test(url);
        if (isRootOrLangRoot) continue;
      }

      // Parse URL path
      const urlObj = new URL(url, baseUrl);
      const pathParts = urlObj.pathname.split("/").filter((part) =>
        part !== ""
      );

      // Always start with Home
      const items: BreadcrumbItem[] = [
        {
          "@type": "ListItem",
          position: 1,
          name: homeNames[lang] || homeNames[defaultLanguage] || "Home",
          item: `${baseUrl}${lang === defaultLanguage ? "/" : `/${lang}/`}`,
        },
      ];

      // Build breadcrumb trail from URL path
      let currentPath = lang === defaultLanguage ? "" : `/${lang}`;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];

        // Skip language code in path (already handled in Home item)
        if (languages.includes(part)) continue;

        currentPath += `/${part}`;

        // Capitalize and format the part name
        // Replace hyphens with spaces and capitalize first letter of each word
        const name = part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        items.push({
          "@type": "ListItem",
          position: items.length + 1,
          name: name,
          item: `${baseUrl}${currentPath}/`,
        });
      }

      // Only add breadcrumb schema if there are enough items
      if (items.length >= minItems) {
        page.data.breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}${url}#breadcrumb`,
          itemListElement: items,
        } as BreadcrumbListSchema;
      }
    }
  };
}

/**
 * Helper function to manually create a breadcrumb schema object
 *
 * Useful if you want to create custom breadcrumbs in page frontmatter
 * or programmatically in templates.
 *
 * @param baseUrl - Base URL of the site
 * @param url - Page URL
 * @param items - Array of {name, path} objects
 * @returns Schema.org BreadcrumbList object
 *
 * @example
 * ```ts
 * const schema = createBreadcrumbSchema(
 *   "https://example.com",
 *   "/en/blog/post/",
 *   [
 *     { name: "Home", path: "/en/" },
 *     { name: "Blog", path: "/en/blog/" },
 *     { name: "My Post", path: "/en/blog/post/" },
 *   ]
 * );
 * ```
 */
export function createBreadcrumbSchema(
  baseUrl: string,
  url: string,
  items: Array<{ name: string; path: string }>,
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
