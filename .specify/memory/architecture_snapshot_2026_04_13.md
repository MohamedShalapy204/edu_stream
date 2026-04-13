# EduStream Architecture Snapshot (v1.5.0)
Date: 2026-04-13

## 📁 File Structure (src/)
```text
src/
├── api/
│   └── userApi.ts
├── components/
│   └── ui/
│       └── ProgressBar.tsx
├── features/
│   ├── auth/         # Security, Profile, & User Management
│   ├── courses/      # Course catalog, Curriculum Editor, & Management API
│   ├── payment/      # Vodafone Cash Payment Gateway & Enrollment Logic (NEW)
│   ├── student/      # Student Dashboard & Learning Theatre
│   └── teacher/      # Instructor Dashboard & Stats
├── hooks/            # Global custom hooks (useUser, useSections, etc.)
├── keys/             # Centralized Query & Storage keys
├── services/         # Appwrite & External Service Initializations
├── store/            # Redux Slices & Store configuration
└── types/            # Global domain interfaces
```

## 📊 Database Schema (Appwrite)
### Core Collections
1. **Users**: System actors (Student, Teacher, Admin).
2. **Courses**: Educational curriculums.
3. **Sections/Lessons**: Content hierarchy.
4. **Subscriptions**: Active access records.
5. **Payments**: Financial transactions (Stripe).
6. **VodafoneEnrollments**: Manual payment submissions (NEW).

### VodafoneEnrollments Schema
- **student_id**: FK -> Users.$id
- **course_id**: FK -> Courses.$id
- **status**: `pending` | `approved` | `denied`
- **payment_number_shown**: Snapshot of target number at time of payment.
- **receipt_image_id**: Appwrite Storage File ID.
- **receipt_image_url**: Preview URL for teacher audit.

## 🧠 Core Logic: Vodafone Cash Flow
1. **Teacher Setup**: Teachers configure a `vodafone_number` per course or use global default from profile.
2. **Student Submission**: Student uploads receipt image via ` PaymentPage`. Record is created in `VodafoneEnrollments` with `pending` status.
3. **Teacher Audit**: Teachers view pending enrollments in `CourseEnrollmentDashboard`. 
4. **Approval**: Approval triggers:
   - Status update to `approved`.
   - Creation of an active `Subscription` record.
   - Cache invalidation for student access.
5. **Denial**: Optional resubmission allowed if configured.
