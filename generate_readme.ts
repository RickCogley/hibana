// generate_readme.ts

/**
 * This script generates the README.md for the Hibana library
 * by processing JSDoc comments from mod.ts,
 * specifically transforming `{@link}` tags into standard Markdown links.
 */

async function generateReadme() {
  // 1. Run deno doc to get JSON output of documentation
  const p = Deno.run({
    cmd: ["deno", "doc", "--json", "mod.ts"],
    stdout: "piped",
    stderr: "piped",
  });

  const [output, errorOutput] = await Promise.all([
    p.output(),
    p.stderrOutput(),
  ]);

  const { success, code } = await p.status();

  if (!success) {
    console.error("Deno doc failed:", new TextDecoder().decode(errorOutput));
    Deno.exit(code);
  }

  const rawDocJson = JSON.parse(new TextDecoder().decode(output));

  // The actual array of documentation items is under the 'nodes' key
  // in the JSON output from `deno doc --json` for a single file.
  const docItems = rawDocJson.nodes;

  // Ensure docItems is actually an array before proceeding
  if (!Array.isArray(docItems)) {
    console.error(`Error: Expected docItems to be an array, but got ${typeof docItems}.`);
    console.error("Please verify the structure of 'deno doc --json mod.ts' output.");
    Deno.exit(1);
  }

  // 2. Build a map of internal symbol names to their relative file paths
  // This is crucial for correctly forming internal GitHub links.
  const symbolToPathMap = new Map<string, string>();
  // Populate this map based on your project's export structure in mod.ts
  symbolToPathMap.set("cssBanner", "./plugins/css_banner.ts");
  symbolToPathMap.set("shuffle", "./plugins/shuffle.ts");
  symbolToPathMap.set("deferPagefind", "./processors/defer_pagefind.ts");
  symbolToPathMap.set("externalLinksIcon", "./processors/external_links_icon.ts");
  symbolToPathMap.set("loadVendorScript", "./utils/dom_utils.ts");
  symbolToPathMap.set("trapFocus", "./utils/dom_utils.ts");
  // Add any other top-level exports you want to link to

  // 3. Helper function to process JSDoc text and convert {@link} tags to Markdown
  function processJSDocText(text: string): string {
    // Regex matches {@link target} or {@link target|text}
    // Group 1: target (e.g., cssBanner, https://github.com/...)
    // Group 2: optional display text (e.g., GitHub)
    return text.replace(/{@link\s+([^}\s|]+)(?:\s*\|\s*([^}]+))?}/g, (match, target, linkText) => {
      let url = target; // Default URL is the target itself

      // If it's not an external URL (http/https), assume it's an internal symbol
      if (!target.startsWith("http://") && !target.startsWith("https://")) {
        const filePath = symbolToPathMap.get(target);
        if (filePath) {
          // Construct a link to the specific file in your GitHub repository
          // Adjust 'RickCogley/hibana' and 'main' branch if your repo changes
          url = `https://github.com/RickCogley/hibana/blob/main/${filePath}#${target}`; // Add #target for direct anchor
        } else {
          // Fallback for internal links not explicitly mapped, link to mod.ts with anchor
          url = `https://github.com/RickCogley/hibana/blob/main/mod.ts#${target}`;
        }
      }

      // Use provided linkText or default to the target name
      const displayText = linkText || target;
      return `[${displayText}](${url})`;
    });
  }

  let readmeContent = "# Hibana Lume Helpers\n\n"; // Your project title

  // 4. Extract and process main module documentation from the docItems array
  // The moduleDoc now typically has an empty 'name' and 'kind': 'moduleDoc'
  const moduleDoc = docItems.find((item: any) => item.kind === "moduleDoc" && item.name === "");

  if (moduleDoc && moduleDoc.jsDoc && moduleDoc.jsDoc.doc) {
    readmeContent += `${processJSDocText(moduleDoc.jsDoc.doc)}\n\n`;
  } else {
    console.warn("Warning: Could not find main module documentation (kind 'moduleDoc' with empty name).");
    // You might want to provide a default intro here if no moduleDoc is found
  }

  readmeContent += "## API\n\n";

  // 5. Iterate over exported items and add their processed documentation
  for (const item of docItems) {
    // Exclude the main moduleDoc (which has an empty name) and any other non-API kinds
    if (item.name && item.kind !== "moduleDoc" && item.kind !== "module") {
      readmeContent += `### \`${item.name}\`\n\n`; // Heading for the symbol

      if (item.jsDoc && item.jsDoc.doc) { // Access doc property via jsDoc
        readmeContent += `${processJSDocText(item.jsDoc.doc)}\n\n`; // Process symbol description
      }

      // Add parameters if available
      // Note: functionDef.params also has a 'doc' property which needs processing
      if (item.functionDef && item.functionDef.params) {
        readmeContent += "**Parameters:**\n\n";
        for (const param of item.functionDef.params) {
          // Process parameter description as well
          readmeContent += `- \`${param.name}\` ${param.tsType ? `: \`${param.tsType.repr}\`` : ''} - ${param.jsDoc && param.jsDoc.doc ? processJSDocText(param.jsDoc.doc) : ''}\n`;
        }
        readmeContent += "\n";
      }

      // Add return description if available
      // Note: functionDef.returnType also has a 'doc' property which needs processing
      if (item.functionDef && item.functionDef.returnType && item.functionDef.returnType.jsDoc && item.functionDef.returnType.jsDoc.doc) {
        readmeContent += `**Returns:** ${processJSDocText(item.functionDef.returnType.jsDoc.doc)}\n\n`;
      }

      // Add examples from JSDoc tags
      if (item.jsDoc && Array.isArray(item.jsDoc.tags)) {
        for (const tag of item.jsDoc.tags) {
          if (tag.kind === "example" && tag.doc) {
            readmeContent += `**Example:**\n\`\`\`ts\n${tag.doc}\n\`\`\`\n\n`;
          }
          // Also process @see tags if you want them in the README
          // Your JSON shows @see tags having a 'doc' property that needs processing
          if (tag.kind === "see" && tag.doc) {
             readmeContent += `*See also: ${processJSDocText(tag.doc)}*\n\n`;
          }
        }
      }
    }
  }

  // 6. Write the generated content to README.md
  await Deno.writeTextFile("README.md", readmeContent);
  console.log("README.md generated successfully!");
}

// Execute the generation script
generateReadme();