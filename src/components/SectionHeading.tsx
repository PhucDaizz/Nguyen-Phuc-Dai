import React from 'react';

interface SectionHeadingProps {
    label: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

/**
 * Consistent section header used across all content sections:
 * a small labeled eyebrow line followed by the (usually animated) title.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ label, children, style }) => (
    <div className="section-heading" style={style}>
        <span className="section-label">{label}</span>
        {children}
    </div>
);
