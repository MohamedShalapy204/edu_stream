# Implementation Plan: Multi-PDF Learning Theatre

**Branch**: `001-multi-pdf-learning-theatre` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-multi-pdf-learning-theatre/spec.md`

## Summary

Update `StudentDashboard.tsx` and `LearningTheatre.tsx` to support a VS Code style tabbed/split-screen multi-PDF interface alongside a central video player, leveraging native OS/Browser PDF capabilities.

## Technical Context

**Language/Version**: TypeScript, React 19  
**Primary Dependencies**: React, TailwindCSS v4, DaisyUI, Redux Toolkit  
**Storage**: Client-side state only  
**Testing**: Vitest/Jest + React Testing Library  
**Target Platform**: Web browsers (Mobile, Tablet, Desktop)  
**Project Type**: Web Application (React)  
**Performance Goals**: PDF loads natively via browser plugin under 500ms  
**Constraints**: Native OS memory management handles PDF rendering capabilities  
**Scale/Scope**: Adjusts Learning Theatre structural layout, introduces `tests/` directory  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Master Plan Adherence**: Complies with React/Tailwind/TypeScript tech stack.
- **II. FSD**: Complies. Code strictly localized to `src/features/student`.
- **III. Incremental Phase Execution**: Continues work on Phase 6 (Student Features) guided by the user request.
- **IV. Exact Data Model Consistency (ERD)**: Not applicable (no backend database changes).
- **V. Product Scope & Quality Gates (PRD)**: Fits within the < 2s load time constraint due to native browser offloading.
- **VI. Performance & Security Best Practices**: Safe utilization of the browser DOM structure avoiding heavy third-party parsing arrays.
- **VII. Human-in-the-Loop Constraint**: Verified. Specification explicitly approved by the human supervisor.

## Project Structure

### Documentation (this feature)

```text
specs/001-multi-pdf-learning-theatre/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
└── features/
    └── student/
        ├── pages/
        │   ├── StudentDashboard.tsx
        │   └── LearningTheatre.tsx
        ├── components/
        │   ├── LearningTheatre/
        │   │   ├── DocumentViewer.tsx
        │   │   └── DocumentTabs.tsx
        └── tests/
            ├── LearningTheatre.test.tsx
            └── DocumentViewer.test.tsx
```

**Structure Decision**: 
The components and views are fully isolated under `features/student`, adhering completely to the Feature-Sliced Design architectural mandate.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| UI Layout logic complexity | VS Code style tabs and split screens | Simple full-screen or tab-only PDF viewer was rejected because a dual split screen allows better functional studying. |
