'use client';

import React, { useMemo } from 'react';
import type { Article } from './ArticleList';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    activeItem: string;
    onItemClick: (id: string) => void;
    feedSources: string[];
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onAddSource?: () => void;
    className?: string;
    articles?: Article[];
}

const SmartFeedIcons = {
    today: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    unread: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" /><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        </svg>
    ),
    starred: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
};

const SmartFeedColors: Record<string, string> = {
    today: '#ff9f0a',
    unread: '#0a84ff',
    starred: '#ffd60a',
};

const SmartFeedLabels: Record<string, string> = {
    today: 'Today',
    unread: 'All Unread',
    starred: 'Starred',
};

export default function Sidebar({
    activeItem,
    onItemClick,
    feedSources,
    collapsed = false,
    onToggleCollapse,
    onAddSource,
    className = '',
    articles = [],
}: SidebarProps) {
    const counts = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayUnread = articles.filter(a => {
            if (a.read) return false;
            try {
                return new Date(a.publishTime) >= todayStart;
            } catch {
                return false;
            }
        }).length;

        const allUnread = articles.filter(a => !a.read).length;
        const starred = articles.filter(a => a.starred).length;

        const perSource: Record<string, number> = {};
        for (const a of articles) {
            if (!a.read) {
                perSource[a.source] = (perSource[a.source] || 0) + 1;
            }
        }

        return { today: todayUnread, unread: allUnread, starred, perSource };
    }, [articles]);

    const smartFeedIds = ['today', 'unread', 'starred'] as const;

    return (
        <div className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${className}`}>
            {/* Header: just brand */}
            <div className="sidebar__header">
                {!collapsed && <span className="sidebar__brand">DevSpark</span>}
                {collapsed && (
                    <button
                        className="sidebar__btn"
                        title="Expand sidebar"
                        onClick={onToggleCollapse}
                        aria-label="Expand sidebar"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Scrollable feed list */}
            <div className="sidebar__scroll">
                {!collapsed && <div className="sidebar__section">Smart Feeds</div>}
                {smartFeedIds.map(id => {
                    const count = counts[id];
                    return (
                        <div
                            key={id}
                            className={`sidebar__item ${activeItem === id ? 'sidebar__item--active' : ''}`}
                            onClick={() => onItemClick(id)}
                            title={collapsed ? SmartFeedLabels[id] : undefined}
                        >
                            <span className="sidebar__icon" style={{ color: activeItem === id ? undefined : SmartFeedColors[id] }}>
                                {SmartFeedIcons[id]}
                            </span>
                            {!collapsed && <span>{SmartFeedLabels[id]}</span>}
                            {!collapsed && count > 0 && (
                                <span className="sidebar__count sidebar__badge">{count}</span>
                            )}
                        </div>
                    );
                })}

                {!collapsed && (
                    <div className="sidebar__section">
                        <span>Feeds</span>
                        {onAddSource && (
                            <button
                                className="sidebar__section-btn"
                                onClick={onAddSource}
                                title="Add RSS source"
                                aria-label="Add RSS source"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                {feedSources.map(source => {
                    const unreadCount = counts.perSource[source] || 0;
                    return (
                        <div
                            key={source}
                            className={`sidebar__item ${activeItem === source ? 'sidebar__item--active' : ''}`}
                            onClick={() => onItemClick(source)}
                            title={collapsed ? source : undefined}
                        >
                            <span className="sidebar__icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" />
                                    <circle cx="5" cy="19" r="1" />
                                </svg>
                            </span>
                            {!collapsed && <span>{source}</span>}
                            {!collapsed && unreadCount > 0 && (
                                <span className="sidebar__count sidebar__badge">{unreadCount}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer: utility buttons pinned to bottom */}
            <div className="sidebar__footer">
                {!collapsed ? (
                    <>
                        <ThemeToggle />
                        <button
                            className="sidebar__btn"
                            title="Refresh feeds"
                            onClick={() => window.location.reload()}
                            aria-label="Refresh feeds"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                        </button>
                        <button
                            className="sidebar__btn"
                            title="Collapse sidebar"
                            onClick={onToggleCollapse}
                            aria-label="Collapse sidebar"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="sidebar__btn"
                            title="Refresh feeds"
                            onClick={() => window.location.reload()}
                            aria-label="Refresh feeds"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
