# 🚀 EduStream Project Context

EduStream is a high-performance, scalable educational marketplace built with a modern "Serverless BaaS" (Backend-as-a-Service) architecture using **Appwrite** and **React**.

---

## 🛠️ Tech Stack & Infrastructure

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Appwrite (Authentication, Database, Storage, Functions)
- **State Management**:
  - **Server State**: TanStack Query (v5) - Primary data fetching & caching.
  - **UI State**: Redux Toolkit - Global UI interaction state.
- **Styling**: Tailwind CSS 4.0 + **DaisyUI 5.0** (with a unified Oklch-based semantic theme)
- **Validation**: Zod + React Hook Form
- **Testing**: Vitest + React Testing Library (100% Coverage on Auth and Teacher cores)
- **Payments**: Stripe (Planned integration)

---

## 🏗️ Architectural Patterns

### 1. The "Guard Pattern" (Security Chain)

The application uses a multi-layered security approach for routing and UI:

- **`AuthGuard`**: Verified identity (session) is required.
- **`GuestGuard`**: Restricted to unauthenticated users (Login/Register pages).
- **`RoleGuard`**: Deep authorization based on user profile roles (Student/Teacher/Admin).
- **`PermissionGuard` (`WithRole`)**: HOC/Component for fine-grained UI feature gating.

### 2. Atomic Authentication

To maintain data integrity between Appwrite's Auth (Identity) and Database (Profile):

- **Synchronization**: Registration logic is atomic. If database profile creation fails, the system triggers a `logout` rollback to prevent orphaned identity accounts.
- **Prime Cache**: Guards fetch data early and prime the TanStack Query cache so children components load instantly.

### 3. Type-Safe Error Handling & SDK Compliance

- Standardized `try/catch` blocks in services and hooks.
- Explicit use of `instanceof AppwriteException` for error narrowing.
- **Strict Type Audit**: All generic `any` casts in mutations and dashboard logic have been replaced with explicit domain interfaces (`ICourse`, `CourseInput`).
- Implemented `IAppwriteDoc` syncing with Appwrite `Document` type (e.g. `$sequence`) to prevent query constraints.
- Complete adherence to `verbatimModuleSyntax: true` using `import type` standard.
- **Path Aliasing**: Strictly enforced `@/` absolute path aliasing via Vite and Vitest.
- **Feature-Sliced Design (FSD)**: Modular domain logic co-located within `src/features/`.
  - Every feature has a public `index.ts` API.
  - Explicit Filenames: Avoided generic `index.tsx` for components to improve IDE navigation and domain clarity.
- **Design System Standards**: Strict adherence to "The Digital Atheneum" (Cinematic Aperture) for premium, editorial UI aesthetics.
- **Styling Architecture**: Use of background color shifts (No-Line rule), ambient depth shadows (6% opac.), and premium Oklch-based tonal surfaces for high-fidelity interactive elements.

### 4. Curriculum Management Architecture (Atomic Control)

- **Hierarchical Structures**: Fully implemented the `Course` -> `Section` -> `Lesson` hierarchy.
- **Twin-Mutation Reordering**: Lessons and Sections are reordered via a sequence-swapping logic that dispatches atomic `updateDocument` calls to keep the UI in sync without the need for complex drag-and-drop libraries.
- **Cascading Deletions**: Implemented guarded deletion flows across the entire management suite (ManageCoursePage -> CurriculumEditor -> SectionItem).
- **Hybrid Media (Multi-Document)**: Lessons no longer rely on a single file. They now support an array of Appwrite Storage identifiers (`document_ids: string[]`), allowing multiple concurrent resource attachments (PDFs, ZIPs, etc.) alongside primary video embeds.

### 5. Asset Security & Delivery

- **Storage Strategy**: Course thumbnails use the `thumbnail_id` attribute. All course thumbnails are served via the `getFilePreview()` endpoint for optimal performance.
- **Public Resilience**: To ensure images render across standard browser `<img>` tags, specific Appwrite buckets are configured with `Any: Read` permissions, bypassing standard Header-based auth barriers for public assets.

---

## 📂 Directory Structure

```text
src/
├── components/       # Global Shared Components (Layouts, Shared Logic)
├── features/         # Modular Domain Logic (Feature-Slice)
│   ├── auth/         # Security, Profile, & User Management
│   ├── courses/      # Course catalog, Curriculum Editor, & Management API
│   ├── lessons/      # Video Player & Lesson Resource Grid
│   └── teacher/      # Instructor Dashboard, Stats, & Course Management Pages
├── pages/            # View components (Consumer of features)
├── store/            # Global Redux state management
├── services/         # Global Appwrite SDK configuration (Auth, Databases, Storage)
├── utils/            # Shared utilities (Zod schemas, Formatters)
├── keys/             # Centralized Query & Storage keys
└── types/            # Global TypeScript domain interfaces
```

---

## 💾 Core Logic Highlights

### Syncing Identity & Profile

Users have two sources of truth:

1.  **Account**: Managed by `account` service (JWT/Session).
2.  **Profile**: Managed by `databases` service (Stored in the `Users` collection).
    The `useUser(userId)` hook is the primary bridge between the active session and user-specific metadata (role, bio, avatar).

### Testing Standards

The project maintains a **Clean Senior Standard** for testing:

- Unit tests reside in `tests/` within each feature slice.
- `test-utils.tsx`: Custom wrapper providing `Redux`, `QueryClient`, and `MemoryRouter` providers to all tests.
- Mocks are used for all Appwrite services to ensure isolated, fast test execution.
- **Teacher Coverage**: Full unit test suite for `useTeacherStats` hook and UI components (`StatsOverview`, `CourseList`).

---

## 🎯 Current Status

- [x] Core Auth System (Identity + Profile)
- [x] Guard Pattern (Routing/UI security)
- [x] Atomic Registration with Rollback
- [x] Base UI Foundation (**DaisyUI Migration Complete**)
- [x] **Phase 4 - Course Management** (100% Complete)
- [x] **Curriculum Editor Suite** (Section/Lesson creation & Reordering)
- [x] **Multi-Document Lesson Support** (Hybrid attachments array)
- [x] **Atomic Deletion Flow** (Courses, Sections, Lessons)
- [x] Hybrid Content Assets Integration (YouTube/Vimeo Embed parser)
- [x] Feature-Based Modular Architecture (**Teacher Slice refactored**)
- [x] "**Digital Atheneum**" Design System Integration
- [x] Public Course Catalog (Filtering \& Guarded access to drafts)
- [x] **Instructor Ecosystem** (Dashboard, Scholarly Stats, Course Ledger)
- [x] **TypeScript Hardening** (Zero 'any' in core mutations)
- [ ] Student Progress Tracking (Next)
- [x] **Testing Suite Extension** (Auth & Teacher features)
- [ ] Stripe Checkout Integration (Future)
- [ ] Admin Moderator Panel (Phase 7)
