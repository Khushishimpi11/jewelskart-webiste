/**
 * sessionInterceptor.ts
 * 
 * A fetch wrapper that intercepts 401 sessionRevoked responses
 * and automatically logs the user out on both Customer and Admin sides.
 */

/**
 * Customer session interceptor.
 * Call this instead of fetch() for authenticated customer API calls.
 */
export async function customerFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    try {
      const cloned = response.clone();
      const data = await cloned.json();
      if (data.sessionRevoked) {
        console.warn('🔒 Customer session revoked — logging out.');
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_storage');
        localStorage.removeItem('customer_user');
        // Store flag for App.tsx to show toast after redirect
        sessionStorage.setItem('session_expired', '1');
        window.dispatchEvent(new CustomEvent('customer_session_revoked'));
        window.location.href = '/';
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return response;
}


/**
 * Admin session interceptor.
 * Call this instead of fetch() for authenticated admin API calls.
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    try {
      const cloned = response.clone();
      const data = await cloned.json();
      if (data.sessionRevoked) {
        console.warn('🔒 Admin session revoked — logging out.');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('admin_session_revoked'));
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session_expired=1';
        }
      }
    } catch {
      // ignore JSON parse errors, return original response
    }
  }

  return response;
}
