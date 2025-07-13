'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
                  <p className="text-gray-600 mb-6">You're logged in as {user?.email}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-800">Your Profile</h3>
                      <p className="mt-2 text-blue-600">View and update your profile information</p>
                      <div className="mt-4">
                        <Link 
                          href="/profile"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Profile →
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-green-800">Settings</h3>
                      <p className="mt-2 text-green-600">Configure your account settings</p>
                      <div className="mt-4">
                        <Link 
                          href="/settings"
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Go to Settings →
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-purple-800">Quick Actions</h3>
                      <p className="mt-2 text-purple-600">Access common tasks and features</p>
                      <div className="mt-4">
                        <Link 
                          href="/actions"
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          View Actions →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
