/**
 * @file TypeScript type definitions for Vento TOC and heading anchor plugins.
 * @author Rick Cogley
 */

/**
 * A single node in the table of contents tree.
 */
export interface TOCNode {
  /** Heading level (2-6) */
  level: number;

  /** Text content of the heading */
  text: string;

  /** URL-safe slug generated from heading text */
  slug: string;

  /** Full URL to the heading (includes page URL + #slug) */
  url: string;

  /** Nested child headings */
  children: TOCNode[];
}

/**
 * Options for the heading anchors processor.
 */
export interface HeadingAnchorsOptions {
  /**
   * Minimum heading level to process (e.g., 2 for h2 and below)
   * @default 2
   */
  level?: number;

  /**
   * Maximum heading level to process (e.g., 4 for up to h4)
   * @default 6
   */
  maxLevel?: number;

  /**
   * Value of the tabindex attribute on headings, set to false to disable
   * @default -1
   */
  tabIndex?: number | false;

  /**
   * Position of the anchor link relative to heading
   * - "inside": Wrap heading text in anchor link
   * - "outside": Place anchor link after heading text
   * @default "outside"
   */
  anchorPosition?: "inside" | "outside";

  /**
   * CSS class to add to anchor links
   * @default "header-anchor"
   */
  anchorClass?: string;

  /**
   * Symbol to use for anchor link
   * @default "#"
   */
  anchorSymbol?: string;

  /**
   * aria-label text for anchor links (for accessibility)
   * @default "Permalink"
   */
  ariaLabel?: string;

  /**
   * Only process pages using these template engines
   * @default ["vto"]
   */
  includeTemplateEngines?: string[];

  /**
   * Custom slugify function
   * If not provided, uses Lume's built-in slugifier
   */
  slugify?: (text: string) => string;
}

/**
 * Options for the TOC generator processor.
 */
export interface TOCGeneratorOptions {
  /**
   * Minimum heading level to include in TOC
   * @default 2
   */
  level?: number;

  /**
   * Maximum heading level to include in TOC
   * @default 6
   */
  maxLevel?: number;

  /**
   * Key in page.data where TOC will be stored
   * @default "toc"
   */
  key?: string;

  /**
   * Only process pages using these template engines
   * @default ["vto"]
   */
  includeTemplateEngines?: string[];
}

/**
 * Internal heading data structure used during processing.
 */
export interface HeadingData {
  /** Heading level (2-6) */
  level: number;

  /** Text content */
  text: string;

  /** Generated slug */
  slug: string;

  /** DOM element reference */
  element: Element;
}
