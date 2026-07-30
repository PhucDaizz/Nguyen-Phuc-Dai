import { useEffect, useState } from 'react';
import { Scroll } from '@react-three/drei';
import { Github, ExternalLink, Linkedin, Mail, ArrowUpRight, Star, GitFork, BookOpen, Code2, Copy, Check, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import portfolioData from '../data/portfolioData.json';

interface Project {
    title: string;
    description: string;
    liveLink: string | null;
    githubLink: string;
    tags: string[];
}

interface UserStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    totalForks: number;
    topLanguages: { name: string; count: number; percentage: number }[];
}

export const HTMLContent = () => {
    const [projects, setProjects] = useState<Project[]>(portfolioData.featuredProjects || []);
    const [userStats, setUserStats] = useState<UserStats | null>({
        publicRepos: 18,
        followers: 12,
        totalStars: 5,
        totalForks: 3,
        topLanguages: [
            { name: 'C#', count: 10, percentage: 45 },
            { name: 'TypeScript', count: 6, percentage: 25 },
            { name: 'JavaScript', count: 4, percentage: 15 },
            { name: 'HTML/CSS', count: 3, percentage: 10 },
            { name: 'Docker', count: 1, percentage: 5 }
        ]
    });
    const [emailCopied, setEmailCopied] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.contact.email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        async function loadGithubData() {
            try {
                const username = portfolioData.githubStats.username;
                const pinnedRepoNames = portfolioData.githubStats.pinnedRepos;

                // 1. Fetch Pinned Repos
                const repoPromises = pinnedRepoNames.map(repoName =>
                    fetch(`https://api.github.com/repos/${username}/${repoName}`).then(res => res.json())
                );
                const reposData = await Promise.all(repoPromises);
                const validRepos = reposData.filter(repo => repo && !repo.message && repo.name);

                if (validRepos.length > 0) {
                    setProjects(validRepos.map((repo: any) => ({
                        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                        description: repo.description || 'System architected for optimal performance.',
                        liveLink: repo.homepage || null,
                        githubLink: repo.html_url,
                        tags: repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : ['C#', '.NET']),
                    })));
                }

                // 2. Fetch User Profile & All Repos for Stats
                const [userRes, userReposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`).then(res => res.json()),
                    fetch(`https://api.github.com/users/${username}/repos?per_page=100`).then(res => res.json())
                ]);

                if (userRes && !userRes.message && Array.isArray(userReposRes)) {
                    let totalStars = 0;
                    let totalForks = 0;
                    const langCountMap: Record<string, number> = {};

                    userReposRes.forEach((repo: any) => {
                        totalStars += repo.stargazers_count || 0;
                        totalForks += repo.forks_count || 0;
                        if (repo.language) {
                            langCountMap[repo.language] = (langCountMap[repo.language] || 0) + 1;
                        }
                    });

                    const totalLangEntries = Object.values(langCountMap).reduce((a, b) => a + b, 0) || 1;
                    const sortedLangs = Object.entries(langCountMap)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([name, count]) => ({
                            name,
                            count,
                            percentage: Math.round((count / totalLangEntries) * 100)
                        }));

                    setUserStats({
                        publicRepos: userRes.public_repos || userReposRes.length,
                        followers: userRes.followers || 0,
                        totalStars,
                        totalForks,
                        topLanguages: sortedLangs
                    });
                }
            } catch (error) {
                console.warn("Using fallback local data due to rate limit/network error", error);
            }
        }
        loadGithubData();
    }, []);

    // Sleek animation parameters
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    const getDotColor = (categoryId: string) => {
        switch (categoryId) {
            case '01': return '#a855f7'; // Backend - Purple
            case '02': return '#3b82f6'; // Database - Blue
            case '03': return '#10b981'; // Frontend/DevOps - Emerald
            default: return '#ffffff';
        }
    };

    return (
        <Scroll html style={{ width: '100vw' }}>
            <div className="noise-overlay" />

            {/* 1. HERO SECTION */}
            <section className="hero-section container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <motion.div variants={itemVariants} style={{ overflow: 'hidden' }}>
                        <h5 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            {portfolioData.hero.role}
                        </h5>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h1>{portfolioData.hero.name}</h1>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <p style={{ maxWidth: '700px', marginTop: '3rem', fontSize: '1.4rem' }}>
                            {portfolioData.hero.description}
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
                        <a 
                            href="#about" 
                            className="interactive-element" 
                            style={{ paddingBottom: '0.2rem', borderBottom: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            {portfolioData.hero.ctaText} <ArrowUpRight size={16} style={{ display: 'inline', marginLeft: '0.5rem', marginBottom: '-2px' }} />
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* 2. IDENTITY SECTION */}
            <section id="about" className="container" style={{ minHeight: '100vh', paddingTop: '15vh' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2 variants={itemVariants} style={{ marginBottom: '4rem' }}>
                        {portfolioData.about.title}<br /><span style={{ color: 'var(--text-secondary)' }}>{portfolioData.about.subtitle}</span>
                    </motion.h2>

                    <div className="architectural-layout">
                        <motion.div variants={itemVariants} className="col-span-12 glass-panel" style={{ marginBottom: '3rem' }}>
                            <div className="architectural-layout identity-layout">
                                <div className="col-span-5 premium-image-container identity-image-col" style={{ height: '500px' }}>
                                    <img src={portfolioData.about.avatarUrl} alt="Portrait" className="premium-image" />
                                </div>
                                <div className="col-span-7">
                                    <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 300 }}>{portfolioData.about.role}</h3>
                                    {portfolioData.about.paragraphs.map((p, idx) => (
                                        <p key={idx} style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
                                            {p}
                                        </p>
                                    ))}
                                    <div style={{ padding: '2rem 0', borderTop: '1px solid var(--panel-border)', borderBottom: '1px solid var(--panel-border)' }}>
                                        <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>CORE MISSION</h4>
                                        <p style={{ color: 'var(--text-primary)' }}>{portfolioData.about.coreMission}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="col-span-12 glass-panel">
                            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center' }}>
                                GITHUB METRICS & INSIGHTS
                            </h4>
                            
                            <div className="architectural-layout" style={{ gap: '2rem', alignItems: 'stretch' }}>
                                {/* Left Widget: Overview Stats */}
                                <div className="col-span-6 glass-panel interactive-element" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '12px' }}>
                                    <h5 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                                        <Github size={20} /> Overall Performance
                                    </h5>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <BookOpen size={16} /> Repositories
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '0.5rem', color: '#fff' }}>
                                                {userStats ? userStats.publicRepos : '...'}
                                            </div>
                                        </div>

                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <Star size={16} style={{ color: '#eab308' }} /> Stars Earned
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '0.5rem', color: '#fff' }}>
                                                {userStats ? userStats.totalStars : '...'}
                                            </div>
                                        </div>

                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <GitFork size={16} /> Total Forks
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '0.5rem', color: '#fff' }}>
                                                {userStats ? userStats.totalForks : '...'}
                                            </div>
                                        </div>

                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <Github size={16} /> Followers
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '0.5rem', color: '#fff' }}>
                                                {userStats ? userStats.followers : '...'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Widget: Top Languages */}
                                <div className="col-span-6 glass-panel interactive-element" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '12px' }}>
                                    <h5 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                                        <Code2 size={20} /> Most Used Languages
                                    </h5>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        {userStats?.topLanguages ? (
                                            userStats.topLanguages.map((lang) => (
                                                <div key={lang.name}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                                                        <span style={{ color: 'var(--text-primary)' }}>{lang.name}</span>
                                                        <span style={{ color: 'var(--text-secondary)' }}>{lang.percentage}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div
                                                            style={{
                                                                width: `${lang.percentage}%`,
                                                                height: '100%',
                                                                background: 'linear-gradient(90deg, #a1a1aa, #ffffff)',
                                                                borderRadius: '4px',
                                                                transition: 'width 1s ease-in-out'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                                                Loading Language Data...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* 3. PROJECTS SECTION */}
            <section id="projects" className="container" style={{ minHeight: '100vh', paddingTop: '20vh' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2 variants={itemVariants} style={{ marginBottom: '4rem', textAlign: 'right' }}>
                        Featured<br /><span style={{ color: 'var(--text-secondary)' }}>Projects</span>
                    </motion.h2>

                    <div className="architectural-layout" style={{ gap: '3rem' }}>
                        {projects.map((project: Project, i: number) => (
                            <motion.div key={i} variants={itemVariants} className="col-span-6 glass-panel project-card">
                                <div style={{ flexGrow: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                        <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>
                                            PROJECT 0{i + 1}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                                            FEATURED
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{project.title}</h3>
                                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                                        {project.description || 'System architected for optimal performance.'}
                                    </p>
                                </div>

                                <div className="project-tags">
                                    {project.tags.map((tag: string) => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--panel-border)' }}>
                                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn interactive-element">
                                        <Github size={16} /> Source
                                    </a>
                                    {project.liveLink && (
                                        <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn interactive-element">
                                            <ExternalLink size={16} /> Deploy
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* 4. EXPERTISE SECTION */}
            <section id="skills" className="container" style={{ minHeight: '100vh', paddingTop: '20vh' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2 variants={itemVariants} style={{ marginBottom: '4rem' }}>
                        Technical<br /><span style={{ color: 'var(--text-secondary)' }}>Skills</span>
                    </motion.h2>

                    <motion.div variants={itemVariants} className="glass-panel architectural-layout expertise-panel">
                        {portfolioData.expertise.map((exp) => (
                            <div key={exp.id} className="col-span-4 expertise-col">
                                <h4 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                    {exp.id} // {exp.category}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {exp.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="interactive-element"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.8rem',
                                                padding: '0.7rem 1rem',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                                borderRadius: '8px',
                                                fontSize: '1.05rem',
                                                fontWeight: 300
                                            }}
                                        >
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getDotColor(exp.id) }} />
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* 5. CONTACT SECTION */}
            <section id="contact" className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '10vh' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <motion.h2 variants={itemVariants} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '3rem' }}>
                        {portfolioData.contact.title}<br /><span style={{ color: 'var(--text-secondary)' }}>{portfolioData.contact.subtitle}</span>
                    </motion.h2>

                    <motion.div variants={itemVariants} className="architectural-layout" style={{ gap: '2rem' }}>
                        <div className="col-span-6 glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Mail size={32} style={{ color: 'var(--text-secondary)' }} />
                            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginTop: '1rem' }}>PRIMARY COMMUNICATION CHANNEL</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <a href={`mailto:${portfolioData.contact.email}`} className="interactive-element" style={{ fontSize: '1.8rem', fontWeight: 300 }}>
                                    {portfolioData.contact.email}
                                </a>
                                <button
                                    onClick={handleCopyEmail}
                                    className="btn"
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.75rem',
                                        background: emailCopied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: emailCopied ? '#22c55e' : 'rgba(255, 255, 255, 0.15)',
                                        color: emailCopied ? '#4ade80' : 'var(--text-primary)'
                                    }}
                                >
                                    {emailCopied ? <Check size={14} /> : <Copy size={14} />}
                                    <span>{emailCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="col-span-6 glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>DIGITAL PRESENCE</h4>
                            <div className="contact-links">
                                <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className="interactive-element" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Github size={24} /> GitHub <ArrowUpRight size={18} />
                                </a>
                                <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="interactive-element" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Linkedin size={24} /> LinkedIn <ArrowUpRight size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.footer variants={itemVariants} className="site-footer">
                        <span>© {new Date().getFullYear()} {portfolioData.hero.name}.</span>
                        <span>CRAFTING RELIABLE SOFTWARE.</span>
                    </motion.footer>
                </motion.div>
            </section>

            {/* Scroll To Top Floating Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToTop}
                        style={{
                            position: 'fixed',
                            bottom: '2rem',
                            right: '2rem',
                            zIndex: 1000,
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: 'rgba(20, 20, 25, 0.8)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                            transition: 'all 0.3s ease'
                        }}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

        </Scroll>
    );
};


