// filters/__tests__/temporal_date.test.ts
import { assertEquals } from "../../deps.ts";
import temporalDate from "../temporal_date.ts";

Deno.test("temporalDate - formats date with default options", () => {
  const filter = temporalDate();
  const testDate = new Date("2024-01-15T10:30:00Z");
  const result = filter(testDate);

  // Should return a formatted string (exact format depends on locale)
  assertEquals(typeof result, "string");
  assertEquals(result.length > 0, true);
});

Deno.test("temporalDate - handles ISO format", () => {
  const filter = temporalDate();
  const testDate = new Date("2024-01-15T10:30:00Z");
  const result = filter(testDate, "iso");

  // ISO format should contain the year
  assertEquals(result.includes("2024"), true);
});

Deno.test("temporalDate - handles different format types", () => {
  const filter = temporalDate({ defaultTimezone: "UTC" });
  const testDate = new Date("2024-01-15T10:30:00Z");

  const fullFormat = filter(testDate, "full");
  const longFormat = filter(testDate, "long");
  const mediumFormat = filter(testDate, "medium");
  const shortFormat = filter(testDate, "short");

  // All should be strings
  assertEquals(typeof fullFormat, "string");
  assertEquals(typeof longFormat, "string");
  assertEquals(typeof mediumFormat, "string");
  assertEquals(typeof shortFormat, "string");

  // Full format should generally be longer than short format
  assertEquals(fullFormat.length >= shortFormat.length, true);
});

Deno.test("temporalDate - handles string input", () => {
  const filter = temporalDate();
  const isoString = "2024-01-15T10:30:00Z";
  const result = filter(isoString);

  assertEquals(typeof result, "string");
  assertEquals(result.includes("2024"), true);
});
