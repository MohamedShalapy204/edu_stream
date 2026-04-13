# Data Model: Vodafone Cash Payment

**Phase**: 1 — Design  
**Feature**: `002-vodafone-cash-payment`  
**Date**: 2026-04-11

---

## Overview

This feature adds three data changes to the existing EduStream Appwrite database:
1. **Extend `Users` collection** — add `vodafone_cash_number` field (teacher's default payment number)
2. **Extend `Courses` collection** — add `vodafone_cash_number` and `allow_resubmission` fields
3. **New `VodafoneEnrollment` collection** — student manual payment request lifecycle
4. **Storage** — Reuse existing main Appwrite Storage Bucket for receipt screenshots

---

## 1. Users Collection Extension

**Collection**: `users` (existing, mapped via `appwriteConfig.usersCollectionId`)

### New Field

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `vodafone_cash_number` | `string` | No | Regex `^010\d{8}$` or null | Teacher's default payment number. Null for students and teachers without one set. |

### TypeScript Extension

```ts
// src/features/auth/types/index.ts — extend IUser
export interface IUser extends IAppwriteDoc {
    name: string;
    email: string;
    role: UserRole;
    avatar_url?: string;
    bio?: string;
    vodafone_cash_number?: string | null;  // NEW
}
```

---

## 2. Courses Collection Extension

**Collection**: `courses` (existing, mapped via `appwriteConfig.coursesCollectionId`)

### New Fields

| Field | Type | Required | Default | Validation | Notes |
|-------|------|----------|---------|------------|-------|
| `vodafone_cash_number` | `string` | No (only paid) | null | Regex `^010\d{8}$` | Course-specific payment number. Required before publishing if `price > 0`. |
| `allow_resubmission` | `boolean` | No | `false` | boolean | Whether denied students can re-submit payment for this course. |

### TypeScript Extension

```ts
// src/features/courses/types/courseTypes.ts — extend ICourse
export interface ICourse extends IAppwriteDoc {
    title: string;
    description: string;
    thumbnail_id?: string;
    thumbnail_url?: string;
    thumbnail?: File | unknown;
    teacher_id: string;
    price: number;
    is_published: boolean;
    categories: string[];
    total_students?: number;
    rating?: number;
    duration?: number;
    language?: string;
    vodafone_cash_number?: string | null;  // NEW
    allow_resubmission?: boolean;           // NEW
}
```

### courseApi.updateCourse Allowlist Extension

Add to the `allowedFields` array in `courseApi.updateCourse`:
```ts
'vodafone_cash_number', 'allow_resubmission'
```

---

## 3. New: VodafoneEnrollment Collection

**Collection name**: `vodafone_enrollments`  
**ENV variable**: `VITE_APPWRITE_VODAFONE_ENROLLMENTS_COLLECTION_ID`  
**Config key**: `appwriteConfig.vodafoneEnrollmentsCollectionId`

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `student_id` | `relationship` | Yes | Relationship to `users` collection |
| `course_id` | `relationship` | Yes | Relationship to `courses` collection |
| `status` | `string` (enum) | Yes | `pending` \| `approved` \| `denied` |
| `payment_number_shown` | `string` | Yes | Snapshot of the Vodafone Cash number shown to the student at confirmation time |
| `receipt_image_id` | `string` | Yes | ID of the uploaded receipt in Appwrite Storage |
| `receipt_image_url` | `string` | Yes | View URL for the receipt image |

### Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| `idx_status` | `status` | Direct dashboard queries by status state |

> **Note**: Because `student_id` and `course_id` are Appwrite Relationships, Appwrite automatically handles indexing for them behind the scenes. You typically do not need (and often cannot) put them into manual compound indexes.

### Appwrite Permissions

- **Create**: Any authenticated user with role `student`
- **Read**: Document owner (student) OR course teacher (`teacher_id` match)
- **Update** (status): Only teacher of the associated course (enforced in API logic)
- **Delete**: Admin only

### TypeScript Interface

```ts
// src/features/payment/types/index.ts

export const VodafoneEnrollmentStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    DENIED: 'denied',
} as const;
export type VodafoneEnrollmentStatus =
    (typeof VodafoneEnrollmentStatus)[keyof typeof VodafoneEnrollmentStatus];

export interface IVodafoneEnrollment extends IAppwriteDoc {
    student_id: string;
    course_id: string;
    status: VodafoneEnrollmentStatus;
    payment_number_shown: string;
    receipt_image_id: string;
    receipt_image_url: string;
}

// Enriched view used in UI (joined with user/course data)
export interface IVodafoneEnrollmentView {
    enrollment: IVodafoneEnrollment;
    student: IUser;
    course?: ICourse; // Included in global pending list view
}
```

---

## 4. State Transitions: VodafoneEnrollment

```
[Student clicks Enroll on paid course]
         │
         ▼
   ┌──────────┐
   │ PENDING  │  ◄── Initial state on payment confirmation
   └──────────┘
        │
   ┌────┴─────────────┐
   ▼                  ▼
┌──────────┐    ┌──────────┐
│ APPROVED │    │  DENIED  │
└──────────┘    └──────────┘
      │                │
      │          (if allow_resubmission = true)
      │                │
      │                ▼
      │          ┌──────────┐
      │          │ PENDING  │  (new Enrollment record)
      │          └──────────┘
      ▼
[Subscription created → EnrollmentGuard grants access]
```

---

## 5. Zod Validation Schemas

```ts
// src/features/payment/schemas/paymentSchema.ts

import { z } from 'zod';

export const vodafoneNumberSchema = z
    .string()
    .regex(/^010\d{8}$/, 'Must be a valid Vodafone Egypt number (starts with 010, 11 digits total)');

export const paymentSettingsSchema = z.object({
    vodafone_cash_number: vodafoneNumberSchema,
    save_as_default: z.boolean().default(false),
});

export const coursePaymentSchema = z.object({
    vodafone_cash_number: vodafoneNumberSchema,
    allow_resubmission: z.boolean().default(false),
});
```

---

## 6. Appwrite Config Extension

```ts
// src/services/appwrite/config.ts — add to appwriteConfig object:
vodafoneEnrollmentsCollectionId: import.meta.env.VITE_APPWRITE_VODAFONE_ENROLLMENTS_COLLECTION_ID,
```

---

## 7. Query Keys Extension

```ts
// src/keys/queryKeys.ts — add:
vodafoneEnrollments: {
    all: ['vodafone_enrollments'] as const,
    byCourse: (courseId: string) => ['vodafone_enrollments', 'course', courseId] as const,
    byStudent: (studentId: string) => ['vodafone_enrollments', 'student', studentId] as const,
    check: (courseId: string, studentId: string) =>
        ['vodafone_enrollments', 'check', courseId, studentId] as const,
    allPendingByTeacher: (teacherId: string) =>
        ['vodafone_enrollments', 'pending', teacherId] as const,
},
```
