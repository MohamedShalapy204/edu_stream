import { Routes, Route } from 'react-router-dom';
import { AuthGuard, GuestGuard } from './components/auth/AuthGuard';
import { RoleGuard } from './components/auth/RoleGuard';
import { UserRole } from './types';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

// Phase 4: Course Management
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ManageCoursePage from './pages/teacher/ManageCoursePage';

function App() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route element={<MainLayout isPublic />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
      </Route>

      {/* ── Guest Routes (Only logged out users) ── */}
      <Route path="/login" element={
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      } />
      <Route path="/register" element={
        <GuestGuard>
          <RegisterPage />
        </GuestGuard>
      } />

      {/* ── Protected Routes (Require Authentication) ── */}
      <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ── Role-Specific Routes (TEACHER) ── */}
        <Route element={<RoleGuard allowedRoles={[UserRole.TEACHER]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses/new" element={<ManageCoursePage />} />
          <Route path="/teacher/courses/:id" element={<ManageCoursePage />} />
        </Route>

        {/* ── Role-Specific Routes (ADMIN) ── */}
        <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="/admin" element={<div>Admin Dashboard Placeholder</div>} />
        </Route>
      </Route>

      {/* ── Error Routes ── */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;