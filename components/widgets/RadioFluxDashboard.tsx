"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Radio, Zap, Sun } from 'lucide-react';

interface RadioFluxDashboardProps {
    protonFlux?: number;
    electronFlux?: number;
    f107Flux?: number;
}

const CHART_TYPES = [
    { id: 'proton', label: 'Proton Flux', icon: Zap, color: '#ef4444' },
    { id: 'electron', label: 'Electron Flux', icon: Radio, color: '#3b82f6' },
    { id: 'f107', label: '10.7cm Flux', icon: Sun, color: '#f59e0b' },
];

// S-Scale radiation storm levels
const S_SCALE = [
    { level: 'S1', label: 'Minor', color: 'bg-green-500', threshold: 10 },
    { level: 'S2', label: 'Moderate', color: 'bg-yellow-500', threshold: 100 },
    { level: 'S3', label: 'Strong', color: 'bg-orange-500', threshold: 1000 },
    { level: 'S4', label: 'Severe', color: 'bg-red-500', threshold: 10000 },
    { level: 'S5', label: 'Extreme', color: 'bg-red-800', threshold: 100000 },
];

export function RadioFluxDashboard({ protonFlux = 0.5, electronFlux = 1e4, f107Flux = 150 }: RadioFluxDashboardProps) {
    const [activeChart, setActiveChart] = React.useState('proton');

    // Generate mock 24h data
    const chartData = React.useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            proton: Math.random() * 10,
            electron: Math.random() * 1e5,
            f107: 120 + Math.random() * 60,
        }));
    }, []);

    // Determine current S-level
    const currentSLevel = S_SCALE.find(s => protonFlux < s.threshold) || S_SCALE[0];

    return (
        <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                        Particle & Radio Flux
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">
                        Radiation storm monitoring
                    </p>
                </div>

                {/* S-Scale Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className={`w-2 h-2 rounded-full ${currentSLevel.color}`} />
                    <span className="text-xs text-white font-medium">{currentSLevel.level}</span>
                    <span className="text-[10px] text-gray-400">{currentSLevel.label}</span>
                </div>
            </div>

            {/* Chart Toggle */}
            <div className="flex gap-2 mb-4">
                {CHART_TYPES.map((chart) => {
                    const Icon = chart.icon;
                    const isActive = activeChart === chart.id;
                    return (
                        <button
                            key={chart.id}
                            onClick={() => setActiveChart(chart.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${isActive
                                ? 'bg-white/15 border border-white/20 text-white'
                                : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Icon className="w-3 h-3" style={{ color: isActive ? chart.color : undefined }} />
                            {chart.label}
                        </button>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 9, fill: '#666' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 9, fill: '#666' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={false}
                            width={40}
                            scale={activeChart === 'electron' ? 'log' : 'auto'}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '11px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey={activeChart}
                            stroke={CHART_TYPES.find(c => c.id === activeChart)?.color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Radio Burst Feed */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <h4 className="text-xs text-gray-400 uppercase mb-2">Recent Radio Bursts</h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5">
                        <span className="text-gray-300">Type II Burst</span>
                        <span className="text-gray-500" suppressHydrationWarning>2h ago</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5">
                        <span className="text-gray-300">Type III Burst</span>
                        <span className="text-gray-500" suppressHydrationWarning>5h ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
