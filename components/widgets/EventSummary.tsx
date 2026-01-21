"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Activity, Zap, CheckCircle2, ShieldAlert } from "lucide-react";

export function EventSummary({ hasXClass, stormLevel }: { hasXClass: boolean, stormLevel: number }) {
    let summary = "Solar activity is currently stable.";
    let status = "NOMINAL";
    let Icon = CheckCircle2;
    let colorClass = "from-green-500/20 to-emerald-500/10";
    let borderClass = "border-green-500/30";
    let textClass = "text-green-400";
    let glowClass = "shadow-green-500/20";

    if (stormLevel >= 5) {
        summary = "Geomagnetic storm in progress. Aurora visible at lower latitudes.";
        status = "CRITICAL";
        Icon = ShieldAlert;
        colorClass = "from-red-600/30 to-orange-600/10";
        borderClass = "border-red-500/50";
        textClass = "text-red-400";
        glowClass = "shadow-red-500/40";
    } else if (hasXClass) {
        summary = "Major X-Class flare detected. Potential radio blackouts.";
        status = "ALERT";
        Icon = Zap;
        colorClass = "from-orange-500/30 to-red-600/10";
        borderClass = "border-orange-500/50";
        textClass = "text-orange-400";
        glowClass = "shadow-orange-500/30";
    } else if (stormLevel >= 4) {
        summary = "Unsettled geomagnetic conditions.";
        status = "ELEVATED";
        Icon = Activity;
        colorClass = "from-yellow-500/20 to-orange-500/10";
        borderClass = "border-yellow-500/40";
        textClass = "text-yellow-400";
        glowClass = "shadow-yellow-500/20";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden glass-panel p-6 rounded-2xl border ${borderClass} bg-gradient-to-br ${colorClass} ${glowClass} shadow-xl group`}
        >
            {/* Animated Scanning Line */}
            <motion.div
                className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10`}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Background Grain/Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-20 flex flex-col items-center">
                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border ${borderClass} mb-4`}>
                    <Icon className={`w-3.5 h-3.5 ${textClass} animate-pulse`} />
                    <span className={`text-[10px] font-black tracking-[0.2em] font-mono ${textClass}`}>
                        STATUS: {status}
                    </span>
                </div>

                {/* Main Message */}
                <h3 className={`text-xl font-bold text-center tracking-tight leading-tight ${textClass}`}>
                    {summary}
                </h3>

                {/* Decorative Brackets */}
                <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${borderClass} rounded-tl-lg`} />
                <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${borderClass} rounded-tr-lg`} />
                <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${borderClass} rounded-bl-lg`} />
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${borderClass} rounded-br-lg`} />

                {/* Telemetry Label (Bottom) */}
                <div className="mt-4 flex items-center gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <span className={`w-1 h-1 rounded-full ${textClass.replace('text-', 'bg-')} animate-ping`} />
                        Real-time Analytics
                    </span>
                    <span>•</span>
                    <span>System Active</span>
                </div>
            </div>

            {/* Accent Ambient Glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-20 ${textClass.replace('text-', 'bg-')}`} />
        </motion.div>
    );
}
