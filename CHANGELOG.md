# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2025-11-08

### Changed

- **Performance**: Reduced console logging in processors - now logs summary statistics instead of per-page messages
- **Performance**: Cached `DOMParser` instance in `defer_pagefind` processor to avoid creating new instances for every page
- **Debugging**: Added named function expressions to all processors (`deferPagefindProcessor`, `externalLinksIconProcessor`, `cssBannerProcessor`) so they appear correctly in Lume debug bar instead of showing as "unknown"

### Fixed

- Type annotations added to `cssBannerProcessor` for better type safety

## [0.5.0] - 2024-11-20

### Added

- Initial commit
- Acknowledgements in readme

### Fixed

- Removed redundant name in shuffle.ts

[Unreleased]: https://github.com/RickCogley/hibana/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/RickCogley/hibana/compare/v0.5.0...v1.1.0
[0.5.0]: https://github.com/RickCogley/hibana/releases/tag/v0.5.0
