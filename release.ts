// release.ts - Final version with all features

// Usage:
// deno run --allow-read --allow-write --allow-run release.ts [--dry-run]

const dryRun = Deno.args.includes("--dry-run");

const exec = async (cmd: string[], silent = false): Promise<string> => {
  const p = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);
  p.close();
  if (!status.success) {
    throw new Error(new TextDecoder().decode(stderr));
  }
  return new TextDecoder().decode(stdout).trim();
};

const readJson = async (path: string) =>
  JSON.parse(await Deno.readTextFile(path));

const writeText = async (path: string, content: string) => {
  if (!dryRun) await Deno.writeTextFile(path, content);
};

const appendText = async (path: string, content: string) => {
  if (!dryRun) await Deno.writeTextFile(path, content, { append: true });
};

const updateVersionInFile = async (path: string, version: string) => {
  const content = await Deno.readTextFile(path);
  const updated = content.replace(
    /\*\*Version\*\* \| [\d\.]+/,
    `**Version** | ${version}`
  );
  if (!dryRun) await Deno.writeTextFile(path, updated);
};

const getCurrentVersion = async (): Promise<string> => {
  const json = await readJson("deno.json");
  return json.version;
};

const getPreviousTag = async (): Promise<string> => {
  try {
    return await exec(["git", "describe", "--tags", "--abbrev=0"]);
  } catch {
    return "";
  }
};

const getChangelog = async (prev: string, curr: string): Promise<string> => {
  const log = await exec(
    prev
      ? ["git", "log", `${prev}..HEAD`, "--pretty=format:- %s"]
      : ["git", "log", "--pretty=format:- %s"]
  );
  const date = new Date().toISOString().split("T")[0];
  const compareLink = prev
    ? `https://github.com/youruser/yourrepo/compare/${prev}...${curr}`
    : "";
  return `\n## ${curr} - ${date}\n\n### Added\n\n${log}\n\n${
    compareLink ? `[Compare changes](${compareLink})\n` : ""
  }`;
};

const zipDocs = async () => {
  if (!dryRun) {
    await exec(["zip", "-r", "docs.zip", "docs"]);
  }
};

const openReleasePage = async (version: string) => {
  const url = `https://github.com/youruser/yourrepo/releases/tag/${version}`;
  await exec(["xdg-open", url]).catch(() =>
    exec(["open", url]).catch(() => console.log("Open URL:", url))
  );
};

const main = async () => {
  const version = await getCurrentVersion();
  const prevVersion = await getPreviousTag();

  console.log("Version:", version);
  console.log("Previous tag:", prevVersion || "None");

  await updateVersionInFile("mod.ts", version);
  await updateVersionInFile("README.md", version);

  console.log("Generating docs...");
  if (!dryRun) await exec(["deno", "doc", "--html", "--name=\"Hibana Lume Helpers\"", "--output", "docs", "mod.ts"]);

  console.log("Running generate_readme.ts...");
  if (!dryRun) await exec(["deno", "run", "--allow-read", "--allow-run", "generate_readme.ts"]);

  console.log("Generating changelog...");
  const changelogEntry = await getChangelog(prevVersion, version);
  console.log(changelogEntry);
  await appendText("CHANGELOG.md", changelogEntry);

  console.log("Zipping docs...");
  await zipDocs();

  if (!dryRun) {
    console.log("Creating git tag...");
    await exec(["git", "tag", version]);
    await exec(["git", "push", "origin", version]);

    console.log("Creating GitHub release...");
    await exec([
      "gh",
      "release",
      "create",
      version,
      "--title",
      version,
      "--notes",
      changelogEntry,
      "docs.zip",
    ]);
  }

  console.log("Opening release page...");
  await openReleasePage(version);

  console.log(dryRun ? "Dry run complete." : "Release complete.");
};

main();
