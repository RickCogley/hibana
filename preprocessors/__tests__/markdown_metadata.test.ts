// preprocessors/__tests__/markdown_metadata.test.ts
import { assertEquals } from "../../deps.ts";
import markdownMetadata from "../markdown_metadata.ts";

Deno.test("markdownMetadata - extracts excerpt from content", () => {
  const preprocessor = markdownMetadata();

  const mockPages: any = [
    {
      content: "First paragraph.\n\n<!-- more -->\n\nSecond paragraph.",
      data: { date: new Date("2024-01-15") },
    },
  ];

  preprocessor(mockPages);

  assertEquals(mockPages[0].data.excerpt, "First paragraph.");
});

Deno.test("markdownMetadata - handles content without marker", () => {
  const preprocessor = markdownMetadata();

  const mockPages: any = [
    {
      content: "Just some content without a marker.",
      data: { date: new Date("2024-01-15") },
    },
  ];

  preprocessor(mockPages);

  // Should not have excerpt if no marker found
  assertEquals(mockPages[0].data.excerpt, undefined);
});

Deno.test("markdownMetadata - calculates elapsed days", () => {
  const preprocessor = markdownMetadata({ calculateElapsed: true });

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 10); // 10 days ago

  const mockPages: any = [
    {
      content: "Some content",
      data: { date: pastDate },
    },
  ];

  preprocessor(mockPages);

  // Should be approximately 10 days
  assertEquals(typeof mockPages[0].data.elapsedDays, "number");
  assertEquals(mockPages[0].data.elapsedDays >= 9, true);
  assertEquals(mockPages[0].data.elapsedDays <= 11, true);
});

Deno.test("markdownMetadata - respects custom excerpt marker", () => {
  const preprocessor = markdownMetadata({ excerptMarker: "<!-- break -->" });

  const mockPages: any = [
    {
      content: "Custom marker test.\n\n<!-- break -->\n\nRest of content.",
      data: { date: new Date("2024-01-15") },
    },
  ];

  preprocessor(mockPages);

  assertEquals(mockPages[0].data.excerpt, "Custom marker test.");
});

Deno.test("markdownMetadata - can disable elapsed calculation", () => {
  const preprocessor = markdownMetadata({ calculateElapsed: false });

  const mockPages: any = [
    {
      content: "Some content",
      data: { date: new Date("2024-01-15") },
    },
  ];

  preprocessor(mockPages);

  assertEquals(mockPages[0].data.elapsedDays, undefined);
});
