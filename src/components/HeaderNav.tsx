import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Code, FolderGit2, Mail, Copy, Check } from 'lucide-react';
import portfolioData from '../data/portfolioData.json';

export const HeaderNav: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('hero');

    useEffect(() => {
        const sectionIds = ['hero', 'about', 'projects', 'skills', 'contact'];
        
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;
            for (const id of sectionIds) {
                const element = document.getElementById(id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.contact.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                top: '1.5rem',
                left: 0,
                width: '100%',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 1rem',
                pointerEvents: 'none'
            }}
        >
            <div
                style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '0.6rem 1.2rem',
                    background: 'rgba(12, 12, 14, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '100px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
                }}
            >
                {/* Live Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <span
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            boxShadow: '0 0 10px #22c55e',
                            animation: 'pulse 2s infinite'
                        }}
                    />
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                        AVAILABLE
                    </span>
                </div>

                {/* Nav Links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => scrollTo('about')}
                        className={`nav-item-btn ${activeSection === 'about' ? 'active' : ''}`}
                        title="About Me"
                    >
                        <User size={15} />
                        <span>About</span>
                    </button>

                    <button
                        onClick={() => scrollTo('projects')}
                        className={`nav-item-btn ${activeSection === 'projects' ? 'active' : ''}`}
                        title="Projects"
                    >
                        <FolderGit2 size={15} />
                        <span>Projects</span>
                    </button>

                    <button
                        onClick={() => scrollTo('skills')}
                        className={`nav-item-btn ${activeSection === 'skills' ? 'active' : ''}`}
                        title="Skills"
                    >
                        <Code size={15} />
                        <span>Skills</span>
                    </button>

                    <button
                        onClick={() => scrollTo('contact')}
                        className={`nav-item-btn ${activeSection === 'contact' ? 'active' : ''}`}
                        title="Contact"
                    >
                        <Mail size={15} />
                        <span>Contact</span>
                    </button>
                </nav>

                {/* Quick Copy Email Button */}
                <button
                    onClick={handleCopyEmail}
                    style={{
                        pointerEvents: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.8rem',
                        background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        border: `1px solid ${copied ? '#22c55e' : 'rgba(255, 255, 255, 0.15)'}`,
                        borderRadius: '100px',
                        color: copied ? '#4ade80' : 'var(--text-primary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied ? 'Copied!' : 'Email'}</span>
                </button>
            </div>
        </motion.header>
    );
};

