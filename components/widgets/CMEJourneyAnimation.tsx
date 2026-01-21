"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Rocket, Zap, Globe } from 'lucide-react';

export function CMEJourneyAnimation() {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    // Animation stages
    const stages = [
        { id: 1, name: 'Solar Eruption', time: '0h', distance: '0 km', description: 'Massive solar flare triggers CME' },
        { id: 2, name: 'CME Departing Sun', time: '12h', distance: '25M km', description: 'Plasma cloud accelerates through space' },
        { id: 3, name: 'Solar Wind Transit', time: '36h', distance: '100M km', description: 'CME travels at 500-800 km/s' },
        { id: 4, name: 'Approaching L1 Point', time: '60h', distance: '148M km', description: 'Satellites detect incoming cloud' },
        { id: 5, name: 'Earth Impact', time: '72h', distance: '150M km', description: 'Magnetosphere compressed, aurora visible' },
    ];

    const currentStage = stages[Math.floor(progress / 20)] || stages[0];
    const cmePosition = progress;
    const showAurora = progress >= 95;
    const showImpact = progress >= 90;

    React.useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    setIsPlaying(false);
                    return 100;
                }
                return p + 0.3; // Slower animation
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isPlaying]);

    const reset = () => {
        setProgress(0);
        setIsPlaying(false);
    };

    return (
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-2 border-purple-500/20">
            {/* Enhanced background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-purple-900/10 to-blue-900/10 animate-subtle-shift" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="flex items-center justify-center gap-3 mb-3"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                        <Rocket className="w-6 h-6 text-orange-400" />
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400">
                            Journey Through a CME
                        </h3>
                        <Zap className="w-6 h-6 text-purple-400" />
                    </motion.div>
                    <p className="text-sm text-gray-300">
                        Watch a Coronal Mass Ejection travel 150 million km from the Sun to Earth
                    </p>
                </div>

                {/* Enhanced Animation Canvas */}
                <div className="relative h-[280px] mb-8 bg-gradient-to-b from-black/40 to-black/20 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
                    {/* Stars background */}
                    <div className="absolute inset-0">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-[1px] h-[1px] bg-white rounded-full"
                                style={{
                                    left: `${(i * 19 + 7) % 100}%`,
                                    top: `${(i * 31 + 13) % 100}%`,
                                    opacity: ((i * 7) % 10) / 20 + 0.3
                                }}
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ repeat: Infinity, duration: ((i * 3) % 4) + 2 }}
                            />
                        ))}
                    </div>

                    {/* Sun */}
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20">
                        <motion.div
                            animate={{ scale: [1, 1.08, 1], rotate: 360 }}
                            transition={{
                                scale: { repeat: Infinity, duration: 3 },
                                rotate: { repeat: Infinity, duration: 60, ease: "linear" }
                            }}
                            className="relative w-24 h-24"
                        >
                            {/* Sun corona */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 blur-2xl opacity-60 animate-pulse" />

                            {/* Sun surface */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-[0_0_80px_rgba(255,150,0,0.9)]">
                                {/* Surface details */}
                                <div className="absolute inset-0 rounded-full opacity-50">
                                    <div className="absolute top-3 left-4 w-3 h-3 bg-orange-900 rounded-full" />
                                    <div className="absolute bottom-5 right-3 w-4 h-4 bg-red-900 rounded-full" />
                                    <div className="absolute top-1/2 left-3 w-2 h-2 bg-yellow-900 rounded-full" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Solar flare eruption */}
                        <AnimatePresence>
                            {progress > 0 && progress < 20 && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0, x: 0 }}
                                    animate={{
                                        scale: [0, 2, 1.5],
                                        opacity: [0, 1, 0.3],
                                        x: [0, 40, 60]
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 2 }}
                                    className="absolute top-0 right-0 w-24 h-24"
                                >
                                    <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 blur-2xl" />
                                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-yellow-200" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CME Cloud with trail */}
                    <AnimatePresence>
                        {progress > 5 && progress < 98 && (
                            <motion.div
                                initial={{ left: '10%', opacity: 0 }}
                                animate={{
                                    left: `${10 + (progress * 0.75)}%`,
                                    opacity: 1
                                }}
                                className="absolute top-1/2 -translate-y-1/2 z-10"
                            >
                                {/* Particle trail */}
                                <div className="absolute right-full mr-2 flex gap-1">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 h-1 rounded-full bg-purple-400"
                                            animate={{
                                                opacity: [0.8, 0.2],
                                                scale: [1, 0.3]
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.1,
                                                repeat: Infinity
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Main CME cloud */}
                                <div className="relative">
                                    {/* Outer glow */}
                                    <motion.div
                                        className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur-xl"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />

                                    {/* Core */}
                                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 shadow-[0_0_40px_rgba(168,85,247,0.8)]">
                                        {/* Internal structure */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                            className="absolute inset-0 rounded-full"
                                        >
                                            <div className="absolute top-2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full blur-sm" />
                                            <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-blue-300 rounded-full blur-sm" />
                                            <div className="absolute top-1/2 left-2 w-2 h-2 bg-purple-200 rounded-full blur-sm" />
                                            <div className="absolute top-1/2 right-2 w-2 h-2 bg-pink-200 rounded-full blur-sm" />
                                        </motion.div>
                                    </div>

                                    {/* Magnetic field lines */}
                                    <svg className="absolute -inset-8 w-32 h-32 pointer-events-none">
                                        <motion.path
                                            d="M 64 32 Q 48 16 32 32"
                                            stroke="rgba(168, 85, 247, 0.4)"
                                            strokeWidth="1"
                                            fill="none"
                                            animate={{ pathLength: [0, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                        <motion.path
                                            d="M 64 96 Q 48 112 32 96"
                                            stroke="rgba(236, 72, 153, 0.4)"
                                            strokeWidth="1"
                                            fill="none"
                                            animate={{ pathLength: [0, 1] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                        />
                                    </svg>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Earth */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20">
                        <div className="relative">
                            {/* Earth */}
                            <motion.div
                                className="relative w-16 h-16"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_0_60px_rgba(59,130,246,0.7)]">
                                    {/* Continents */}
                                    <div className="absolute inset-0 rounded-full">
                                        <div className="absolute top-4 left-3 w-5 h-3 bg-green-600/80 rounded-sm" />
                                        <div className="absolute bottom-3 right-4 w-3 h-3 bg-green-700/80 rounded-full" />
                                        <div className="absolute top-1/2 left-5 w-2 h-4 bg-green-600/80" />

                                        {/* Clouds */}
                                        <motion.div
                                            className="absolute top-2 right-2 w-4 h-2 bg-white/40 rounded-full blur-sm"
                                            animate={{ x: [-2, 2, -2] }}
                                            transition={{ repeat: Infinity, duration: 5 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Magnetosphere */}
                            <svg className="absolute -inset-8 w-32 h-32 pointer-events-none">
                                <motion.ellipse
                                    cx="64"
                                    cy="64"
                                    rx="50"
                                    ry="40"
                                    stroke="rgba(168, 85, 247, 0.3)"
                                    strokeWidth="2"
                                    fill="none"
                                    animate={{ opacity: showImpact ? [0.3, 0.8, 0.3] : 0.3 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <ellipse
                                    cx="64"
                                    cy="64"
                                    rx="40"
                                    ry="30"
                                    stroke="rgba(168, 85, 247, 0.2)"
                                    strokeWidth="1"
                                    fill="none"
                                />
                            </svg>

                            {/* Impact shockwave */}
                            <AnimatePresence>
                                {showImpact && !showAurora && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0.8 }}
                                        animate={{ scale: 2.5, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.5, repeat: 2 }}
                                        className="absolute inset-0 rounded-full border-4 border-purple-400"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Aurora - North and South */}
                            <AnimatePresence>
                                {showAurora && (
                                    <>
                                        {/* Northern aurora */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                            animate={{
                                                opacity: [0.5, 1, 0.7, 1],
                                                scale: [0.8, 1.2, 0.9, 1.1],
                                                y: -24
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute -top-10 left-1/2 -translate-x-1/2"
                                        >
                                            <div className="w-12 h-6 bg-gradient-to-t from-green-400 via-emerald-300 to-transparent blur-md rounded-full" />
                                            <div className="absolute inset-0 w-12 h-6 bg-gradient-to-t from-green-300 via-teal-200 to-transparent blur-sm rounded-full" />
                                        </motion.div>

                                        {/* Southern aurora */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                            animate={{
                                                opacity: [0.5, 1, 0.7, 1],
                                                scale: [0.8, 1.2, 0.9, 1.1],
                                                y: 24
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 0.5
                                            }}
                                            className="absolute -bottom-10 left-1/2 -translate-x-1/2"
                                        >
                                            <div className="w-12 h-6 bg-gradient-to-b from-green-400 via-emerald-300 to-transparent blur-md rounded-full" />
                                            <div className="absolute inset-0 w-12 h-6 bg-gradient-to-b from-green-300 via-teal-200 to-transparent blur-sm rounded-full" />
                                        </motion.div>

                                        {/* Aurora particles */}
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 bg-green-300 rounded-full"
                                                style={{
                                                    left: `${Math.sin(i * 30 * Math.PI / 180) * 40 + 50}%`,
                                                    top: i < 6 ? '-30px' : 'calc(100% + 30px)'
                                                }}
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    y: i < 6 ? [0, 10, 0] : [0, -10, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: i * 0.2
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Globe icon on Earth */}
                            <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
                        </div>
                    </div>

                    {/* Distance markers */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-between px-16 text-[10px] text-gray-500">
                        <span>Sun</span>
                        <span>25M km</span>
                        <span>75M km</span>
                        <span>125M km</span>
                        <span>Earth</span>
                    </div>
                </div>

                {/* Enhanced Timeline */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400 font-medium">Progress Timeline</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-400 font-mono bg-purple-500/10 px-3 py-1 rounded-full">
                                {currentStage.time} elapsed
                            </span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50"
                        style={{
                            background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`
                        }}
                    />
                </div>

                {/* Stage info */}
                <motion.div
                    key={currentStage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
                >
                    <h4 className="text-lg font-bold text-white mb-1">{currentStage.name}</h4>
                    <p className="text-sm text-gray-300">{currentStage.description}</p>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 text-center border border-orange-500/20">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Distance Traveled</p>
                        <p className="text-lg font-mono font-bold text-orange-300">{currentStage.distance}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 text-center border border-purple-500/20">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Average Speed</p>
                        <p className="text-lg font-mono font-bold text-purple-300">600 km/s</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Time Elapsed</p>
                        <p className="text-lg font-mono font-bold text-blue-300">{currentStage.time}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border-2 border-purple-500/50 rounded-xl text-white font-medium transition-all shadow-lg shadow-purple-500/20"
                    >
                        {isPlaying ? (
                            <><Pause className="w-5 h-5" /> Pause</>
                        ) : (
                            <><Play className="w-5 h-5" /> {progress > 0 ? 'Resume' : 'Start Journey'}</>
                        )}
                    </button>
                    <button
                        onClick={reset}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-gray-300 hover:text-white transition-all"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
