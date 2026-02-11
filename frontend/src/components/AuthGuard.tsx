'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthState, type AuthState } from '../lib/auth';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const state = getAuthState();
        setAuthState(state);
        setChecking(false);

        if (!state.isAuthenticated) {
            router.push('/login');
        }
    }, [router]);

    if (checking) {
        return fallback || (
            <div className="auth-loading">
                <div className="spinner" />
                <span>Loading...</span>
            </div>
        );
    }

    if (!authState?.isAuthenticated) {
        return fallback || null;
    }

    return <>{children}</>;
}

// Hook to get auth state
export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>(() => getAuthState());

    useEffect(() => {
        // Re-check auth state on mount
        setAuthState(getAuthState());

        // Listen for storage changes (e.g., logout in another tab)
        const handleStorageChange = () => {
            setAuthState(getAuthState());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return authState;
}
