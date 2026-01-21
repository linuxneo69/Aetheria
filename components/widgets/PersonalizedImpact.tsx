"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Radio, Navigation, Eye, HelpCircle, Rocket } from 'lucide-react';

interface PersonalizedImpactProps {
    kpIndex: number;
    latitude?: number;
}

interface GlossaryTerm {
    term: string;
    definition: string;
    explanation: string;
    related: string[];
}

const GLOSSARY: GlossaryTerm[] = [
    {
        term: 'Kp Index',
        definition: 'Global geomagnetic activity index',
        explanation: 'Ranges 0-9. Values 5+ indicate geomagnetic storms. Higher Kp = aurora visible at lower latitudes.',
        related: ['Geomagnetic Storm', 'Aurora']
    },
    {
        term: 'Bz Component',
        definition: 'Southward interplanetary magnetic field',
        explanation: 'When Bz is negative (southward), it can couple with Earth\'s field causing storms. More negative = higher impact.',
        related: ['IMF', 'Solar Wind']
    },
    {
        term: 'X-ray Flux',
        definition: 'Solar X-ray emission intensity',
        explanation: 'Measured in W/m². Flares classified as A, B, C, M, X based on flux. X-class = major flare.',
        related: ['Solar Flare', 'Radio Blackout']
    },
];

function getAuroraVisibility(kp: number, lat: number): { probability: number; message: string } {
    // Simplified aurora visibility calculation
    const latThreshold = 67 - (kp * 3); // Higher Kp = visible at lower latitudes
    if (lat >= latThreshold) {
        const prob = Math.min(90, 40 + kp * 10);
        return { probability: prob, message: 'Aurora likely visible' };
    }
    if (lat >= latThreshold - 5) {
        return { probability: 30, message: 'Aurora possible on horizon' };
    }
    return { probability: 5, message: 'Aurora unlikely at your latitude' };
}

function getHFConditions(kp: number): { status: string; color: string } {
    if (kp >= 7) return { status: 'Poor', color: 'text-red-400' };
    if (kp >= 5) return { status: 'Fair', color: 'text-orange-400' };
    if (kp >= 3) return { status: 'Good', color: 'text-yellow-400' };
    return { status: 'Excellent', color: 'text-green-400' };
}

export function PersonalizedImpact({ kpIndex, latitude = 28.6 }: PersonalizedImpactProps) {
    const [location, setLocation] = React.useState({ lat: latitude, name: 'Delhi, India' });
    const [selectedTerm, setSelectedTerm] = React.useState<GlossaryTerm | null>(null);
    const [showCMEJourney, setShowCMEJourney] = React.useState(false);

    const aurora = getAuroraVisibility(kpIndex, location.lat);
    const hfConditions = getHFConditions(kpIndex);

    return (
        <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium mb-4">
                Personalized Impact
            </h3>

            {/* Local Impact Card */}
            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">{location.name}</span>
                    <span className="text-[10px] text-gray-500">({location.lat.toFixed(1)}°N)</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {/* Aurora Visibility */}
                    <div className="text-center p-2 rounded-lg bg-white/5">
                        <Eye className="w-4 h-4 mx-auto mb-1 text-green-400" />
                        <p className="text-lg font-mono font-bold text-white">{aurora.probability}%</p>
                        <p className="text-[9px] text-gray-400">Aurora</p>
                    </div>

                    {/* HF Radio */}
                    <div className="text-center p-2 rounded-lg bg-white/5">
                        <Radio className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <p className={`text-sm font-bold ${hfConditions.color}`}>{hfConditions.status}</p>
                        <p className="text-[9px] text-gray-400">HF Radio</p>
                    </div>

                    {/* GPS */}
                    <div className="text-center p-2 rounded-lg bg-white/5">
                        <Navigation className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                        <p className="text-sm font-bold text-green-400">Normal</p>
                        <p className="text-[9px] text-gray-400">GPS</p>
                    </div>
                </div>
            </div>

            {/* Interactive Glossary */}
            <div className="mb-4">
                <h4 className="text-xs text-gray-400 uppercase mb-2 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Quick Reference
                </h4>
                <div className="flex flex-wrap gap-2">
                    {GLOSSARY.map((term) => (
                        <button
                            key={term.term}
                            onClick={() => setSelectedTerm(term)}
                            className="px-2 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                        >
                            {term.term}
                        </button>
                    ))}
                </div>
            </div>

            {/* Glossary Modal */}
            {selectedTerm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedTerm(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass-panel rounded-2xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-2">{selectedTerm.term}</h3>
                        <p className="text-sm text-purple-300 mb-3">{selectedTerm.definition}</p>
                        <p className="text-sm text-gray-300 mb-4">{selectedTerm.explanation}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedTerm.related.map((r) => (
                                <span key={r} className="px-2 py-1 rounded-full text-[10px] bg-white/5 text-gray-400">
                                    {r}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedTerm(null)}
                            className="w-full py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
