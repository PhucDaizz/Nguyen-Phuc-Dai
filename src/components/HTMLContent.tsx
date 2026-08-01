import { useEffect, useState } from 'react';
import { Scroll } from '@react-three/drei';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import portfolioData from '../data/portfolioData.json';

import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { ContactSection } from './sections/ContactSection';

interface Project {
    title: string;
    description: string;
    liveLink: string | null;
    githubLink: string;
    architecturePattern?: string;
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
    const [projects, _setProjects] = useState<Project[]>(portfolioData.featuredProjects || []);
    const [userStats, _setUserStats] = useState<UserStats | null>({
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

    /* 
    // OPTIONAL: Live GitHub Data Fetching (Uncomment if needed)
    useEffect(() => {
        async function loadGithubData() {
            try {
                const username = portfolioData.githubStats.username;
                const pinnedRepoNames = portfolioData.githubStats.pinnedRepos;

                // 1. Fetch Pinned Repos with res.ok check
                const repoPromises = pinnedRepoNames.map(repoName =>
                    fetch(`https://api.github.com/repos/${username}/${repoName}`)
                        .then(res => res.ok ? res.json() : null)
                        .catch(() => null)
                );
                const reposData = await Promise.all(repoPromises);
                const validRepos = reposData.filter(repo => repo && !repo.message && repo.name);

                if (validRepos.length > 0) {
                    _setProjects(validRepos.map((repo: any) => ({
                        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                        description: repo.description || 'System architected for optimal performance.',
                        liveLink: repo.homepage || null,
                        githubLink: repo.html_url,
                        tags: repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : ['C#', '.NET']),
                    })));
                }

                // 2. Fetch User Profile & All Repos for Stats with res.ok check
                const [userRes, userReposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`).then(res => res.ok ? res.json() : null).catch(() => null),
                    fetch(`https://api.github.com/users/${username}/repos?per_page=100`).then(res => res.ok ? res.json() : null).catch(() => null)
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

                    _setUserStats({
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
    */

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.contact.email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            <HeroSection containerVariants={containerVariants} itemVariants={itemVariants} />

            {/* 2. IDENTITY SECTION */}
            <AboutSection containerVariants={containerVariants} itemVariants={itemVariants} userStats={userStats} />

            {/* 3. PROJECTS SECTION */}
            <ProjectsSection containerVariants={containerVariants} itemVariants={itemVariants} projects={projects} />

            {/* 4. EXPERTISE SECTION */}
            <SkillsSection containerVariants={containerVariants} itemVariants={itemVariants} />

            {/* 5. CONTACT SECTION */}
            <ContactSection
                containerVariants={containerVariants}
                itemVariants={itemVariants}
                emailCopied={emailCopied}
                handleCopyEmail={handleCopyEmail}
            />

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
