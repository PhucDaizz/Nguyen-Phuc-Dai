import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, CornerDownLeft, Sparkles } from 'lucide-react';
import portfolioData from '../data/portfolioData.json';

export const TerminalCLI: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<{ command: string; output: string | React.ReactNode }[]>([
        {
            command: 'welcome',
            output: (
                <div>
                    <p style={{ color: '#4ade80', marginBottom: '0.4rem' }}>
                        🚀 Antigravity CLI v1.0.4 - [NGUYEN PHUC DAI PORTFOLIO]
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Type <span style={{ color: '#38bdf8' }}>'help'</span> to see available commands or click buttons below.
                    </p>
                </div>
            )
        }
    ]);

    const handleCommand = (cmdStr: string) => {
        const cleanCmd = cmdStr.trim().toLowerCase();
        let responseOutput: React.ReactNode = '';

        switch (cleanCmd) {
            case 'help':
                responseOutput = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <p><span style={{ color: '#38bdf8' }}>whoami</span> - Display developer profile summary</p>
                        <p><span style={{ color: '#38bdf8' }}>skills</span> - List core technical stack & expertise</p>
                        <p><span style={{ color: '#38bdf8' }}>projects</span> - Show featured projects list</p>
                        <p><span style={{ color: '#38bdf8' }}>contact</span> - Display email and social links</p>
                        <p><span style={{ color: '#38bdf8' }}>clear</span> - Clear terminal output history</p>
                    </div>
                );
                break;

            case 'whoami':
                responseOutput = (
                    <div>
                        <p style={{ color: '#fff', fontWeight: 500 }}>{portfolioData.hero.name} ({portfolioData.about.role})</p>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{portfolioData.hero.description}</p>
                    </div>
                );
                break;

            case 'skills':
                responseOutput = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {portfolioData.expertise.map(exp => (
                            <div key={exp.id}>
                                <span style={{ color: '#a855f7', fontWeight: 600 }}>{exp.category}: </span>
                                <span style={{ color: 'var(--text-secondary)' }}>{exp.skills.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                );
                break;

            case 'projects':
                responseOutput = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {portfolioData.featuredProjects.map((p, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#38bdf8' }}>• {p.title}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{p.architecturePattern}</span>
                            </div>
                        ))}
                    </div>
                );
                break;

            case 'contact':
                responseOutput = (
                    <div>
                        <p>📧 Email: <a href={`mailto:${portfolioData.contact.email}`} style={{ color: '#38bdf8' }}>{portfolioData.contact.email}</a></p>
                        <p>🐙 GitHub: <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{portfolioData.contact.github}</a></p>
                        <p>💼 LinkedIn: <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{portfolioData.contact.linkedin}</a></p>
                    </div>
                );
                break;

            case 'clear':
                setHistory([]);
                return;

            default:
                if (cleanCmd === '') return;
                responseOutput = <span style={{ color: '#ef4444' }}>Command not found: '{cleanCmd}'. Type 'help' for command list.</span>;
                break;
        }

        setHistory(prev => [...prev, { command: cmdStr, output: responseOutput }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    return (
        <>
            {/* Toggle Terminal Button */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        left: '2rem',
                        zIndex: 999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.7rem 1.2rem',
                        background: 'rgba(15, 15, 18, 0.85)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '100px',
                        color: '#fff',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                    }}
                    whileHover={{ scale: 1.05, border: '1px solid rgba(56, 189, 248, 0.5)' }}
                >
                    <TerminalIcon size={16} style={{ color: '#38bdf8' }} />
                    <span>CLI Terminal</span>
                    <Sparkles size={13} style={{ color: '#4ade80' }} />
                </motion.button>
            )}

            {/* Terminal Window Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '2rem',
                            left: '2rem',
                            zIndex: 1001,
                            width: 'min(90vw, 550px)',
                            height: '380px',
                            background: 'rgba(10, 10, 12, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Terminal Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.7rem 1rem',
                            background: 'rgba(255, 255, 255, 0.04)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
                                    bash - phucdaizz@portfolio:~
                                </span>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Quick Command Pills */}
                        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                            {['whoami', 'skills', 'projects', 'contact', 'clear'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => handleCommand(c)}
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#38bdf8',
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* History Log Body */}
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.6' }}>
                            {history.map((item, index) => (
                                <div key={index} style={{ marginBottom: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa' }}>
                                        <span style={{ color: '#22c55e' }}>➜</span>
                                        <span style={{ color: '#38bdf8' }}>~</span>
                                        <span>{item.command}</span>
                                    </div>
                                    <div style={{ marginTop: '0.2rem', paddingLeft: '1.2rem', color: '#e4e4e7' }}>
                                        {item.output}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Command Input Bar */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '0.7rem 1rem', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <span style={{ color: '#22c55e', marginRight: '0.5rem', fontFamily: 'monospace' }}>➜</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type command (e.g. help, whoami)..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#fff',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem'
                                }}
                            />
                            <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <CornerDownLeft size={14} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
