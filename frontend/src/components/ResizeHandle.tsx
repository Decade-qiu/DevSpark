'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ResizeHandleProps {
    onResize: (delta: number) => void;
    orientation?: 'vertical' | 'horizontal';
    className?: string;
}

export default function ResizeHandle({
    onResize,
    orientation = 'vertical',
    className = '',
}: ResizeHandleProps) {
    const [isDragging, setIsDragging] = useState(false);
    const handleRef = useRef<HTMLDivElement>(null);
    const startPosRef = useRef(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        startPosRef.current = orientation === 'vertical' ? e.clientX : e.clientY;
        document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
    }, [orientation]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const currentPos = orientation === 'vertical' ? e.clientX : e.clientY;
            const delta = currentPos - startPosRef.current;
            startPosRef.current = currentPos;
            onResize(delta);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onResize, orientation]);

    return (
        <div
            ref={handleRef}
            className={`resize-handle resize-handle--${orientation} ${isDragging ? 'resize-handle--active' : ''} ${className}`}
            onMouseDown={handleMouseDown}
            role="separator"
            aria-orientation={orientation}
            tabIndex={0}
            onKeyDown={(e) => {
                const step = e.shiftKey ? 50 : 10;
                if (orientation === 'vertical') {
                    if (e.key === 'ArrowLeft') onResize(-step);
                    if (e.key === 'ArrowRight') onResize(step);
                } else {
                    if (e.key === 'ArrowUp') onResize(-step);
                    if (e.key === 'ArrowDown') onResize(step);
                }
            }}
        />
    );
}
