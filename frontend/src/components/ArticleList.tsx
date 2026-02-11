'use client';

import React from 'react';

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

interface ArticleListProps {
    articles: Article[];
    selectedId: string | null;
    onSelect: (article: Article) => void;
    loading: boolean;
    title: string;
}

function formatTime(dateStr: string): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

export default function ArticleList({
    articles,
    selectedId,
    onSelect,
    loading,
    title,
}: ArticleListProps) {
    if (loading) {
        return (
            <div className="feed-list">
                <div className="feed-list__header">
                    <span className="feed-list__title">{title}</span>
                </div>
                <div className="feed-list__scroll">
                    {/* Skeleton loading items */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton-item">
                            <div className="skeleton-item__content">
                                <div className="skeleton skeleton-item__line skeleton-item__line--meta" />
                                <div className="skeleton skeleton-item__line skeleton-item__line--title" />
                                <div className="skeleton skeleton-item__line skeleton-item__line--summary" />
                                <div className="skeleton skeleton-item__line skeleton-item__line--summary" style={{ width: '60%' }} />
                            </div>
                            <div className="skeleton skeleton-item__thumb" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="feed-list">
            <div className="feed-list__header">
                <span className="feed-list__title">{title}</span>
                <span className="feed-list__count">{articles.length}</span>
            </div>
            <div className="feed-list__scroll">
                {articles.length === 0 ? (
                    <div className="feed-list__empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p>No articles found</p>
                    </div>
                ) : (
                    articles.map((article) => (
                        <div
                            key={article.id}
                            className={`feed-item ${selectedId === article.id ? 'feed-item--active' : ''} ${article.read ? 'feed-item--read' : ''}`}
                            onClick={() => onSelect(article)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSelect(article);
                                }
                            }}
                        >
                            {!article.read && <div className="feed-item__dot" />}
                            <div className="feed-item__body">
                                <div className="feed-item__meta">
                                    <span className="feed-item__source">{article.source}</span>
                                    <span className="feed-item__time">{formatTime(article.publishTime)}</span>
                                </div>
                                <h3 className="feed-item__title">{article.title}</h3>
                                <p className="feed-item__summary">{article.summary}</p>
                            </div>
                            {article.imageUrl && (
                                <div className="feed-item__thumb">
                                    <img src={article.imageUrl} alt="" loading="lazy" />
                                </div>
                            )}
                            {article.starred && (
                                <div className="feed-item__star">
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
