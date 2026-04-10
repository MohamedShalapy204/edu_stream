# Phase 0: Outline & Research

## Unknowns Identified
- **Tabbed / Split-screen Layout in React**: How to build a VS Code style layout?
- **Native PDF Embedding**: How to embed PDFs using native browser viewer in a React component while matching the exact platform requirements?

## Research Findings

### Decision: Layout Management
- **Decision**: Use CSS Flexbox to build a custom tabbed interface. For the split-screen feature, conditionally render two flex containers side-by-side. 
- **Rationale**: Keeps the bundle size minimal by avoiding heavy window-management dependencies since the interface only needs a maximum of a two-way horizontal split for most practical use cases. It maintains the < 2s load time constraint per the constitution.
- **Alternatives**: Heavy layout libraries like `react-split` or `golden-layout` were considered but rejected as overkill.

### Decision: Native PDF Viewer Embed
- **Decision**: Use `<object data="url.pdf" type="application/pdf" width="100%" height="100%">` wrapped inside React components.
- **Rationale**: An `<object>` tag directly invokes the browser's highly efficient native PDF plugin, adhering to FR-002, and offloads memory/scrolling management from the React thread to the browser.
- **Alternatives**: `react-pdf` (pdf.js) was rejected because it uses canvas rendering and ignores the platform’s native capabilities. `<iframe>` was considered, but `<object>` provides slightly better fallback styling when a PDF plugin isn't supported.
