'use client';

import { useState, useCallback, useEffect } from 'react';

interface LayoutState {
    sidebarCollapsed: boolean;
    sidebarHidden: boolean;
    readingMode: boolean;
    detailVisible: boolean;
}

const STORAGE_KEY = 'devspark-layout';

export function useLayout() {
    const [state, setState] = useState<LayoutState>({
        sidebarCollapsed: false,
        sidebarHidden: false,
        readingMode: false,
        detailVisible: false,
    });

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setState((prev) => ({
                    ...prev,
                    sidebarCollapsed: parsed.sidebarCollapsed || false,
                }));
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    // Keyboard shortcut for reading mode (Cmd/Ctrl + \)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
                e.preventDefault();
                toggleReadingMode();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleSidebarCollapsed = useCallback(() => {
        setState((prev) => {
            const newState = { ...prev, sidebarCollapsed: !prev.sidebarCollapsed };
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ sidebarCollapsed: newState.sidebarCollapsed }));
            return newState;
        });
    }, []);

    const toggleSidebarHidden = useCallback(() => {
        setState((prev) => ({ ...prev, sidebarHidden: !prev.sidebarHidden }));
    }, []);

    const toggleReadingMode = useCallback(() => {
        setState((prev) => ({ ...prev, readingMode: !prev.readingMode }));
    }, []);

    const showDetail = useCallback(() => {
        setState((prev) => ({ ...prev, detailVisible: true }));
    }, []);

    const hideDetail = useCallback(() => {
        setState((prev) => ({ ...prev, detailVisible: false }));
    }, []);

    const exitReadingMode = useCallback(() => {
        setState((prev) => ({ ...prev, readingMode: false }));
    }, []);

    return {
        ...state,
        toggleSidebarCollapsed,
        toggleSidebarHidden,
        toggleReadingMode,
        showDetail,
        hideDetail,
        exitReadingMode,
    };
}
