"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

export function MoonPhaseWidget() {
    // Calculate current moon phase
    const getMoonPhase = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Simple moon phase calculation
        let c = 0;
        let e = 0;
        let jd = 0;
        let b = 0;

        if (month < 3) {
            c = year - 1;
            e = month + 12;
        } else {
            c = year;
            e = month;
        }

        jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
        b = (jd - 2451550.1) / 29.530588853;
        b = b - Math.floor(b);

        const phase = b * 8; // 0-8

        if (phase < 1) return { name: 'New Moon', illumination: 0, emoji: '🌑', percent: 0 };
        if (phase < 2) return { name: 'Waxing Crescent', illumination: 0.25, emoji: '🌒', percent: 12.5 };
        if (phase < 3) return { name: 'First Quarter', illumination: 0.5, emoji: '🌓', percent: 50 };
        if (phase < 4) return { name: 'Waxing Gibbous', illumination: 0.75, emoji: '🌔', percent: 75 };
        if (phase < 5) return { name: 'Full Moon', illumination: 1, emoji: '🌕', percent: 100 };
        if (phase < 6) return { name: 'Waning Gibbous', illumination: 0.75, emoji: '🌖', percent: 75 };
        if (phase < 7) return { name: 'Last Quarter', illumination: 0.5, emoji: '🌗', percent: 50 };
        return { name: 'Waning Crescent', illumination: 0.25, emoji: '🌘', percent: 12.5 };
    };

    const [mounted, setMounted] = React.useState(false);
    const [phase, setPhase] = React.useState<any>(null);

    React.useEffect(() => {
        setMounted(true);
        setPhase(getMoonPhase());
    }, []);

    if (!mounted || !phase) {
        return <div className="glass-panel rounded-2xl p-6 h-[120px] animate-pulse bg-white/5" />;
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel rounded-2xl p-6 border border-blue-500/20"
        >
            <div className="flex items-center gap-2 mb-4">
                <Moon className="w-4 h-4 text-blue-300" />
                <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                    Moon Phase
                </h3>
            </div>

            <div className="flex items-center gap-6">
                {/* Moon visualization */}
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        className="relative w-20 h-20"
                    >
                        {/* Moon sphere */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[0_0_30px_rgba(200,200,220,0.5)]">
                            {/* Craters */}
                            <div className="absolute top-3 left-4 w-2 h-2 bg-gray-500 rounded-full opacity-40" />
                            <div className="absolute bottom-4 right-5 w-3 h-3 bg-gray-600 rounded-full opacity-30" />
                            <div className="absolute top-1/2 left-5 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-50" />
                        </div>

                        {/* Shadow overlay for phase */}
                        <div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-black to-transparent"
                            style={{
                                opacity: 1 - phase.illumination,
                                transform: phase.name.includes('Waning') ? 'scaleX(-1)' : 'scaleX(1)'
                            }}
                        />
                    </motion.div>

                    {/* Glow */}
                    <div className="absolute -inset-2 rounded-full bg-blue-200/20 blur-xl -z-10" />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="text-4xl mb-2">{phase.emoji}</div>
                    <p className="text-lg font-medium text-white mb-1" suppressHydrationWarning>{phase.name}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${phase.percent}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300"
                            />
                        </div>
                        <span className="text-xs text-gray-400 font-mono" suppressHydrationWarning>{phase.percent}%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
