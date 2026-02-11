"use client";

import { useState, useMemo } from "react";
import AppShell from "../../src/components/AppShell";
import ThemeToggle from "../../src/components/ThemeToggle";
import FeedCard from "../../src/features/feed/FeedCard";
import { useArticles, type Article } from "../../src/hooks/useArticles";

export default function FeedPage() {
  const { articles, loading, error, refresh } = useArticles();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Derive unique sources
  const sources = useMemo(() => {
    return [...new Set(articles.map((a) => a.source))].filter(Boolean);
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (selectedSource) {
      result = result.filter((a) => a.source === selectedSource);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)
      );
    }

    return result;
  }, [articles, selectedSource, searchQuery]);

  // Format time helper
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Yesterday";
      return `${diffDays}d`;
    } catch {
      return dateStr;
    }
  };

  return (
    <AppShell
      toolbar={
        <>
          <div className="toolbar__brand">DevSpark</div>
          <div className="toolbar__actions">
            <input
              className="input toolbar__search"
              placeholder="Search articles"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ThemeToggle />
            <button
              className="button button--ghost"
              type="button"
              onClick={refresh}
            >
              Refresh
            </button>
          </div>
        </>
      }
      sidebar={
        <>
          <h3 className="panel__title">Sources</h3>
          <div className="list">
            <div
              className={`list__item ${!selectedSource ? "list__item--active" : ""}`}
              onClick={() => setSelectedSource(null)}
            >
              <span>All Sources</span>
              <span className="muted">{articles.length}</span>
            </div>
            {sources.map((source) => (
              <div
                key={source}
                className={`list__item ${selectedSource === source ? "list__item--active" : ""}`}
                onClick={() => setSelectedSource(source)}
              >
                <span>{source}</span>
                <span className="muted">
                  {articles.filter((a) => a.source === source).length}
                </span>
              </div>
            ))}
          </div>
        </>
      }
      main={
        <>
          <h3 className="panel__title">
            Feed {loading && <span className="muted">(Loading...)</span>}
          </h3>
          {error && <div className="error-message">{error}</div>}
          <div className="list">
            {filteredArticles.length === 0 && !loading ? (
              <div className="empty-state">
                <p className="muted">No articles found</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <FeedCard
                  key={article.id}
                  article={{
                    title: article.title,
                    summary: article.summary,
                    source: article.source,
                    time: formatTime(article.publishTime),
                  }}
                />
              ))
            )}
          </div>
        </>
      }
      detail={
        <>
          <h3 className="panel__title">Summary preview</h3>
          <p className="muted">
            Select an item to see the full summary, related notes, and draft
            actions.
          </p>
          <button className="button button--primary" type="button">
            Start draft
          </button>
        </>
      }
    />
  );
}
