// generate_readme.ts - Generates README.md from mod.ts using deno doc --json

// Run with: deno run --allow-read --allow-run generate_readme.ts

const modFile = "mod.ts";
const githubRepo = "RickCogley/hibana";
const githubBranch = "main";
const githubBase = `https://github.com/${githubRepo}/blob/${githubBranch}/`;

const text = await Deno.readTextFile(modFile);
const exportMap: Record<string, string> = {};

for (const line of text.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("export")) {
    const match = trimmed.match(/export\s+\{([^}]+)\}\s+from\s+["'](.+)["']/);
    if (match) {
      const symbols = match[1].split(",").map(s => s.trim());
      const path = match[2];
      for (const symbol of symbols) exportMap[symbol] = path;
    } else if (trimmed.includes("default as")) {
      const [, symbol, path] = trimmed.match(/default as (\w+).*from ['"](.+)['"]/) || [];
      if (symbol && path) exportMap[symbol] = path;
    }
  }
}

const proc = Deno.run({
  cmd: ["deno", "doc", "--json", modFile],
  stdout: "piped",
});
const raw = await proc.output();
const docJson = JSON.parse(new TextDecoder().decode(raw));

function replaceLinks(text: string): string {
  return text.replace(/\{@link\s+([^}]+)\}/g, (_, symbol) => {
    if (symbol.startsWith("http")) return `[${symbol}](${symbol})`;
    if (exportMap[symbol]) return `[${symbol}](${githubBase}${exportMap[symbol]})`;
    return symbol;
  });
}

let readme = `# Hibana Documentation

![Version](https://img.shields.io/badge/version-1.0.18-blue)
![License](https://img.shields.io/badge/license-MIT-green)
[GitHub Repo](${githubBase})

## Table of Contents
- [Overview](#overview)
- [Usage](#usage)
- [Exports](#exports)
- [Documentation](#documentation)

## Overview
`;

for (const item of docJson) {
  if (item.kind === "moduleDoc" && item.jsDoc?.doc) {
    readme += replaceLinks(item.jsDoc.doc) + "\n\n";
  }
}

readme += `## Usage

### Import via Deno.land
\`\`\`ts
import { cssBanner, shuffle } from "https://deno.land/x/hibana/mod.ts";
\`\`\`

### Import via GitHub
\`\`\`ts
import { cssBanner, shuffle } from "https://raw.githubusercontent.com/${githubRepo}/${githubBranch}/mod.ts";
\`\`\`

## Exports
`;

for (const [symbol, path] of Object.entries(exportMap)) {
  readme += `- [${symbol}](${githubBase}${path})\n`;
}

readme += `

## Documentation
`;

for (const item of docJson) {
  if (["function", "class", "variable"].includes(item.kind)) {
    readme += `### ${item.name}\n`;
    readme += item.jsDoc?.doc ? replaceLinks(item.jsDoc.doc) + "\n\n" : "_No documentation._\n\n";
  }
}

await Deno.writeTextFile("README222.md", readme);
console.log("README.md generated successfully.");
