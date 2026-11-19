import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AdminGuard } from './components/common/AdminGuard';

// Public & Common Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ContactPage } from './pages/ContactPage';
import { PaymentPage } from './pages/PaymentPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { VerifyReceiptPage } from './pages/VerifyReceiptPage';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { FeeDetailsPage } from './pages/student/FeeDetailsPage';
import { PaymentHistoryPage } from './pages/student/PaymentHistoryPage';
import { ReceiptsListPage } from './pages/student/ReceiptsListPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageStudentsPage } from './pages/admin/ManageStudentsPage';
import { AddStudentPage } from './pages/admin/AddStudentPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { ManageFeesPage } from './pages/admin/ManageFeesPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSupportPage } from './pages/admin/AdminSupportPage';
import { AdminWebsitePage } from './pages/admin/AdminWebsitePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public & Common Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/receipts" element={<ReceiptsListPage />} />
              <Route path="/receipt/:id" element={<ReceiptPage />} />
              <Route path="/verify" element={<VerifyReceiptPage />} />
              <Route path="/verify/:code" element={<VerifyReceiptPage />} />

              {/* Student Portal Routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/fees" element={<FeeDetailsPage />} />
              <Route path="/history" element={<PaymentHistoryPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />
              <Route path="/notifications" element={<StudentNotificationsPage />} />
              <Route path="/settings" element={<StudentSettingsPage />} />

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Portal Routes */}
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/students" element={<AdminGuard><ManageStudentsPage /></AdminGuard>} />
              <Route path="/admin/students/new" element={<AdminGuard><AddStudentPage /></AdminGuard>} />
              <Route path="/admin/departments" element={<AdminGuard><AdminDepartmentsPage /></AdminGuard>} />
              <Route path="/admin/courses" element={<AdminGuard><AdminCoursesPage /></AdminGuard>} />
              <Route path="/admin/fees" element={<AdminGuard><ManageFeesPage /></AdminGuard>} />
              <Route path="/admin/payments" element={<AdminGuard><AdminPaymentsPage /></AdminGuard>} />
              <Route path="/admin/receipts" element={<AdminGuard><AdminPaymentsPage /></AdminGuard>} />
              <Route path="/admin/reports" element={<AdminGuard><AdminReportsPage /></AdminGuard>} />
              <Route path="/admin/notifications" element={<AdminGuard><AdminNotificationsPage /></AdminGuard>} />
              <Route path="/admin/support" element={<AdminGuard><AdminSupportPage /></AdminGuard>} />
              <Route path="/admin/website" element={<AdminGuard><AdminWebsitePage /></AdminGuard>} />
              <Route path="/admin/settings" element={<AdminGuard><AdminSettingsPage /></AdminGuard>} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
