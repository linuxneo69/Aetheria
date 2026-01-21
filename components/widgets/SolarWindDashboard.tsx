"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Gauge, Wind, Zap, Activity, RefreshCcw } from "lucide-react";
import { type SolarWind } from "@/lib/api/solar-wind";

export function SolarWindDashboard({ data }: { data: SolarWind | null }) {
    if (!data) return <div className="glass-panel p-4 text-center text-gray-500">Solar Wind Data Unavailable</div>;

    // Interpretation of Bz
    const bzColor = data.bz < -5 ? "text-red-500" : (data.bz < 0 ? "text-yellow-400" : "text-green-400");
    const speedColor = data.speed > 500 ? "text-red-400" : (data.speed > 400 ? "text-yellow-400" : "text-blue-300");

    return (
        <div className="glass-panel p-6 rounded-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-400" /> Real-Time Solar Wind (L1)
                </h3>
                <button
                    onClick={() => window.location.reload()}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <RefreshCcw className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Speed */}
                <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">Speed</div>
                    <div className={`text-2xl font-mono font-bold ${speedColor}`}>
                        {data.speed.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-600">km/sec</div>
                </div>

                {/* Density */}
                <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">Density</div>
                    <div className="text-2xl font-mono font-bold text-orange-200">
                        {data.density.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-600">p/cm³</div>
                </div>

                {/* Bz (IMF) */}
                <div className="flex flex-col items-center border-l border-white/5">
                    <div className="text-xs text-gray-500 uppercase mb-1">Bz (South)</div>
                    <div className={`text-2xl font-mono font-bold ${bzColor}`}>
                        {data.bz.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-600">nT</div>
                    {data.bz < 0 && <span className="text-[9px] text-red-400 animate-pulse mt-1">SOUTHWARD</span>}
                </div>

                {/* Bt (Total Field) */}
                <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">Bt (Total)</div>
                    <div className="text-2xl font-mono font-bold text-white">
                        {data.bt.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-600">nT</div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-right text-gray-500" suppressHydrationWarning>
                Updated: {new Date(data.base_time).toLocaleTimeString("en-US", { timeZone: "UTC", hour12: false })} UTC
            </div>
        </div>
    );
}
