// preprocessors/__tests__/language_alternates_schema.test.ts
import { assertEquals } from "../../deps.ts";
import languageAlternatesSchema, {
  addLanguageAlternate,
} from "../language_alternates_schema.ts";

Deno.test("addLanguageAlternate - adds translation as original", () => {
  const schema = {
    "@type": "WebPage",
    name: "Test Page",
  };

  const result = addLanguageAlternate(
    schema,
    "https://example.com/ja/page",
    true, // This is the original (en), linking to translation (ja)
  );

  assertEquals(result.workTranslation, "https://example.com/ja/page");
});

Deno.test("addLanguageAlternate - adds translation as alternate", () => {
  const schema = {
    "@type": "WebPage",
    name: "Test Page",
  };

  const result = addLanguageAlternate(
    schema,
    "https://example.com/en/page",
    false, // This is a translation, linking back to original (en)
  );

  assertEquals(result.translationOfWork, "https://example.com/en/page");
});

Deno.test("languageAlternatesSchema - links pages by ID", () => {
  const preprocessor = languageAlternatesSchema({
    baseUrl: "https://example.com",
    languages: ["en", "ja"],
    schemaFields: ["webPageSchema"],
  });

  const mockPages: any = [
    {
      data: {
        id: "about",
        url: "/en/about/",
        lang: "en",
        schema: {
          webPageSchema: {
            "@type": "WebPage",
            name: "About Us",
          },
        },
      },
    },
    {
      data: {
        id: "about",
        url: "/ja/about/",
        lang: "ja",
        schema: {
          webPageSchema: {
            "@type": "WebPage",
            name: "私たちについて",
          },
        },
      },
    },
  ];

  preprocessor(mockPages);

  // English page should link to Japanese
  assertEquals(
    mockPages[0].data.schema.webPageSchema.workTranslation,
    "https://example.com/ja/about/",
  );

  // Japanese page should link to English
  assertEquals(
    mockPages[1].data.schema.webPageSchema.translationOfWork,
    "https://example.com/en/about/",
  );
});

Deno.test("languageAlternatesSchema - handles multiple schema fields", () => {
  const preprocessor = languageAlternatesSchema({
    baseUrl: "https://example.com",
    languages: ["en", "ja"],
    schemaFields: ["webPageSchema", "serviceSchema"],
  });

  const mockPages: any = [
    {
      data: {
        id: "service",
        url: "/en/service/",
        lang: "en",
        schema: {
          webPageSchema: { "@type": "WebPage" },
          serviceSchema: { "@type": "Service" },
        },
      },
    },
    {
      data: {
        id: "service",
        url: "/ja/service/",
        lang: "ja",
        schema: {
          webPageSchema: { "@type": "WebPage" },
          serviceSchema: { "@type": "Service" },
        },
      },
    },
  ];

  preprocessor(mockPages);

  // Both schema fields should be linked
  assertEquals(
    mockPages[0].data.schema.webPageSchema.workTranslation !== undefined,
    true,
  );
  assertEquals(
    mockPages[0].data.schema.serviceSchema.workTranslation !== undefined,
    true,
  );
});

Deno.test("languageAlternatesSchema - skips pages without ID", () => {
  const preprocessor = languageAlternatesSchema({
    baseUrl: "https://example.com",
    languages: ["en", "ja"],
    schemaFields: ["webPageSchema"],
  });

  const mockPages: any = [
    {
      data: {
        url: "/en/page/",
        lang: "en",
        schema: {
          webPageSchema: { "@type": "WebPage" },
        },
      },
    },
  ];

  preprocessor(mockPages);

  // Should not add translation properties
  assertEquals(
    mockPages[0].data.schema.webPageSchema.workTranslation,
    undefined,
  );
});
