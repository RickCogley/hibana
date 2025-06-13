// update_lume_version.ts
const VERSION_URL = "https://cdn.deno.land/lume/meta/versions.json";
const DENO_JSON_PATH = "./deno.json";

const response = await fetch(VERSION_URL);
if (!response.ok) {
  console.error("Failed to fetch Lume versions:", response.statusText);
  Deno.exit(1);
}

const { latest } = await response.json();
const denoJsonText = await Deno.readTextFile(DENO_JSON_PATH);
const denoJson = JSON.parse(denoJsonText);

// Update the lume/ import
if (denoJson.imports?.["lume/"]) {
  denoJson.imports["lume/"] = `https://deno.land/x/lume@${latest}/`;
}

// Add a task to run this script
denoJson.tasks ??= {};
denoJson.tasks["update-lume"] = "deno run --allow-read --allow-write --allow-net update_lume_version.ts";

// Write back to deno.json
await Deno.writeTextFile(DENO_JSON_PATH, JSON.stringify(denoJson, null, 2));
console.log(`Updated lume/ to ${latest} and added 'update-lume' task.`);
