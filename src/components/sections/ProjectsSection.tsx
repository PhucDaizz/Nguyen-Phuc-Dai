import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface Project {
    title: string;
    description: string;
    liveLink: string | null;
    githubLink: string;
    architecturePattern?: string;
    tags: string[];
}

interface ProjectsSectionProps {
    containerVariants: any;
    itemVariants: any;
    projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ containerVariants, itemVariants, projects }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');

    const filterCategories = ['ALL', '.NET / C#', 'REACT', 'AI / RAG'];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (activeFilter === 'ALL') return true;
        if (activeFilter === '.NET / C#') {
            return project.tags.some(t => ['c#', '.net', 'asp.net core', '.net 8'].includes(t.toLowerCase()));
        }
        if (activeFilter === 'REACT') {
            return project.tags.some(t => ['react', 'reactjs'].includes(t.toLowerCase()));
        }
        if (activeFilter === 'AI / RAG') {
            return project.tags.some(t => ['ai', 'llms', 'agentic rag', 'gemini api', 'generative ai'].includes(t.toLowerCase()));
        }
        return true;
    });

    return (
        <section id="projects" className="container" style={{ minHeight: '100vh', paddingTop: '20vh' }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
                            PORTFOLIO WORK
                        </span>
                        <motion.h2 variants={itemVariants} style={{ marginBottom: 0 }}>
                            Featured<br /><span style={{ color: 'var(--text-secondary)' }}>Projects</span>
                        </motion.h2>
                    </div>

                    {/* Search & Filter Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '550px' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, tech stack (e.g. .NET, React, AI)..."
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1.2rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    borderRadius: '100px',
                                    color: '#fff',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {filterCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`btn ${activeFilter === cat ? 'active' : ''}`}
                                    style={{
                                        padding: '0.4rem 0.9rem',
                                        fontSize: '0.7rem',
                                        borderRadius: '100px',
                                        background: activeFilter === cat ? '#fff' : 'rgba(255, 255, 255, 0.03)',
                                        color: activeFilter === cat ? '#000' : 'var(--text-secondary)',
                                        borderColor: activeFilter === cat ? '#fff' : 'rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="architectural-layout" style={{ gap: '3rem' }}>
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project: Project, i: number) => (
                                <motion.div
                                    key={project.title}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="col-span-6 glass-panel glass-panel-spotlight project-card"
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
                                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                                    }}
                                >
                                    <div style={{ flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>
                                                PROJECT 0{i + 1}
                                            </span>
                                            <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                                                FEATURED
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{project.title}</h3>
                                        
                                        {/* Architecture Micro Badge */}
                                        {project.architecturePattern && (
                                            <div style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                                                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: '#e0f2fe', letterSpacing: '0.05em' }}>
                                                    {project.architecturePattern}
                                                </span>
                                            </div>
                                        )}

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
                            ))
                        ) : (
                            <div className="col-span-12 glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>No projects matching "{searchQuery}" under {activeFilter} filter.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </section>
    );
};
