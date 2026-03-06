import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Scene } from './components/Scene';
import { HTMLContent } from './components/HTMLContent';
import { Suspense, useState, useEffect } from 'react';
import { Loader } from './components/Loader';

function App() {
  const [pages, setPages] = useState(7.5);

  useEffect(() => {
    const handleResize = () => {
      // Because fields stack vertically on smaller screens, they take up more 'vh'.
      // Total content is ~7+ pages on desktop (Hero 1 + Identity 1.5 + Projects 1.5 + Expertise 1.5 + Contact 1 + padding)
      if (window.innerWidth <= 768) {
        setPages(12); // Extend scrolling area for mobile (all columns stack vertically)
      } else if (window.innerWidth <= 1024) {
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
          dpr={[1, 1.5]} // Performance: limit pixel ratio cap to 1.5 (down from 2, huge FPS improvement on retinal screens)
          gl={{ antialias: false, powerPreference: "high-performance", alpha: false }} // alpha: false helps performance
          performance={{ min: 0.5 }} // Allows fiber to scale down resolution if frame drops
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <ScrollControls pages={pages} damping={0.2}>
              {/* The 3D world that moves automatically as you scroll */}
              <Scene />

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
