'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import AuthGuard from '../src/components/AuthGuard';
import Sidebar from '../src/components/Sidebar';
import ArticleList from '../src/components/ArticleList';
import ArticleDetail from '../src/components/ArticleDetail';
import { useArticles, type Article } from '../src/hooks/useArticles';
import { useLayout } from '../src/hooks/useLayout';
import { usePanelSizes } from '../src/hooks/useResizable';
import ResizeHandle from '../src/components/ResizeHandle';
import AddSourceDialog from '../src/components/AddSourceDialog';
import { importOpml } from '../src/lib/api';

export default function HomePage() {
    const { articles, loading, error, setArticles, refresh } = useArticles();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [activeNav, setActiveNav] = useState('today');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<string | null>(null);
    const [addSourceOpen, setAddSourceOpen] = useState(false);

    const {
        sidebarCollapsed,
        readingMode,
        toggleSidebarCollapsed,
        toggleReadingMode,
        exitReadingMode,
    } = useLayout();

    const { sizes, resizeSidebar, resizeFeedList } = usePanelSizes();

    // Derive unique sources for the sidebar
    const feedSources = useMemo(() => {
        return [...new Set(articles.map(a => a.source))].filter(Boolean);
    }, [articles]);

    // Filter articles based on active nav and search
    const filteredArticles = useMemo(() => {
        let result = articles;

        // Filter by source if a specific feed is selected
        if (activeNav !== 'today' && activeNav !== 'unread' && activeNav !== 'starred') {
            result = result.filter(a => a.source === activeNav);
        }

        // Filter unread
        if (activeNav === 'unread') {
            result = result.filter(a => !a.read);
        }

        // Filter starred
        if (activeNav === 'starred') {
            result = result.filter(a => a.starred);
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.source.toLowerCase().includes(q)
            );
        }

        return result;
    }, [articles, activeNav, searchQuery]);

    // Get display title for the feed list
    const listTitle = useMemo(() => {
        if (activeNav === 'today') return 'Today';
        if (activeNav === 'unread') return 'All Unread';
        if (activeNav === 'starred') return 'Starred';
        return activeNav;
    }, [activeNav]);

    // Unread count
    const unreadCount = useMemo(() => articles.filter(a => !a.read).length, [articles]);

    const handleSelectArticle = useCallback((article: Article) => {
        // Mark as read
        setArticles(prev =>
            prev.map(a => (a.id === article.id ? { ...a, read: true } : a))
        );
        setSelectedArticle({ ...article, read: true });
        // Update selected index
        const idx = filteredArticles.findIndex(a => a.id === article.id);
        if (idx !== -1) setSelectedIndex(idx);
    }, [setArticles, filteredArticles]);

    const handleToggleStar = useCallback((article: Article) => {
        setArticles(prev =>
            prev.map(a => (a.id === article.id ? { ...a, starred: !a.starred } : a))
        );
        setSelectedArticle(prev =>
            prev && prev.id === article.id ? { ...prev, starred: !prev.starred } : prev
        );
    }, [setArticles]);

    const handleToggleRead = useCallback((article: Article) => {
        setArticles(prev =>
            prev.map(a => (a.id === article.id ? { ...a, read: !a.read } : a))
        );
        setSelectedArticle(prev =>
            prev && prev.id === article.id ? { ...prev, read: !prev.read } : prev
        );
    }, [setArticles]);

    const handleNavClick = (id: string) => {
        setActiveNav(id);
        setSelectedArticle(null);
        setSelectedIndex(0);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't handle if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case 'j': // Next article
                    e.preventDefault();
                    if (filteredArticles.length > 0) {
                        const nextIndex = Math.min(selectedIndex + 1, filteredArticles.length - 1);
                        setSelectedIndex(nextIndex);
                        handleSelectArticle(filteredArticles[nextIndex]);
                    }
                    break;

                case 'k': // Previous article
                    e.preventDefault();
                    if (filteredArticles.length > 0) {
                        const prevIndex = Math.max(selectedIndex - 1, 0);
                        setSelectedIndex(prevIndex);
                        handleSelectArticle(filteredArticles[prevIndex]);
                    }
                    break;

                case 'o': // Open article
                case 'Enter':
                    if (filteredArticles.length > 0 && !selectedArticle) {
                        e.preventDefault();
                        handleSelectArticle(filteredArticles[selectedIndex]);
                    }
                    break;

                case 's': // Star/unstar
                    e.preventDefault();
                    if (selectedArticle) {
                        handleToggleStar(selectedArticle);
                    }
                    break;

                case 'm': // Toggle read/unread
                    e.preventDefault();
                    if (selectedArticle) {
                        handleToggleRead(selectedArticle);
                    }
                    break;

                case 'r': // Refresh
                    if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        refresh();
                    }
                    break;

                case 'Escape':
                    if (readingMode) {
                        exitReadingMode();
                    }
                    break;

                case '/': // Focus search
                    if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        document.querySelector<HTMLInputElement>('.search-box input')?.focus();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [filteredArticles, selectedIndex, selectedArticle, readingMode, handleSelectArticle, handleToggleStar, handleToggleRead, refresh, exitReadingMode]);

    // OPML import handler
    const handleOpmlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportStatus('Importing...');

        try {
            const result = await importOpml(file);
            setImportStatus(`Imported ${result.imported} sources`);
            setTimeout(() => setImportStatus(null), 3000);
            refresh();
        } catch (err) {
            setImportStatus('Import failed');
            setTimeout(() => setImportStatus(null), 3000);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AuthGuard>
        <div className={`app ${readingMode ? 'app--reading-mode' : ''}`}>
            {readingMode && (
                <button className="reading-mode-exit" onClick={exitReadingMode}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Exit Reading Mode
                    <span className="reading-mode-exit__shortcut">⌘\</span>
                </button>
            )}

            <Sidebar
                activeItem={activeNav}
                onItemClick={handleNavClick}
                feedSources={feedSources}
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapsed}
                onAddSource={() => setAddSourceOpen(true)}
                className={readingMode ? 'sidebar--hidden' : ''}
                articles={articles}
            />

            {!readingMode && (
                <ResizeHandle onResize={resizeSidebar} />
            )}

            <div style={{
                width: sidebarCollapsed ? undefined : sizes.feedList,
                minWidth: sidebarCollapsed ? undefined : sizes.feedList,
                height: '100%',
                overflow: 'hidden',
            }}>
                <ArticleList
                    articles={filteredArticles}
                    selectedId={selectedArticle?.id || null}
                    onSelect={handleSelectArticle}
                    loading={loading}
                    title={listTitle}
                />
            </div>

            {!readingMode && (
                <ResizeHandle onResize={resizeFeedList} />
            )}

            <ArticleDetail
                article={selectedArticle}
                onToggleStar={handleToggleStar}
            />

            {/* Hidden OPML file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".opml,.xml"
                onChange={handleOpmlImport}
                style={{ display: 'none' }}
                aria-hidden="true"
            />

            {/* Import status toast */}
            {importStatus && (
                <div className="toast">
                    {importStatus}
                </div>
            )}

            <AddSourceDialog
                open={addSourceOpen}
                onClose={() => setAddSourceOpen(false)}
                onAdded={() => refresh()}
            />
        </div>
        </AuthGuard>
    );
}
