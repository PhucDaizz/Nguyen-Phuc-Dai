import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovered, setIsHovered] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    const prefersReducedMotion = useReducedMotion() ?? false;

    useEffect(() => {
        let counter = 0;

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Add particle to trail
            counter++;
            if (counter % 3 === 0) {
                setTrail(prev => [
                    ...prev.slice(-8),
                    { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() }
                ]);
            }

            // Check if hovering over interactive element
            const target = e.target as HTMLElement;
            if (target && (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.onclick !== null ||
                target.classList.contains('interactive-element') ||
                target.closest('.interactive-element') ||
                target.closest('button') ||
                target.closest('a')
            )) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        const onMouseDown = () => setIsMouseDown(true);
        const onMouseUp = () => setIsMouseDown(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    // Disable on mobile/touch screens
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    // Respect reduced-motion: keep the native cursor instead of a custom animated one
    if (prefersReducedMotion) {
        return null;
    }

    return (
        <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 99999 }}>
            {/* Trail Particles */}
            {trail.map((pt) => (
                <motion.div
                    key={pt.id}
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        left: pt.x,
                        top: pt.y,
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                    }}
                />
            ))}

            {/* Main Inner Cursor Dot */}
            <motion.div
                animate={{
                    x: position.x - 4,
                    y: position.y - 4,
                    scale: isMouseDown ? 0.7 : isHovered ? 1.5 : 1,
                    backgroundColor: isHovered ? 'var(--accent)' : '#ffffff'
                }}
                transition={{ type: 'spring', stiffness: 1000, damping: 50, mass: 0.1 }}
                style={{
                    position: 'fixed',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    boxShadow: isHovered ? '0 0 12px var(--accent)' : '0 0 8px rgba(255, 255, 255, 0.8)'
                }}
            />

            {/* Outer Cyber Ring */}
            <motion.div
                animate={{
                    x: position.x - 20,
                    y: position.y - 20,
                    scale: isMouseDown ? 0.8 : isHovered ? 1.4 : 1,
                    borderColor: isHovered ? 'rgba(56, 189, 248, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                }}
                transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.2 }}
                style={{
                    position: 'fixed',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    pointerEvents: 'none',
                    boxShadow: isHovered ? '0 0 20px rgba(56, 189, 248, 0.3)' : 'none'
                }}
            />
        </div>
    );
};
