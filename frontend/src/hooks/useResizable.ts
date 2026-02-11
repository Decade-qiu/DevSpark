'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseResizableOptions {
    initialWidth: number;
    minWidth: number;
    maxWidth: number;
    storageKey?: string;
}

interface UseResizableResult {
    width: number;
    handleResize: (delta: number) => void;
    resetWidth: () => void;
}

export function useResizable({
    initialWidth,
    minWidth,
    maxWidth,
    storageKey,
}: UseResizableOptions): UseResizableResult {
    const [width, setWidth] = useState(initialWidth);

    // Load from localStorage on mount
    useEffect(() => {
        if (storageKey) {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = parseInt(stored, 10);
                if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
                    setWidth(parsed);
                }
            }
        }
    }, [storageKey, minWidth, maxWidth]);

    const handleResize = useCallback((delta: number) => {
        setWidth((prev) => {
            const newWidth = Math.min(maxWidth, Math.max(minWidth, prev + delta));
            if (storageKey) {
                localStorage.setItem(storageKey, String(newWidth));
            }
            return newWidth;
        });
    }, [minWidth, maxWidth, storageKey]);

    const resetWidth = useCallback(() => {
        setWidth(initialWidth);
        if (storageKey) {
            localStorage.removeItem(storageKey);
        }
    }, [initialWidth, storageKey]);

    return { width, handleResize, resetWidth };
}

// Hook for managing multiple resizable panels
interface PanelSizes {
    sidebar: number;
    feedList: number;
}

const DEFAULT_SIZES: PanelSizes = {
    sidebar: 220,
    feedList: 340,
};

const MIN_SIZES: PanelSizes = {
    sidebar: 160,
    feedList: 260,
};

const MAX_SIZES: PanelSizes = {
    sidebar: 320,
    feedList: 500,
};

export function usePanelSizes() {
    const [sizes, setSizes] = useState<PanelSizes>(DEFAULT_SIZES);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('devspark-panel-sizes');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSizes({
                    sidebar: Math.min(MAX_SIZES.sidebar, Math.max(MIN_SIZES.sidebar, parsed.sidebar || DEFAULT_SIZES.sidebar)),
                    feedList: Math.min(MAX_SIZES.feedList, Math.max(MIN_SIZES.feedList, parsed.feedList || DEFAULT_SIZES.feedList)),
                });
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    const resizeSidebar = useCallback((delta: number) => {
        setSizes((prev) => {
            const newSidebar = Math.min(MAX_SIZES.sidebar, Math.max(MIN_SIZES.sidebar, prev.sidebar + delta));
            const newSizes = { ...prev, sidebar: newSidebar };
            localStorage.setItem('devspark-panel-sizes', JSON.stringify(newSizes));
            return newSizes;
        });
    }, []);

    const resizeFeedList = useCallback((delta: number) => {
        setSizes((prev) => {
            const newFeedList = Math.min(MAX_SIZES.feedList, Math.max(MIN_SIZES.feedList, prev.feedList + delta));
            const newSizes = { ...prev, feedList: newFeedList };
            localStorage.setItem('devspark-panel-sizes', JSON.stringify(newSizes));
            return newSizes;
        });
    }, []);

    const resetSizes = useCallback(() => {
        setSizes(DEFAULT_SIZES);
        localStorage.removeItem('devspark-panel-sizes');
    }, []);

    return {
        sizes,
        resizeSidebar,
        resizeFeedList,
        resetSizes,
        minSizes: MIN_SIZES,
        maxSizes: MAX_SIZES,
    };
}
