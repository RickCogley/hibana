/**
 * Language alternate Schema.org linker for Lume
 *
 * Links translated versions of pages via Schema.org translationOfWork/workTranslation properties.
 * Supports multiple languages and multiple schema types per page.
 *
 * @module preprocessors/language_alternates_schema
 * @author Rick Cogley
 * @license MIT
 *
 * @example
 * ```ts
 * // In _config.ts
 * import { languageAlternatesSchema } from "hibana/preprocessors/language_alternates_schema.ts";
 *
 * site.preprocess([".md"], languageAlternatesSchema({
 *   baseUrl: "https://example.com",
 *   languages: ["en", "ja"],
 *   defaultLanguage: "ja",
 *   schemaFields: [
 *     "serviceSchema",
 *     "aboutPageSchema",
 *     "webPageSchema",
 *   ],
 * }));
 * ```
 */

/**
 * Configuration options for language alternate schema linking
 */
export interface LanguageAlternatesSchemaOptions {
  /**
   * Base URL of the site (without trailing slash)
   * @example "https://example.com"
   */
  baseUrl: string;

  /**
   * List of supported language codes
   * @example ["en", "ja", "es"]
   */
  languages: string[];

  /**
   * Default/original language code
   * @example "en"
   * @default "en"
   */
  defaultLanguage?: string;

  /**
   * Array of schema field names to process
   * These are the frontmatter fields that contain Schema.org objects
   * @example ["serviceSchema", "aboutPageSchema", "contactPageSchema"]
   */
  schemaFields: string[];
}

/**
 * Creates a language alternates schema preprocessor
 *
 * This preprocessor:
 * 1. Maps pages by their ID and language
 * 2. Finds pages with the same ID in different languages
 * 3. Links them via Schema.org relationships:
 *    - Original language (default) → adds `workTranslation` pointing to translations
 *    - Translated languages → adds `translationOfWork` pointing to original
 * 4. Updates all specified schema types on each page
 *
 * **Requirements**:
 * - Pages must have an `id` field in frontmatter
 * - Pages must have a `lang` field in frontmatter
 * - Schema objects must have an `@id` property
 *
 * @param options - Configuration options
 * @returns Preprocessor function compatible with Lume's site.preprocess()
 *
 * @example
 * ```ts
 * // In page frontmatter:
 * // en/services/consulting.md
 * ---
 * id: service-consulting
 * lang: en
 * serviceSchema:
 *   "@id": "https://example.com/en/services/consulting/#service"
 *   ...
 * ---
 *
 * // ja/services/consulting.md
 * ---
 * id: service-consulting
 * lang: ja
 * serviceSchema:
 *   "@id": "https://example.com/services/consulting/#service"
 *   ...
 * ---
 * ```
 *
 * After processing:
 * - EN page serviceSchema gains: `workTranslation: { "@id": "https://example.com/services/consulting/#service" }`
 * - JA page serviceSchema gains: `translationOfWork: { "@id": "https://example.com/en/services/consulting/#service" }`
 */
export default function languageAlternatesSchema(
  options: LanguageAlternatesSchemaOptions,
  // deno-lint-ignore no-explicit-any
): (pages: any[]) => void {
  const {
    baseUrl,
    languages,
    defaultLanguage = "en",
    schemaFields,
  } = options;

  // deno-lint-ignore no-explicit-any
  return (pages: any[]): void => {
    // Build a map of pages by their ID and language
    // deno-lint-ignore no-explicit-any
    const pagesByIdAndLang = new Map<string, Map<string, any>>();

    for (const page of pages) {
      const id = page.data.id as string | undefined;
      const lang = (page.data.lang as string) || defaultLanguage;

      if (!id) continue;

      if (!pagesByIdAndLang.has(id)) {
        pagesByIdAndLang.set(id, new Map());
      }
      pagesByIdAndLang.get(id)!.set(lang, page);
    }

    // Add language alternate references to schemas
    for (const page of pages) {
      const id = page.data.id as string | undefined;
      const lang = (page.data.lang as string) || defaultLanguage;
      const url = page.data.url as string | undefined;

      if (!id || !url) continue;

      const pagesWithSameId = pagesByIdAndLang.get(id);
      if (!pagesWithSameId || pagesWithSameId.size < 2) {
        // No alternate language version exists
        continue;
      }

      // Determine the alternate language page
      const alternateLang = lang === defaultLanguage
        ? languages.find((l) => l !== defaultLanguage && pagesWithSameId.has(l))
        : defaultLanguage;

      if (!alternateLang) continue;

      const alternatePage = pagesWithSameId.get(alternateLang);
      if (!alternatePage) continue;

      // Add language alternate to all specified schema fields
      for (const field of schemaFields) {
        const pageSchema = page.data[field];
        const alternateSchema = alternatePage.data[field];

        // Skip if either page doesn't have this schema field
        if (!pageSchema || !alternateSchema) continue;

        // Skip if schemas don't have @id
        if (!pageSchema["@id"] || !alternateSchema["@id"]) {
          console.warn(
            `languageAlternatesSchema: Schema field "${field}" missing @id on page ${url}`,
          );
          continue;
        }

        const alternateId = alternateSchema["@id"];

        // Original language (default) → add workTranslation pointing to translation
        // Translated language → add translationOfWork pointing to original
        if (lang === defaultLanguage) {
          // This is the original, link to translation(s)
          if (!pageSchema.workTranslation) {
            pageSchema.workTranslation = [];
          }

          // Support both single object and array of translations
          if (Array.isArray(pageSchema.workTranslation)) {
            // Check if this translation is already linked
            const alreadyLinked = pageSchema.workTranslation.some(
              (t: { "@id": string }) => t["@id"] === alternateId,
            );
            if (!alreadyLinked) {
              pageSchema.workTranslation.push({ "@id": alternateId });
            }
          } else {
            // Convert to array if not already
            pageSchema.workTranslation = [{ "@id": alternateId }];
          }
        } else {
          // This is a translation, link back to original
          pageSchema.translationOfWork = { "@id": alternateId };
        }
      }
    }
  };
}

/**
 * Helper function to manually add language alternate links to a schema
 *
 * Useful for custom schema objects created in templates or frontmatter.
 *
 * @param schema - The schema object to modify
 * @param alternateId - The @id of the alternate language version
 * @param isOriginal - Whether this schema is for the original (default) language
 * @returns Modified schema object
 *
 * @example
 * ```ts
 * const schema = {
 *   "@id": "https://example.com/en/page/#content",
 *   "@type": "WebPage",
 *   // ...
 * };
 *
 * addLanguageAlternate(
 *   schema,
 *   "https://example.com/ja/page/#content",
 *   true // This is the original English version
 * );
 *
 * // Result: schema now has workTranslation: [{ "@id": "https://example.com/ja/page/#content" }]
 * ```
 */
export function addLanguageAlternate(
  schema: Record<string, any>,
  alternateId: string,
  isOriginal: boolean,
): Record<string, any> {
  if (isOriginal) {
    // Original language → add workTranslation
    if (!schema.workTranslation) {
      schema.workTranslation = [];
    }
    if (Array.isArray(schema.workTranslation)) {
      const alreadyLinked = schema.workTranslation.some(
        (t: { "@id": string }) => t["@id"] === alternateId,
      );
      if (!alreadyLinked) {
        schema.workTranslation.push({ "@id": alternateId });
      }
    }
  } else {
    // Translation → add translationOfWork
    schema.translationOfWork = { "@id": alternateId };
  }

  return schema;
}
