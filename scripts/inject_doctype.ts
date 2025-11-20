/**
 * Inject DOCTYPE into HTML files
 *
 * Workaround for Lume 3 which strips DOCTYPE declarations during build.
 * This script uses sed to ensure all HTML files start with `<!DOCTYPE html>`.
 *
 * @module scripts/inject_doctype
 * @author Rick Cogley
 * @license MIT
 *
 * @example
 * ```ts
 * // In _config.ts
 * import { injectDoctype } from "hibana/scripts/inject_doctype.ts";
 *
 * site.addEventListener("afterBuild", injectDoctype());
 * ```
 */

/**
 * Configuration options for DOCTYPE injection
 */
export interface InjectDoctypeOptions {
  /**
   * Output directory containing HTML files (relative to project root)
   * @default "_site"
   */
  outputDir?: string;

  /**
   * Whether to show success/failure messages
   * @default true
   */
  verbose?: boolean;
}

/**
 * Creates an event listener function that injects DOCTYPE into all HTML files
 *
 * The function:
 * 1. Removes any existing DOCTYPE declarations (to avoid duplicates)
 * 2. Adds <!DOCTYPE html> to the start of each HTML file
 *
 * Platform-aware: Uses correct sed syntax for macOS vs Linux.
 *
 * @param options - Configuration options
 * @returns Async function compatible with Lume's addEventListener("afterBuild")
 *
 * @example
 * ```ts
 * import { injectDoctype } from "hibana/scripts/inject_doctype.ts";
 *
 * site.addEventListener("afterBuild", injectDoctype({
 *   outputDir: "_site",
 *   verbose: true,
 * }));
 * ```
 */
export default function injectDoctype(
  options: InjectDoctypeOptions = {},
): () => Promise<void> {
  const { outputDir = "_site", verbose = true } = options;

  return async (): Promise<void> => {
    const isMacOS = Deno.build.os === "darwin";

    // Platform-specific sed commands
    // Step 1: Remove existing DOCTYPE (if any)
    // Step 2: Add DOCTYPE at start of file
    const sedCommand = isMacOS
      ? `find ${outputDir} -name "*.html" -type f -exec sed -i '' '1s/^<!DOCTYPE html>//' {} \\; && find ${outputDir} -name "*.html" -type f -exec sed -i '' '1s/^/<!DOCTYPE html>/' {} \\;`
      : `find ${outputDir} -name "*.html" -type f -exec sed -i '1s/^<!DOCTYPE html>//' {} \\; && find ${outputDir} -name "*.html" -type f -exec sed -i '1s/^/<!DOCTYPE html>/' {} \\;`;

    const command = new Deno.Command("sh", {
      args: ["-c", sedCommand],
      stdout: "inherit",
      stderr: "inherit",
    });

    const { success } = await command.output();

    if (verbose) {
      if (success) {
        console.log("✅ DOCTYPE added to all HTML files");
      } else {
        console.error("❌ Failed to add DOCTYPE to HTML files");
      }
    }

    if (!success) {
      throw new Error("DOCTYPE injection failed");
    }
  };
}

/**
 * Generates a shell command string for DOCTYPE injection
 *
 * Use this if you want to register the command as a script rather than
 * an event listener.
 *
 * @param options - Configuration options
 * @returns Shell command string
 *
 * @example
 * ```ts
 * import { generateDoctypeCommand } from "hibana/scripts/inject_doctype.ts";
 *
 * site.script("injectDoctype", generateDoctypeCommand());
 * site.addEventListener("afterBuild", "injectDoctype");
 * ```
 */
export function generateDoctypeCommand(
  options: InjectDoctypeOptions = {},
): string {
  const { outputDir = "_site" } = options;
  const isMacOS = Deno.build.os === "darwin";

  return isMacOS
    ? `find ${outputDir} -name "*.html" -type f -exec sed -i '' '1s/^<!DOCTYPE html>//' {} \\; && find ${outputDir} -name "*.html" -type f -exec sed -i '' '1s/^/<!DOCTYPE html>/' {} \\;`
    : `find ${outputDir} -name "*.html" -type f -exec sed -i '1s/^<!DOCTYPE html>//' {} \\; && find ${outputDir} -name "*.html" -type f -exec sed -i '1s/^/<!DOCTYPE html>/' {} \\;`;
}
