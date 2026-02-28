import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader = () => {
    const { progress } = useProgress();

    return (
        <AnimatePresence>
            {progress < 100 && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#000000',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999, /* Above everything */
                        color: '#ffffff',
                        pointerEvents: 'none'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '0.85rem', letterSpacing: '0.3em', marginBottom: '2rem', color: '#a1a1aa' }}
                    >
                        INITIALIZING CORE ENGINE
                    </motion.div>

                    <div style={{ fontSize: '5rem', fontWeight: 300, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {progress.toFixed(0)}%
                    </div>

                    <div style={{ width: '250px', height: '1px', background: 'rgba(255,255,255,0.1)', marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
                        <motion.div
                            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#ffffff' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
