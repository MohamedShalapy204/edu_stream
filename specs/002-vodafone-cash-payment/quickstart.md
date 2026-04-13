# Quickstart: Vodafone Cash Payment

**Feature**: `002-vodafone-cash-payment`  
**Date**: 2026-04-11

---

## What Must Be Done Before Coding

### Step 1: Appwrite Console — Extend Users Collection

Open Appwrite Console → Database → `users` collection → Add attribute:

| Attribute Key | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| `vodafone_cash_number` | String | 11 | No | _(empty)_ |

### Step 2: Appwrite Console — Extend Courses Collection

Open Appwrite Console → Database → `courses` collection → Add attributes:

| Attribute Key | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| `vodafone_cash_number` | String | 11 | No | _(empty)_ |
| `allow_resubmission` | Boolean | — | No | `false` |

### Step 3: Appwrite Console — Create VodafoneEnrollment Collection

Create new collection named `vodafone_enrollments` with these attributes:

| Attribute Key | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| `student_id` | Relationship | — | Yes | related to `users` |
| `course_id` | Relationship | — | Yes | related to `courses` |
| `status` | String | 10 | Yes | `pending` |
| `payment_number_shown` | String | 11 | Yes | — |
| `receipt_image_id` | String | 50 | Yes | — |
| `receipt_image_url` | URL | — | Yes | — |

**Indexes** to create:

| Index Name | Type | Attributes |
|------------|------|------------|
| `idx_status` | Key | `status` |

> ⚠️ As `student_id` and `course_id` are set as Relationships rather than string IDs, Appwrite handles their indexing internally for performance. You only need to manually index the scalar `status` field!

**Permissions**:
- Create: `role:all` (scoped to authenticated users in API logic)
- Read: `role:all` (scoped per student/teacher in Appwrite rules or API)
- Update: `role:all` (scoped to teacher in API logic)
- Delete: Admin only

### Step 4: Add ENV Variable

Add to `.env` and `.env.example`:

```env
VITE_APPWRITE_VODAFONE_ENROLLMENTS_COLLECTION_ID=your_collection_id_here
```

### Step 5: Register in Config

In `src/services/appwrite/config.ts`, add to `appwriteConfig`:

```ts
vodafoneEnrollmentsCollectionId: import.meta.env.VITE_APPWRITE_VODAFONE_ENROLLMENTS_COLLECTION_ID,
```

---

## Development Sequence (overview)

Once Appwrite is set up:

1. **Types & Schema** — Add new fields to `IUser`, `ICourse`; create `IVodafoneEnrollment`, `VodafoneEnrollmentStatus`; write `paymentSchema.ts` Zod validators.
2. **API Layer** — Create `payment/api/vodafoneEnrollmentApi.ts`; extend `teacher/api/enrollmentApi.ts` with approve/deny; extend `courseApi.ts` allowedFields.
3. **Query Keys** — Extend `queryKeys.ts` with `vodafoneEnrollments` namespace.
4. **Hooks** — Create `payment/hooks/useVodafoneEnrollment.ts`; extend `teacher/hooks/useEnrollments.ts`.
5. **Teacher Settings** — Add Vodafone Cash number field to Teacher profile settings UI.
6. **Course Form** — Add payment step to `CourseForm.tsx` for paid courses (price > 0).
7. **Payment Page** — Create `payment/pages/PaymentPage.tsx`; add route `/payment/:courseId`.
8. **Teacher Enrollment Dashboard** — Create `payment/components/CourseEnrollmentDashboard.tsx`; add "Manage Enrollments" tab to `ManageCoursePage.tsx`; add route `/teacher/courses/:id/enrollments`.
9. **Teacher Dashboard Extensions** — Add pending badge to `CourseList` cards; add `PendingEnrollmentsPanel` to `TeacherDashboard`.
10. **Student Status** — Add enrollment status badge to `StudentDashboard`; extend `EnrollmentGuard` to accept approved Vodafone enrollments.
11. **Tests** — Follow existing test patterns in `src/features/*/tests/`.

---

## Key File Locations

| File | Change Type |
|------|-------------|
| `src/features/auth/types/index.ts` | Extend `IUser` |
| `src/features/courses/types/courseTypes.ts` | Extend `ICourse` |
| `src/features/courses/schemas/courseSchema.ts` | Extend `courseSchema` |
| `src/features/courses/api/courseApi.ts` | Extend `allowedFields` |
| `src/features/courses/components/CourseForm.tsx` | Add payment step |
| `src/features/payment/` | New slice (all new files) |
| `src/features/teacher/api/enrollmentApi.ts` | Extend with approve/deny |
| `src/features/teacher/hooks/useEnrollments.ts` | Extend with pending queries |
| `src/features/teacher/components/CourseList.tsx` | Add pending badge |
| `src/features/teacher/pages/TeacherDashboard.tsx` | Add PendingEnrollmentsPanel |
| `src/features/teacher/pages/ManageCoursePage.tsx` | Add Manage Enrollments tab |
| `src/features/student/components/EnrollmentGuard.tsx` | Extend access check |
| `src/features/student/pages/StudentDashboard.tsx` | Add status badges |
| `src/keys/queryKeys.ts` | Add `vodafoneEnrollments` |
| `src/services/appwrite/config.ts` | Add collection ID |
| `src/routes/protected.tsx` | Add new routes |
| `.env` / `.env.example` | Add env variable |
