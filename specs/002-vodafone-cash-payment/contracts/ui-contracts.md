# UI Contracts: Vodafone Cash Payment

**Feature**: `002-vodafone-cash-payment`  
**Date**: 2026-04-11

---

## Overview

Defines the props contracts for each new UI component and page introduced by this feature. All components follow the existing EduStream style conventions (DaisyUI, TailwindCSS v4, Motion animations).

---

## 1. VodafoneNumberInput

**File**: `src/features/payment/components/VodafoneNumberInput.tsx`  
**Purpose**: Reusable controlled input for Vodafone Cash number with 010-prefix validation.

```ts
interface VodafoneNumberInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
    placeholder?: string;       // default: '010XXXXXXXX'
    showSaveAsDefault?: boolean; // show "Save as my default number" checkbox
    onSaveAsDefault?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}
```

**Behaviour**: Validates on blur using `vodafoneNumberSchema`. Shows inline error. Auto-formats display only (no masking — store raw digits).

---

## 2. PaymentPage

**File**: `src/features/payment/pages/PaymentPage.tsx`  
**Route**: `/payment/:courseId` (protected, student role)  
**Purpose**: Student-facing payment instructions page.

```ts
// No props — reads courseId from useParams()
// Internal data sources:
//   - useGetCourseById(courseId)          → course name, price, vodafone_cash_number
//   - useCurrentAccount()                 → student id
//   - useCheckVodafoneEnrollment(...)     → existing enrollment state
//   - useCreateVodafoneEnrollment()       → mutation

// Redirects:
//   - If course is free (price === 0) → redirect to /courses/:courseId
//   - If course has no vodafone_cash_number → show error state
//   - If unauthenticated → handled by ProtectedLayoutWrapper
//   - If student already has Pending/Approved enrollment → show status screen instead
```

**States to render**:
1. Loading skeleton
2. Error state (no payment number configured)
3. Already-enrolled state (Pending / Approved / Denied with optional re-submit CTA)
4. Payment instructions (main state): shows course card, number, step list, confirm button
5. Confirmation success (post-submit)

---

## 3. PaymentInstructionsCard

**File**: `src/features/payment/components/PaymentInstructionsCard.tsx`  
**Purpose**: Displays course payment info and step-by-step Vodafone Cash instructions.

```ts
interface PaymentInstructionsCardProps {
    courseName: string;
    price: number;
    vodafoneNumber: string;
    onConfirm: () => void;
    isConfirming: boolean;
    onFileSelected: (file: File | null) => void;
    selectedFile: File | null;
}
```

---

## 4. EnrollmentStatusBadge

**File**: `src/features/payment/components/EnrollmentStatusBadge.tsx`  
**Purpose**: Small status badge used in student dashboard and course page.

```ts
interface EnrollmentStatusBadgeProps {
    status: VodafoneEnrollmentStatus;   // 'pending' | 'approved' | 'denied'
    size?: 'sm' | 'md';
}
```

**Renders**: Colored pill — amber for pending, green for approved, red for denied.

---

## 5. CourseEnrollmentDashboard

**File**: `src/features/payment/components/CourseEnrollmentDashboard.tsx`  
**Purpose**: Teacher's per-course enrollment list with approve/deny actions.

```ts
interface CourseEnrollmentDashboardProps {
    courseId: string;
    allowResubmission: boolean;
    onToggleResubmission: (value: boolean) => void;
}

// Internal data sources:
//   - useGetCourseEnrollments(courseId)        → IVodafoneEnrollmentView[]
//   - useApproveEnrollment()                   → mutation
//   - useDenyEnrollment()                      → mutation
```

**Features**:
- Search bar (filters by student name or email client-side)
- Table/list: student name, email, submitted date, `payment_number_shown`, `receipt_image_link/thumbnail`, status badge, action buttons
- Approve/Deny buttons visible only on Pending rows
- `allow_resubmission` toggle switch at top
- Empty state message when no enrollments
- Optimistic UI update on approve/deny (React Query `onMutate`)

---

## 6. PendingEnrollmentsPanel

**File**: `src/features/teacher/components/PendingEnrollmentsPanel.tsx`  
**Purpose**: Global aggregated list of pending enrollments across all teacher's courses.

```ts
interface PendingEnrollmentsPanelProps {
    courses: ICourse[];   // teacher's course list (already fetched in TeacherDashboard)
}

// Internal data sources:
//   - useGetAllPendingEnrollments(courseIds)  → IVodafoneEnrollmentView[] (status=pending)
```

**Features**:
- Section heading with total pending count
- Row: course name, student name, student email, submitted date → clickable → navigates to `/teacher/courses/:id/enrollments`
- Hidden when count is 0

---

## 7. Profile Settings: Vodafone Number Field

**Location**: Added to existing teacher profile settings page/component  
**Input component**: `VodafoneNumberInput` (reused)  
**Mutation**: `useUpdateUserVodafoneNumber()` → `databases.updateDocument(users, userId, { vodafone_cash_number })`

---

## 8. CourseForm Payment Step

**Location**: Extended within `src/features/courses/components/CourseForm.tsx`  
**Condition**: Rendered only when `price > 0` (checked via form watch)  
**Fields added**:
- `VodafoneNumberInput` (pre-populated from teacher's `vodafone_cash_number` default)
- Checkbox: "Use my default number" (auto-fills from profile)
- Toggle: "Allow re-submission after denial"
- Validation: blocked from publishing if `vodafone_cash_number` is empty and `price > 0`

---

## 9. New Routes Summary

| Route | Component | Guard |
|-------|-----------|-------|
| `/payment/:courseId` | `PaymentPage` | student role |
| `/teacher/courses/:id/enrollments` | `ManageCoursePage` (new "Enrollments" tab) | teacher role |
