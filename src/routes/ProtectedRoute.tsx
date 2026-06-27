import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading your secure workspace...
        </p>
      </div>
    );
  }

  // If not signed in
  if (!user && !userProfile) {
    return <Navigate to="/auth" replace />;
  }

  // If role-based route, verify matching roles
  if (allowedRoles && userProfile) {
    const { dbRoleToAppRole } = useAuth();
    const currentAppRole = dbRoleToAppRole(userProfile.role);
    
    if (!allowedRoles.includes(currentAppRole)) {
      // Role not allowed - redirect to home page or their dedicated dashboard
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
