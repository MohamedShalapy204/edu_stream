# 📊 Entity Relationship Diagram (ERD)

## EduStream Platform

---

## 🧠 Overview

This ERD defines the database structure for the EduStream platform, including:

- User roles (طلاب / مدرسين / أدمن)
- Course hierarchy (Courses → Sections → Lessons)
- Subscription system
- Payment tracking (Stripe)
- Content protection (device tracking)

---

## 👤 1. Users

Represents all system users.

**Fields:**

- id (PK)
- name
- email (unique)
- role (student | teacher | admin)
- avatar_url
- created_at
- updated_at

---

## 📚 2. Courses

Courses created by teachers.

**Fields:**

- id (PK)
- title
- description
- price
- teacher_id (FK → Users.id)
- thumbnail_id
- thumbnail_url
- is_published
- categories
- rating
- total_students
- duration
- language
- created_at
- updated_at

---

## 📦 3. Sections

Course chapters/structure.

**Fields:**

- id (PK)
- course_id (FK → Courses.id)
- title
- order
- description
- created_at
- updated_at

---

## 🎬 4. Lessons

Course content (video, PDF, audio).

**Fields:**

- id (PK)
- section_id (FK → Sections.id)
- title
- content_type (video | pdf | audio | powerpoint | word | zip)
- file_url
- duration
- order
- description
- created_at
- updated_at

---

## 💳 5. Subscriptions ✅

Handles access control between users and courses.

**Fields:**

- id (PK)
- user_id (FK → Users.id)
- course_id (FK → Courses.id)
- status (active | expired | revoked)
- start_date
- end_date
- stripeSubscriptionId
- created_at
- updated_at

**Why separate table?**

- Supports expiry
- Allows revoking access
- Enables admin control
- Tracks subscription lifecycle

---

## 💰 6. Payments ✅

Tracks all payment transactions.

**Fields:**

- id (PK)
- user_id (FK → Users.id)
- course_id (FK → Courses.id)
- amount
- currency
- payment_status (pending | success | failed)
- stripe_payment_id
- created_at
- updated_at

**Why independent table?**

- Tracks failures and retries
- Keeps financial records separate
- Clean integration with Stripe
- Supports auditing and analytics

---

## ⭐ 7. Reviews

Course feedback system.

**Fields:**

- id (PK)
- user_id (FK → Users.id)
- course_id (FK → Courses.id)
- rating (1–5)
- comment
- created_at
- updated_at

---

## 🔔 8. Notifications

System notifications.

**Fields:**

- id (PK)
- user_id (FK → Users.id)
- title
- message
- is_read (boolean)
- created_at
- updated_at

---

## 🛡️ 9. ContentAccess (Advanced) 🚀

Tracks user access per device.

**Fields:**

- id (PK)
- user_id (FK → Users.id)
- course_id (FK → Courses.id)
- device_id
- last_access_time
- device_name
- device_type
- ip_address
- created_at
- updated_at

**Why this table?**

- Prevent account sharing
- Track active sessions
- Enable device limiting
- Improve content security

---

## 🔗 Relationships

### 👤 User Relationships

- User (Teacher) → creates → Courses (1:N)
- User (Student) → subscribes → Courses (M:N via Subscriptions)

---

### 📚 Course Relationships

- Course → has → Sections (1:N)
- Section → has → Lessons (1:N)

---

### 💳 Subscription Flow

- User + Course → Subscription
- Subscription → controls access

---

### 💰 Payment Flow

- Payment → belongs to User
- Payment → belongs to Course
- Payment → triggers Subscription

---

### 🛡️ Content Access Flow

- User → accesses → Course via device
- Device tracked in ContentAccess

---

## 🔥 Key Design Decisions

### 1. Separate Subscription Table ✅

- Handles expiry
- Supports revoking access
- Enables admin control

---

### 2. Section → Lesson Hierarchy ✅

- Structured learning experience
- Scalable course organization

---

### 3. Independent Payment Table ✅

- Tracks failed/success payments
- Supports Stripe integration
- Enables financial auditing

---

## ⚠️ Advanced Design

### ContentAccess Table 🚀

- Tracks:
  - device_id
  - last_access_time

👉 Prevents account sharing and improves security

---

## 🧪 Testing Implications (Important)

- Subscription created after successful payment
- Expired subscription → access denied
- Multiple devices → check ContentAccess rules
- Payment failure → no subscription created

---

## 🚀 Future Extensions

- Certificates table
- Live sessions table
- Instructor earnings table
- Coupon/discount system
