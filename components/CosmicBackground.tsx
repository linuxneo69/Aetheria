"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Pre-generated deterministic values to avoid hydration mismatch
const STAR_POSITIONS = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: (i * 17 + 23) % 100,
    y: (i * 31 + 11) % 100,
    size: ((i * 7) % 15) / 10 + 0.5,
    duration: ((i * 13) % 30) / 10 + 2,
    delay: ((i * 19) % 20) / 10,
}));

const NEBULA_CONFIG = [
    { id: 0, x: 10, y: 20, size: 400, color: 'purple', duration: 35 },
    { id: 1, x: 70, y: 10, size: 350, color: 'blue', duration: 40 },
    { id: 2, x: 30, y: 70, size: 500, color: 'pink', duration: 45 },
    { id: 3, x: 80, y: 60, size: 300, color: 'indigo', duration: 38 },
    { id: 4, x: 50, y: 40, size: 450, color: 'violet', duration: 42 },
];

const PARTICLE_CONFIG = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    r: ((i * 7) % 10) / 10 + 0.5,
    red: 150 + ((i * 13) % 100),
    green: 150 + ((i * 17) % 100),
    cx1: (i * 23) % 100,
    cy1: (i * 29) % 100,
    cx2: (i * 31) % 100,
    cy2: (i * 37) % 100,
    cx3: (i * 41) % 100,
    cy3: (i * 43) % 100,
    duration: 20 + ((i * 11) % 30),
}));

export function CosmicBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Deep space gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-slate-900" />

            {/* Nebulae clouds */}
            {NEBULA_CONFIG.map((nebula) => {
                const nebulaClass = nebula.color === 'purple' ? 'from-purple-600 to-transparent' :
                    nebula.color === 'blue' ? 'from-blue-600 to-transparent' :
                        nebula.color === 'pink' ? 'from-pink-600 to-transparent' :
                            nebula.color === 'indigo' ? 'from-indigo-600 to-transparent' :
                                'from-violet-600 to-transparent';

                return (
                    <motion.div
                        key={`nebula-${nebula.id}`}
                        className={`absolute rounded-full blur-3xl opacity-10 ${nebulaClass}`}
                        style={{
                            left: `${nebula.x}%`,
                            top: `${nebula.y}%`,
                            width: `${nebula.size}px`,
                            height: `${nebula.size}px`,
                            background: `radial-gradient(circle, var(--tw-gradient-stops))`,
                        }}
                        animate={{
                            scale: [1, 1.2, 0.9, 1],
                            opacity: [0.08, 0.15, 0.1, 0.08],
                            x: [0, 30, -20, 0],
                            y: [0, -20, 30, 0],
                        }}
                        transition={{
                            duration: nebula.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}

            {/* Animated stars */}
            {STAR_POSITIONS.map((star) => (
                <motion.div
                    key={`star-${star.id}`}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Shooting stars */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={`shooting-${i}`}
                    className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{
                        width: '100px',
                        top: `${20 + i * 25}%`,
                        left: '-100px',
                    }}
                    animate={{
                        x: ['0vw', '120vw'],
                        y: ['0vh', '30vh'],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 8 + 5,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* Aurora borealis effect at top */}
            <div className="absolute top-0 left-0 right-0 h-64">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-emerald-500/3 to-transparent blur-3xl"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        x: [-50, 50, -50],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-cyan-500/3 to-transparent blur-3xl"
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        x: [50, -50, 50],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3,
                    }}
                />
            </div>

            {/* Cosmic dust particles - using deterministic values */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {PARTICLE_CONFIG.map((particle) => (
                    <motion.circle
                        key={`particle-${particle.id}`}
                        r={particle.r}
                        fill={`rgba(${particle.red}, ${particle.green}, 255, 0.6)`}
                        filter="url(#glow)"
                        animate={{
                            cx: [
                                `${particle.cx1}%`,
                                `${particle.cx2}%`,
                                `${particle.cx3}%`,
                            ],
                            cy: [
                                `${particle.cy1}%`,
                                `${particle.cy2}%`,
                                `${particle.cy3}%`,
                            ],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>

            {/* Radial gradient overlay for depth */}
            <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }}
            />
        </div>
    );
}
