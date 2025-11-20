/**
 * Temporal API-based date filter for Lume static sites
 *
 * Provides modern, timezone-aware date formatting using the Temporal API.
 * Supports multiple output formats and locales.
 *
 * @module filters/temporal_date
 * @author Rick Cogley
 * @license MIT
 *
 * @example
 * ```ts
 * // In _config.ts
 * import { temporalDate } from "hibana/filters/temporal_date.ts";
 *
 * site.filter("tdate", temporalDate({
 *   defaultTimezone: "Asia/Tokyo",
 *   defaultLocale: "ja-JP"
 * }));
 * ```
 *
 * @example
 * ```vto
 * <!-- In templates -->
 * {{ date |> tdate("iso", lang) }}
 * {{ date |> tdate("long", "en") }}
 * {{ date |> tdate("medium") }}
 * ```
 */

/**
 * Configuration options for the temporal date filter
 */
export interface TemporalDateOptions {
  /**
   * Default timezone for date display
   * @default "UTC"
   */
  defaultTimezone?: string;

  /**
   * Default locale for date formatting
   * @default "en-US"
   */
  defaultLocale?: string;
}

/**
 * Format types supported by the filter
 *
 * - `full`: Full date with weekday (e.g., "Monday, January 1, 2024")
 * - `long`: Long date without weekday (e.g., "January 1, 2024")
 * - `medium`: Medium date with short month (e.g., "Jan 1, 2024")
 * - `short`: Numeric short date (e.g., "01/01/2024")
 * - `iso`: ISO-style date (e.g., "1 Jan 2024")
 */
export type DateFormat = "full" | "long" | "medium" | "short" | "iso";

/**
 * Creates a Temporal API-based date filter function
 *
 * @param options - Configuration options
 * @returns Filter function compatible with Lume's site.filter()
 *
 * @example
 * ```ts
 * const filter = temporalDate({ defaultTimezone: "America/New_York" });
 * site.filter("tdate", filter);
 * ```
 */
export default function temporalDate(
  options: TemporalDateOptions = {},
): (
  value: Date | string | undefined,
  format?: DateFormat | string,
  lang?: string,
) => string {
  const {
    defaultTimezone = "UTC",
    defaultLocale = "en-US",
  } = options;

  return (
    value: Date | string | undefined,
    format: DateFormat | string = "medium",
    lang?: string,
  ): string => {
    if (!value) {
      return "";
    }

    try {
      // Convert to Temporal Instant
      let instant: Temporal.Instant;

      if (value instanceof Date) {
        // JavaScript Date object
        instant = Temporal.Instant.fromEpochMilliseconds(value.getTime());
      } else if (typeof value === "string") {
        // Try to parse as ISO string or convert Date string
        const date = new Date(value);
        instant = Temporal.Instant.fromEpochMilliseconds(date.getTime());
      } else {
        return "";
      }

      // Convert to specified timezone
      const zonedDateTime = instant.toZonedDateTimeISO(defaultTimezone);

      // Define format options based on format string
      let formatOptions: Intl.DateTimeFormatOptions;

      switch (format) {
        case "full":
          formatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
            timeZone: defaultTimezone,
          };
          break;
        case "long":
          formatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: defaultTimezone,
          };
          break;
        case "medium":
          formatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: defaultTimezone,
          };
          break;
        case "short":
          formatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: defaultTimezone,
          };
          break;
        case "iso":
          // Return ISO format like "16 Nov 2025" - use en-GB locale for day-month-year order
          const isoFormatter = new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: defaultTimezone,
          });
          return isoFormatter.format(zonedDateTime.epochMilliseconds);
        default:
          // Use format as-is if it's a preset
          formatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: defaultTimezone,
          };
      }

      // Determine locale (parameter overrides default)
      const locale = lang || defaultLocale;

      return new Intl.DateTimeFormat(locale, formatOptions).format(
        zonedDateTime.epochMilliseconds,
      );
    } catch (error) {
      console.error("temporal_date filter error:", error, "value:", value);
      return String(value);
    }
  };
}
