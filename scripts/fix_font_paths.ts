/**
 * Fix font paths in Google Fonts CSS files
 *
 * The Lume googleFonts plugin generates CSS with relative font paths,
 * but browsers need absolute paths. This script fixes the paths using sed.
 *
 * @module scripts/fix_font_paths
 * @author Rick Cogley
 * @license MIT
 *
 * @example
 * ```ts
 * // In _config.ts
 * import { fixFontPaths } from "hibana/scripts/fix_font_paths.ts";
 *
 * site.script("fixFontPaths", fixFontPaths({
 *   cssFiles: ["fonts-en.css", "fonts-ja.css"],
 *   fontDirs: ["fonts-en", "fonts-ja"],
 * }));
 *
 * site.addEventListener("afterBuild", "fixFontPaths");
 * ```
 */

/**
 * Configuration options for font path fixing
 */
export interface FixFontPathsOptions {
  /**
   * Array of CSS filenames to fix (relative to _site/)
   * @example ["fonts-en.css", "fonts-ja.css"]
   */
  cssFiles: string[];

  /**
   * Array of font directory names (must match cssFiles order)
   * @example ["fonts-en", "fonts-ja"]
   */
  fontDirs: string[];

  /**
   * Output directory (relative to project root)
   * @default "_site"
   */
  outputDir?: string;
}

/**
 * Generates a shell command to fix font paths
 *
 * Converts relative paths like `url("fonts-en/file.woff2")` to absolute
 * paths like `url("/fonts-en/file.woff2")` in CSS files.
 *
 * @param options - Configuration options
 * @returns Shell command string to execute via site.script()
 *
 * @example
 * ```ts
 * const command = fixFontPaths({
 *   cssFiles: ["fonts.css"],
 *   fontDirs: ["fonts"],
 * });
 * site.script("fixFonts", command);
 * ```
 */
export default function fixFontPaths(
  options: FixFontPathsOptions,
): string {
  const { cssFiles, fontDirs, outputDir = "_site" } = options;

  if (cssFiles.length !== fontDirs.length) {
    throw new Error(
      "fixFontPaths: cssFiles and fontDirs arrays must have the same length",
    );
  }

  // Detect OS for correct sed syntax
  const isMacOS = Deno.build.os === "darwin";

  // Generate sed command for each CSS file
  const commands = cssFiles.map((cssFile, index) => {
    const fontDir = fontDirs[index];
    const filePath = `${outputDir}/${cssFile}`;

    // macOS sed requires empty string after -i flag
    // Linux sed doesn't require it
    const sedFlag = isMacOS ? "-i ''" : "-i";

    return `sed ${sedFlag} 's|url(\\"${fontDir}/|url(\\"/$ {fontDir}/|g' ${filePath}`;
  });

  // Join all commands with &&
  return commands.join(" && ");
}

/**
 * Generates individual fix commands for manual registration
 *
 * Use this if you want more control over when each font CSS is fixed.
 *
 * @param options - Configuration options
 * @returns Array of {name, command} objects
 *
 * @example
 * ```ts
 * const fixes = generateFontPathFixes({
 *   cssFiles: ["fonts-en.css", "fonts-ja.css"],
 *   fontDirs: ["fonts-en", "fonts-ja"],
 * });
 *
 * fixes.forEach(({ name, command }) => {
 *   site.script(name, command);
 *   site.addEventListener("afterBuild", name);
 * });
 * ```
 */
export function generateFontPathFixes(
  options: FixFontPathsOptions,
): Array<{ name: string; command: string }> {
  const { cssFiles, fontDirs, outputDir = "_site" } = options;

  if (cssFiles.length !== fontDirs.length) {
    throw new Error(
      "fixFontPaths: cssFiles and fontDirs arrays must have the same length",
    );
  }

  const isMacOS = Deno.build.os === "darwin";

  return cssFiles.map((cssFile, index) => {
    const fontDir = fontDirs[index];
    const filePath = `${outputDir}/${cssFile}`;
    const sedFlag = isMacOS ? "-i ''" : "-i";
    const name = `fixFontPath${index + 1}`;

    return {
      name,
      command:
        `sed ${sedFlag} 's|url(\\"${fontDir}/|url(\\"/$ {fontDir}/|g' ${filePath}`,
    };
  });
}
