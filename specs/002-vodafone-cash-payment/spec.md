# Feature Specification: Vodafone Cash Payment

**Feature Branch**: `002-vodafone-cash-payment`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "payment feature with vodaphone cash the teacher profile should have a setting that allow him to add default vodaphone cash number and in create new course it requier from him to select a vodaphone number (default or new number), from student point of view when he click to enroll non free course it redirect to payment pages this pages now its job to display the course vodaphone cash number and it is the responsibility of the teacher to approve the new student to enter his course this requier a dashboard for the course containing the student infos like name email status and approve or deny buttons"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Teacher Configures Default Vodafone Cash Number (Priority: P1)

A teacher wants to register their Vodafone Cash number once and reuse it across all their courses without re-entering it every time. They navigate to their profile settings, add or update their default Vodafone Cash number (11-digit Egyptian mobile number), and save it.

**Why this priority**: This is the foundation of the entire payment feature. Without a payment number, no course can accept payments. Unblocks all downstream stories.

**Independent Test**: Can be fully tested by visiting the teacher profile settings page, filling in a Vodafone Cash number, saving, and confirming it persists on the next visit.

**Acceptance Scenarios**:

1. **Given** a logged-in teacher on the profile settings page, **When** they enter a valid 11-digit Vodafone Cash number and click Save, **Then** the number is stored and displayed next time they visit settings.
2. **Given** a logged-in teacher with a saved number, **When** they update the number and save, **Then** the new number replaces the old one.
3. **Given** a teacher entering an invalid number (fewer than 11 digits, non-numeric), **When** they attempt to save, **Then** an inline validation error appears and the save is blocked.
4. **Given** a logged-in teacher with no number set, **When** they open the settings page, **Then** the field is empty with clear placeholder guidance.

---

### User Story 2 – Teacher Assigns a Payment Number When Creating a Course (Priority: P1)

When creating a new paid course, the teacher must specify which Vodafone Cash number students should send payment to. The teacher can choose their saved default number or enter a new one specifically for that course.

**Why this priority**: This directly gates whether students can enroll in paid courses. Without it, the student payment flow cannot function.

**Independent Test**: Can be fully tested by creating a paid course, selecting or entering a Vodafone Cash number, publishing the course, and verifying the number is saved on the course record.

**Acceptance Scenarios**:

1. **Given** a teacher creating a new course with a price > 0, **When** they reach the payment settings step, **Then** they are required to select or enter a Vodafone Cash number before publishing.
2. **Given** a teacher with a saved default number, **When** they open the payment settings step, **Then** the default number is pre-selected.
3. **Given** a teacher who selects "Use a different number", **When** they enter a valid 11-digit number and continue, **Then** that number is saved uniquely to this course.
4. **Given** a teacher creating a free course (price = 0), **When** they fill in course details, **Then** the Vodafone Cash number step is skipped entirely.
5. **Given** a teacher who has not set a default number yet, **When** they try to publish a paid course, **Then** they are prompted to enter a Vodafone Cash number and optionally save it as default.

---

### User Story 3 – Student Views Payment Instructions and Submits Enrollment Request (Priority: P2)

When a student clicks "Enroll" on a paid course, they are redirected to a dedicated payment page showing the course Vodafone Cash number, the course price, and instructions for sending payment via Vodafone Cash. After the student has sent the money, they confirm on the page, placing their enrollment in a "Pending Approval" state.

**Why this priority**: Core student-facing flow. Depends on P1 teacher stories being complete. Enables the teacher's approval dashboard.

**Independent Test**: Can be fully tested by clicking Enroll on a paid course, following the payment page UI, and confirming that the enrollment record is created with "Pending Approval" status.

**Acceptance Scenarios**:

1. **Given** a logged-in student browsing a paid course, **When** they click "Enroll", **Then** they are redirected to the payment instructions page for that course.
2. **Given** the student on the payment page, **When** the page loads, **Then** it clearly displays: the course name, course price, the teacher's Vodafone Cash number, and step-by-step payment instructions.
3. **Given** a student who has sent the payment externally, **When** they click "I've Sent the Payment", **Then** their enrollment is recorded with status "Pending Approval" and they see a confirmation message.
4. **Given** a student who already has a Pending or Approved enrollment for the course, **When** they visit the course page, **Then** the Enroll button is replaced by their enrollment status.
5. **Given** a student navigating to the payment page for a free course directly via URL, **When** the page loads, **Then** they are redirected to the standard enrollment flow.

---

### User Story 4 – Teacher Reviews and Approves/Denies Student Enrollment (Priority: P2)

The teacher accesses a per-course enrollment dashboard where they see all students who have submitted payment confirmations. For each student the dashboard shows their name, email, enrollment date, and current status. The teacher can approve or deny each student individually.

**Why this priority**: Closes the payment loop. Without approval, enrolled students cannot access course content. Directly impacts teacher trust in the system.

**Independent Test**: Can be fully tested by having a student submit a pending enrollment, then logging in as the teacher, visiting the course dashboard, and pressing Approve or Deny.

**Acceptance Scenarios**:

1. **Given** a teacher on the course enrollment dashboard, **When** the page loads, **Then** a list of all enrollments is displayed with columns: student name, email, enrollment date, and status (Pending / Approved / Denied).
2. **Given** a teacher viewing a Pending enrollment, **When** they click "Approve", **Then** the enrollment status changes to "Approved" and the student gains access to the course content.
3. **Given** a teacher viewing a Pending enrollment, **When** they click "Deny", **Then** the enrollment status changes to "Denied" and the student loses access to/cannot access the course content.
4. **Given** a teacher on the dashboard, **When** there are no pending enrollments, **Then** an empty-state message is clearly shown.
5. **Given** a teacher approving or denying an enrollment, **When** the action completes, **Then** the student status row updates immediately without a full page reload.

---

### User Story 5 – Student Receives Feedback on Enrollment Status (Priority: P3)

After submitting payment, a student can check back on the course page or their student dashboard to see the current state of their enrollment (Pending, Approved, or Denied) without needing to contact the teacher.

**Why this priority**: Improves student experience and reduces teacher support load. Dependent on the core approval flow (P2).

**Independent Test**: Can be tested by submitting an enrollment request, then checking the course page and student dashboard to verify the enrollment status badge is visible.

**Acceptance Scenarios**:

1. **Given** a student with a Pending enrollment, **When** they visit the course page or their student dashboard, **Then** they see a "Pending Approval" status badge.
2. **Given** a teacher approving a student, **When** the student next visits the course page, **Then** they see "Approved" status and can access course content.
3. **Given** a teacher denying a student, **When** the student next visits the course page, **Then** they see a "Denied" message with guidance to contact the teacher.

---

### User Story 6 – Teacher Monitors Pending Enrollments from Dashboard (Priority: P2)

A teacher with multiple active courses wants to immediately see which courses have new pending enrollment requests when they land on their teacher dashboard, without manually clicking into each course. They also want a single consolidated view of all pending enrollments across all their courses.

**Why this priority**: Without any awareness mechanism, pending enrollments could go unreviewed indefinitely, blocking students from accessing content and reducing platform trust. This story completes the teacher-side experience.

**Independent Test**: Can be fully tested by having a student submit a pending enrollment, then logging in as the teacher and verifying the course card shows a pending count badge and the global enrollments section lists the student.

**Acceptance Scenarios**:

1. **Given** a teacher on their dashboard, **When** one or more students have Pending enrollments for a course, **Then** that course's card displays a visible badge showing the number of pending enrollments.
2. **Given** a teacher on their dashboard, **When** a course has no pending enrollments, **Then** no badge is shown on that course's card.
3. **Given** a teacher on their dashboard, **When** they view the dedicated "Pending Enrollments" section, **Then** they see a consolidated list of all pending enrollments across all their courses, each row showing: course name, student name, student email, and submission date.
4. **Given** a teacher clicking on a row in the global pending list, **When** they select an enrollment, **Then** they are taken directly to that course's enrollment dashboard with that student highlighted.

---

### Edge Cases

- What happens when a student tries to enroll in the same paid course twice while already Pending or Approved? → The system prevents duplicate Pending or Approved enrollments for the same course.
- What happens when a student with a Denied enrollment tries to re-enroll? → Behavior is determined by the course's re-submission setting: if the teacher has enabled re-submission for that course, the student may submit a new payment request (which creates a fresh Pending enrollment alongside the previous Denied record); if re-submission is disabled, the student sees a message indicating they cannot re-enroll and should contact the teacher.
- What happens when a teacher changes the course Vodafone Cash number after students have pending enrollments? → Each enrollment record stores a snapshot of the number the student was shown at payment confirmation time. The teacher dashboard displays this snapshot number per enrollment, enabling dispute resolution regardless of subsequent number changes.
- What happens when a teacher's course changes from free to paid? → Students who were already enrolled remain enrolled. New enrollments from that point require payment.
- What happens when the payment page is accessed by a non-logged-in student? → The student is redirected to the login page with a return URL back to the payment page.
- What happens when the course has no Vodafone Cash number set (e.g., data inconsistency)? → The payment page shows an error state instructing the student to contact the teacher.
- What happens when the teacher has hundreds of pending enrollments? → The enrollment dashboard supports search by student name/email and pagination.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Teachers MUST be able to add, view, and update a default Vodafone Cash number in their profile settings.
- **FR-002**: System MUST validate that Vodafone Cash numbers are exactly 11 digits, numeric, and begin with the prefix `010` (Vodafone Egypt network) before saving. Numbers with any other prefix (011, 012, 015) MUST be rejected with a clear inline error message explaining the requirement.
- **FR-003**: When creating a paid course (price > 0), teachers MUST select or enter a Vodafone Cash number before the course can be published.
- **FR-004**: System MUST pre-populate the course payment number field with the teacher's saved default number (if one exists).
- **FR-005**: Teachers MUST be able to override the default and enter a course-specific Vodafone Cash number during course creation.
- **FR-006**: System MUST skip the payment number requirement entirely for free courses (price = 0).
- **FR-007**: When a student clicks "Enroll" on a paid course, the system MUST redirect them to a payment instructions page.
- **FR-008**: The payment instructions page MUST display: course name, course price, the course's Vodafone Cash number, and step-by-step instructions for completing payment via Vodafone Cash.
- **FR-009**: Students MUST be able to confirm payment submission, which creates an enrollment record with status "Pending Approval".
- **FR-010**: System MUST prevent a student from creating a duplicate enrollment (Pending or Approved) for the same course.
- **FR-011**: Teachers MUST have access to a per-course enrollment dashboard listing all enrollments with student name, email, enrollment submission date, and current status.
- **FR-012**: The enrollment dashboard MUST provide Approve and Deny action buttons for each Pending enrollment.
- **FR-013**: Approving an enrollment MUST grant the student access to the course content immediately.
- **FR-014**: Denying an enrollment MUST revoke or block the student's access to the course content.
- **FR-015**: Enrollment status changes MUST be reflected immediately in the dashboard without full page reload.
- **FR-016**: Students MUST be able to view their enrollment status (Pending / Approved / Denied) on the course page and their student dashboard.
- **FR-017**: The enrollment dashboard MUST support filtering or searching enrollments by student name or email.
- **FR-018**: The enrollment dashboard MUST support pagination when the number of enrollments is large.
- **FR-019**: Unauthenticated students who navigate to a paid course payment page MUST be redirected to login with a return URL.
- **FR-020**: Teachers MUST be able to configure, per course, whether students with a Denied enrollment are allowed to re-submit a new payment request. This setting MUST be accessible from the course enrollment dashboard.
- **FR-021**: Each course card on the teacher dashboard MUST display a pending enrollment count badge when one or more enrollments are in Pending status. The badge MUST disappear when no pending enrollments remain.
- **FR-022**: The teacher dashboard MUST include a dedicated "Pending Enrollments" section that aggregates all Pending enrollments across all the teacher's courses, displaying: course name, student name, student email, and submission date. Clicking an item navigates directly to the relevant course enrollment dashboard.
- **FR-023**: At the moment a student confirms payment, the system MUST record a snapshot of the Vodafone Cash number they were shown on the payment page into the Enrollment record. This snapshot MUST be displayed to the teacher on the enrollment dashboard for audit and dispute-resolution purposes.

### Key Entities *(include if feature involves data)*

- **TeacherPaymentProfile**: Represents a teacher's saved default Vodafone Cash number. Belongs to a user with teacher role. Has one number per teacher.
- **CoursePaymentSettings**: Stores the Vodafone Cash number assigned to a specific course and the re-submission policy flag (`allow_resubmission: boolean`). Belongs to a course. One-to-one relationship. Exists only for paid courses.
- **Enrollment**: Records a student's enrollment attempt for a course. Attributes: student reference, course reference, status (Pending / Approved / Denied), payment_number_shown (snapshot of the Vodafone Cash number displayed to the student at confirmation time), submission timestamp, review timestamp, reviewed-by reference. Multiple Enrollment records may exist for the same (student, course) pair when re-submission is enabled (only one may be Pending or Approved at a time).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Teachers can add or update their Vodafone Cash number in under 30 seconds from the profile settings page.
- **SC-002**: Students can complete the Enroll → Payment Page → Confirm Payment flow in under 2 minutes.
- **SC-003**: Teachers can review, approve, or deny a pending enrollment in under 15 seconds from the enrollment dashboard.
- **SC-004**: 100% of paid courses display a valid Vodafone Cash number on their payment page (enforced at course publish time).
- **SC-005**: The enrollment dashboard correctly reflects status changes within 2 seconds of the teacher taking an action, without requiring a page refresh.
- **SC-006**: Students who have been approved gain access to course content within 5 seconds of the teacher's approval action.
- **SC-007**: Zero duplicate Pending or Approved enrollments exist for any (student, course) pair.
- **SC-008**: The enrollment dashboard remains usable (search in < 1 second) for courses with up to 1,000 enrolled students.

---

## Assumptions

- The platform already has an existing user authentication system with distinct Teacher and Student roles, which this feature reuses without modification.
- The existing course creation flow has a multi-step form; the Vodafone Cash number selection step is inserted as an additional step for paid courses.
- Payment verification is intentionally manual (teacher reviews and approves after the student sends money via their phone); no automated payment gateway integration is in scope for this version.
- Push notifications or emails for status changes (e.g., "Your enrollment was approved") are desirable improvements but are out of scope for v1; students check the status manually.
- Vodafone Cash numbers must be exactly 11 digits and begin with the prefix `010` (Vodafone Egypt network). Numbers starting with 011 (e&/Etisalat), 012 (Orange), or 015 (WE) cannot receive Vodafone Cash transfers and are therefore invalid for this feature.
- A teacher can have at most one default Vodafone Cash number but may use different numbers per course.
- The enrollment dashboard is accessible from the teacher's course management area (e.g., a "Manage Enrollments" button on the course detail or teacher dashboard).
- The student dashboard already exists and shows enrolled courses; this feature adds enrollment status badges to that existing view.
- The course access control (what a student can and cannot view based on enrollment status) is enforced at the application routing/guard level.

---

## Clarifications

### Session 2026-04-10

- Q: After a teacher denies a student's enrollment, can that student re-submit a new payment request for the same course? → A: Configurable per course — teacher decides at course level (via `allow_resubmission` setting on CoursePaymentSettings) whether denied students may re-submit.
- Q: How should the teacher be made aware of new pending enrollments without full notification support? → A: Both (D) — a pending count badge on each course card in the teacher dashboard, AND a dedicated global "Pending Enrollments" aggregated list across all courses in the teacher dashboard.
- Q: Should the enrollment record store a snapshot of the Vodafone Cash number the student was shown at payment time? → A: Yes (A) — the number is snapshotted into the Enrollment record (`payment_number_shown`) at confirmation time for audit and dispute-resolution purposes.
- Q: Should the system enforce that the Vodafone Cash number starts with `010` (Vodafone Egypt only) or accept any Egyptian mobile prefix? → A: Enforce `010` prefix only (A) — numbers starting with 011, 012, or 015 cannot receive Vodafone Cash transfers and must be rejected with a clear validation error.
