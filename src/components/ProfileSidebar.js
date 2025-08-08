'use client';

import { cn, getRandomColor } from '@/lib/utils';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

//Arrow icon
const ArrowIcon = ({ isCollapsed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-300 ${
      isCollapsed ? 'rotate-180' : ''
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

//Logout icon
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function ProfileSidebar({ user }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colorClass = getRandomColor(user.name || user.email);

  return (
    <aside
      className={cn(
        'relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex-1 p-4 overflow-hidden">
        <div className="flex items-center mb-8">
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0', colorClass)}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="ml-4 overflow-hidden">
              <p className="font-bold text-lg whitespace-nowrap truncate">{user.name || 'User'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap truncate">{user.email}</p>
            </div>
          )}
        </div>

        <nav>
          <ul>
            <li className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer">
              <a href="/user/profile" className="flex items-center">
                {!isCollapsed && <span className="ml-2 whitespace-nowrap">My Listings</span>}
              </a>
            </li>
            <li
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <div className="flex items-center">
                <span className="w-8 text-center"><LogoutIcon /></span>
                {!isCollapsed && <span className="ml-2 whitespace-nowrap">Logout</span>}
              </div>
            </li>
            {/* You can add more navigation links here */}
          </ul>
        </nav>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3.5 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ArrowIcon isCollapsed={isCollapsed} />
      </button>
    </aside>
  );
}
