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

function App() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<Home />} />

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
          {/* 
              Example: 
              <Route path="/courses/create" element={<CreateCourse />} /> 
            */}
        </Route>

        {/* ── Role-Specific Routes (ADMIN) ── */}
        <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
          {/* 
              Example: 
              <Route path="/admin" element={<AdminDashboard />} /> 
            */}
        </Route>
      </Route>

      {/* ── Error Routes ── */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;