# 📄 Product Requirements Document (PRD)

## 🏷️ Product Name  
**EduStream Platform**

---

## 🎯 1. Product Overview

EduStream is a web-based educational marketplace that enables content creators (teachers) to publish and monetize courses (video, PDF, audio), while giving students controlled access through subscriptions.

---

## ⚠️ 2. Problem Statement

### Current Problems:
- Students struggle to find high-quality structured content  
- Teachers lack full control over subscriptions and content access  
- Content piracy reduces creator revenue  
- Limited customization in existing platforms  

---

## 👥 3. Target Users

### 1. Students
- Consume courses  
- Subscribe to content  
- Track progress  

### 2. Teachers (Content Creators)
- Upload and manage courses  
- Set pricing and subscription rules  
- Control enrolled users  

### 3. Admins
- Moderate content  
- Manage users  
- Handle reports  

### 4. Guests
- Browse courses  
- Preview limited content  

---

## 🧩 4. Core Features

### 🔐 Authentication & Authorization
- Register/Login (Student / Teacher / Admin)
- Role-Based Access Control (RBAC)
- Email verification
- Password reset

---

### 📚 Course Management (Teacher)
- Create course
- Upload:
  - Videos
  - PDFs
  - Audio files
- Organize into sections/lessons
- Set pricing (free/paid)
- Subscription types (one-time / monthly)

---

### 👨‍🎓 Student Features
- Browse/search courses
- Subscribe to courses
- Watch content
- Track progress
- Bookmark lessons

---

### 💳 Payment System
- Stripe integration
- Subscription management
- Transaction history

---

### 📊 Teacher Dashboard
- Revenue analytics
- Student enrollment list
- Manage access (grant/revoke)

---

### 🛡️ Content Protection
- Disable right-click/download (basic)
- Watermarking
- Token-based streaming
- Device/session limits

---

### ⭐ Reviews & Ratings
- Course ratings
- Feedback system

---

### 🔔 Notifications
- Course updates
- Subscription alerts
- Announcements

---

### 🛠️ Admin Panel
- User management
- Content moderation
- Reports handling
- Platform analytics

---

## ⚙️ 5. Functional Requirements

- User can register/login  
- Teacher can upload courses  
- Student can subscribe  
- Access restricted to subscribers  
- Teacher can manage students  

---

## 🚫 6. Non-Functional Requirements

- Performance: < 2s load time  
- Scalability: supports thousands of users  
- Security:
  - JWT authentication
  - Encrypted passwords  
- Availability: 99.9% uptime  

---

## 🧾 7. User Stories

### Student
- As a student, I want to subscribe to courses so I can access content  
- As a student, I want to track progress  

### Teacher
- As a teacher, I want to upload courses so I can teach and earn  
- As a teacher, I want to control access  

### Admin
- As an admin, I want to manage users and content  

---

## ✅ 8. Acceptance Criteria

### Subscription
- User must be logged in  
- Payment successful  
- Access granted immediately  
- Access revoked after expiry  

---

## ⚠️ 9. Edge Cases

- Access without subscription  
- Payment success but no access  
- Course deleted while students enrolled  
- Video fails to load  
- Multiple device logins  

---

## 🧱 10. System Architecture

### Frontend
- React

### Backend (BaaS)
- Appwrite

### Storage
- Appwrite Storage / AWS S3

### CDN
- Cloudflare CDN

### Payments
- Stripe

---

## 🧪 11. Test Scenarios

### Authentication
- Valid login → success  
- Invalid login → error  

### Course Access
- Subscribed → allowed  
- Not subscribed → denied  

### Upload
- Valid file → success  
- Invalid format → rejected  

---

## 📈 12. Success Metrics

- Active users  
- Course completion rate  
- Revenue  
- Retention rate  

---

## 🚀 13. Future Enhancements

- Mobile app  
- AI recommendations  
- Live classes  
- Certificates  

