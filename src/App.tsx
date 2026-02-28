import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Scene } from './components/Scene';
import { HTMLContent } from './components/HTMLContent';
import { Cursor } from './components/Cursor';
import { Suspense, useState, useEffect } from 'react';
import { Loader } from './components/Loader';

function App() {
  const [pages, setPages] = useState(5.5);

  useEffect(() => {
    const handleResize = () => {
      // Because fields stack vertically on smaller screens, they take up more 'vh'.
      if (window.innerWidth <= 768) {
        setPages(8.5); // Extend scrolling area for mobile
      } else if (window.innerWidth <= 1024) {
        setPages(7); // Extend scrolling area for tablet
      } else {
        setPages(5.5); // Default for desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Cursor />
      <Loader />
      <div id="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 2]} // Performance: pixel ratio cap
          gl={{ antialias: false, powerPreference: "high-performance" }} // Performance optimization
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
