# Implementation Plan: Vodafone Cash Payment

**Branch**: `002-vodafone-cash-payment` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-vodafone-cash-payment/spec.md`

---

## Summary

Implement a manual Vodafone Cash payment flow for EduStream. Teachers can register a Vodafone Cash number (010-prefix) in their profile and assign one per paid course. Students enrolling in a paid course are redirected to a payment instructions page, confirm payment, and enter a `Pending` state. Teachers review, approve, or deny enrollments via a per-course dashboard (accessible from the course management page and from a global pending panel on the teacher dashboard). On approval, a `Subscription` record is created to grant content access. The feature introduces a new `VodafoneEnrollment` Appwrite collection and extends the `Users` and `Courses` collections with new fields.

---

## Technical Context

**Language/Version**: TypeScript 5.x with React 19 (Vite)  
**Primary Dependencies**: Appwrite JS SDK, React Query (`@tanstack/react-query`), Zod, Motion (`motion/react`), React Hook Form, React Router v6, DaisyUI, TailwindCSS v4  
**Storage**: Appwrite Databases (new `vodafone_enrollments` collection; field extensions to `users` and `courses`)  
**Testing**: Vitest + React Testing Library (existing test pattern: `src/features/*/tests/`)  
**Target Platform**: Web (mobile-responsive, existing Vite SPA)  
**Performance Goals**: Dashboard search < 1s for 1,000 enrollments; status update reflected within 2s  
**Constraints**: Vodafone Cash numbers must match `^010\d{8}$`; no payment gateway; strictly manual teacher approval  
**Scale/Scope**: Single-tenant feature teacher → courses → students

---

## Constitution Check

### I. Master Plan Adherence ✅
Stack unchanged: React 19, Vite, TypeScript, TailwindCSS v4, Appwrite, React Query, Redux Toolkit, Zod, Motion. No new third-party libraries introduced.

### II. Feature-Sliced Design (FSD) ✅
New code is organized into:
- `src/features/payment/` — new dedicated feature slice (payment API, hooks, schemas, types, components, pages)
- Extensions to `src/features/teacher/` (dashboard panels, enrollment dashboard page)
- Extensions to `src/features/student/` (EnrollmentGuard update, status badge)
- Extensions to `src/features/courses/` (CourseForm payment step, ICourse type update)
- Global shared: `src/keys/queryKeys.ts` (new namespace), `src/services/appwrite/config.ts` (new collection ID)

### III. Incremental Phase Execution ⚠️ (Amendment Required)
The constitution specifies Phase 6 (Reviews, Notifications) as the current focus. This feature is a new Phase 7 addition (Payment). No Phase 6 code is modified. The Vodafone Cash payment feature is self-contained and additive — no Phase 6 work is disrupted.

### IV. Exact Data Model Consistency (ERD) ✅
- Existing `Subscriptions` and `Payments` collections are **not modified** — the ERD independence principle is preserved.
- New `VodafoneEnrollment` collection is additive to the ERD.
- `Users.vodafone_cash_number` and `Courses.vodafone_cash_number / allow_resubmission` are additive field extensions.

### V. Product Scope & Quality Gates (PRD) ✅
- Role-Based Access Control preserved: Teacher-only access to enrollment approval dashboard enforced via existing `RoleGuard`.
- Zod validation on all inputs (number format, enrollment state transitions).
- Load time target maintained: lazy-load new payment pages.

### VI. Performance & Security ✅
- Appwrite collection permissions restrict enrollment creation to students and review to course teachers.
- All inputs validated with Zod before any Appwrite write.
- New query keys prevent cache pollution.

### VII. Human-in-the-Loop ✅
No destructive operations auto-executed. Database schema changes (new collection, field additions) require manual Appwrite console setup — documented in `quickstart.md`.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-vodafone-cash-payment/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/           ← Phase 1 output
│   └── ui-contracts.md
└── tasks.md             ← Phase 2 output (from /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── payment/                          ← NEW feature slice
│   │   ├── api/
│   │   │   └── vodafoneEnrollmentApi.ts  ← CRUD for VodafoneEnrollment
│   │   ├── hooks/
│   │   │   └── useVodafoneEnrollment.ts  ← React Query hooks
│   │   ├── schemas/
│   │   │   └── paymentSchema.ts          ← Zod: number + enrollment schemas
│   │   ├── types/
│   │   │   └── index.ts                  ← IVodafoneEnrollment, status enum
│   │   ├── components/
│   │   │   ├── PaymentInstructionsCard.tsx
│   │   │   ├── EnrollmentStatusBadge.tsx
│   │   │   ├── VodafoneNumberInput.tsx   ← Reusable input with 010-validation
│   │   │   └── CourseEnrollmentDashboard.tsx ← Teacher per-course dashboard
│   │   ├── pages/
│   │   │   └── PaymentPage.tsx           ← Student payment instructions page
│   │   └── index.ts                      ← Public API
│   │
│   ├── teacher/
│   │   ├── api/enrollmentApi.ts          ← EXTEND: add approval/denial methods
│   │   ├── components/
│   │   │   ├── CourseList.tsx            ← EXTEND: add pending badge per course card
│   │   │   └── PendingEnrollmentsPanel.tsx ← NEW: global aggregated pending list
│   │   ├── hooks/
│   │   │   └── useEnrollments.ts         ← EXTEND: add pending count + global list hooks
│   │   └── pages/
│   │       ├── TeacherDashboard.tsx      ← EXTEND: add PendingEnrollmentsPanel section
│   │       └── ManageCoursePage.tsx      ← EXTEND: add "Manage Enrollments" tab/button
│   │
│   ├── student/
│   │   ├── components/
│   │   │   └── EnrollmentGuard.tsx       ← EXTEND: check VodafoneEnrollment.approved
│   │   └── pages/
│   │       └── StudentDashboard.tsx      ← EXTEND: add enrollment status badges
│   │
│   ├── courses/
│   │   ├── types/courseTypes.ts          ← EXTEND: add vodafone_cash_number, allow_resubmission
│   │   ├── schemas/courseSchema.ts       ← EXTEND: add payment fields
│   │   ├── api/courseApi.ts              ← EXTEND: allowedFields for new course fields
│   │   └── components/CourseForm.tsx     ← EXTEND: add payment step for paid courses
│   │
│   └── auth/
│       └── types/index.ts                ← EXTEND: add vodafone_cash_number to IUser
│
├── keys/queryKeys.ts                     ← EXTEND: add vodafoneEnrollments namespace
├── services/appwrite/config.ts           ← EXTEND: add vodafoneEnrollmentsCollectionId
└── routes/protected.tsx                  ← EXTEND: add /courses/:id/enrollments route + /payment/:courseId
```

**Structure Decision**: FSD single-app structure. New `payment` slice owns the core logic; existing slices are extended minimally and import from the payment slice for data. No new routing layouts needed — payment page and enrollment dashboard are added to the existing `ProtectedLayoutWrapper`.

---

## Complexity Tracking

No constitution violations. All changes are additive within the established FSD architecture.
