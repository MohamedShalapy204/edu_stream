# Research: Vodafone Cash Payment

**Phase**: 0 — Research  
**Feature**: `002-vodafone-cash-payment`  
**Date**: 2026-04-11

---

## RES-001: Appwrite Collections Strategy for New Entities

**Decision**: Add two new Appwrite collections — `vodafone_payment_settings` (teacher default + course-level numbers) and `vodafone_enrollments` (student payment requests with approval state). The existing `Subscriptions` collection is NOT repurposed; it remains the Stripe-oriented access-control record per the ERD architecture principle. A new lightweight `VodafoneEnrollment` collection handles the manual payment lifecycle independently.

**Rationale**: The ERD explicitly mandates the Subscriptions and Payments tables remain independent, each with distinct purposes. Grafting a new status field (`Pending/Approved/Denied`) onto the existing `Subscriptions` schema would violate the ERD's design principle. A dedicated `VodafoneEnrollment` collection keeps concerns clean, allows independent scaling, and maps naturally to the spec's `Enrollment` entity. Upon teacher approval, a corresponding `Subscription` record is created (status: `active`) — matching the existing access-control flow used by `EnrollmentGuard`.

**Alternatives considered**:
- Reuse `Subscriptions` with new `pending` status: Rejected — ERD forbids mutations to established collection shapes; would break existing `EnrollmentGuard` logic that expects only `active/expired/revoked`.
- Store enrollment data in Appwrite user preferences: Rejected — not queryable server-side, unsuitable for teacher dashboard filtering.

---

## RES-002: Teacher Payment Number Storage Strategy

**Decision**: Store the teacher's default Vodafone Cash number in the `IUser` profile document itself (new `vodafone_cash_number` field on the Users collection), rather than a separate collection.

**Rationale**: One-to-one relationship (one teacher → one default number). Adding a field to the existing `Users` collection avoids an extra collection and join. The Users collection is already mutated for `bio`, `avatar_url` etc. — this is a natural profile attribute. Appwrite's `updateDocument` on the Users collection supports partial updates, so only the number field changes.

**Alternatives considered**:
- Separate `TeacherPaymentProfile` collection: Rejected — over-engineered for a single scalar field; one-to-one with no distinct lifecycle.

---

## RES-003: Course-Level Vodafone Cash Number Storage

**Decision**: Add `vodafone_cash_number` and `allow_resubmission` fields directly to the `Courses` collection document, rather than a separate `CoursePaymentSettings` collection.

**Rationale**: Course payment settings have a strict 1:1 relationship with a course and no independent lifecycle. The `courseApi.updateCourse` already handles partial updates via an allowlist — we extend that allowlist with the two new fields. This avoids an extra collection read on the payment page (course document is already fetched).

**Alternatives considered**:
- Separate `CoursePaymentSettings` collection: Rejected — adds a second async fetch on the payment page for two scalar fields; over-normalized.

---

## RES-004: Vodafone Enrollment Access Control Integration

**Decision**: Extend the existing `EnrollmentGuard` component (in `src/features/student`) to also check for an `Approved` `VodafoneEnrollment` record for paid courses that use the manual Vodafone Cash flow (i.e., `course.vodafone_cash_number` is set and `course.price > 0`).

**Rationale**: The existing `EnrollmentGuard` already gates content access by checking `Subscriptions`. For Vodafone-paid courses, the guard must also accept `VodafoneEnrollment.status === 'approved'` as a valid access credential, since no Appwrite Subscription is created until teacher approval. This keeps the guard as the single security boundary.

**Alternatives considered**:
- Create a separate `VodafoneEnrollmentGuard`: Rejected — two guard components creates confusion; better to have one composable guard.

---

## RES-005: Vodafone Cash Number Validation Rule

**Decision**: Validate using the regex `^010\d{8}$` — exactly 11 digits, starting with `010`.

**Rationale**: Vodafone Egypt numbers are exclusively prefixed with `010`. The remaining 8 digits are subscriber-specific. This is consistent with Egyptian telecom standards. Applied via Zod schema: `z.string().regex(/^010\d{8}$/, 'Must be a valid Vodafone Egypt number starting with 010')`.

---

## RES-006: FSD Slice Placement for New Feature Code

**Decision**: Create a new FSD slice `src/features/payment/` to own all Vodafone Cash payment logic. Teacher-facing enrollment dashboard components extend the existing `src/features/teacher/` slice but delegate payment data fetching to the new `payment` slice's API/hooks. Student payment page lives in `src/features/payment/pages/`.

**Rationale**: Payment logic (enrollment creation, approval, number display) crosses both teacher and student domains. A dedicated `payment` slice avoids tight coupling between teacher and student slices. The new slice handles: `api/`, `hooks/`, `components/`, `pages/`, `schemas/`, `types/`.

---

## RES-007: Query Key Strategy

**Decision**: Add a new `vodafoneEnrollments` namespace to `queryKeys`:
```ts
vodafoneEnrollments: {
  all: ['vodafone_enrollments'],
  byCourse: (courseId: string) => ['vodafone_enrollments', 'course', courseId],
  byStudent: (studentId: string) => ['vodafone_enrollments', 'student', studentId],
  check: (courseId: string, studentId: string) => ['vodafone_enrollments', 'check', courseId, studentId],
  allPendingByTeacher: (teacherId: string) => ['vodafone_enrollments', 'pending', teacherId],
}
```

**Rationale**: Follows the existing `queryKeys` pattern in `src/keys/queryKeys.ts`. Granularity avoids over-invalidation; `byCourse` is for the teacher dashboard, `byStudent` / `check` for the student view, `allPendingByTeacher` for the global pending list.

---

## RES-008: Appwrite Collection ENV Variables

**Decision**: Add two new env variables:
- `VITE_APPWRITE_VODAFONE_PAYMENT_SETTINGS_COLLECTION_ID` — Not needed (stored in Users and Courses collections directly per RES-002/003)
- `VITE_APPWRITE_VODAFONE_ENROLLMENTS_COLLECTION_ID` — New collection for `VodafoneEnrollment`

One new env variable total. Register in `appwriteConfig` as `vodafoneEnrollmentsCollectionId`.
