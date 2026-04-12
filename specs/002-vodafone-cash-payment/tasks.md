# Tasks: Vodafone Cash Payment

**Input**: Design documents from `/specs/002-vodafone-cash-payment/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/ui-contracts.md

**Organization**: Tasks are grouped by logical development phases (Foundational, followed by independent User Stories).

### Format
- **[P]**: Can run in parallel (different files, no dependencies)
- **[USX]**: Maps to User Stories from the spec (e.g. [US1], [US2])

---

## Phase 1: Setup & Foundational

**Purpose**: Core infrastructure, types, schema updates, and configurations that block subsequent feature development.

- [ ] T001 [P] Ensure Appwrite Database is configured per `quickstart.md` (Users, Courses, VodafoneEnrollments, Storage Bucket)
- [ ] T002 [P] Update env variables and configuration in `src/services/appwrite/config.ts`
- [ ] T003 [P] Add React Query keys namespace for `vodafoneEnrollments` in `src/keys/queryKeys.ts`
- [ ] T004 [P] Extend interfaces `IUser` and `ICourse` in `src/features/auth/types/index.ts` and `src/features/courses/types/courseTypes.ts`
- [ ] T005 Create models in `src/features/payment/types/index.ts` (`VodafoneEnrollmentStatus`, `IVodafoneEnrollment`, `IVodafoneEnrollmentView`)
- [ ] T006 [P] Update schemas in `src/features/courses/schemas/courseSchema.ts` & create `src/features/payment/schemas/paymentSchema.ts`
- [ ] T007 Register new routes in `src/routes/protected.tsx`
- [ ] T007b [P] Write integration test in `src/features/payment/tests/` to explicitly verify unauthenticated guests hitting `/payment/:courseId` redirect to login
- [ ] T008 [P] Update allowed fields in `src/features/courses/api/courseApi.ts`

**Checkpoint**: Core foundation established. Types, query keys, routes, and DB layers are ready.

---

## Phase 2: User Story 1 - Teacher Course Payment Settings (P1)

**Goal**: Allow teachers to input a Vodafone Cash number and "allow resubmission" toggle during course creation.

- [ ] T009 [P] [US1] Create reusable `VodafoneNumberInput.tsx` in `src/features/payment/components/`
- [ ] T010 [US1] Integrate `VodafoneNumberInput` and resubmission settings into `src/features/courses/components/CourseForm.tsx` (conditionally shown for Paid courses)
- [ ] T011 [US1] Extend teacher's main profile edit page to set a global default `vodafone_cash_number` 

**Checkpoint**: Teachers can save and update payment numbers on their courses independently.

---

## Phase 3: User Story 2 & 3 - Student Payment Flow (P1)

**Goal**: Student navigates to the payment page, sees instructions, and confirms payment. Wait for approval.

- [ ] T012 [P] [US2] Create Appwrite storage API functions for receipts in `src/features/payment/api/storageApi.ts`
- [ ] T012b [P] [US2] Create `vodafoneEnrollmentApi.ts` logic for fetching and creating enrollments in `src/features/payment/api/`
- [ ] T013 [P] [US2] Create React query hooks `useCreateVodafoneEnrollment` (incorporating image upload) and `useCheckVodafoneEnrollment` in `src/features/payment/hooks/useVodafoneEnrollment.ts`
- [ ] T014 [P] [US2] Create UI components `PaymentInstructionsCard.tsx` (now with upload input) and `EnrollmentStatusBadge.tsx` in `src/features/payment/components/`
- [ ] T015 [US2] Construct the full `PaymentPage.tsx` interface in `src/features/payment/pages/PaymentPage.tsx` (incorporates API hooks, file state, and UI)
- [ ] T016 [US3] Add "Go to Payment" redirect logic for paid courses without active subscriptions in the student path.

**Checkpoint**: Students can individually trigger manual enrollments and arrive in a `Pending` state.

---

## Phase 4: User Story 4, 5, & 6 - Teacher Dashboard & Approvals (P1)

**Goal**: Teacher can review enrollments per-course and globally, and can approve or deny them.

- [ ] T017 [P] [US4] Extend `src/features/teacher/api/enrollmentApi.ts` with manual `approve` (creates appwrite Subscription + changes state) and `deny` logic
- [ ] T018 [P] [US4] Create corresponding mutations / hooks in `src/features/teacher/hooks/useEnrollments.ts`
- [ ] T019 [P] [US4] Build generic `ReceiptImageModal.tsx` in `src/features/payment/components/` for viewing transactions
- [ ] T019b [US4] Build `CourseEnrollmentDashboard.tsx` in `src/features/payment/components/` integrating the image modal
- [ ] T020 [US4] Safely mount `CourseEnrollmentDashboard` inside the "Manage Enrollments" tab in `src/features/teacher/pages/ManageCoursePage.tsx`
- [ ] T021 [P] [US6] Render pending status badge in `src/features/teacher/components/CourseList.tsx`
- [ ] T022 [P] [US6] Build `PendingEnrollmentsPanel.tsx` in `src/features/teacher/components/`
- [ ] T023 [US6] Integrate `PendingEnrollmentsPanel` directly into `src/features/teacher/pages/TeacherDashboard.tsx`

**Checkpoint**: Teachers can approve enrollments independently. The lifecycle is complete.

---

## Phase 5: User Story 7 - Student Access Validation & Dashboard Badges (P2)

**Goal**: Enforce access via `EnrollmentGuard` and indicate enrollment outcome on the student dashboard.

- [ ] T024 [P] [US7] Modify `src/features/student/components/EnrollmentGuard.tsx` to grant access if a valid `Approved` VodafoneEnrollment is present.
- [ ] T025 [US7] Update `src/features/student/pages/StudentDashboard.tsx` to decorate course cards with the `EnrollmentStatusBadge.tsx` based on their enrollment outcome.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup & Foundational (Phase 1)**: Must be completed first as they establish types/APIs required everywhere.
- **US1, US2/3, US4/5/6, US7**: Can be executed sequentially or parallelized once Phase 1 is done, because they touch isolated frontend domains (Course Creation vs. Student Checkout vs. Teacher Settings vs. Student Access).

### Implementation Strategy (MVP First)
1. Build Phase 1 schema changes.
2. Build US1 and US2 simultaneously using mocked types if team is large.
3. Hook up the backend mutations in US4 to close the loop.
4. Verify by attempting a full run-through as student and then approving as teacher.
