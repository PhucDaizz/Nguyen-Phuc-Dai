import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Scene } from './components/Scene';
import { HTMLContent } from './components/HTMLContent';
import { Suspense, useState, useEffect } from 'react';
import { Loader } from './components/Loader';

function App() {
  const [pages, setPages] = useState(7.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);

      // Because fields stack vertically on smaller screens, they take up more 'vh'.
      if (width <= 768) {
        setPages(12); // Extend scrolling area for mobile (all columns stack vertically)
      } else if (width <= 1024) {
        setPages(9); // Extend scrolling area for tablet
      } else {
        setPages(7.5); // Default for desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Loader />
      <div id="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]} // Performance: limit pixel ratio to 1 on mobile, 1.5 on desktop
          gl={{ antialias: false, powerPreference: "high-performance", alpha: false }} // alpha: false helps performance
          performance={{ min: 0.5 }} // Allows fiber to scale down resolution if frame drops
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <ScrollControls pages={pages} damping={0.1}>
              {/* The 3D world that moves automatically as you scroll */}
              <Scene isMobile={isMobile} />

              {/* The HTML overlay that scrolls naturally alongside the 3D scroll */}
              <HTMLContent />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
