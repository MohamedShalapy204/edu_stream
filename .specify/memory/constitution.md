<!--
Sync Impact Report:
Version change: 1.1.0 -> 1.2.0
Modified principles:
- Added Principle IV. Exact Data Model Consistency (ERD)
- Added Principle V. Product Scope & Quality Gates (PRD)
Templates requiring updates: (✅ updated / ⚠ pending) 
- .specify/templates/plan-template.md (✅ updated - dynamic gates)
- .specify/templates/spec-template.md (✅ updated - dynamic constraints)
- .specify/templates/tasks-template.md (✅ updated - dynamic categorizations)
-->

# EduStream Constitution

## Core Principles

### I. Master Plan Adherence
The project strictly follows the architecture, stack, and phases laid out in `context/implementation_plan.md`. This includes maintaining React 19, Vite, TypeScript, TailwindCSS v4, Appwrite, Stripe, React Query, Redux Toolkit, Zod, and Motion. All updates must sync with the master plan.

### II. Feature-Sliced Design (FSD)
The structure of the project must follow the Features design pattern / slices design pattern (FSD). Code should be strictly organized into domain-specific slices (e.g., `features/auth`, `features/courses`, `features/reviews`, `features/notifications`), minimizing coupling between features. Global shared code goes into shared layers (`src/components`, `src/hooks`, `src/services`, `src/store`, `src/types`, and `src/utils`).

### III. Incremental Phase Execution
Implementation must progress exactly according to the active phases defined in `context/implementation_plan.md`. Currently, **Phase 5 is deliberately skipped**, and development is strictly focused on **Phase 6 (Student Features: Reviews, Notifications)**. No features from other phases should be implemented without explicit amendment.

### IV. Exact Data Model Consistency (ERD)
The database definitions and Appwrite Collections must perfectly match `context/ERD.md`. Crucial architectural choices such as independent Subscription and Payment collections must not be merged. Entities must respect the `Section -> Lesson` hierarchy and all relations (such as `ContentAccess` tracking for device limiting).

### V. Product Scope & Quality Gates (PRD)
Features must trace back to the requirements in `context/PRD.md`. Development must respect Non-Functional Requirements including: < 2s load time targets, JWT authentication, precise Role-Based Access Control (Student, Teacher, Admin), and Content Protection techniques (device limits, basic visual watermarking).

## Governance

- **Amendment Procedure:** Amendments require documentation and updating this constitution file to reflect new phases or design decisions. All PRs must verify compliance with PRD and ERD boundaries.
- **Versioning Policy:** Major version bumps for architectural shifts, minor for new phases or principles, patch for clarifications.
- **Compliance Review Expectations:** All pull requests, tasks, and feature specifications must verify compliance with the `context/implementation_plan.md`, Phase 6 goals, `context/PRD.md`, and `context/ERD.md`. Complexity that breaks FSD must be strictly justified in architecture documents.

**Version**: 1.2.0 | **Ratified**: 2026-04-09 | **Last Amended**: 2026-04-09
