import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { SectionHeading } from '../SectionHeading';
import portfolioData from '../../data/portfolioData.json';

interface SkillsSectionProps {
    containerVariants: Variants;
    itemVariants: Variants;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ containerVariants, itemVariants }) => {
    const getDotColor = (categoryId: string) => {
        switch (categoryId) {
            case '01': return 'var(--accent-purple)'; // Backend - Purple
            case '02': return 'var(--accent-blue)';   // Database - Blue
            case '03': return 'var(--accent-emerald)'; // Frontend/DevOps - Emerald
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
                <SectionHeading label="Technical Expertise">
                    <motion.h2 variants={itemVariants}>
                        Technical<br /><span style={{ color: 'var(--text-secondary)' }}>Skills</span>
                    </motion.h2>
                </SectionHeading>

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
