import React, { useState, useEffect } from 'react';
import { PrincipalDashboard } from './components/principal/PrincipalDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ContractManagement } from './components/admin/ContractManagement';
import { UserManagement } from './components/admin/UserManagement';
import { SystemSettings } from './components/admin/SystemSettings';
import { EvaluationForm } from './components/evaluation/EvaluationForm';
import { TeacherEvaluation } from './components/evaluation/TeacherEvaluation';
import { ReportScreen } from './components/reports/ReportScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { KPIInfo } from './components/kpi/KPIInfo';
import { KPICalculation } from './components/kpi/KPICalculation';
import { AttendanceSystem } from './components/attendance/AttendanceSystem';
import { ReEvaluationRequest } from './components/evaluation/ReEvaluationRequest';
import { TeacherList } from './components/teacher/TeacherList';
import { AddTeacher } from './components/teacher/AddTeacher';
import { KPIRequest } from './components/kpi/KPIRequest';
import { KPIApproval } from './components/kpi/KPIApproval';
import { ContractStatus } from './components/teacher/ContractStatus';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ThemeProvider } from './components/theme-provider';
import { User } from './services/api';

export type View = 'principal' | 'teacher' | 'admin' | 'admin-dashboard' | 'admin-users' | 'admin-settings' | 'admin-contracts' |
  'evaluation-form' | 'reports' | 'login' | 'kpi-info' | 'kpi-calculation' | 'attendance' |
  're-evaluation' | 'teacher-list' | 'teacher-evaluation' | 'add-teacher' | 'kpi-request' | 'my-contract' | 'principal-kpi-requests';

// Map backend roles to frontend role types
function mapBackendRole(role: string): 'principal' | 'teacher' | 'admin' {
  switch (role) {
    case 'hr_admin':
      return 'admin';
    case 'principal':
      return 'principal';
    case 'teacher':
    default:
      return 'teacher';
  }
}

// Get initial view based on user role
function getInitialView(role: string): View {
  switch (role) {
    case 'hr_admin':
      return 'admin-dashboard';
    case 'principal':
      return 'principal';
    case 'teacher':
    default:
      return 'teacher';
  }
}

function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('login');

  // Update view when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentView(getInitialView(user.role));
    } else if (!isLoading && !isAuthenticated) {
      setCurrentView('login');
    }
  }, [isAuthenticated, user, isLoading]);

  const handleLogout = async () => {
    await logout();
    setCurrentView('login');
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  const userRole = mapBackendRole(user.role);
  const userName = user.name;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {currentView === 'principal' && (
        <PrincipalDashboard onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} />
      )}
      {currentView === 'teacher' && (
        <TeacherDashboard onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} />
      )}
      {currentView === 'kpi-request' && (
        <KPIRequest onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'teacher'} />
      )}
      {currentView === 'my-contract' && (
        <ContractStatus onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'teacher'} />
      )}
      {(currentView === 'admin' || currentView === 'admin-dashboard') && (
        <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} />
      )}
      {currentView === 'admin-users' && (
        <UserManagement onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'admin'} />
      )}
      {currentView === 'admin-settings' && (
        <SystemSettings onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'admin'} />
      )}
      {currentView === 'admin-contracts' && (
        <ContractManagement onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'admin'} />
      )}
      {currentView === 'evaluation-form' && (
        <EvaluationForm onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} />
      )}
      {currentView === 'reports' && (
        <ReportScreen onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 'kpi-info' && (
        <KPIInfo onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 'kpi-calculation' && (
        <KPICalculation onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 'attendance' && (
        <AttendanceSystem onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 're-evaluation' && (
        <ReEvaluationRequest onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 'teacher-list' && (
        <TeacherList onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 'add-teacher' && (
        <AddTeacher onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole} />
      )}
      {currentView === 'teacher-evaluation' && (
        <TeacherEvaluation onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'principal' | 'admin'} />
      )}
      {currentView === 'principal-kpi-requests' && (
        <KPIApproval onNavigate={handleNavigate} onLogout={handleLogout} userName={userName} userRole={userRole as 'principal'} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}