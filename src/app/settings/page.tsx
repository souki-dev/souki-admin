'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'app', name: 'App Settings', icon: Cog6ToothIcon },
    { id: 'about', name: 'About', icon: InformationCircleIcon },
  ];

  return (
    <AuthGuard>
      <Navigation>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and application settings</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex">
              {/* Sidebar */}
              <nav className="w-64 bg-gray-50 border-r border-gray-200">
                <div className="p-4 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Content */}
              <div className="flex-1 p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || user.email}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {user?.displayName || 'Admin User'}
                          </h3>
                          <p className="text-gray-600">{user?.email}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Administrator
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={user?.displayName || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            disabled
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Profile information is managed through your authentication provider
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            disabled
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            User ID
                          </label>
                          <input
                            type="text"
                            value={user?.uid || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                            disabled
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <input
                            type="text"
                            value="Administrator"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                              Authentication Provider
                            </h3>
                            <p className="text-sm text-blue-700 mt-1">
                              Your account security is managed by Firebase Authentication. 
                              To change your password or enable two-factor authentication, 
                              please use your authentication provider&apos;s settings.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Admin Access</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-gray-900">Administrator privileges enabled</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            You have full access to all admin panel features
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Session Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Sign In:</span>
                            <span className="text-gray-900">Current session</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Authentication Method:</span>
                            <span className="text-gray-900">
                              {user?.email?.includes('gmail.com') ? 'Google' : 'Email/Password'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'app' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Environment</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Firebase Project:</span>
                              <span className="text-gray-900 font-mono">
                                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not configured'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Environment:</span>
                              <span className="text-gray-900">
                                {process.env.NODE_ENV || 'development'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">App Version:</span>
                              <span className="text-gray-900">1.0.0</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">Article Management</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">Media Upload</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">Rich Text Editor</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">Firebase Storage</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About Souki Admin</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Application Info</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Version:</span>
                            <span className="text-gray-900">1.0.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Framework:</span>
                            <span className="text-gray-900">Next.js 15</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Backend:</span>
                            <span className="text-gray-900">Firebase</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">UI Library:</span>
                            <span className="text-gray-900">Tailwind CSS</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Article management with rich text editing</li>
                          <li>• Photo and video library management</li>
                          <li>• Firebase Authentication integration</li>
                          <li>• Real-time data synchronization</li>
                          <li>• Responsive design for mobile and desktop</li>
                          <li>• Content visibility controls</li>
                          <li>• Tag and category organization</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Technology Stack</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Frontend</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>React 19</li>
                              <li>Next.js 15</li>
                              <li>TypeScript</li>
                              <li>Tailwind CSS</li>
                              <li>Headless UI</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Backend</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>Firebase Auth</li>
                              <li>Firestore Database</li>
                              <li>Firebase Storage</li>
                              <li>Cloud Functions</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Navigation>
    </AuthGuard>
  );
}
