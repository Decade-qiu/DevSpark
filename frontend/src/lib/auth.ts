const AUTH_TOKEN_KEY = 'devspark-auth-token';
const AUTH_USER_KEY = 'devspark-auth-user';

export interface User {
    id: string;
    email: string;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

// Get the current auth state
export function getAuthState(): AuthState {
    if (typeof window === 'undefined') {
        return { token: null, user: null, isAuthenticated: false };
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);

    let user: User | null = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch {
            // Invalid user data
        }
    }

    return {
        token,
        user,
        isAuthenticated: !!token && !!user,
    };
}

// Save auth credentials
export function saveAuth(token: string, user: User): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Clear auth credentials
export function clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

// Get the auth token
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return getAuthState().isAuthenticated;
}

// Logout
export function logout(): void {
    clearAuth();
    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}
