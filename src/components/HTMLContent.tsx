import { useEffect, useState } from 'react';
import { Scroll } from '@react-three/drei';
import { Github, ExternalLink, Linkedin, Mail, ArrowUpRight, Star, GitFork, BookOpen, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);

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
                const validRepos = reposData.filter(repo => repo && !repo.message);

                setProjects(validRepos.map((repo: any) => ({
                    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                    description: repo.description,
                    liveLink: repo.homepage,
                    githubLink: repo.html_url,
                    tags: repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
                })));

                // 2. Fetch User Profile & All Repos for Stats
                const [userRes, userReposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`).then(res => res.json()),
                    fetch(`https://api.github.com/users/${username}/repos?per_page=100`).then(res => res.json())
                ]);

                if (userRes && Array.isArray(userReposRes)) {
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
                console.error("Error fetching GitHub data", error);
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
            <section className="container" style={{ minHeight: '100vh', paddingTop: '20vh' }}>
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
            <section className="container" style={{ minHeight: '100vh', paddingTop: '20vh' }}>
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
                                <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.2rem', fontWeight: 300 }}>
                                    {exp.skills.map((skill, index) => (
                                        <li key={index} className="interactive-element" style={{ display: 'block' }}>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* 5. CONTACT SECTION */}
            <section className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '10vh' }}>
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
                            <a href={`mailto:${portfolioData.contact.email}`} className="interactive-element" style={{ fontSize: '1.8rem', fontWeight: 300 }}>
                                {portfolioData.contact.email}
                            </a>
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

        </Scroll>
    );
};

