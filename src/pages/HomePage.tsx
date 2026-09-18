import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Scene } from '../components/Scene';
import { HTMLContent } from '../components/HTMLContent';
import { TerminalCLI } from '../components/TerminalCLI';
import { Suspense, useState, useEffect } from 'react';

export const HomePage = () => {
  const [pages, setPages] = useState(7.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      if (width <= 768) {
        setPages(11.5);
      } else if (width <= 1024) {
        setPages(9.2);
      } else {
        setPages(7.8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <TerminalCLI />
      <div id="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <ScrollControls pages={pages} damping={0.1}>
              <Scene isMobile={isMobile} />
              <HTMLContent />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};
