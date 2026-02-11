const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export interface Article {
    id: string;
    title: string;
    summary: string;
    source: string;
    publishTime: string;
    content: string;
    imageUrl?: string;
    starred: boolean;
    read: boolean;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export interface ImportResult {
    imported: number;
    failed: number;
    sources: string[];
}

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('devspark-auth-token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new ApiError(response.status, errorText);
    }

    return response;
}

export async function fetchArticles(sourceId?: string): Promise<Article[]> {
    const url = sourceId ? `/api/articles?sourceId=${encodeURIComponent(sourceId)}` : '/api/articles';
    const response = await fetchWithAuth(url);
    const data = await response.json();

    // Map backend response to frontend Article interface
    const items = data.items || data || [];
    return items.map((a: Record<string, unknown>, idx: number) => ({
        id: (a.id as string) || `article-${idx}`,
        title: (a.title as string) || 'Untitled',
        summary: (a.summary as string) || '',
        source: (a.source as string) || 'Unknown',
        publishTime: (a.publishTime as string) || '',
        content: (a.content as string) || (a.summary as string) || '',
        imageUrl: (a.imageUrl as string) || '',
        starred: false,
        read: false,
    }));
}

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
    const response = await fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const response = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export async function importOpml(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('devspark-auth-token') : null;

    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/api/sources/import-opml`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Import failed');
        throw new ApiError(response.status, errorText);
    }

    return response.json();
}

export async function fetchSources(): Promise<string[]> {
    const response = await fetchWithAuth('/api/sources');
    const data = await response.json();
    return data.sources || data || [];
}

export interface ValidateSourceResult {
    valid: boolean;
    title?: string;
    error?: string;
}

export async function validateSource(url: string): Promise<ValidateSourceResult> {
    const response = await fetchWithAuth('/api/sources/validate', {
        method: 'POST',
        body: JSON.stringify({ url }),
    });
    return response.json();
}

export interface AddSourceResult {
    success: boolean;
    name?: string;
    error?: string;
}

export async function addSource(url: string, name?: string): Promise<AddSourceResult> {
    const response = await fetchWithAuth('/api/sources', {
        method: 'POST',
        body: JSON.stringify({ url, name }),
    });
    return response.json();
}

export async function removeSource(name: string): Promise<{ success: boolean }> {
    const response = await fetchWithAuth('/api/sources', {
        method: 'DELETE',
        body: JSON.stringify({ name }),
    });
    return response.json();
}
