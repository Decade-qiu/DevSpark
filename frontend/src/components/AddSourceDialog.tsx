'use client';

import React, { useState } from 'react';
import { validateSource, addSource } from '../lib/api';

interface AddSourceDialogProps {
    open: boolean;
    onClose: () => void;
    onAdded: () => void;
}

type Status = 'idle' | 'validating' | 'valid' | 'invalid' | 'adding' | 'added' | 'error';

export default function AddSourceDialog({ open, onClose, onAdded }: AddSourceDialogProps) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [feedTitle, setFeedTitle] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    if (!open) return null;

    const handleValidate = async () => {
        if (!url.trim()) return;
        setStatus('validating');
        setErrorMsg('');
        setFeedTitle('');

        try {
            const result = await validateSource(url.trim());
            if (result.valid && result.title) {
                setStatus('valid');
                setFeedTitle(result.title);
                if (!name.trim()) setName(result.title);
            } else {
                setStatus('invalid');
                setErrorMsg(result.error || 'Invalid RSS feed');
            }
        } catch {
            setStatus('invalid');
            setErrorMsg('Failed to validate URL');
        }
    };

    const handleAdd = async () => {
        if (!url.trim()) return;
        setStatus('adding');
        setErrorMsg('');

        try {
            const result = await addSource(url.trim(), name.trim() || undefined);
            if (result.success) {
                setStatus('added');
                setTimeout(() => {
                    handleClose();
                    onAdded();
                }, 800);
            } else {
                setStatus('error');
                setErrorMsg(result.error || 'Failed to add source');
            }
        } catch {
            setStatus('error');
            setErrorMsg('Failed to add source');
        }
    };

    const handleClose = () => {
        setUrl('');
        setName('');
        setFeedTitle('');
        setStatus('idle');
        setErrorMsg('');
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
    };

    const canAdd = status === 'valid' || url.trim().length > 0;

    return (
        <div className="dialog-overlay" onClick={handleClose} onKeyDown={handleKeyDown}>
            <div className="dialog" onClick={e => e.stopPropagation()} role="dialog" aria-label="Add RSS Source">
                <div className="dialog__header">
                    <h2 className="dialog__title">Add RSS Source</h2>
                    <button className="dialog__close" onClick={handleClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="dialog__body">
                    <div className="dialog__field">
                        <label className="dialog__label" htmlFor="source-url">Feed URL</label>
                        <div className="dialog__input-row">
                            <input
                                id="source-url"
                                className="dialog__input"
                                type="url"
                                value={url}
                                onChange={e => { setUrl(e.target.value); setStatus('idle'); }}
                                placeholder="https://example.com/feed.xml"
                                autoFocus
                            />
                            <button
                                className="btn btn--ghost btn--sm"
                                onClick={handleValidate}
                                disabled={!url.trim() || status === 'validating'}
                                type="button"
                            >
                                {status === 'validating' ? 'Checking...' : 'Check'}
                            </button>
                        </div>
                    </div>

                    {/* Validation result */}
                    {status === 'valid' && (
                        <div className="dialog__status dialog__status--success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Valid feed: {feedTitle}</span>
                        </div>
                    )}
                    {(status === 'invalid' || status === 'error') && (
                        <div className="dialog__status dialog__status--error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}
                    {status === 'added' && (
                        <div className="dialog__status dialog__status--success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Source added successfully!</span>
                        </div>
                    )}

                    <div className="dialog__field">
                        <label className="dialog__label" htmlFor="source-name">Display Name (optional)</label>
                        <input
                            id="source-name"
                            className="dialog__input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder={feedTitle || 'Auto-detected from feed'}
                        />
                    </div>
                </div>

                <div className="dialog__footer">
                    <button className="btn btn--ghost" onClick={handleClose} type="button">
                        Cancel
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={handleAdd}
                        disabled={!canAdd || status === 'adding' || status === 'added'}
                        type="button"
                    >
                        {status === 'adding' ? 'Adding...' : status === 'added' ? 'Added!' : 'Add Source'}
                    </button>
                </div>
            </div>
        </div>
    );
}
