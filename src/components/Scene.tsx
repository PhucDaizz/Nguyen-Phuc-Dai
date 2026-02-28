import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, MeshTransmissionMaterial, Float, Environment, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── SKILL GALAXY ────────────────────────────────────────────────────────────

const SKILLS = [
    'C#', '.NET 8', 'ASP.NET', 'EF Core', 'SOLID',
    'Clean Arch', 'Microservices', 'CQRS', 'MediatR',
    'SQL Server', 'Redis', 'RabbitMQ', 'MySQL', 'T-SQL',
    'React', 'TypeScript', 'SignalR', 'Docker', 'Ocelot',
    'Vite', 'Git', 'REST API', 'JWT', 'LINQ',
];

interface SkillNodeProps {
    text: string;
    radius: number;
    speed: number;
    initialAngle: number;
    yOffset: number;
    inclination: number;
}

const SkillNode = ({ text, radius, speed, initialAngle, yOffset, inclination }: SkillNodeProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const angle = useRef(initialAngle);

    const fontSize = THREE.MathUtils.mapLinear(radius, 3, 12, 0.42, 0.18);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        angle.current += delta * speed;

        groupRef.current.position.x = Math.cos(angle.current) * radius;
        groupRef.current.position.z = Math.sin(angle.current) * radius * 0.4;
        groupRef.current.position.y = yOffset + Math.sin(angle.current + inclination) * (radius * 0.3);

        // Billboard: always face camera
        groupRef.current.rotation.y = -angle.current;

        // Gentle pulse
        const pulse = 0.92 + Math.sin(state.clock.elapsedTime * 1.5 + initialAngle) * 0.08;
        groupRef.current.scale.setScalar(pulse);
    });

    return (
        <group ref={groupRef}>
            <Suspense fallback={null}>
                <Text
                    fontSize={fontSize}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={4}
                    outlineWidth={0.004}
                    outlineColor="#888888"
                    outlineOpacity={0.4}
                // No custom font - use built-in Helvetiker to avoid network/font errors
                >
                    {text}
                </Text>
            </Suspense>
        </group>
    );
};

const SkillOrbit = () => {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    const orbits = useMemo(() => {
        const seed = (i: number, salt: number) => {
            const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
            return x - Math.floor(x);
        };
        return SKILLS.map((text, i) => ({
            text,
            radius: 3 + seed(i, 0) * 9,
            speed: 0.08 + seed(i, 1) * 0.18,
            initialAngle: seed(i, 2) * Math.PI * 2,
            yOffset: (seed(i, 3) - 0.5) * 4,
            inclination: seed(i, 4) * Math.PI,
        }));
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;
        const offset = scroll.offset;

        // Desktop (5.5 pages):
        //   Hero      = 0.00–0.20
        //   Identity  = 0.20–0.42
        //   Projects  = 0.42–0.62
        //   Tech      = 0.62–0.82   ← Galaxy peaks HERE and stays through this section
        //   Contact   = 0.82–1.00
        //
        // Galaxy: fade-in starts at 0.58, full at 0.68, starts fading at 0.84, gone at 1.00
        const START = 0.58;
        const PEAK_IN = 0.68;
        const PEAK_OUT = 0.84;
        const END = 1.00;

        let vis = 0;
        if (offset >= START && offset <= PEAK_IN) {
            vis = (offset - START) / (PEAK_IN - START);
        } else if (offset > PEAK_IN && offset <= PEAK_OUT) {
            vis = 1; // Full visibility during the entire Tech section
        } else if (offset > PEAK_OUT && offset <= END) {
            vis = 1 - (offset - PEAK_OUT) / (END - PEAK_OUT);
        }

        // Smoothstep
        vis = vis * vis * (3 - 2 * vis);

        groupRef.current.visible = vis > 0.01;

        // Fade opacity of all child meshes
        groupRef.current.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (mesh.isMesh) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((m) => {
                    const mat = m as THREE.MeshBasicMaterial;
                    if (mat) {
                        mat.transparent = true;
                        mat.opacity = vis;
                        mat.needsUpdate = true;
                    }
                });
            }
        });

        // Float in from above
        groupRef.current.position.y = THREE.MathUtils.lerp(8, 0, vis);
        groupRef.current.rotation.y = offset * Math.PI * 0.5;
    });

    return (
        <group ref={groupRef}>
            {orbits.map((orbit) => (
                <SkillNode key={orbit.text} {...orbit} />
            ))}
        </group>
    );
};

// ─── GLASS STRUCTURE ─────────────────────────────────────────────────────────

const AbstractGlassStructure = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const scroll = useScroll();
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(2.5, 4), []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += delta * 0.1;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;

        const offset = scroll.offset;
        meshRef.current.rotation.y += offset * Math.PI;

        const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        meshRef.current.scale.setScalar(1 + offset * 1.5 + breathe);
        meshRef.current.position.y = -offset * 15;
        meshRef.current.position.z = offset * 5;
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <MeshTransmissionMaterial
                backside
                backsideThickness={1.5}
                thickness={1.5}
                ior={1.2}
                chromaticAberration={0.06}
                anisotropy={0.3}
                distortion={0.5}
                distortionScale={0.5}
                temporalDistortion={0.1}
                color="#ffffff"
                attenuationDistance={2}
                attenuationColor="#ffffff"
            />
        </mesh>
    );
};

// ─── BACKGROUND FRAGMENTS ────────────────────────────────────────────────────

// Pre-compute stable fragment data with deterministic seeding
const fragmentData = Array.from({ length: 30 }, (_, i) => {
    const seed = (s: number) => {
        const x = Math.sin(i * 73.1 + s * 157.3) * 43758.5453;
        return x - Math.floor(x);
    };
    return {
        position: [(seed(0) - 0.5) * 30, (seed(1) - 0.5) * 30, seed(2) * -20 - 5] as [number, number, number],
        rotation: [seed(3) * Math.PI, seed(4) * Math.PI, 0] as [number, number, number],
        scale: 0.1 + seed(5) * 0.4,
        isBox: seed(6) > 0.5,
        color: seed(7) > 0.8 ? '#ffffff' : '#444444',
        floatSpeed: 1 + seed(8),
    };
});

const Fragments = () => {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_state, delta) => {
        if (!groupRef.current) return;
        groupRef.current.position.y = scroll.offset * 20;
        groupRef.current.rotation.y += delta * 0.05;
    });

    return (
        <group ref={groupRef}>
            {fragmentData.map((f, i) => (
                <Float key={i} speed={f.floatSpeed} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={f.position} rotation={f.rotation} scale={f.scale}>
                        {f.isBox ? <boxGeometry /> : <octahedronGeometry args={[1, 0]} />}
                        <meshStandardMaterial color={f.color} metalness={0.8} roughness={0.2} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

// ─── MAIN SCENE ──────────────────────────────────────────────────────────────

export const Scene = () => {
    return (
        <>
            <color attach="background" args={['#000000']} />
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-10, -20, -10]} intensity={0.5} color="#4444ff" />
            <Sparkles count={300} scale={20} size={1} speed={0.4} opacity={0.2} color="#ffffff" />

            <AbstractGlassStructure />
            <Fragments />

            {/* Skill galaxy — Fade in on Technical Subsystems scroll range */}
            <SkillOrbit />
        </>
    );
};
