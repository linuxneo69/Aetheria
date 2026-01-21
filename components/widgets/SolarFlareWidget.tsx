"use client";

import { motion } from "framer-motion";
import { type SolarFlare } from "@/lib/api/nasa";

export function SolarFlareWidget({ flares }: { flares: SolarFlare[] }) {
    // Sort by date desc
    const recentFlares = [...flares].reverse().slice(0, 5);

    return (
        <div className="glass-panel p-6 rounded-2xl bg-opacity-30 min-h-[200px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 text-sm uppercase tracking-widest">Recent Solar Flares</h3>
                <span className="text-xs text-gray-500">{flares.length} detected (7d)</span>
            </div>

            <div className="space-y-3">
                {recentFlares.length === 0 ? (
                    <div className="text-gray-500 text-sm italic">No significant flares detected recently.</div>
                ) : (
                    recentFlares.map((flare) => {
                        const isStrong = flare.classType.startsWith('X') || flare.classType.startsWith('M');
                        return (
                            <motion.div
                                key={flare.flrID}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                            >
                                <div className="flex flex-col">
                                    <span className={`font-bold ${isStrong ? 'text-red-400' : 'text-blue-300'}`}>
                                        {flare.classType}
                                    </span>
                                    <span suppressHydrationWarning>
                                        {new Date(flare.beginTime).toLocaleDateString("en-US", { timeZone: "UTC" })}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500">Region</div>
                                    <div className="text-xs text-gray-300">{flare.sourceLocation || "N/A"}</div>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
