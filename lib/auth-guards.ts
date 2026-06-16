import { authClient } from './auth-client';

export type OnboardingStep =
  | 'splash'        // Not authenticated
  | 'phone'         // Not authenticated
  | 'otp'           // Verifying phone
  | 'username'      // Authenticated but no username
  | 'permissions'   // Has username but needs permissions
  | 'complete';     // Fully onboarded

export interface UserOnboardingState {
  isAuthenticated: boolean;
  hasUsername: boolean;
  hasPermissions: boolean;
  currentStep: OnboardingStep;
  shouldRedirect: boolean;
  redirectPath: string | null;
}

/**
 * Determines the user's current onboarding state and where they should be redirected
 */
export async function checkOnboardingState(user: any): Promise<UserOnboardingState> {
  // Not authenticated -> Start onboarding
  if (!user) {
    return {
      isAuthenticated: false,
      hasUsername: false,
      hasPermissions: false,
      currentStep: 'splash',
      shouldRedirect: true,
      redirectPath: '/onboarding/splash'
    };
  }

  // Authenticated but no username -> Username step
  if (!user.username) {
    return {
      isAuthenticated: true,
      hasUsername: false,
      hasPermissions: false,
      currentStep: 'username',
      shouldRedirect: true,
      redirectPath: '/onboarding/username'
    };
  }

  // Has username but no permissions check
  // Note: We can't check actual device permissions here, so we assume
  // if they have a username, they've completed permissions
  // You could add a 'permissionsGranted' field to the user schema if needed

  // Fully onboarded -> No redirect needed
  return {
    isAuthenticated: true,
    hasUsername: true,
    hasPermissions: true,
    currentStep: 'complete',
    shouldRedirect: false,
    redirectPath: null
  };
}

/**
 * Gets the user's session data using Better Auth
 */
export async function getUserSession() {
  try {
    const { data: session } = await authClient.getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Hook-like function to check if user should access a protected route
 */
export async function canAccessRoute(
  routePath: string,
  user: any
): Promise<{ canAccess: boolean; redirectTo: string | null }> {
  const state = await checkOnboardingState(user);

  // Onboarding routes - allow if not complete
  if (routePath.startsWith('/onboarding/')) {
    if (state.currentStep === 'complete') {
      return { canAccess: false, redirectTo: '/lobby' };
    }
    return { canAccess: true, redirectTo: null };
  }

  // Protected routes - require complete onboarding
  const protectedRoutes = ['/lobby', '/camera', '/feed', '/wrap', '/archive', '/gate'];
  if (protectedRoutes.some(route => routePath.startsWith(route))) {
    if (state.shouldRedirect) {
      return { canAccess: false, redirectTo: state.redirectPath };
    }
    return { canAccess: true, redirectTo: null };
  }

  // Allow all other routes
  return { canAccess: true, redirectTo: null };
}
