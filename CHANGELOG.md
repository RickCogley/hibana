# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.3.0] - 2025-11-23

### Added

- **New Processors for Vento Pages**:
  - `ventoHeadingAnchors` - Add ID attributes and anchor links to headings in
    Vento-rendered pages
    - Automatic unique slug generation with collision prevention
    - Configurable heading levels (min/max) and anchor positioning
    - Matches markdown-it-toc-done-right behavior by default
    - Supports `containerSelector` option to limit scope to main content
  - `ventoTOC` - Generate hierarchical table of contents from headings in Vento
    pages
    - Builds nested TOC tree structure stored in `page.data.toc`
    - Generates full URLs with anchors for each heading
    - Supports `containerSelector` option for scoped extraction
  - `ventoTOCInject` - Inject TOC HTML into rendered pages at marker position
    - Works around Lume's build order limitation (processors run after layouts)
    - Finds `<!-- VENTO-TOC-INJECTION-POINT: -->` marker and replaces with TOC
      HTML
    - Respects `show_toc` frontmatter setting

- **New Utility Modules**:
  - `utils/slugify.ts` - URL-safe slug generation from text
  - `utils/headings.ts` - Heading extraction and manipulation utilities
  - `types/vento_toc.ts` - TypeScript types for TOC functionality

### Changed

- `ventoHeadingAnchors` default behavior now matches markdown-it style:
  - `anchorPosition: "inside"` (anchor wraps heading text)
  - `anchorSymbol: ""` (empty - use CSS ::before for icon)
  - Ensures consistent appearance between Vento and markdown pages

### Fixed

- Prevent duplicate anchors/TOC on markdown pages by skipping pages with "md" in
  templateEngine chain
- Only pure Vento pages (templateEngine: ["vto"]) are now processed by Vento
  processors

### Documentation

- Comprehensive documentation for all three Vento TOC processors in README
- Complete workflow examples showing processor ordering
- CSS styling examples for anchor links
- Explanation of Lume build order and HTML injection solution

## [1.2.1] - 2025-11-21

### Fixed

- Fixed template literal syntax bug in `fixFontPaths` script that caused
  incorrect sed command generation
  - Changed `$ {fontDir}` to `${fontDir}` in both `fixFontPaths` and
    `generateFontPathFixes` functions
  - Bug was causing literal string `/$ {fontDir}/` in CSS output instead of
    actual font directory paths

## [1.2.0] - 2025-11-21

### Added

- **New Filter**: `temporalDate` - Temporal API-based date formatting with
  timezone support
  - Multiple format styles: full, long, medium, short, iso
  - Locale support for internationalization
  - Handles Date objects and ISO date strings

- **New Preprocessors**:
  - `markdownMetadata` - Extract excerpts and calculate elapsed days from
    markdown content
  - `breadcrumbSchema` - Auto-generate Schema.org breadcrumb structured data
    from URL paths
  - `languageAlternatesSchema` - Link translated pages across languages using
    Schema.org

- **New Scripts**:
  - `fixFontPaths` - Fix Google Fonts relative paths in CSS files
    (platform-aware)
  - `injectDoctype` - Inject DOCTYPE into HTML files (Lume 3 workaround)

- **New Utilities**:
  - `prefersReducedMotion()` - Check user's motion preference (accessibility)
  - `detectOS()` - Detect operating system
  - `addOSClass()` - Auto-add OS class to document body

### Changed

- Updated Lume dependency from v3.0.4 to v3.1.2
- Comprehensive README documentation with examples for all new features
- Enhanced mod.ts JSDoc comments for better API documentation

### Documentation

- Added CLAUDE.md for project-specific AI assistant context
- Added comprehensive API documentation in README.md
- Added EXTRACTION_SUMMARY.md documenting Phase 1 extraction from eSolia 2025

## [1.1.0] - 2025-11-08

### Changed

- **Performance**: Reduced console logging in processors - now logs summary
  statistics instead of per-page messages
- **Performance**: Cached `DOMParser` instance in `defer_pagefind` processor to
  avoid creating new instances for every page
- **Debugging**: Added named function expressions to all processors
  (`deferPagefindProcessor`, `externalLinksIconProcessor`, `cssBannerProcessor`)
  so they appear correctly in Lume debug bar instead of showing as "unknown"

### Fixed

- Type annotations added to `cssBannerProcessor` for better type safety

## [0.5.0] - 2024-11-20

### Added

- Initial commit
- Acknowledgements in readme

### Fixed

- Removed redundant name in shuffle.ts

[Unreleased]: https://github.com/RickCogley/hibana/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/RickCogley/hibana/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/RickCogley/hibana/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/RickCogley/hibana/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/RickCogley/hibana/compare/v0.5.0...v1.1.0
[0.5.0]: https://github.com/RickCogley/hibana/releases/tag/v0.5.0

## 1.1.0 - 2025-11-08

### Added

- feat: improve processor performance and Lume debug bar visibility
- Adds actual path to repo
- Allows generate_readme.ts to run with write privileges
- Removes unneeded switch
- Adds release.ts to be run when you want to prepare a release
- Adds jsdoc
- Generates readme.md file
- Attempts to generate readme
- Generated docs

[Compare changes](https://github.com/rickcogley/hibana/compare/v1.0.18...1.1.0)
