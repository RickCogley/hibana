# hibana

Hibana 火花 (lit "fire flowers") are little sparks, shareable Helpers and Filters for «[Lume ルメ](https://lume.land/)», the fast Deno SSG by [Óscar Otero](https://oscarotero.com/). 🙏🏻

With this repo I hope to learn more about Lume, Deno and typescript coding. 

## Usage
### css_banner.ts

```
import cssBanner from "https://github.com/RickCogley/hibana/blob/main/plugins/css_banner.ts";

site.use(cssBanner({
  message: "© This code belongs to ACME Inc.",
}));
```