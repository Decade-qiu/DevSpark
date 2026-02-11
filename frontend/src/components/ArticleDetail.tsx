'use client';

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Article } from './ArticleList';

interface ArticleDetailProps {
    article: Article | null;
    onToggleStar: (article: Article) => void;
    onBack?: () => void;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

// Detect if content is HTML (has tags) vs plain text / markdown
function isHtmlContent(content: string): boolean {
    // Check for common HTML tags
    return /<(?:p|div|span|h[1-6]|ul|ol|li|table|br|img|a|blockquote|pre|code|figure|section|article)\b/i.test(content);
}

// Configure DOMPurify
const purifyConfig = {
    ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins',
        'img', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'section', 'article',
        'video', 'audio', 'source',
        'iframe',
    ],
    ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id',
        'width', 'height', 'style',
        'target', 'rel',
        'controls', 'autoplay', 'muted', 'loop', 'poster',
        'frameborder', 'allowfullscreen', 'allow',
        'loading',
    ],
    ADD_ATTR: ['target'],
    ALLOW_DATA_ATTR: false,
};

export default function ArticleDetail({ article, onToggleStar, onBack }: ArticleDetailProps) {
    // Determine content to render and whether it's HTML
    const { renderedHtml, isMarkdown } = useMemo(() => {
        const rawContent = article?.content || article?.summary || '';
        if (!rawContent) return { renderedHtml: '', isMarkdown: false };

        const htmlDetected = isHtmlContent(rawContent);

        if (htmlDetected) {
            // It's HTML content — sanitize it
            if (typeof window === 'undefined') return { renderedHtml: rawContent, isMarkdown: false };

            DOMPurify.addHook('afterSanitizeAttributes', (node) => {
                if (node.tagName === 'A') {
                    node.setAttribute('target', '_blank');
                    node.setAttribute('rel', 'noopener noreferrer');
                }
                if (node.tagName === 'IMG') {
                    node.setAttribute('loading', 'lazy');
                }
            });

            const clean = DOMPurify.sanitize(rawContent, purifyConfig);
            DOMPurify.removeHook('afterSanitizeAttributes');

            return { renderedHtml: clean, isMarkdown: false };
        }

        // Not HTML — treat as markdown
        return { renderedHtml: rawContent, isMarkdown: true };
    }, [article?.content, article?.summary]);

    if (!article) {
        return (
            <div className="detail">
                <div className="detail__toolbar">
                    <div className="toolbar-group" />
                    <div className="toolbar-group" />
                </div>
                <div className="detail__empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p>Select an article to read</p>
                    <span className="detail__hint">Use j/k keys to navigate</span>
                </div>
            </div>
        );
    }

    return (
        <div className="detail">
            <div className="detail__toolbar">
                <div className="toolbar-group">
                    {onBack && (
                        <button
                            className="toolbar-btn"
                            onClick={onBack}
                            title="Back to list"
                            aria-label="Back to list"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    )}
                    <button
                        className={`toolbar-btn ${article.starred ? 'toolbar-btn--accent' : ''}`}
                        onClick={() => onToggleStar(article)}
                        title={article.starred ? 'Remove from starred' : 'Add to starred'}
                        aria-label={article.starred ? 'Remove from starred' : 'Add to starred'}
                    >
                        <svg viewBox="0 0 24 24" fill={article.starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>
                    <button
                        className="toolbar-btn"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: article.title, text: article.summary });
                            } else {
                                navigator.clipboard.writeText(article.title);
                            }
                        }}
                        title="Share"
                        aria-label="Share article"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                </div>
                <div className="toolbar-group">
                    <button
                        className="toolbar-btn"
                        onClick={() => window.print()}
                        title="Print"
                        aria-label="Print article"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="detail__content">
                <article className="reader">
                    <header className="reader__header">
                        <div className="reader__source">
                            <span className="reader__source-icon">
                                {article.source.charAt(0).toUpperCase()}
                            </span>
                            <span>{article.source}</span>
                        </div>
                        <h1 className="reader__title">{article.title}</h1>
                        <time className="reader__date" dateTime={article.publishTime}>
                            {formatDate(article.publishTime)}
                        </time>
                    </header>
                    {article.imageUrl && (
                        <figure className="reader__hero">
                            <img src={article.imageUrl} alt="" loading="lazy" />
                        </figure>
                    )}
                    <div className="reader__body">
                        {isMarkdown ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    a: ({ children, href, ...props }) => (
                                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                                            {children}
                                        </a>
                                    ),
                                    img: ({ src, alt, ...props }) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={src} alt={alt || ''} loading="lazy" {...props} />
                                    ),
                                }}
                            >
                                {renderedHtml}
                            </ReactMarkdown>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: renderedHtml || `<p>${article.summary}</p>` }} />
                        )}
                    </div>
                    <div className="reader__footer">
                        <a
                            href={article.id}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="reader__original-link"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Read original article
                        </a>
                    </div>
                </article>
            </div>
        </div>
    );
}
