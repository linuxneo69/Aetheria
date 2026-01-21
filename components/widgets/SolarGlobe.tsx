"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function SunSphere({ textureUrl }: { textureUrl: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    const texture = useLoader(THREE.TextureLoader, textureUrl);

    // Create a custom shader for the corona glow effect
    const coronaMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffcc66) },
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 color;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Very slow rotation to simulate sun's rotation
            meshRef.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <group>
            {/* Corona Glow Effect */}
            <mesh ref={glowRef} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[2, 64, 64]} />
                <primitive object={coronaMaterial} attach="material" />
            </mesh>

            {/* Main Sun Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    emissive={new THREE.Color(0xffaa33)}
                    emissiveIntensity={0.3}
                />
            </mesh>
        </group>
    );
}

export function SolarGlobe() {
    // Use AIA 193 (green) - shows coronal holes and active regions much better than HMI
    // This wavelength (193 Angstroms) is perfect for viewing the corona and sunspots
    const originalUrl = "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg";
    const textureUrl = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;

    return (
        <div className="w-full h-[400px] md:h-[500px] relative glass-panel rounded-2xl overflow-hidden border border-orange-500/20"
            style={{ boxShadow: '0 0 60px rgba(255, 150, 50, 0.2), inset 0 0 30px rgba(0,0,0,0.5)' }}>

            <div className="absolute top-4 left-0 w-full text-center z-10 pointer-events-none">
                <h3 className="text-orange-200/80 text-xs tracking-[0.2em] uppercase font-medium">Live SDO AIA 193</h3>
                <p className="text-[10px] text-gray-400">Corona at 1.2M K • Sunspots & Active Regions</p>
            </div>

            {/* Outer Glow Ring - Animated */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none z-0">
                <div className="absolute inset-0 rounded-2xl border-2 border-orange-400/30 animate-pulse-glow" />
            </div>

            {/* HUD Overlay - High Tech Observatory Feel */}
            <div className="absolute inset-0 z-20 pointer-events-none p-4">
                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-orange-500/40" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-orange-500/40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-orange-500/40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-orange-500/40" />

                {/* Coordinate Grid Labels */}
                <div className="absolute top-1/2 left-2 -translate-y-1/2 flex flex-col gap-8 text-[8px] font-mono text-orange-500/50 uppercase vertical-text">
                    <span>90°N</span>
                    <span>45°N</span>
                    <span>00°E</span>
                    <span>45°S</span>
                    <span>90°S</span>
                </div>

                {/* Scanning Line */}
                <motion.div
                    className="absolute left-0 right-0 h-[1px] bg-orange-400/20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Data Points (Fixed) */}
                <div className="absolute top-12 right-6 text-right space-y-1 hidden md:block">
                    <p className="text-[8px] font-mono text-orange-400/60 uppercase">System Frequency</p>
                    <p className="text-[10px] font-mono text-orange-200">2.8 GHz</p>
                    <div className="h-1 w-20 bg-orange-950 rounded-full overflow-hidden mt-1">
                        <motion.div
                            className="h-full bg-orange-500"
                            animate={{ width: ['20%', '80%', '40%', '90%', '20%'] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#ff9944" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6622" />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={3.5}
                    maxDistance={10}
                    autoRotate={true}
                    autoRotateSpeed={0.3}
                />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

                <React.Suspense fallback={null}>
                    <SunSphere textureUrl={textureUrl} />
                </React.Suspense>
            </Canvas>

            <div className="absolute bottom-4 left-0 w-full text-center z-10 pointer-events-none">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest bg-black/40 backdrop-blur-md inline-block px-4 py-1 rounded-full border border-white/5">
                    Drag to Rotate • Scroll to Zoom • Auto-rotating
                </p>
            </div>
        </div>
    );
}
