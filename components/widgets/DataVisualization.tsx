"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Activity, Zap, Wind, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataPoint {
    time: string;
    value: number;
}

interface DataVisualizationProps {
    solarWindSpeed: DataPoint[];
    xrayFlux: DataPoint[];
    kpHistory: DataPoint[];
}

const TABS = [
    { id: 'solar-wind', label: 'Solar Wind', icon: Wind, color: '#3B82F6', unit: 'km/s' },
    { id: 'xray', label: 'X-Ray Flux', icon: Zap, color: '#F59E0B', unit: 'W/m²' },
    { id: 'kp', label: 'Kp Index', icon: Activity, color: '#10B981', unit: '' },
];

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        const startTime = Date.now();
        const startValue = displayValue;
        const endValue = value;

        const timer = setInterval(() => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplayValue(startValue + (endValue - startValue) * easeProgress);

            if (progress === 1) clearInterval(timer);
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <>{displayValue.toFixed(1)}</>;
}

export function DataVisualization({ solarWindSpeed, xrayFlux, kpHistory }: DataVisualizationProps) {
    const [activeTab, setActiveTab] = React.useState('kp');
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const getActiveData = () => {
        switch (activeTab) {
            case 'solar-wind': return { data: solarWindSpeed, color: '#3B82F6', label: 'Speed (km/s)', unit: 'km/s' };
            case 'xray': return { data: xrayFlux, color: '#F59E0B', label: 'Flux (W/m²)', unit: 'W/m²' };
            case 'kp': return { data: kpHistory, color: '#10B981', label: 'Kp Index', unit: '' };
            default: return { data: [], color: '#fff', label: '', unit: '' };
        }
    };

    const { data, color, label, unit } = getActiveData();

    // Generate mock data only if mounted to prevent hydration mismatch
    const displayData = React.useMemo(() => {
        if (data.length > 0) return data;
        if (!mounted) return [];
        return Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: activeTab === 'solar-wind' ? Math.random() * 200 + 300 :
                activeTab === 'kp' ? Math.random() * 6 + 1 :
                    Math.random() * 1e-6
        }));
    }, [data, mounted, activeTab]);

    const current = displayData.length > 0 ? displayData[displayData.length - 1].value : 0;
    const high = displayData.length > 0 ? Math.max(...displayData.map(d => d.value)) : 0;
    const low = displayData.length > 0 ? Math.min(...displayData.map(d => d.value)) : 0;
    const trend = displayData.length > 1 ? displayData[displayData.length - 1].value - displayData[displayData.length - 2].value : 0;

    return (
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden animate-subtle-shift bg-gradient-to-br from-purple-900/10 via-black/40 to-blue-900/10 border border-white/10 group">
            {/* Space Illustration Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                {/* Orbiting Planets / Moons */}
                <motion.div
                    className="absolute top-10 right-20 w-16 h-16 rounded-full border border-blue-400/30"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    <div className="absolute -top-1 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
                </motion.div>

                <motion.div
                    className="absolute -bottom-20 -left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />

                {/* Star Field inside widget */}
                <div className="absolute inset-0">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-[1px] h-[1px] bg-white rounded-full"
                            style={{
                                top: `${(i * 13 + 7) % 100}%`,
                                left: `${(i * 17 + 3) % 100}%`,
                                opacity: ((i * 3) % 10) / 20 + 0.1
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Sub-widget background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium flex items-center gap-2">
                            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                            Real-Time Data Monitoring
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-1">24-Hour Observation Window</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 hover:bg-white/10 rounded-full transition-all group/refresh active:scale-95"
                            title="Refresh Data"
                        >
                            <RefreshCcw className="w-4 h-4 text-gray-500 group-hover/refresh:text-purple-400 group-active/refresh:rotate-180 transition-all duration-500" />
                        </button>

                        {/* Live indicator */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-xs text-green-400 font-medium">LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Tab Buttons with enhanced styling */}
                <div className="flex gap-2 mb-6">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all relative overflow-hidden ${isActive
                                    ? 'bg-white/15 border border-white/20 text-white shadow-lg'
                                    : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className="w-3 h-3 relative z-10" style={{ color: isActive ? tab.color : undefined }} />
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Enhanced Chart with gradient fill */}
                <div className="h-[220px] w-full mb-6 rounded-xl bg-black/20 p-4 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={displayData}>
                            <defs>
                                <linearGradient id={`colorGradient-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: '#666' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={false}
                                interval="preserveStartEnd"
                                minTickGap={30}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#666' }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={false}
                                width={50}
                                domain={activeTab === 'kp' ? [0, 9] : ['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,0,0,0.95)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                    padding: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}
                                labelStyle={{ color: '#999', fontSize: '11px', marginBottom: '4px', display: 'block' }}
                                itemStyle={{ color: color, fontSize: '14px', fontWeight: 'bold' }}
                                formatter={(value: number | string | (number | string)[] | undefined) => {
                                    if (value === undefined) return ['', ''];
                                    const val = Array.isArray(value) ? Number(value[0]) : Number(value);
                                    if (isNaN(val)) return [value, label];
                                    const formattedValue = activeTab === 'xray' ? val.toExponential(2) : val.toFixed(1);
                                    return [`${formattedValue} ${unit}`, label];
                                }}
                                labelFormatter={(label) => `Time: ${label} UTC`}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={3}
                                fill={`url(#colorGradient-${activeTab})`}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: color,
                                    stroke: '#fff',
                                    strokeWidth: 2,
                                    filter: 'drop-shadow(0 0 8px ' + color + ')'
                                }}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Enhanced Summary Cards with gauges */}
                <div className="grid grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                        <p className="text-[10px] text-gray-500 uppercase mb-1 relative z-10">Current</p>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <p className="text-2xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                <AnimatedNumber value={current} />
                            </p>
                            <span className="text-xs text-gray-600">{unit}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            {trend > 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-400" />
                            ) : (
                                <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                            <span className={`text-[10px] ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {Math.abs(trend).toFixed(1)}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all"
                    >
                        <p className="text-[10px] text-gray-500 uppercase mb-1">24h High</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-mono font-bold text-orange-300">
                                <AnimatedNumber value={high} />
                            </p>
                            <span className="text-xs text-gray-600">{unit}</span>
                        </div>
                        <div className="h-1 bg-orange-500/20 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(current / high) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all"
                    >
                        <p className="text-[10px] text-gray-500 uppercase mb-1">24h Low</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-mono font-bold text-green-300">
                                <AnimatedNumber value={low} />
                            </p>
                            <span className="text-xs text-gray-600">{unit}</span>
                        </div>
                        <div className="h-1 bg-green-500/20 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(low / high) * 100}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
