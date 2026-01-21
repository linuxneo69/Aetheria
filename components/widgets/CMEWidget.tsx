"use client";

import { motion } from "framer-motion";
import { type CME } from "@/lib/api/nasa";

export function CMEWidget({ cmes }: { cmes: CME[] }) {
    const latestCME = cmes.length > 0 ? cmes[cmes.length - 1] : null;

    return (
        <div className="glass-panel p-6 rounded-2xl min-h-[150px] flex flex-col justify-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Latest CME Activity</h3>

            {latestCME ? (
                <div>
                    <div className="text-2xl text-blue-200 font-light mb-1" suppressHydrationWarning>
                        {new Date(latestCME.startTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-brand-blue-400 mb-3" suppressHydrationWarning>
                        {new Date(latestCME.startTime).toLocaleTimeString("en-US", { timeZone: "UTC", hour12: false })} UTC
                    </div>

                    {latestCME.cmeAnalyses && latestCME.cmeAnalyses.length > 0 ? (
                        <div className="flex items-center space-x-4">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase">Speed</div>
                                <div className="text-lg font-mono">{latestCME.cmeAnalyses[0].speed} <span className="text-sm text-gray-600">km/s</span></div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase">Type</div>
                                <div className="text-lg font-mono">{latestCME.cmeAnalyses[0].type}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">Analysis pending...</div>
                    )}
                </div>
            ) : (
                <div className="text-gray-500 italic">No recent CMEs detected.</div>
            )}
        </div>
    );
}
