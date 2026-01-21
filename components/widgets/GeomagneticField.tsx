"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import { RefreshCcw } from "lucide-react";

interface GeomagneticFieldProps {
    kpIndex: number;
}

function Earth() {
    return (
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial
                color="#1e40af"
                transparent
                opacity={0.8}
                emissive="#1e3a8a"
                emissiveIntensity={0.3}
            />
        </Sphere>
    );
}

function AuroraOval({ position, scale, intensity }: { position: [number, number, number], scale: number, intensity: number }) {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35 * scale, 0.08, 16, 32]} />
            <meshBasicMaterial
                color="#22c55e"
                transparent
                opacity={0.3 + intensity * 0.4}
            />
        </mesh>
    );
}

function MagneticFieldLine({ index, total }: { index: number, total: number }) {
    const angle = (index / total) * Math.PI * 2;
    const points = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let t = -1; t <= 1; t += 0.05) {
            const r = 2 + Math.cos(t * Math.PI) * 1.5;
            const x = Math.cos(angle) * r * (1 - Math.abs(t) * 0.3);
            const y = t * 3;
            const z = Math.sin(angle) * r * (1 - Math.abs(t) * 0.3);
            pts.push(new THREE.Vector3(x, y, z));
        }
        return pts;
    }, [angle]);

    return (
        <Line
            points={points}
            color="#8b5cf6"
            lineWidth={1}
            transparent
            opacity={0.4}
        />
    );
}

function SolarWindStream() {
    const points = useMemo(() => {
        return [
            new THREE.Vector3(-8, 0, 0),
            new THREE.Vector3(-4, 0, 0),
            new THREE.Vector3(-2, 0, 0),
        ];
    }, []);

    return (
        <Line
            points={points}
            color="#fbbf24"
            lineWidth={2}
            dashed
            dashScale={2}
        />
    );
}

function MagnetosphereScene({ kpIndex }: { kpIndex: number }) {
    const groupRef = useRef<THREE.Group>(null);

    // Aurora intensity based on Kp
    const auroraIntensity = Math.min(kpIndex / 9, 1);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <Earth />

            {/* Aurora Ovals */}
            <AuroraOval position={[0, 0.85, 0]} scale={1} intensity={auroraIntensity} />
            <AuroraOval position={[0, -0.85, 0]} scale={1} intensity={auroraIntensity} />

            {/* Magnetic Field Lines */}
            {Array.from({ length: 8 }).map((_, i) => (
                <MagneticFieldLine key={i} index={i} total={8} />
            ))}

            {/* Solar Wind */}
            <SolarWindStream />
        </group>
    );
}


export function GeomagneticField({ kpIndex }: GeomagneticFieldProps) {
    return (
        <div className="glass-panel rounded-2xl p-4 h-[300px] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                    Magnetosphere & Aurora
                </h3>
                <button
                    onClick={() => window.location.reload()}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <RefreshCcw className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                </button>
            </div>
            <p className="text-[10px] text-gray-500 mb-3">
                Kp {kpIndex.toFixed(1)} • Aurora at {kpIndex >= 5 ? 'mid' : 'high'} latitudes
            </p>

            <div className="h-[220px] rounded-xl overflow-hidden bg-black/30">
                <Canvas camera={{ position: [5, 2, 5], fov: 45 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[-10, 0, 0]} intensity={2} color="#fbbf24" />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    <MagnetosphereScene kpIndex={kpIndex} />
                </Canvas>
            </div>
        </div>
    );
}
