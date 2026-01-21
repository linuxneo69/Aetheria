"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Radio, Navigation, ShieldCheck } from 'lucide-react';

interface CompactImpactProps {
    kpIndex: number;
}

export function CompactImpact({ kpIndex }: CompactImpactProps) {
    const getAuroraVis = (kp: number) => {
        if (kp >= 7) return { label: 'High', color: 'text-green-400' };
        if (kp >= 5) return { label: 'Moderate', color: 'text-emerald-400' };
        return { label: 'Low', color: 'text-gray-500' };
    };

    const getRadioStatus = (kp: number) => {
        if (kp >= 7) return { label: 'Blackout', color: 'text-red-400' };
        if (kp >= 5) return { label: 'Disturbed', color: 'text-orange-400' };
        return { label: 'Normal', color: 'text-blue-400' };
    };

    const aurora = getAuroraVis(kpIndex);
    const radio = getRadioStatus(kpIndex);

    return (
        <div className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Personal Impact</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-help" title="Aurora Visibility Probability">
                    <Eye className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 uppercase leading-none mb-0.5">Aurora</span>
                        <span className={`text-[10px] font-bold ${aurora.color} leading-none`}>{aurora.label}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 group cursor-help" title="HF Radio Propagation Status">
                    <Radio className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 uppercase leading-none mb-0.5">HF Radio</span>
                        <span className={`text-[10px] font-bold ${radio.color} leading-none`}>{radio.label}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 group cursor-help" title="GPS Accuracy Status">
                    <Navigation className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 uppercase leading-none mb-0.5">GPS</span>
                        <span className="text-[10px] font-bold text-green-400 leading-none">Stable</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
