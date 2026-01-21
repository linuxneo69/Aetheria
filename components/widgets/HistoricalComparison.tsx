"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

interface HistoricalEvent {
    id: string;
    name: string;
    date: string;
    description: string;
    peakValue: number;
    type: 'xray' | 'kp' | 'proton';
}

const FAMOUS_EVENTS: HistoricalEvent[] = [
    {
        id: 'carrington',
        name: 'Carrington Event',
        date: 'September 1859',
        description: 'Largest recorded geomagnetic storm. Telegraph systems worldwide failed.',
        peakValue: 9,
        type: 'kp'
    },
    {
        id: 'march1989',
        name: 'March 1989 Storm',
        date: 'March 13, 1989',
        description: 'Caused Quebec blackout affecting 6 million people for 9 hours.',
        peakValue: 9,
        type: 'kp'
    },
    {
        id: 'halloween2003',
        name: 'Halloween Storms',
        date: 'October-November 2003',
        description: 'X17+ flares, satellite damage, aurora visible in Texas.',
        peakValue: 9,
        type: 'kp'
    },
    {
        id: 'bastille2000',
        name: 'Bastille Day Event',
        date: 'July 14, 2000',
        description: 'X5.7 flare with CME reaching Earth in just 33 hours.',
        peakValue: 9,
        type: 'kp'
    },
];

interface HistoricalComparisonProps {
    currentKp: number;
}

export function HistoricalComparison({ currentKp }: HistoricalComparisonProps) {
    const [selectedEvent, setSelectedEvent] = React.useState<HistoricalEvent | null>(null);
    const [dataType, setDataType] = React.useState<'kp' | 'xray' | 'proton'>('kp');

    // Generate comparison chart data
    const chartData = React.useMemo(() => {
        const current = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            current: currentKp + (Math.random() - 0.5) * 2,
            historical: selectedEvent ? selectedEvent.peakValue * (0.5 + Math.sin(i / 4) * 0.5) : 0,
        }));
        return current;
    }, [currentKp, selectedEvent]);

    return (
        <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                        Historical Comparison
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">
                        Compare current conditions with major events
                    </p>
                </div>

                {/* Solar Cycle Info */}
                <div className="text-right">
                    <p className="text-[10px] text-gray-500">Solar Cycle 25</p>
                    <p className="text-xs text-purple-400 font-medium">Active Phase</p>
                </div>
            </div>

            {/* Famous Events Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {FAMOUS_EVENTS.map((event) => (
                    <button
                        key={event.id}
                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                        className={`p-3 rounded-xl text-left transition-all ${selectedEvent?.id === event.id
                                ? 'bg-purple-500/20 border border-purple-500/50'
                                : 'bg-white/5 border border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <p className="text-xs font-medium text-white truncate">{event.name}</p>
                        <p className="text-[10px] text-gray-400">{event.date}</p>
                    </button>
                ))}
            </div>

            {/* Comparison Chart */}
            {selectedEvent && (
                <div className="mb-4">
                    <div className="h-[120px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis
                                    dataKey="hour"
                                    tick={{ fontSize: 9, fill: '#666' }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 9, fill: '#666' }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    tickLine={false}
                                    domain={[0, 9]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        fontSize: '10px'
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '10px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="current"
                                    name="Current"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="historical"
                                    name={selectedEvent.name}
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">{selectedEvent.description}</p>
                </div>
            )}

            {/* Current vs Historical Stats */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase">Current Kp</p>
                    <p className="text-lg font-mono font-bold text-green-400">{currentKp.toFixed(1)}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Carrington Equivalent</p>
                    <p className="text-lg font-mono font-bold text-purple-400">9.0</p>
                </div>
            </div>
        </div>
    );
}
