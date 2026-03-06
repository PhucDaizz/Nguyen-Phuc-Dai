import { useEffect, useState } from 'react';
import { Scroll } from '@react-three/drei';
import { Github, ExternalLink, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Project {
    title: string;
    description: string;
    liveLink: string | null;
    githubLink: string;
    tags: string[];
}

export const HTMLContent = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function loadProjects() {
            try {
                // Hardcoded list of pinned repositories to ensure they match the GitHub profile exactly.
                // Note: GitHub REST API does not have a "pinned" endpoint, so we fetch them by name.
                const pinnedRepoNames = [
                    'CarbonTC',
                    'E-commerce-FE',
                    'E-commerce-BE',
                    'WordWise-BE',
                    'WordWise',
                    'LicensePlateRecognitionVNAPI'
                ];

                const fetchPromises = pinnedRepoNames.map(repoName =>
                    fetch(`https://api.github.com/repos/PhucDaizz/${repoName}`).then(res => res.json())
                );

                const reposData = await Promise.all(fetchPromises);
                const validRepos = reposData.filter(repo => repo && !repo.message);

                setProjects(validRepos.map((repo: any) => ({
                    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                    description: repo.description,
                    liveLink: repo.homepage,
                    githubLink: repo.html_url,
                    tags: repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
                })));
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        }
        loadProjects();
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
                            SOFTWARE & SYSTEM ENGINEERING
                        </h5>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h1>NGUYEN PHUC DAI</h1>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <p style={{ maxWidth: '700px', marginTop: '3rem', fontSize: '1.4rem' }}>
                            Crafting immersive, performance-driven digital environments.
                            Treating code like architecture—building scalable foundations and seamless micro-interactions.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
                        <a href="#about" className="interactive-element" style={{ paddingBottom: '0.2rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                            Discover Paradigm <ArrowUpRight size={16} style={{ display: 'inline', marginLeft: '0.5rem', marginBottom: '-2px' }} />
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
                        Structured<br /><span style={{ color: 'var(--text-secondary)' }}>Identity</span>
                    </motion.h2>

                    <div className="architectural-layout">
                        <motion.div variants={itemVariants} className="col-span-12 glass-panel" style={{ marginBottom: '3rem' }}>
                            <div className="architectural-layout identity-layout">
                                <div className="col-span-5 premium-image-container identity-image-col" style={{ height: '500px' }}>
                                    <img src="https://iili.io/FFwH7hF.md.jpg" alt="Portrait" className="premium-image" />
                                </div>
                                <div className="col-span-7">
                                    <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 300 }}>Architect of Digital Spaces.</h3>
                                    <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
                                        I am a software engineer focused on building robust, resilient, and structurally sound solutions.
                                        Beyond just raw code, I engineer systems with an emphasis on spatial design principles, ensuring every interface feels tactile, alive, and intuitive.
                                    </p>
                                    <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
                                        Bridging backend resilience with frontend hyper-immersion, my mission is to elevate the baseline quality of web applications.
                                    </p>
                                    <div style={{ padding: '2rem 0', borderTop: '1px solid var(--panel-border)', borderBottom: '1px solid var(--panel-border)' }}>
                                        <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>CORE DIRECTIVE</h4>
                                        <p style={{ color: 'var(--text-primary)' }}>Constructing sophisticated frameworks that scale effortlessly while retaining uncompromising aesthetics.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="col-span-12 glass-panel">
                            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center' }}>SYSTEM METRICS</h4>
                            <div className="architectural-layout" style={{ gap: '2rem', alignItems: 'center' }}>
                                <div className="col-span-6 interactive-element" style={{ width: '100%' }}>
                                    <img
                                        src="https://github-readme-stats.vercel.app/api?username=PhucDaizz&show_icons=true&bg_color=0a0a0a&title_color=ffffff&icon_color=a1a1aa&text_color=a1a1aa&hide_border=true&ring_color=555555"
                                        alt="Stats"
                                        style={{ width: '100%', borderRadius: '8px' }}
                                    />
                                </div>
                                <div className="col-span-6 interactive-element" style={{ width: '100%' }}>
                                    <img
                                        src="https://github-readme-stats.vercel.app/api/top-langs/?username=PhucDaizz&layout=compact&langs_count=8&bg_color=0a0a0a&title_color=ffffff&text_color=a1a1aa&hide_border=true"
                                        alt="Languages"
                                        style={{ width: '100%', borderRadius: '8px' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', textAlign: 'center' }} className="interactive-element">
                                <img
                                    src="https://github-readme-activity-graph.vercel.app/graph?username=PhucDaizz&theme=github-dark-dimmed&bg_color=0a0a0a&hide_border=true&color=a1a1aa&line=555555&point=ffffff"
                                    alt="Graph"
                                    style={{ width: '100%', borderRadius: '8px' }}
                                />
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
                        Constructed<br /><span style={{ color: 'var(--text-secondary)' }}>Prototypes</span>
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
                        Technical<br /><span style={{ color: 'var(--text-secondary)' }}>Subsystems</span>
                    </motion.h2>

                    <motion.div variants={itemVariants} className="glass-panel architectural-layout expertise-panel">
                        <div className="col-span-4 expertise-col">
                            <h4 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '2rem' }}>01 // BACKEND</h4>
                            <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.2rem', fontWeight: 300 }}>
                                <li className="interactive-element" style={{ display: 'block' }}>C# & .NET Core 8</li>
                                <li className="interactive-element" style={{ display: 'block' }}>ASP.NET Core (API/MVC)</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Entity Framework Core</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Clean Architecture & SOLID</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Microservices & CQRS</li>
                            </ul>
                        </div>

                        <div className="col-span-4 expertise-col">
                            <h4 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '2rem' }}>02 // DATABASES & BROKERS</h4>
                            <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.2rem', fontWeight: 300 }}>
                                <li className="interactive-element" style={{ display: 'block' }}>SQL Server (T-SQL)</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Redis Caching</li>
                                <li className="interactive-element" style={{ display: 'block' }}>RabbitMQ</li>
                                <li className="interactive-element" style={{ display: 'block' }}>MySQL / PostgreSQL</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Query Optimization</li>
                            </ul>
                        </div>

                        <div className="col-span-4 expertise-col">
                            <h4 style={{ fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '2rem' }}>03 // FRONTEND & DEVOPS</h4>
                            <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.2rem', fontWeight: 300 }}>
                                <li className="interactive-element" style={{ display: 'block' }}>ReactJS & JavaScript (ES6+)</li>
                                <li className="interactive-element" style={{ display: 'block' }}>SignalR Real-time Comm.</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Docker Containerization</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Ocelot API Gateway</li>
                                <li className="interactive-element" style={{ display: 'block' }}>Vite & Responsive UI</li>
                            </ul>
                        </div>
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
                        Initialize<br /><span style={{ color: 'var(--text-secondary)' }}>Handshake</span>
                    </motion.h2>

                    <motion.div variants={itemVariants} className="architectural-layout" style={{ gap: '2rem' }}>
                        <div className="col-span-6 glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Mail size={32} style={{ color: 'var(--text-secondary)' }} />
                            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginTop: '1rem' }}>PRIMARY COMMUNICATION CHANNEL</h4>
                            <a href="mailto:dai742004.dn@gmail.com" className="interactive-element" style={{ fontSize: '1.8rem', fontWeight: 300 }}>
                                dai742004.dn@gmail.com
                            </a>
                        </div>

                        <div className="col-span-6 glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>DIGITAL PRESENCE</h4>
                            <div className="contact-links">
                                <a href="https://github.com/PhucDaizz" target="_blank" rel="noreferrer" className="interactive-element" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Github size={24} /> GitHub <ArrowUpRight size={18} />
                                </a>
                                <a href="https://linkedin.com/in/nguy%E1%BB%85n-ph%C3%BAc-%C4%91%E1%BA%A1i-82719a27b" target="_blank" rel="noreferrer" className="interactive-element" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Linkedin size={24} /> LinkedIn <ArrowUpRight size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.footer variants={itemVariants} className="site-footer">
                        <span>© {new Date().getFullYear()} NGUYEN PHUC DAI.</span>
                        <span>CRAFTING RELIABLE SOFTWARE.</span>
                    </motion.footer>
                </motion.div>
            </section>

        </Scroll>
    );
};
