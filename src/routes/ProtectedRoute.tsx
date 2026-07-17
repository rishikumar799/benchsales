import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, dbRoleToAppRole } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const isValidOrgId = (id: any): boolean => {
  return typeof id === 'string' && id !== 'undefined' && id.trim() !== '';
};

const rolesRequiringOrg = [
  'organization_admin',
  'placement_officer',
  'student',
  'company_admin',
  'company_recruiter',
  'company_manager',
  'employee'
];

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, loading, profileError, logout } = useAuth() as any;

  if (profileError) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
        <div className="max-w-md w-full bg-slate-800 border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white">System Loading Error</h2>
            <p className="text-sm text-slate-400 font-medium">Your profile or organization context could not be resolved.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-xs text-red-400 font-mono break-words text-left">
            {profileError}
          </div>
          <button
            onClick={async () => {
              try {
                await logout();
              } catch (err) {
                console.error("Logout failed during error state recovery:", err);
              }
            }}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/30 transition-all duration-150 text-sm cursor-pointer"
          >
            Sign Out & Return
          </button>
        </div>
      </div>
    );
  }

  const isOrgRole = userProfile && rolesRequiringOrg.includes(userProfile.role);
  const isOrgIdPending = isOrgRole && !isValidOrgId(userProfile.organizationId);

  if (loading || isOrgIdPending) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isOrgIdPending ? "Resolving organization workspace..." : "Loading your secure workspace..."}
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
    const currentAppRole = dbRoleToAppRole(userProfile.role);
    
    if (!allowedRoles.includes(currentAppRole)) {
      // Role not allowed - redirect to home page or their dedicated dashboard
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
