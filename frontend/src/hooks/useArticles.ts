'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchArticles as apiFetchArticles, type Article, ApiError } from '../lib/api';

interface UseArticlesResult {
    articles: Article[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

export function useArticles(sourceId?: string): UseArticlesResult {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetchArticles(sourceId);
            setArticles(data);
        } catch (e) {
            if (e instanceof ApiError) {
                setError(`Error ${e.status}: ${e.message}`);
            } else if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Failed to fetch articles');
            }
            console.error('Failed to fetch articles:', e);
        } finally {
            setLoading(false);
        }
    }, [sourceId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { articles, loading, error, refresh, setArticles };
}

// Re-export Article type for convenience
export type { Article } from '../lib/api';
