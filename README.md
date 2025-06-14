# hibana

Hibana 火花 (lit "fire flowers") are little sparks, shareable Helpers and Filters for «[Lume ルメ](https://lume.land/)», the fast Deno typescript SSG by [Óscar Otero](https://oscarotero.com/). 🙏🏻

With this repo I hope to learn more about Lume, Deno and typescript coding. 

## Usage

This library is published to https://deno.land/x/hibana, so you can import it from there, or directly from github. 

N.b. Github caches raw files for 10 min, so if you ever need the latest and don't want to wait, just "cache bust" it by appending `?1`, `?2` etc.

Import the hibana version in your import map in `deno.json`:

```json
"imports": {
  "lume/": "https://deno.land/x/lume@v3.0.3/",
  "lume/cms/": "https://cdn.jsdelivr.net/gh/lumeland/cms@0.12.0/",
  "lume/jsx-runtime": "https://deno.land/x/ssx@v0.1.10/jsx-runtime.ts",
  "hibana/": "https://deno.land/x/hibana/v1.0.17/"
 },...
```

Then in `_config.ts`, import the needed modules from `hibana`, no version needed. 

```ts
import { cssBanner, shuffle } from "hibana/mod.ts";
import { cssBanner } from "https://raw.githubusercontent.com/RickCogley/hibana/v1.0.17/plugins/css_banner.ts?1";
import { cssBanner, shuffle, deferPagefind, externalLinksIcon } from "hibana/mod.ts";
etc
```

### css_banner.ts

```
import cssBanner from "https://raw.githubusercontent.com/RickCogley/hibana/refs/heads/main/plugins/css_banner.ts";

site.use(cssBanner({
  message: "© This code belongs to ACME Inc.",
}));
```

### shuffle.ts

```
import shuffle from "https://raw.githubusercontent.com/RickCogley/hibana/refs/heads/main/plugins/shuffle.ts";

site.use(shuffle());
```