"use client";

import { motion } from "framer-motion";
import { RefreshCcw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface StormLevelWidgetProps {
    kpIndex: number; // 0-9
    timeTag: string;
}

export function StormLevelWidget({ kpIndex, timeTag }: StormLevelWidgetProps) {
    // Determine color and status
    let statusColor = "bg-green-500";
    let statusText = "Quiet";

    if (kpIndex >= 4 && kpIndex < 5) {
        statusColor = "bg-yellow-500";
        statusText = "Unsettled";
    } else if (kpIndex >= 5) {
        statusColor = "bg-red-500";
        statusText = "Storm";
    }

    // Create Kp levels (0 to 9)
    const kpLevels = Array.from({ length: 9 }, (_, i) => i + 1);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-between min-h-[280px] relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="w-full flex items-center justify-between mb-6 z-10">
                <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    Kp Activity
                </h3>
                <button
                    onClick={() => window.location.reload()}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <RefreshCcw className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                </button>
            </div>

            <div className="space-y-2">
                {kpLevels.map((level, i) => {
                    const isFilled = kpIndex >= level;
                    const barColor = level <= 3 ? 'from-green-500 to-emerald-500' :
                        level <= 6 ? 'from-yellow-500 to-orange-500' :
                            'from-orange-500 to-red-600';

                    return (
                        <motion.div
                            key={level}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-xs text-gray-500 font-mono w-6">{level}</span>
                            <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: isFilled ? '100%' : '0%' }}
                                    transition={{ duration: 0.8, delay: i * 0.05 + 0.2, ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-r ${barColor} relative ${kpIndex >= 5 && isFilled ? 'animate-pulse-glow' : ''
                                        }`}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="text-center">
                <div className={cn("text-3xl font-bold", statusColor.replace("bg-", "text-"))}>
                    Kp {kpIndex}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                    Status: {statusText}
                </div>
                <div className="text-gray-500 text-[10px] mt-1" suppressHydrationWarning>
                    {new Date(timeTag).toLocaleTimeString("en-US", { timeZone: "UTC", hour12: false })} UTC
                </div>
            </div>
        </motion.div>
    );
}
