<!--
Sync Impact Report:
Version change: 1.4.0 -> 1.5.0
Modified principles:
- Updated Principle VIII to mandate architecture snapshots.
- Recorded implementation of Vodafone Cash manual payment flow.
Templates requiring updates: (✅ updated / ⚠ pending) 
- .specify/memory/architecture_snapshot_2026_04_13.md (✅ created)
- context/ERD.md (✅ updated with Vodafone collection)
- .specify/templates/plan-template.md (✅ updated - dynamic gates)
- .specify/templates/spec-template.md (⚠ pending - future tasks will inherit new logic)
- .specify/templates/tasks-template.md (⚠ pending - final polish phase should include documentation sync)
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

### VI. Performance & Security Best Practices
- **Security Checkpoints**: Ensure strict Zod validation on inputs on both client and database functions. Apply correct Appwrite collection limits. Tokens, device tracking logic, and Appwrite document permissions must rigorously restrict cross-tenant views.
- **Performance Thresholds**: Code must be audited to ensure compliance with the < 2s load time. Lazy load non-critical React chunks. Leverage React Query’s built-in caching where data is mostly static. 

### VII. Human-in-the-Loop Constraint 
The AI must strictly await explicit human approval before executing any destructive operations. No major Git branch changes (like push/merge), large architectural rewrites, or database schema mutations should be fully executed automatically without prompting for the user's manual "Continue" or "Approve" statement. AI acts as an advisory implementer but the Human steers.

### VIII. State & Context Persistence (.specify/ tracking)
Every major architectural update, file structure evolution, database schema migration (e.g., new collections or fields), and core logic decision MUST be explicitly documented within the `.specify/` system (in `.specify/memory/` documents, new templates, or centralized tracking files). Future AI agents rely on `.specify` as the single source of truth; therefore, the agent must continuously snapshot systemic knowledge into these directories rather than relying purely on conversational memory or scattered root docs.

## Governance

- **Amendment Procedure:** Amendments require documentation and updating this constitution file to reflect new phases or design decisions. All PRs must verify compliance with PRD and ERD boundaries.
- **Versioning Policy:** Major version bumps for architectural shifts, minor for new phases or principles, patch for clarifications.
- **Compliance Review Expectations:** All pull requests, tasks, and feature specifications must verify compliance with the `context/implementation_plan.md`, Phase 6 goals, `context/PRD.md`, `context/ERD.md`, and the requirement to persist knowledge in `.specify/`.

**Version**: 1.4.0 | **Ratified**: 2026-04-09 | **Last Amended**: 2026-04-12
