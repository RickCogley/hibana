import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://hibana-docs.esolia.workers.dev",
  integrations: [
    starlight({
      title: "Hibana (火花)",
      description:
        "Lume SSG helper utility library — plugins, processors, filters, and preprocessors for Lume static sites. Hibana means 'little sparks' in Japanese.",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/RickCogley/hibana" },
      ],
      sidebar: [
        {
          label: "API Reference",
          link: "/api/",
          attrs: { target: "_blank", rel: "noopener" },
          badge: { text: "deno doc", variant: "tip" },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/RickCogley/hibana/edit/main/docs-site/",
      },
      lastUpdated: true,
    }),
  ],
});
