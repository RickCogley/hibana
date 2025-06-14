// src/_processors/defer_pagefind.test.ts
import { assertEquals } from "@std/assert";
import deferPagefind from "../defer_pagefind.ts";

Deno.test("deferPagefind modifies Pagefind CSS and JS", () => {
  const mockPage = {
    content: `
      <html><head>
      <link rel="stylesheet" href="/pagefind/pagefind-ui.css">
      <script type="text/javascript" src="/pagefind/pagefind-ui.js"></script>
      </head><body></body></html>
    `,
    src: { path: "/test.html" },
  };

  const processor = deferPagefind();
  processor([mockPage]);

  assertEquals(
    mockPage.content.includes(`media="print" onload="this.media='all'"`),
    true,
  );
  assertEquals(
    mockPage.content.includes(`defer`),
    true,
  );
});
