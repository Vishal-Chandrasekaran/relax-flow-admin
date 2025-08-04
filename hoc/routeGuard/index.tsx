'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from '@/store/store';

/**
 * RouteGuard Component for Next.js 15
 * - Wraps children and enforces authentication for private routes
 * - Redirects unauthenticated users to /login
 * - Handles public/private route distinction
 * - Includes error handling
 *
 * Usage (in layout.tsx or any component):
 *
 * <RouteGuard>
 *   {children}
 * </RouteGuard>
 *
 * // For a public route:
 * <RouteGuard isPublic>
 *   {children}
 * </RouteGuard>
 */

export type RouteGuardProps = {
  children: React.ReactNode;
  isPublic?: boolean;
};

export function RouteGuard({children, isPublic = false}: RouteGuardProps) {
  const router = useRouter();
  // Determine if the current route is public or private based on pathname
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const privateRoutes = [
    '/',
    '/dashboard',
    '/profile',
    '/settings',
    '/music',
    '/owners',
    '/products',
    '/users'
  ];

  // Get current pathname from Next.js router
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';

  // If isPublic prop is not explicitly set, determine it based on the route
  if (typeof isPublic === 'undefined' || isPublic === false) {
    if (publicRoutes.includes(pathname)) {
      isPublic = true;
    } else if (privateRoutes.includes(pathname)) {
      isPublic = false;
    }
    // If not found in either, default to private (could be adjusted as needed)
  }
  useEffect(() => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // If route is public (e.g., /login) and user is authenticated, redirect to private route ("/")
      if (isPublic && token) {
        router.replace('/');
        return;
      }
      // If route is private and user is not authenticated, redirect to /login
      if (!isPublic && !token) {
        router.replace('/login');
        return;
      }
      // else: correct access, allow
    } catch (err) {
      // Error accessing localStorage or other unexpected error
      // Optionally log error for debugging
      // console.error('Route guard error:', err);
      router.replace('/login');
    }
  }, [isPublic, router]);

  // Optionally, you could render a loading state while checking auth
  // For now, just render children (redirect will occur if unauthenticated)
  return <Provider store={store}>{children}</Provider>;
}
