import React from 'react';
import { motion } from 'framer-motion';
import portfolioData from '../../data/portfolioData.json';

interface SkillsSectionProps {
    containerVariants: any;
    itemVariants: any;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ containerVariants, itemVariants }) => {
    const getDotColor = (categoryId: string) => {
        switch (categoryId) {
            case '01': return '#a855f7'; // Backend - Purple
            case '02': return '#3b82f6'; // Database - Blue
            case '03': return '#10b981'; // Frontend/DevOps - Emerald
            default: return '#ffffff';
        }
    };

    return (
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
    );
};
