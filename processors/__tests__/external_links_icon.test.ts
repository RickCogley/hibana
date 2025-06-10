// src/_processors/external_links_icon.test.ts
import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";
import externalLinksIcon from "../external_links_icon.ts";

Deno.test("adds external icon class to external links", () => {
  const mockPage = {
    document: new DOMParser().parseFromString(
      `<a href="https://external.com" target="_blank">External</a>
       <a href="/internal" target="_blank">Internal</a>
       <div class="no-external-icon"><a href="https://external.com" target="_blank">Skip</a></div>`,
      "text/html"
    ),
    data: { url: "https://blog.esolia.pro" },
    src: { path: "/test.html" },
  };

  const processor = externalLinksIcon();
  processor([mockPage as any]);

  const links = mockPage.document!.querySelectorAll("a");

  assertEquals(links[0].classList.contains("after:content-['_↗']"), true);  // External
  assertEquals(links[1].classList.contains("after:content-['_↗']"), false); // Internal
  assertEquals(links[2].classList.contains("after:content-['_↗']"), false); // Skipped
});
