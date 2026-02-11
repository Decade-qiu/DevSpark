"use client";

import { useState } from "react";
import AppShell from "../../src/components/AppShell";
import ThemeToggle from "../../src/components/ThemeToggle";
import ReaderEditor from "../../src/features/reader/ReaderEditor";
import { useArticles, type Article } from "../../src/hooks/useArticles";

export default function ReaderPage() {
  const { articles, loading, error } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Use the first article as default or the selected one
  const article = selectedArticle || articles[0];

  return (
    <AppShell
      toolbar={
        <>
          <div className="toolbar__brand">DevSpark</div>
          <div className="toolbar__actions">
            <select
              className="input"
              value={selectedArticle?.id || ""}
              onChange={(e) => {
                const found = articles.find((a) => a.id === e.target.value);
                setSelectedArticle(found || null);
              }}
              aria-label="Select article"
            >
              <option value="">Select an article...</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <ThemeToggle />
            <button className="button button--primary" type="button">
              Export
            </button>
          </div>
        </>
      }
      sidebar={
        <>
          <h3 className="panel__title">Article</h3>
          {loading ? (
            <p className="muted">Loading articles...</p>
          ) : error ? (
            <p className="muted error">{error}</p>
          ) : (
            <p className="muted">
              Keep the source visible while drafting and add citations with one
              click.
            </p>
          )}
          {article && (
            <div className="article-meta">
              <p className="muted"><strong>Source:</strong> {article.source}</p>
              <p className="muted"><strong>Published:</strong> {article.publishTime}</p>
            </div>
          )}
        </>
      }
      main={
        article ? (
          <ReaderEditor
            article={{
              title: article.title,
              content: article.content || article.summary,
              sourceUrl: `#article-${article.id}`,
            }}
          />
        ) : (
          <div className="empty-state">
            <p className="muted">
              {loading ? "Loading..." : "Select an article to start reading"}
            </p>
          </div>
        )
      }
      detail={
        <>
          <h3 className="panel__title">Draft notes</h3>
          <p className="muted">
            Capture key takeaways and convert them into a draft when ready.
          </p>
          <button className="button button--primary" type="button">
            Start draft
          </button>
        </>
      }
    />
  );
}
