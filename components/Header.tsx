"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Globe, Bell, Activity, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { type NOAAAlert } from "@/lib/api/noaa";

interface HeaderProps {
    threatLevel: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
    alerts: NOAAAlert[];
    isLive?: boolean;
    children?: React.ReactNode;
}

export function Header({ threatLevel, alerts, isLive = true, children }: HeaderProps) {
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [showNotifications, setShowNotifications] = React.useState(false);
    const alertCount = alerts.length;

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const threatConfig = {
        NOMINAL: { color: 'text-green-400', bg: 'bg-green-500', ping: 'bg-green-400' },
        ELEVATED: { color: 'text-orange-400', bg: 'bg-orange-500', ping: 'bg-orange-400' },
        CRITICAL: { color: 'text-red-400', bg: 'bg-red-500', ping: 'bg-red-400' },
    };

    const config = threatConfig[threatLevel];

    return (
        <header className="sticky top-0 z-40 glass-panel border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            {/* Header Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative z-10">
                <div className="flex items-center justify-between">

                    {/* Mission Control Clock (Desktop) */}
                    <div className="hidden lg:flex flex-col items-start min-w-[120px]">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Mission Time</span>
                        <div className="text-xl font-mono text-blue-400 font-black tabular-nums" suppressHydrationWarning>
                            {currentTime.getUTCHours().toString().padStart(2, '0')}:
                            {currentTime.getUTCMinutes().toString().padStart(2, '0')}:
                            {currentTime.getUTCSeconds().toString().padStart(2, '0')}
                            <span className="text-xs ml-1 text-gray-500 font-normal">UTC</span>
                        </div>
                    </div>

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-5 group">
                        {/* Animated Highly Visual Sun Logo */}
                        <div className="relative w-14 h-14">
                            {/* Corona Glow Layers */}
                            <motion.div
                                className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            />
                            <motion.div
                                className="absolute inset-2 rounded-full bg-yellow-500/10 blur-lg"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                            />

                            {/* Orbital Rings */}
                            <div className="absolute inset-0 rounded-full border border-purple-500/40 animate-spin-slow" />
                            <div className="absolute inset-2 rounded-full border-t border-b border-blue-400/30 animate-spin-slow"
                                style={{ animationDirection: 'reverse', animationDuration: '10s' }} />

                            {/* The Sun Core */}
                            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 shadow-lg shadow-orange-500/50">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.08, 1]
                                    }}
                                    transition={{
                                        rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                                        scale: { repeat: Infinity, duration: 4 }
                                    }}
                                    className="relative w-full h-full rounded-full overflow-hidden"
                                >
                                    {/* Sunspots simulation */}
                                    <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-orange-950 rounded-full opacity-60" />
                                    <div className="absolute bottom-3 right-2 w-1 h-1 bg-red-950 rounded-full opacity-40" />
                                    <div className="absolute top-1/2 left-2 w-1 h-1 bg-orange-900 rounded-full opacity-50" />

                                    <Sun className="absolute inset-0 m-auto w-5 h-5 text-white/50" />
                                </motion.div>
                            </div>

                            {/* Flares / Rays */}
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-8 h-[1px] bg-gradient-to-r from-yellow-400 to-transparent origin-left"
                                    style={{ rotate: angle }}
                                    animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                                />
                            ))}
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                                    AETHERIA
                                </h1>
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] border border-white/10 text-gray-400 font-mono">v2.1</span>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium">
                                Space Weather Observatory
                            </p>
                        </div>
                    </Link>

                    {/* Injected Content (like CompactImpact) */}
                    <div className="flex-1 flex justify-center px-8">
                        {children}
                    </div>

                    {/* Status Section */}
                    <div className="flex items-center gap-6">

                        {/* Threat Level Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                            <div className="relative">
                                <Globe className={`w-4 h-4 ${config.color}`} />
                                <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${config.bg} animate-ping`} />
                            </div>
                            <span className={`text-xs font-medium ${config.color}`}>
                                {threatLevel}
                            </span>
                        </div>

                        {/* Alert Counter & Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Bell className={`w-4 h-4 ${alertCount > 0 ? 'text-purple-300' : 'text-gray-500'}`} />
                                {alertCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                        {alertCount}
                                    </span>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowNotifications(false)}
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-80 glass-panel border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300">Space Weather alerts</h4>
                                                <button onClick={() => setShowNotifications(false)}>
                                                    <X className="w-4 h-4 text-gray-500 hover:text-white" />
                                                </button>
                                            </div>

                                            <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                                                {alerts.length > 0 ? (
                                                    alerts.map((alert) => (
                                                        <div
                                                            key={alert.id}
                                                            className={`p-3 rounded-xl border ${alert.severity === 'severe' ? 'bg-red-500/10 border-red-500/30' :
                                                                    alert.severity === 'moderate' ? 'bg-orange-500/10 border-orange-500/30' :
                                                                        'bg-blue-500/10 border-blue-500/30'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`mt-0.5 p-1 rounded ${alert.severity === 'severe' ? 'text-red-400' :
                                                                        alert.severity === 'moderate' ? 'text-orange-400' :
                                                                            'text-blue-400'
                                                                    }`}>
                                                                    {alert.severity === 'severe' ? <AlertCircle className="w-3.5 h-3.5" /> :
                                                                        alert.severity === 'moderate' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                                                                            <Info className="w-3.5 h-3.5" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[11px] font-bold text-gray-200 uppercase leading-none mb-1">{alert.type}</p>
                                                                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{alert.message}</p>
                                                                    <p className="text-[8px] text-gray-500 mt-2 font-mono" suppressHydrationWarning>
                                                                        {alert.issued.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} UTC
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <p className="text-xs text-gray-500 italic">No active space weather alerts</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 bg-white/5 border-t border-white/10 text-center">
                                                <button className="text-[10px] text-purple-400 font-bold uppercase tracking-widest hover:text-purple-300 transition-colors">
                                                    View All Bulletins
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Live Status */}
                        {isLive && (
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                </span>
                                <span className="text-xs text-green-400 font-medium">LIVE</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
