import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Loader = () => {
    const { progress } = useProgress();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        "INITIALIZING CORE SYSTEM ARCHITECTURE...",
        "MOUNTING THREE.JS 3D CANVAS & SHADERS...",
        "FETCHING GITHUB METRICS & REPOSITORIES...",
        "COMPILING CLEAN ARCHITECTURE MODULES...",
        "SYSTEM READY - LAUNCHING PORTFOLIO..."
    ];

    useEffect(() => {
        if (progress < 25) setCurrentStep(0);
        else if (progress < 50) setCurrentStep(1);
        else if (progress < 75) setCurrentStep(2);
        else if (progress < 99) setCurrentStep(3);
        else setCurrentStep(4);
    }, [progress]);

    return (
        <AnimatePresence>
            {progress < 100 && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#050507',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        color: '#ffffff',
                        pointerEvents: 'none'
                    }}
                >
                    {/* Background Grid Pattern */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                            backgroundSize: '30px 30px',
                            opacity: 0.5
                        }}
                    />

                    {/* Top Status Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute',
                            top: '3rem',
                            fontSize: '0.75rem',
                            letterSpacing: '0.3em',
                            color: 'var(--text-secondary)',
                            fontFamily: "'Space Grotesk', sans-serif"
                        }}
                    >
                        NGUYEN PHUC DAI // PORTFOLIO OS v2.4
                    </motion.div>

                    {/* Central Progress Number */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div
                            style={{
                                fontSize: 'clamp(4rem, 12vw, 8rem)',
                                fontWeight: 300,
                                fontFamily: "'Space Grotesk', sans-serif",
                                letterSpacing: '-0.04em',
                                background: 'linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            {progress.toFixed(0)}<span style={{ fontSize: '2rem', opacity: 0.5, WebkitTextFillColor: '#38bdf8' }}>%</span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div
                        style={{
                            width: 'min(80vw, 320px)',
                            height: '2px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            marginTop: '2.5rem',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '100px'
                        }}
                    >
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                background: 'linear-gradient(90deg, #38bdf8, #ffffff)',
                                boxShadow: '0 0 15px #38bdf8'
                            }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>

                    {/* Dynamic Diagnostic Log Text */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            fontSize: '0.75rem',
                            letterSpacing: '0.15em',
                            marginTop: '1.8rem',
                            color: '#38bdf8',
                            fontFamily: 'monospace',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
                        {steps[currentStep]}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

