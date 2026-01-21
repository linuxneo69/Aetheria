"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Zap, Radio } from 'lucide-react';

interface CriticalAlertBannerProps {
    hasXClass: boolean;
    hasGeoStorm: boolean;
    message?: string;
    onDismiss?: () => void;
}

export function CriticalAlertBanner({ hasXClass, hasGeoStorm, message, onDismiss }: CriticalAlertBannerProps) {
    const [dismissed, setDismissed] = React.useState(false);
    const [alertId, setAlertId] = React.useState<number | null>(null);

    React.useEffect(() => {
        setAlertId(Math.floor(Math.random() * 900) + 100);
    }, []);

    const isActive = (hasXClass || hasGeoStorm) && !dismissed;

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    const alertConfig = hasXClass
        ? {
            gradient: 'from-red-900/90 via-orange-900/80 to-red-900/90',
            icon: Zap,
            title: 'X-CLASS SOLAR FLARE DETECTED',
            subtitle: message || 'Potential radio blackouts and radiation storm risk.'
        }
        : {
            gradient: 'from-purple-900/90 via-red-900/80 to-purple-900/90',
            icon: Radio,
            title: 'GEOMAGNETIC STORM IN PROGRESS',
            subtitle: message || 'Aurora visible at lower latitudes. GPS/HF radio disruption possible.'
        };

    const Icon = alertConfig.icon;

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`relative z-50 bg-gradient-to-r ${alertConfig.gradient} backdrop-blur-xl border-b border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] overflow-hidden`}
                >
                    {/* Cosmic Texture Overlays */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
                        <motion.div
                            className="absolute top-0 left-0 w-200% h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"
                            animate={{ x: [0, -100] }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        />
                    </div>

                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.25, 1],
                                        boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.5)', '0 0 0px rgba(239,68,68,0)']
                                    }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="p-3 bg-red-500/30 rounded-full border border-red-500/50"
                                >
                                    <Icon className="h-6 w-6 text-red-200" />
                                </motion.div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-black text-white tracking-widest uppercase">
                                            {alertConfig.title}
                                        </h3>
                                        <span className="animate-pulse bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">EMERGENCY</span>
                                    </div>
                                    <p className="text-xs text-red-100/90 font-medium">
                                        {alertConfig.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden md:block text-right">
                                    <p className="text-[9px] text-red-200/60 uppercase tracking-tighter">System Alert Code</p>
                                    <p className="text-[10px] text-red-100 font-mono">
                                        SW-X{alertId || '---'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-90"
                                >
                                    <X className="h-5 w-5 text-red-200" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Animated bottom Scanning line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-500/20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-transparent via-red-400 to-transparent w-full"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
