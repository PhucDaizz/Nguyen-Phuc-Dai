import React from 'react';
import { motion } from 'framer-motion';
import { Github, BookOpen, Star, GitFork, Code2 } from 'lucide-react';
import portfolioData from '../../data/portfolioData.json';

interface UserStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    totalForks: number;
    topLanguages: { name: string; count: number; percentage: number }[];
}

interface AboutSectionProps {
    containerVariants: any;
    itemVariants: any;
    userStats: UserStats | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ containerVariants, itemVariants, userStats }) => {
    return (
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
    );
};
