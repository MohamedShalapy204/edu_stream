# 🚀 EduStream Platform — Full Implementation Plan

> A complete educational marketplace where teachers publish/monetize courses and students access them via subscriptions.
> **Stack:** React 19 · Vite · TypeScript · TailwindCSS v4 · Appwrite · Stripe · React Query · Redux Toolkit · Zod · Motion

---

## Table of Contents

1. [Current Project State](#-current-project-state)
2. [Final File Structure](#-final-file-structure)
3. [Phase 1 — Foundation & Types](#phase-1--foundation--types)
4. [Phase 2 — Appwrite Backend Setup](#phase-2--appwrite-backend-setup)
5. [Phase 3 — Authentication System](#phase-3--authentication-system)
6. [Phase 4 — Course Management](#phase-4--course-management)
7. [Phase 5 — Subscription & Payment System](#phase-5--subscription--payment-system)
8. [Phase 6 — Student Features](#phase-6--student-features-reviews-notifications)
9. [Phase 7 — Dashboards & Admin Panel](#phase-7--dashboards--admin-panel)
10. [Phase 8 — Layout, Routing & Content Protection](#phase-8--layout-routing--content-protection)
11. [Appwrite Setup Guide](#-appwrite-setup-guide)
12. [Stripe Integration Guide](#-stripe-integration-guide)
13. [Environment Variables](#-environment-variables)
14. [Testing Strategy](#-testing-strategy)

---

## 📐 Current Project State

| Layer                       | Status                                                                   |
| --------------------------- | ------------------------------------------------------------------------ |
| React 19 + Vite 7 + TS 5    | Fully configured and running on `npm run dev`                            |
| Appwrite SDK                | Configured in `config.ts`; Services for `auth`, `databases`, & `storage` |
| React Query + Redux Toolkit | Fully wired; Modular hooks orchestrated with service & store layers      |
| TailwindCSS v4 + Motion     | "Digital Atheneum" (Cinematic Aperture) theme fully integrated           |
| Filtered Course Catalog     | Public courses listing with search, category filtering, and draft guards |
| Phase 4 — Course Management | **100% Complete** (CRUD, Curriculum Editor, Reordering, Deletions)       |
| Phase 7 — Dashboards        | **Teacher Dashboard Complete** (Stats, Course Ledger, FSD Migration)     |
| Vitest + RTL                | **100% Coverage on Auth and Teacher hooks/components**                   |

---

## 📁 Final File Structure

```text
src/
├── components/       # Global Shared UI & Layout
├── features/         # Modular Domain Logic (FSD)
│   ├── auth/         # Security, Profile, & User Management
│   ├── courses/      # Course catalog, Curriculum Editor, & Management API
│   ├── lessons/      # Video Player & Lesson Resource Grid
│   └── teacher/      # Instructor Dashboard, Stats, & Course Management Pages
├── hooks/            # Global custom hooks
├── services/         # Appwrite & External Service Initializations
├── store/            # Redux Slices & Store configuration
├── keys/             # Centralized Query & Storage keys
├── types/            # Global domain interfaces
└── utils/            # Validation schemas & Formatters
```

---

## Phase 1 — Foundation & Types

### 1.1 TypeScript Types (`src/types/index.ts`)

Define all interfaces and enums matching the ERD:

```typescript
// ── Enums ──
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}
export enum ContentType {
  VIDEO = 'video',
  PDF = 'pdf',
  AUDIO = 'audio',
}
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

// ── Interfaces ──
export interface IUser {
  $id: string; // Appwrite document ID
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  created_at: string;
}

export interface ICourse {
  $id: string;
  title: string;
  description?: string;
  price: number;
  teacher_id: string;
  teacher?: IUser; // populated via relationship
  thumbnail_id?: string;
  thumbnail_url?: string;
  is_published: boolean;
  categories?: string[];
  total_students?: number;
  rating?: number;
  duration?: number;
  language?: string;
  created_at: string;
}

export interface ISection {
  $id: string;
  course_id: string;
  title: string;
  order: number;
}

export interface ILesson {
  $id: string;
  section_id: string;
  title: string;
  content_type: ContentType;
  file_url: string;
  duration: number; // in seconds
  order: number;
}

export interface ISubscription {
  $id: string;
  user_id: string;
  course_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
}

export interface IPayment {
  $id: string;
  user_id: string;
  course_id: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  stripe_payment_id: string;
  created_at: string;
}

export interface IReview {
  $id: string;
  user_id: string;
  course_id: string;
  rating: number; // 1–5
  comment: string;
  created_at: string;
}

export interface INotification {
  $id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface IContentAccess {
  $id: string;
  user_id: string;
  course_id: string;
  device_id: string;
  last_access_time: string;
}
```

### 1.2 React Query Key Factory (`src/keys/queryKeys.ts`)

```typescript
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  courses: {
    all: ['courses'] as const,
    list: (filters: Record<string, unknown>) =>
      ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    byTeacher: (teacherId: string) =>
      ['courses', 'teacher', teacherId] as const,
  },
  sections: {
    byCourse: (courseId: string) => ['sections', courseId] as const,
  },
  lessons: {
    bySection: (sectionId: string) => ['lessons', sectionId] as const,
  },
  subscriptions: {
    mine: ['subscriptions', 'mine'] as const,
    check: (courseId: string) => ['subscriptions', 'check', courseId] as const,
    byCourse: (courseId: string) =>
      ['subscriptions', 'course', courseId] as const,
  },
  payments: {
    mine: ['payments', 'mine'] as const,
  },
  reviews: {
    byCourse: (courseId: string) => ['reviews', courseId] as const,
  },
  notifications: {
    mine: ['notifications', 'mine'] as const,
    unreadCount: ['notifications', 'unread'] as const,
  },
} as const;
```

### 1.3 Zod Validation Schemas (`src/utils/validation.ts`)

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['student', 'teacher']),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
});

export const sectionSchema = z.object({
  title: z.string().min(2, 'Section title is required'),
  order: z.number().int().positive(),
});

export const lessonSchema = z.object({
  title: z.string().min(2, 'Lesson title is required'),
  content_type: z.enum(['video', 'pdf', 'audio']),
  duration: z.number().min(0).optional(),
  order: z.number().int().positive(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
```

---

## Phase 2 — Appwrite Backend Setup

### 2.1 Update Config (`src/services/appwrite/config.ts`)

Replace old collection IDs with EduStream entities:

```typescript
import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,

  // ── Collections ──
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  coursesCollectionId: import.meta.env.VITE_APPWRITE_COURSES_COLLECTION_ID,
  sectionsCollectionId: import.meta.env.VITE_APPWRITE_SECTIONS_COLLECTION_ID,
  lessonsCollectionId: import.meta.env.VITE_APPWRITE_LESSONS_COLLECTION_ID,
  subscriptionsCollectionId: import.meta.env
    .VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
  paymentsCollectionId: import.meta.env.VITE_APPWRITE_PAYMENTS_COLLECTION_ID,
  reviewsCollectionId: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID,
  notificationsCollectionId: import.meta.env
    .VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
  contentAccessCollectionId: import.meta.env
    .VITE_APPWRITE_CONTENT_ACCESS_COLLECTION_ID,
};

export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
```

---

## Phase 3 — Authentication System

### 3.1 Auth Service (`src/services/appwrite/auth/authService.ts`)

```typescript
import { ID, Query } from 'appwrite';
import { account, databases, avatars, appwriteConfig } from '../config';

// Create a new user account + user document in the Users collection
export async function createAccount(
  name: string,
  email: string,
  password: string,
  role: string,
) {
  const newAccount = await account.create(ID.unique(), email, password, name);
  const avatarUrl = avatars.getInitials(name);

  const userDoc = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    newAccount.$id, // use the same ID for easy lookup
    { name, email, role, avatarUrl, created_at: new Date().toISOString() },
  );

  await account.createEmailPasswordSession(email, password);
  return userDoc;
}

// Login with email + password
export async function login(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

// Logout current session
export async function logout() {
  return account.deleteSession('current');
}

// Get the current logged-in user (session + user document)
export async function getCurrentUser() {
  const session = await account.get();
  const userDoc = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    session.$id,
  );
  return userDoc;
}

// Send password recovery email
export async function resetPassword(email: string) {
  return account.createRecovery(
    email,
    `${window.location.origin}/reset-password`,
  );
}
```

### 3.2 Auth Redux Slice (`src/store/slices/authSlice.ts`)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearUser: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
```

### 3.3 Auth Hook (`src/hooks/useAuth.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../store/hooks';
import { setUser, clearUser } from '../store/slices/authSlice';
import { queryKeys } from '../keys/queryKeys';
import * as authService from '../services/appwrite/auth/authService';

export function useCurrentUser() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      dispatch(setUser(user as any));
      return user;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) =>
      authService.createAccount(
        data.name,
        data.email,
        data.password,
        data.role,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
    },
  });
}
```

### 3.4 Protected Route & Role Guard

**ProtectedRoute** — Wraps any route that requires authentication. Redirects to `/login` if not logged in.

**RoleGuard** — Checks `user.role` against an allowed roles array. Renders `<Outlet />` if allowed, or redirects to `/dashboard`.

---

## Phase 4 — Course Management (✅ COMPLETE)

### 4.1 Course Service (`src/services/appwrite/databases/courseService.ts`)

| Function                 | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| `createCourse(data)`     | Creates a document in courses collection with `teacher_id`                 |
| `getCourses(queries?)`   | Lists courses with pagination, search (title), and optional teacher filter |
| `getCourseById(id)`      | Gets a single course with teacher info                                     |
| `updateCourse(id, data)` | Partial update                                                             |
| `deleteCourse(id)`       | Deletes course (should also clean up sections/lessons)                     |

### 4.2 Section & Lesson Services

Same CRUD pattern, scoped to their parent:

- `sectionService` — CRUD for sections within a course, ordered by `order` field
- `lessonService` — CRUD for lessons within a section, handles `content_type`, `file_url`, `duration`, `order`

### 4.3 Storage Service (`src/services/appwrite/storage/storageService.ts`)

```typescript
import { ID } from 'appwrite';
import { storage, appwriteConfig } from '../config';

export async function uploadFile(file: File) {
  return storage.createFile(appwriteConfig.storageId, ID.unique(), file);
}

export function getFilePreview(fileId: string) {
  return storage.getFilePreview(appwriteConfig.storageId, fileId);
}

export function getFileView(fileId: string) {
  return storage.getFileView(appwriteConfig.storageId, fileId);
}

export async function deleteFile(fileId: string) {
  return storage.deleteFile(appwriteConfig.storageId, fileId);
}
```

### 4.4 Course Hooks (`src/hooks/useCourses.ts`)

| Hook                     | Type     | Description                             |
| ------------------------ | -------- | --------------------------------------- |
| `useGetCourses(filters)` | Query    | Paginated list with search/filter       |
| `useGetCourseById(id)`   | Query    | Single course detail                    |
| `useCreateCourse()`      | Mutation | Creates course + invalidates list cache |
| `useUpdateCourse()`      | Mutation | Optimistic update                       |
| `useDeleteCourse()`      | Mutation | Removes from cache optimistically       |

### 4.5 UI Components

| Component              | Description                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `CourseCard.tsx`       | Card with thumbnail, title, price badge, teacher name, rating stars, hover animation   |
| `CourseList.tsx`       | Responsive grid + search bar + category filter + infinite scroll                       |
| `CourseForm.tsx`       | Multi-step form (info → sections → lessons → pricing) with React Hook Form + Zod       |
| `CourseDetail.tsx`     | Hero banner, section accordion, lesson list, subscribe/buy CTA                         |
| `SectionAccordion.tsx` | Collapsible sections with lesson count + total duration                                |
| `LessonPlayer.tsx`     | Conditional renderer: `<video>` / `<iframe>` (PDF) / `<audio>` based on `content_type` |

---

## Phase 5 — Subscription & Payment System

### 5.1 Subscription Service (`src/services/appwrite/databases/subscriptionService.ts`)

| Function                               | Description                                                      |
| -------------------------------------- | ---------------------------------------------------------------- |
| `createSubscription(userId, courseId)` | Creates with `status: 'active'`, calculates `end_date`           |
| `getUserSubscriptions(userId)`         | All subscriptions for a user                                     |
| `checkAccess(userId, courseId)`        | Returns `boolean` — is there an active subscription?             |
| `revokeSubscription(subId)`            | Sets status to `revoked`                                         |
| `expireSubscriptions()`                | Batch update for expired subs (can be an Appwrite Function cron) |

### 5.2 Payment Service (`src/services/appwrite/databases/paymentService.ts`)

| Function                                    | Description                                        |
| ------------------------------------------- | -------------------------------------------------- |
| `createPayment(data)`                       | Records a payment attempt with `status: 'pending'` |
| `updatePaymentStatus(id, status, stripeId)` | Updates after Stripe webhook response              |
| `getUserPayments(userId)`                   | Transaction history                                |

### 5.3 Payment Flow

```
Student clicks "Subscribe" on CourseDetailPage
  └─→ CheckoutButton triggers Appwrite Function
       └─→ Function creates Stripe Checkout Session
            └─→ Redirects to Stripe Checkout
                 └─→ On success: Stripe webhook → Appwrite Function
                      └─→ Creates Payment (status: success)
                      └─→ Creates Subscription (status: active)
                      └─→ Redirects to /checkout/success
```

---

## Phase 6 — Student Features (Reviews, Notifications)

### 6.1 Review Service

CRUD for reviews: create (rating 1–5 + comment), list by course, delete own review. One review per user per course enforced via query check.

### 6.2 Notification Service

- `getNotifications(userId)` — recent notifications, ordered by date
- `markAsRead(notificationId)` — updates `is_read` to `true`
- `createNotification(data)` — for system events (new lesson, subscription expiry, etc.)

### 6.3 UI Components

- **ReviewForm** — Star picker + textarea, Zod validation
- **ReviewList** — Avatar, name, stars, comment, date, paginated
- **StarRating** — Reusable interactive/read-only star component
- **NotificationDropdown** — Bell icon with unread badge, dropdown list, mark-as-read on click

---

## Phase 7 — Dashboards & Admin Panel

### 7.1 Teacher Dashboard (✅ COMPLETE)

- **Revenue analytics:** Scholarly revenue based on enrolled learners.
- **Stats Overview:** High-fidelity metrics for learners, courses, and revenue.
- **Course management ledger:** Modular course list with draft/active status.
- **FSD migration:** Refactored into a dedicated feature slice for isolation.

### 7.2 Student Dashboard

- **My subscribed courses** grid (from subscriptions with status `active`)
- **Continue watching** section (track last accessed lesson)
- **Transaction history** link

### 7.3 Admin Dashboard

- **User management** table: search, filter by role, suspend/unsuspend
- **Content moderation** queue: review flagged courses
- **Platform analytics:** total users, total courses, total revenue, retention

---

## Phase 8 — Layout, Routing & Content Protection

### 8.1 Route Tree (`App.tsx`)

```tsx
<Routes>
  {/* ── Public Routes ── */}
  <Route element={<RootLayout />}>
    <Route index element={<HomePage />} />
    <Route path="courses" element={<CoursesPage />} />
    <Route path="courses/:id" element={<CourseDetailPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
  </Route>

  {/* ── Protected Routes (any authenticated user) ── */}
  <Route
    element={
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="checkout/:courseId" element={<CheckoutPage />} />

    {/* ── Teacher Only ── */}
    <Route element={<RoleGuard roles={['teacher']} />}>
      <Route path="courses/create" element={<CreateCoursePage />} />
      <Route path="courses/:id/edit" element={<CreateCoursePage />} />
    </Route>

    {/* ── Admin Only ── */}
    <Route element={<RoleGuard roles={['admin']} />}>
      <Route path="admin/*" element={<AdminDashboard />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### 8.2 Content Protection

| Protection            | Implementation                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Disable right-click   | `onContextMenu={(e) => e.preventDefault()}` on video/audio elements                                              |
| Token-based streaming | Use Appwrite file view URLs (session-scoped, requires active session)                                            |
| Device limiting       | Track `device_id` (user-agent + screen fingerprint) in `ContentAccess` collection. Limit to 2–3 devices per user |
| Watermarking          | Overlay user email on video player via CSS `::after` pseudo-element                                              |

---

## 🔧 Appwrite Setup Guide

### Step 1: Create Project

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Click **Create Project** → name it `EduStream`
3. Copy the **Project ID** → paste to `.env` as `VITE_APPWRITE_PROJECT_ID`
4. Add your domain to **Platforms** → Web → `localhost` (for dev)

### Step 2: Create Database

1. Go to **Databases** → **Create Database** → name it `edustream`
2. Copy the **Database ID** → paste to `.env` as `VITE_APPWRITE_DATABASE_ID`

### Step 3: Create Collections

Create the following collections inside your database. For each, copy the **Collection ID** to `.env`.

---

#### 📋 Users Collection

| Attribute    | Type                                 | Required | Notes |
| ------------ | ------------------------------------ | -------- | ----- |
| `name`       | String (255)                         | ✅       |       |
| `email`      | String (255)                         | ✅       |       |
| `role`       | Enum (`student`, `teacher`, `admin`) | ✅       |       |
| `avatarUrl`  | URL (2000)                           | ❌       |       |
| `created_at` | DateTime                             | ✅       |       |

**Indexes:**

- `email` → Unique index
- `role` → Key index

**Permissions:**

- Any → Read
- Users → Create
- Document (self) → Update, Delete

---

#### 📋 Courses Collection

| Attribute       | Type          | Required | Notes      |
| --------------- | ------------- | -------- | ---------- |
| `title`         | String (255)  | ✅       |            |
| `description`   | String (5000) | ✅       |            |
| `price`         | Float         | ✅       | Min: 0     |
| `teacher_id`    | String (36)   | ✅       | FK → Users |
| `thumbnail_url` | URL (2000)    | ❌       |            |
| `created_at`    | DateTime      | ✅       |            |

**Indexes:**

- `title` → Fulltext index (for search)
- `teacher_id` → Key index
- `created_at` → Key index (descending, for sorting)

**Permissions:**

- Any → Read
- Users (role: teacher) → Create
- Document creator → Update, Delete

---

#### 📋 Sections Collection

| Attribute   | Type         | Required | Notes        |
| ----------- | ------------ | -------- | ------------ |
| `course_id` | String (36)  | ✅       | FK → Courses |
| `title`     | String (255) | ✅       |              |
| `order`     | Integer      | ✅       | Min: 1       |

**Indexes:**

- `course_id` → Key index
- `course_id` + `order` → Key index (compound, for ordered retrieval)

---

#### 📋 Lessons Collection

| Attribute      | Type                           | Required | Notes         |
| -------------- | ------------------------------ | -------- | ------------- |
| `section_id`   | String (36)                    | ✅       | FK → Sections |
| `title`        | String (255)                   | ✅       |               |
| `content_type` | Enum (`video`, `pdf`, `audio`) | ✅       |               |
| `file_url`     | URL (2000)                     | ✅       |               |
| `duration`     | Integer                        | ❌       | In seconds    |
| `order`        | Integer                        | ✅       | Min: 1        |

**Indexes:**

- `section_id` → Key index
- `section_id` + `order` → Key index (compound)

---

#### 📋 Subscriptions Collection

| Attribute    | Type                                  | Required | Notes        |
| ------------ | ------------------------------------- | -------- | ------------ |
| `user_id`    | String (36)                           | ✅       | FK → Users   |
| `course_id`  | String (36)                           | ✅       | FK → Courses |
| `status`     | Enum (`active`, `expired`, `revoked`) | ✅       |              |
| `start_date` | DateTime                              | ✅       |              |
| `end_date`   | DateTime                              | ✅       |              |

**Indexes:**

- `user_id` → Key index
- `course_id` → Key index
- `user_id` + `course_id` + `status` → Key index (compound, for access check)

---

#### 📋 Payments Collection

| Attribute           | Type                                  | Required | Notes          |
| ------------------- | ------------------------------------- | -------- | -------------- |
| `user_id`           | String (36)                           | ✅       | FK → Users     |
| `course_id`         | String (36)                           | ✅       | FK → Courses   |
| `amount`            | Float                                 | ✅       |                |
| `currency`          | String (10)                           | ✅       | Default: `usd` |
| `payment_status`    | Enum (`pending`, `success`, `failed`) | ✅       |                |
| `stripe_payment_id` | String (255)                          | ❌       |                |
| `created_at`        | DateTime                              | ✅       |                |

**Indexes:**

- `user_id` → Key index
- `stripe_payment_id` → Key index

---

#### 📋 Reviews Collection

| Attribute    | Type          | Required | Notes          |
| ------------ | ------------- | -------- | -------------- |
| `user_id`    | String (36)   | ✅       | FK → Users     |
| `course_id`  | String (36)   | ✅       | FK → Courses   |
| `rating`     | Integer       | ✅       | Min: 1, Max: 5 |
| `comment`    | String (2000) | ❌       |                |
| `created_at` | DateTime      | ✅       |                |

**Indexes:**

- `course_id` → Key index
- `user_id` + `course_id` → Unique index (one review per user per course)

---

#### 📋 Notifications Collection

| Attribute    | Type          | Required | Notes            |
| ------------ | ------------- | -------- | ---------------- |
| `user_id`    | String (36)   | ✅       | FK → Users       |
| `title`      | String (255)  | ✅       |                  |
| `message`    | String (2000) | ✅       |                  |
| `is_read`    | Boolean       | ✅       | Default: `false` |
| `created_at` | DateTime      | ✅       |                  |

**Indexes:**

- `user_id` → Key index
- `user_id` + `is_read` → Key index (compound, for unread count)

---

#### 📋 ContentAccess Collection (Advanced)

| Attribute          | Type         | Required | Notes               |
| ------------------ | ------------ | -------- | ------------------- |
| `user_id`          | String (36)  | ✅       | FK → Users          |
| `course_id`        | String (36)  | ✅       | FK → Courses        |
| `device_id`        | String (255) | ✅       | Browser fingerprint |
| `last_access_time` | DateTime     | ✅       |                     |

**Indexes:**

- `user_id` → Key index
- `user_id` + `device_id` → Key index (compound)

---

### Step 4: Create Storage Bucket

1. Go to **Storage** → **Create Bucket** → name it `edustream-files`
2. **Allowed file extensions:** `jpg, jpeg, png, gif, webp, mp4, webm, mp3, wav, pdf`
3. **Maximum file size:** `50 MB` (adjust for video)
4. Copy the **Bucket ID** → paste to `.env` as `VITE_APPWRITE_STORAGE_ID`

**Permissions:**

- Any → Read (public file access)
- Users → Create, Update, Delete

### Step 5: Enable Authentication

1. Go to **Auth** → **Settings**
2. Enable **Email/Password** authentication
3. (Optional) Enable **OAuth2** providers (Google, GitHub)
4. Set **Password recovery** redirect URL to `https://yourdomain.com/reset-password`

### Step 6: Create Appwrite Function (for Stripe)

1. Go to **Functions** → **Create Function**
2. Runtime: **Node.js 18**
3. Name: `create-stripe-checkout`
4. See [Stripe Integration Guide](#-stripe-integration-guide) below for the function code

---

## 💳 Stripe Integration Guide

### Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. Go to **Developers** → **API Keys**
4. Copy:
   - **Publishable key** → `.env` as `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → Appwrite Function environment variable (never expose in frontend!)

### Step 2: Appwrite Function — Create Checkout Session

This function runs on the server (Appwrite Cloud Functions). The frontend calls it to create a Stripe Checkout Session.

```javascript
// Appwrite Function: create-stripe-checkout
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Client, Databases, ID } = require('node-appwrite');

module.exports = async ({ req, res }) => {
  const { courseId, courseTitle, price, userId } = JSON.parse(req.body);

  // 1. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: courseTitle },
          unit_amount: Math.round(price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/courses/${courseId}`,
    metadata: { courseId, userId },
  });

  // 2. Record pending payment in Appwrite
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  await databases.createDocument(
    process.env.DATABASE_ID,
    process.env.PAYMENTS_COLLECTION_ID,
    ID.unique(),
    {
      user_id: userId,
      course_id: courseId,
      amount: price,
      currency: 'usd',
      payment_status: 'pending',
      stripe_payment_id: session.id,
      created_at: new Date().toISOString(),
    },
  );

  return res.json({ checkoutUrl: session.url });
};
```

**Function Environment Variables:**
| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` (from Stripe Dashboard) |
| `FRONTEND_URL` | `http://localhost:5173` (dev) or your production URL |
| `APPWRITE_ENDPOINT` | `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | Your project ID |
| `APPWRITE_API_KEY` | Create an API key in Appwrite Console with Databases permissions |
| `DATABASE_ID` | Your database ID |
| `PAYMENTS_COLLECTION_ID` | Your payments collection ID |
| `SUBSCRIPTIONS_COLLECTION_ID` | Your subscriptions collection ID |

### Step 3: Stripe Webhook — Handle Payment Success

Create a second Appwrite Function that listens to Stripe webhooks.

1. In Stripe Dashboard → **Webhooks** → **Add Endpoint**
2. URL: Your Appwrite Function URL (e.g., `https://cloud.appwrite.io/v1/functions/YOUR_FUNCTION_ID/executions`)
3. Events: `checkout.session.completed`

```javascript
// Appwrite Function: stripe-webhook
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Client, Databases, ID, Query } = require('node-appwrite');

module.exports = async ({ req, res }) => {
  const event = JSON.parse(req.body);

  if (event.type !== 'checkout.session.completed') {
    return res.json({ received: true });
  }

  const session = event.data.object;
  const { courseId, userId } = session.metadata;

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  // 1. Update payment status to 'success'
  const payments = await databases.listDocuments(
    process.env.DATABASE_ID,
    process.env.PAYMENTS_COLLECTION_ID,
    [Query.equal('stripe_payment_id', session.id)],
  );

  if (payments.documents.length > 0) {
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.PAYMENTS_COLLECTION_ID,
      payments.documents[0].$id,
      { payment_status: 'success' },
    );
  }

  // 2. Create active subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1); // 1-year access

  await databases.createDocument(
    process.env.DATABASE_ID,
    process.env.SUBSCRIPTIONS_COLLECTION_ID,
    ID.unique(),
    {
      user_id: userId,
      course_id: courseId,
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    },
  );

  return res.json({ received: true });
};
```

### Step 4: Frontend Integration

```typescript
// In CheckoutButton.tsx — call the Appwrite Function
import { functions } from '../services/appwrite/config'; // add Functions to config

async function handleCheckout(
  courseId: string,
  title: string,
  price: number,
  userId: string,
) {
  const execution = await functions.createExecution(
    'create-stripe-checkout', // function ID
    JSON.stringify({ courseId, courseTitle: title, price, userId }),
    false, // not async
    '/', // path
    'POST', // method
  );

  const { checkoutUrl } = JSON.parse(execution.responseBody);
  window.location.href = checkoutUrl; // redirect to Stripe
}
```

### Step 5: Testing Stripe Locally

1. Use **Stripe test mode** (keys starting with `sk_test_` and `pk_test_`)
2. Use test card numbers:
   - ✅ Success: `4242 4242 4242 4242`
   - ❌ Declined: `4000 0000 0000 0002`
   - ⚠️ 3D Secure: `4000 0027 6000 3184`
3. Install Stripe CLI for local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/stripe-webhook
   ```

---

## 🔐 Environment Variables

### `.env.example` (full)

```env
# ── Appwrite ──
VITE_APPWRITE_ENDPOINT='https://cloud.appwrite.io/v1'
VITE_APPWRITE_PROJECT_ID='your-project-id'
VITE_APPWRITE_DATABASE_ID='your-database-id'
VITE_APPWRITE_STORAGE_ID='your-storage-bucket-id'

# ── Collections ──
VITE_APPWRITE_USERS_COLLECTION_ID='your-users-collection-id'
VITE_APPWRITE_COURSES_COLLECTION_ID='your-courses-collection-id'
VITE_APPWRITE_SECTIONS_COLLECTION_ID='your-sections-collection-id'
VITE_APPWRITE_LESSONS_COLLECTION_ID='your-lessons-collection-id'
VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID='your-subscriptions-collection-id'
VITE_APPWRITE_PAYMENTS_COLLECTION_ID='your-payments-collection-id'
VITE_APPWRITE_REVIEWS_COLLECTION_ID='your-reviews-collection-id'
VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID='your-notifications-collection-id'
VITE_APPWRITE_CONTENT_ACCESS_COLLECTION_ID='your-content-access-collection-id'

# ── Stripe ──
VITE_STRIPE_PUBLISHABLE_KEY='pk_test_your-key'
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest + RTL)

| Area       | What to Test                                                        |
| ---------- | ------------------------------------------------------------------- |
| Services   | Mock Appwrite SDK, verify correct method calls and parameters       |
| Hooks      | Use `renderHook` with providers, test loading/error/success states  |
| Validation | Test Zod schemas with valid & invalid data                          |
| Components | Test form submissions, conditional rendering, role-based visibility |

### Integration Tests

| Flow         | Steps                                                             |
| ------------ | ----------------------------------------------------------------- |
| Auth         | Register → login → verify session → logout → verify redirect      |
| Course CRUD  | Create → view in list → edit → delete → verify removed            |
| Subscription | Subscribe → verify access → revoke → verify denied                |
| Payment      | Trigger checkout → simulate success → verify subscription created |

### Edge Cases to Cover

| Case                          | Expected Behavior                            |
| ----------------------------- | -------------------------------------------- |
| Access without subscription   | Redirect to checkout page                    |
| Payment success but no access | Webhook retry creates subscription           |
| Course deleted while enrolled | Show "course unavailable" to students        |
| Video fails to load           | Error boundary with retry button             |
| Multiple device logins        | Check ContentAccess, block if over limit     |
| Expired subscription          | Status check returns `false`, prompt renewal |

---

## 📊 Implementation Priority & Dependency Graph

```
Phase 1 (Foundation)
  └──→ Phase 2 (Appwrite Setup)
        ├──→ Phase 3 (Auth) ──→ Phase 7 (Dashboards)
        ├──→ Phase 4 (Courses) ──→ Phase 6 (Reviews)
        └──→ Phase 5 (Payments) ──→ Phase 7 (Dashboards)
                                          └──→ Phase 8 (Layout & Protection)
```

> **Recommended order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
> Each phase can be tested independently before moving to the next.
