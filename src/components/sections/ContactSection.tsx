import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check, Send } from 'lucide-react';
import { SectionHeading } from '../SectionHeading';
import portfolioData from '../../data/portfolioData.json';

interface ContactSectionProps {
    containerVariants: Variants;
    itemVariants: Variants;
    emailCopied: boolean;
    handleCopyEmail: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
    containerVariants,
    itemVariants,
    emailCopied,
    handleCopyEmail
}) => {
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState<{ success?: boolean; message?: string }>({});

    const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitting(true);
        setFormStatus({});

        const formData = new FormData(e.currentTarget);
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

        // No Web3Forms key configured -> fall back to opening the mail client directly.
        if (!accessKey) {
            const subject = "Contact from Portfolio";
            const body = `From: ${formData.get("name")}\n\n${formData.get("message")}`;
            window.location.href = `mailto:${portfolioData.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setFormStatus({ success: true, message: "Opening your mail client..." });
            (e.target as HTMLFormElement).reset();
            setFormSubmitting(false);
            return;
        }

        formData.append("access_key", accessKey);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setFormStatus({ success: true, message: "Thank you! Your message has been sent successfully." });
                (e.target as HTMLFormElement).reset();
            } else {
                setFormStatus({ success: true, message: "Opening your mail client..." });
                window.location.href = `mailto:${portfolioData.contact.email}?subject=Contact from Portfolio&body=${encodeURIComponent(formData.get("message") as string || "")}`;
            }
        } catch {
            setFormStatus({ success: false, message: "Something went wrong. Please try sending via email link above." });
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <section id="contact" className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '15vh' }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <SectionHeading label="Initiate Contact" style={{ marginBottom: '3rem' }}>
                    <motion.h2 variants={itemVariants} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
                        {portfolioData.contact.title}<br /><span style={{ color: 'var(--text-secondary)' }}>{portfolioData.contact.subtitle}</span>
                    </motion.h2>
                </SectionHeading>

                <motion.div variants={itemVariants} className="architectural-layout" style={{ gap: '2rem' }}>
                    {/* Quick Info Column */}
                    <div className="col-span-5 glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'space-between' }}>
                        <div>
                            <Mail size={32} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }} />
                            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>PRIMARY EMAIL</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                                <a href={`mailto:${portfolioData.contact.email}`} className="interactive-element" style={{ fontSize: '1.2rem', fontWeight: 300 }}>
                                    {portfolioData.contact.email}
                                </a>
                                <button
                                    onClick={handleCopyEmail}
                                    className="btn"
                                    style={{
                                        padding: '0.3rem 0.6rem',
                                        fontSize: '0.7rem',
                                        background: emailCopied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        borderColor: emailCopied ? '#22c55e' : 'rgba(255, 255, 255, 0.15)',
                                        color: emailCopied ? '#4ade80' : 'var(--text-primary)'
                                    }}
                                >
                                    {emailCopied ? <Check size={12} /> : <Copy size={12} />}
                                    <span>{emailCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>DIGITAL PRESENCE</h4>
                            <div className="contact-links" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className="interactive-element" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Github size={20} /> GitHub <ArrowUpRight size={14} />
                                </a>
                                <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="interactive-element" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Linkedin size={20} /> LinkedIn <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Direct Message Form Column */}
                    <div className="col-span-7 glass-panel">
                        <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>SEND DIRECT MESSAGE</h4>
                        
                        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>YOUR NAME</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        placeholder="John Doe" 
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontFamily: 'var(--font-sans)',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>YOUR EMAIL</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        required 
                                        placeholder="john@example.com" 
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontFamily: 'var(--font-sans)',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>MESSAGE</label>
                                <textarea 
                                    name="message" 
                                    rows={4} 
                                    required 
                                    placeholder="Hello, I'd like to discuss a project..." 
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        resize: 'none'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formSubmitting}
                                className="btn interactive-element"
                                style={{
                                    alignSelf: 'flex-start',
                                    padding: '0.75rem 1.8rem',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    background: formSubmitting ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                                    color: formSubmitting ? 'var(--text-secondary)' : '#000',
                                    borderRadius: '100px',
                                    cursor: formSubmitting ? 'wait' : 'pointer'
                                }}
                            >
                                <Send size={15} />
                                <span>{formSubmitting ? 'Sending...' : 'Send Message'}</span>
                            </button>

                            {formStatus.message && (
                                <p style={{ 
                                    fontSize: '0.85rem', 
                                    color: formStatus.success ? '#4ade80' : '#f87171',
                                    marginTop: '0.5rem'
                                }}>
                                    {formStatus.message}
                                </p>
                            )}
                        </form>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} style={{ marginTop: '5rem', width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
                    <video
                        src="/footer_video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            objectFit: 'cover',
                            borderRadius: '12px'
                        }}
                    />
                </motion.div>

                <motion.footer variants={itemVariants} className="site-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src="/icon.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain', opacity: 0.8 }} />
                        <span>© {new Date().getFullYear()} {portfolioData.hero.name}.</span>
                    </div>
                    <span>CRAFTING RELIABLE SOFTWARE.</span>
                </motion.footer>
            </motion.div>
        </section>
    );
};
