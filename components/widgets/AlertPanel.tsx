"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, RefreshCcw, CheckCircle } from 'lucide-react';

interface Alert {
    id: string;
    type: string;
    severity: 'minor' | 'moderate' | 'severe';
    message: string;
    issued: Date;
}

interface AlertPanelProps {
    alerts: Alert[];
    isLoading?: boolean;
    error?: string;
    onRefresh?: () => void;
}

const SEVERITY_STYLES = {
    minor: {
        border: 'border-yellow-500/50',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/20',
    },
    moderate: {
        border: 'border-orange-500/50',
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        glow: 'shadow-orange-500/20',
    },
    severe: {
        border: 'border-red-500/50',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        glow: 'shadow-red-500/30',
        pulse: true,
    },
};

// NOAA Space Weather Scales
const NOAA_SCALES = [
    { scale: 'G', name: 'Geomagnetic', levels: ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'] },
    { scale: 'R', name: 'Radio Blackout', levels: ['R0', 'R1', 'R2', 'R3', 'R4', 'R5'] },
    { scale: 'S', name: 'Solar Radiation', levels: ['S0', 'S1', 'S2', 'S3', 'S4', 'S5'] },
];

export function AlertPanel({ alerts, isLoading, error, onRefresh }: AlertPanelProps) {

    // Error state
    if (error) {
        return (
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                        Active Alerts
                    </h3>
                    <button onClick={onRefresh} className="p-2 hover:bg-white/10 rounded-full">
                        <RefreshCcw className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                    <p className="text-sm text-red-300">Alert Network Offline</p>
                    <button
                        onClick={onRefresh}
                        className="mt-3 px-4 py-2 text-xs bg-white/10 hover:bg-white/15 rounded-lg text-white"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    // All clear state
    if (alerts.length === 0) {
        return (
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                        Active Alerts
                    </h3>
                </div>

                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="p-3 rounded-full bg-green-500/10 mb-3">
                        <Shield className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-sm text-green-300 font-medium">All Clear</p>
                    <p className="text-[10px] text-gray-500 mt-1">No active space weather alerts</p>
                </div>

                {/* NOAA Scale Legend */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase mb-2">Current Conditions</p>
                    <div className="grid grid-cols-3 gap-2">
                        {NOAA_SCALES.map((scale) => (
                            <div key={scale.scale} className="text-center p-2 rounded-lg bg-white/5">
                                <p className="text-lg font-mono font-bold text-green-400">{scale.scale}0</p>
                                <p className="text-[9px] text-gray-400">{scale.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Active alerts
    return (
        <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                    Active Alerts ({alerts.length})
                </h3>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {alerts.map((alert, index) => {
                    const style = SEVERITY_STYLES[alert.severity];
                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl border ${style.border} ${style.bg} ${style.glow} shadow-lg ${alert.severity === 'severe' ? 'animate-pulse-critical' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangle className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
                                <div>
                                    <p className={`text-sm font-medium ${style.text}`}>{alert.type}</p>
                                    <p className="text-xs text-gray-300 mt-1">{alert.message}</p>
                                    <p className="text-[10px] text-gray-500 mt-2" suppressHydrationWarning>
                                        Issued: {alert.issued.toLocaleString('en-US', { timeZone: 'UTC' })} UTC
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Severity Legend */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-gray-500 uppercase mb-2">Severity Classification</p>
                <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-[10px] text-gray-400">Minor</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] text-gray-400">Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] text-gray-400">Severe</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
