'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MobileNavProps {
    isOpen: boolean;
    onToggle: () => void;
    title: string;
    children?: React.ReactNode;
    actions?: React.ReactNode;
}

export default function MobileNav({ isOpen, onToggle, title, children, actions }: MobileNavProps) {
    const previousBodyOverflow = useRef<string | null>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onToggle();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onToggle]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (!isOpen) {
            if (previousBodyOverflow.current !== null) {
                document.body.style.overflow = previousBodyOverflow.current;
                previousBodyOverflow.current = null;
            }
            return;
        }

        if (previousBodyOverflow.current === null) {
            previousBodyOverflow.current = document.body.style.overflow;
        }
        document.body.style.overflow = 'hidden';

        return () => {
            if (previousBodyOverflow.current !== null) {
                document.body.style.overflow = previousBodyOverflow.current;
                previousBodyOverflow.current = null;
            }
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Header */}
            <div className="mobile-header">
                <button
                    className="mobile-header__menu"
                    type="button"
                    onClick={onToggle}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                        {isOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
                <span className="mobile-header__title">{title}</span>
                <div className="mobile-header__actions">
                    {actions}
                </div>
            </div>

            {/* Overlay */}
            <button
                className={`mobile-overlay ${isOpen ? 'mobile-overlay--visible' : ''}`}
                type="button"
                onClick={onToggle}
                aria-label="Close menu"
            />

            {/* Sidebar content rendered by parent with sidebar--open class */}
            {children}
        </>
    );
}

// Hook to detect mobile viewport
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}
