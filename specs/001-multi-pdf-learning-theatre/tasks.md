# Tasks: Multi-PDF Learning Theatre

**Input**: Design documents from `/specs/001-multi-pdf-learning-theatre/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are INCLUDED as they are explicitly mandated by FR-007 in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Ensure DaisyUI is installed and configured in `tailwind.config.ts`
- [x] T002 Configure Redux Toolkit store structure for Student feature inside `src/features/student/store/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `src/features/student/types/learningTheatreTypes.ts` mapping the definitions from `data-model.md`
- [x] T004 [P] Establish `src/features/student/store/learningTheatreSlice.ts` to manage `LearningTheatreState` and `DocumentControllerState` using Redux Toolkit.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Open and Switch Between Multiple PDFs (Priority: P1) 🎯 MVP

**Goal**: Support opening multiple PDF documents simultaneously and switching between them seamlessly via a VS Code style interface.

**Independent Test**: Can be tested in isolation using Storybook or local dev mock, verifying tabs select different PDF URLs without breaking state.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Create unit tests for PDF switching logic in `src/features/student/tests/DocumentViewer.test.tsx`
- [x] T006 [P] [US1] Create unit tests for DocumentTabs in `src/features/student/tests/DocumentTabs.test.tsx`

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement `src/features/student/components/LearningTheatre/DocumentTabs.tsx` to handle active PDF selection using DaisyUI tab components.
- [x] T008 [P] [US1] Implement `src/features/student/components/LearningTheatre/DocumentViewer.tsx` to handle the native `<object>` rendering and optional side-by-side splitting logic.
- [x] T009 [US1] Integrate `DocumentTabs` and `DocumentViewer` state transitions via actions emitted to `learningTheatreSlice.ts`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. PDF viewers work smoothly.

---

## Phase 4: User Story 2 - Experience Responsive Context Scope Layout (Priority: P2)

**Goal**: Deliver a responsive, easily navigable layout featuring the central video player alongside the interactive PDFs regardless of screen size.

**Independent Test**: Can be verified by scaling browser dimensions, verifying the PDF Viewer container stacks neatly around the central video player on thinner screens.

### Tests for User Story 2 ⚠️

- [x] T010 [P] [US2] Create layout unit tests in `src/features/student/tests/LearningTheatre.test.tsx` to ensure central video player and correct responsive classes are present.

### Implementation for User Story 2

- [x] T011 [US2] Update `src/features/student/pages/LearningTheatre.tsx` to import the new `DocumentViewer`, positioning it using Tailwind CSS Flexbox/Grid responsive utilities.
- [x] T012 [US2] Update `src/features/student/pages/StudentDashboard.tsx` container styles to ensure layout accommodates the internal `LearningTheatre.tsx` dimensions appropriately cleanly on small screens.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Layout is fully responsive.

---

## Phase 5: User Story 3 - Reliable System state and A11y (Priority: P3)

**Goal**: Provide clear loading/empty/error states within the theatre, and allow comprehensive keyboard navigation.

**Independent Test**: Verify components with accessibility extension (e.g. axe) giving 0 violations. Trigger Redux error state to verify error view rendering.

### Tests for User Story 3 ⚠️

- [x] T013 [P] [US3] Add tests for loading/error state rendering and ARIA focus in `src/features/student/tests/LearningTheatreState.test.tsx`.

### Implementation for User Story 3

- [x] T014 [US3] Implement dedicated loading, empty, and error fallback components and swap them conditionally in `src/features/student/pages/LearningTheatre.tsx`.
- [x] T015 [US3] Add comprehensive ARIA tags, strict `tabIndex` controls, and `onKeyDown` handlers to `DocumentTabs.tsx` and interactive areas.

**Checkpoint**: All user stories should now be independently functional with full state stability and accessibility compliant interaction.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Verify native OS memory delegation logic functions smoothly on large PDF load trials without memory leaks.
- [x] T017 Audit CSS implementations to remove unneeded overhead, ensuring compliance with the < 2s load time constraint per constitution.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P2)**: Integrates User Story 1 components into layout context (depends lightly on T007/T008 UI shells).
- **User Story 3 (P3)**: Enhances all components built across US1 and US2 for accessibility.

### Parallel Opportunities

- Model/Type definitions (Phase 2) can run concurrently with the core container setup.
- Testing and core component structural implementation within Phase 3 can run in parallel thanks to prior data-model agreement.

---

## Parallel Example: User Story 1

```bash
# Launch components and tests concurrently
Task: T005 Create unit tests for PDF switching logic in src/features/student/tests/DocumentViewer.test.tsx
Task: T006 Create unit tests for DocumentTabs in src/features/student/tests/DocumentTabs.test.tsx

# Parallel Component stubbing
Task: T007 Implement DocumentTabs.tsx
Task: T008 Implement DocumentViewer.tsx
```

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation (Redux/Types) ready
2. Add User Story 1 → Built local mock viewer tabs → Deploy/Demo (MVP!)
3. Add User Story 2 → Assemble into full layout page using responsive Flexbox → Deploy/Demo
4. Add User Story 3 → Apply final accessibility patches and state handling → Deploy/Demo
