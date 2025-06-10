// run_tests.ts

// This script runs all tests found in the current directory and its subdirectories.
// run_tests.ts

const command = new Deno.Command("deno", {
  args: ["test", "--allow-read", "/"],
  stdout: "inherit",
  stderr: "inherit",
});

const { code } = await command.output();
Deno.exit(code);
