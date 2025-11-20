// preprocessors/__tests__/breadcrumb_schema.test.ts
import { assertEquals } from "../../deps.ts";
import breadcrumbSchema, {
  createBreadcrumbSchema,
} from "../breadcrumb_schema.ts";

Deno.test("createBreadcrumbSchema - creates valid breadcrumb structure", () => {
  const items = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Widget", path: "/products/widget" },
  ];

  const schema = createBreadcrumbSchema(
    "https://example.com",
    "/products/widget",
    items,
  );

  assertEquals(schema["@type"], "BreadcrumbList");
  assertEquals(schema.itemListElement.length, 3);
  assertEquals(schema.itemListElement[0].position, 1);
  assertEquals(schema.itemListElement[0].name, "Home");
  assertEquals(schema.itemListElement[2].position, 3);
});

Deno.test("breadcrumbSchema - generates breadcrumbs from URL", () => {
  const preprocessor = breadcrumbSchema({
    baseUrl: "https://example.com",
    homeNames: { en: "Home" },
    languages: ["en"],
  });

  const mockPages: any = [
    {
      data: {
        url: "/en/products/widget/",
        lang: "en",
      },
    },
  ];

  preprocessor(mockPages);

  const schema = mockPages[0].data.breadcrumbSchema;
  assertEquals(schema["@type"], "BreadcrumbList");
  assertEquals(schema.itemListElement.length > 0, true);
  assertEquals(schema.itemListElement[0].name, "Home");
});

Deno.test("breadcrumbSchema - handles multilingual pages", () => {
  const preprocessor = breadcrumbSchema({
    baseUrl: "https://example.com",
    homeNames: { en: "Home", ja: "ホーム" },
    languages: ["en", "ja"],
  });

  const mockPages: any = [
    {
      data: {
        url: "/ja/products/",
        lang: "ja",
      },
    },
  ];

  preprocessor(mockPages);

  const schema = mockPages[0].data.breadcrumbSchema;
  assertEquals(schema.itemListElement[0].name, "ホーム");
});

Deno.test("breadcrumbSchema - skips pages without URL", () => {
  const preprocessor = breadcrumbSchema({
    baseUrl: "https://example.com",
    homeNames: { en: "Home" },
    languages: ["en"],
  });

  const mockPages: any = [
    {
      data: {},
    },
  ];

  preprocessor(mockPages);

  assertEquals(mockPages[0].data.breadcrumbSchema, undefined);
});
