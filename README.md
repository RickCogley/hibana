# hibana

Hibana 火花 (lit "fire flowers") are little sparks, shareable Helpers and Filters for «[Lume ルメ](https://lume.land/)», the fast Deno SSG by [Óscar Otero](https://oscarotero.com/). 🙏🏻

With this repo I hope to learn more about Lume, Deno and typescript coding. 

## Usage

N.b. Github caches raw files for 10 min, so if you ever need the latest and don't want to wait, just "cache bust" it by appending `?1`, `?2` etc.

```
import { cssBanner, shuffle } from "https://raw.githubusercontent.com/RickCogley/hibana/v1.0.0/mod.ts";
import cssBanner from "https://raw.githubusercontent.com/RickCogley/hibana/v0.5.0/plugins/css_banner.ts?1";
import shuffle from "https://raw.githubusercontent.com/RickCogley/hibana/v0.5.0/plugins/shuffle.ts?1";
import { cssBanner, shuffle, deferPagefind, externalLinksIcon } from "https://raw.githubusercontent.com/RickCogley/hibana/v1.0.0/mod.ts";
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