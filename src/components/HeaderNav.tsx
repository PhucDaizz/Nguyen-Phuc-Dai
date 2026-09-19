import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Code, FolderGit2, Mail, Copy, Check, BrainCircuit, X } from 'lucide-react';
import portfolioData from '../data/portfolioData.json';

export const HeaderNav: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('hero');
    const navigate = useNavigate();
    const location = useLocation();
    const isBlog = location.pathname.startsWith('/blog');
    const containerRef = useRef<HTMLDivElement>(null);

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
        if (isBlog) {
            setExpanded(false);
            navigate('/');
            // Đợi home mount rồi mới scroll
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
            return;
        }
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

    // Route blog: header thu gọn, bấm MENU để bung ra. Nếu không ấn vào hoặc ấn ra ngoài / cuộn trang thì tự động thu nhỏ lại.
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        if (isBlog) setExpanded(false);
        else setExpanded(true);
    }, [isBlog, location.pathname]);

    // Click outside & scroll listener để tự thu nhỏ lại ở route blog khi người dùng không tương tác
    useEffect(() => {
        if (!isBlog || !expanded) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setExpanded(false);
            }
        };

        const handlePageScroll = () => {
            setExpanded(false);
        };

        document.addEventListener('pointerdown', handleClickOutside);
        window.addEventListener('scroll', handlePageScroll, { passive: true });

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            window.removeEventListener('scroll', handlePageScroll);
        };
    }, [isBlog, expanded]);

    const collapsed = isBlog && !expanded;

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="header-nav-wrapper"
            style={{
                position: 'fixed',
                top: '1rem',
                left: 0,
                width: '100%',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 0.75rem',
                pointerEvents: 'none'
            }}
        >
            <div
                ref={containerRef}
                className="header-nav-container"
                onMouseEnter={() => { if (isBlog && window.innerWidth > 768) setExpanded(true); }}
                onMouseLeave={() => { if (isBlog && window.innerWidth > 768) setExpanded(false); }}
                style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0.6rem' : '1.2rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(12, 12, 14, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '100px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                    maxWidth: '100%',
                    transition: 'gap 0.3s ease, padding 0.3s ease',
                }}
            >
                {collapsed ? (
                    <button
                        onClick={() => setExpanded(true)}
                        className="nav-item-btn nav-menu-toggle"
                        title="Mở menu điều hướng"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.4rem 0.6rem' }}
                    >
                        <span
                            style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                backgroundColor: '#22c55e',
                                boxShadow: '0 0 10px #22c55e',
                                animation: 'pulse 2s infinite',
                                flexShrink: 0,
                            }}
                        />
                        <span className="nav-btn-text" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>MENU</span>
                    </button>
                ) : (
                <>
                {/* Khi ở route blog, cho phép nút đóng X thu nhỏ lại ngay */}
                {isBlog && (
                    <button
                        onClick={() => setExpanded(false)}
                        className="nav-item-btn nav-close-btn"
                        title="Thu nhỏ menu"
                        style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%' }}
                    >
                        <X size={15} />
                    </button>
                )}
                {/* Live Status Indicator */}
                <div className="header-status-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
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
                <nav className="header-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <button
                        onClick={() => scrollTo('about')}
                        className={`nav-item-btn ${activeSection === 'about' ? 'active' : ''}`}
                        title="About Me"
                    >
                        <User size={15} />
                        <span className="nav-btn-text">About</span>
                    </button>

                    <button
                        onClick={() => scrollTo('projects')}
                        className={`nav-item-btn ${activeSection === 'projects' ? 'active' : ''}`}
                        title="Projects"
                    >
                        <FolderGit2 size={15} />
                        <span className="nav-btn-text">Projects</span>
                    </button>

                    <button
                        onClick={() => scrollTo('skills')}
                        className={`nav-item-btn ${activeSection === 'skills' ? 'active' : ''}`}
                        title="Skills"
                    >
                        <Code size={15} />
                        <span className="nav-btn-text">Skills</span>
                    </button>

                    <button
                        onClick={() => scrollTo('contact')}
                        className={`nav-item-btn ${activeSection === 'contact' ? 'active' : ''}`}
                        title="Contact"
                    >
                        <Mail size={15} />
                        <span className="nav-btn-text">Contact</span>
                    </button>

                    <button
                        onClick={() => navigate('/blog')}
                        className={`nav-item-btn ${isBlog ? 'active' : ''}`}
                        title="Blog thuật toán"
                    >
                        <BrainCircuit size={15} />
                        <span className="nav-btn-text">Blog</span>
                    </button>
                </nav>

                {/* Quick Copy Email Button */}
                <button
                    onClick={handleCopyEmail}
                    className="header-copy-btn"
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
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                    }}
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span className="copy-btn-text">{copied ? 'Copied!' : 'Email'}</span>
                </button>
                </>
                )}
            </div>
        </motion.header>
    );
};

