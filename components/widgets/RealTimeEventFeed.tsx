"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sun, Radio, Wind, Activity, AlertTriangle } from 'lucide-react';

interface SpaceEvent {
    id: string;
    type: 'flare' | 'cme' | 'geomagnetic' | 'radiation' | 'radio' | 'aurora';
    title: string;
    time: Date;
    severity: 'minor' | 'moderate' | 'major';
    description?: string;
}

const EVENT_ICONS = {
    flare: Zap,
    cme: Sun,
    geomagnetic: Activity,
    radiation: AlertTriangle,
    radio: Radio,
    aurora: Wind,
};

const EVENT_COLORS = {
    minor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    moderate: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    major: 'text-red-400 bg-red-500/10 border-red-500/30',
};

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

interface RealTimeEventFeedProps {
    events: SpaceEvent[];
}

export function RealTimeEventFeed({ events }: RealTimeEventFeedProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState<SpaceEvent | null>(null);

    // Use mock events if none provided
    const displayEvents: SpaceEvent[] = events.length > 0 ? events : [
        { id: '1', type: 'flare', title: 'M2.1 Solar Flare', time: new Date(Date.now() - 3600000), severity: 'moderate' },
        { id: '2', type: 'cme', title: 'Partial Halo CME', time: new Date(Date.now() - 7200000), severity: 'minor' },
        { id: '3', type: 'geomagnetic', title: 'G1 Storm Watch', time: new Date(Date.now() - 14400000), severity: 'moderate' },
        { id: '4', type: 'radio', title: 'R1 Radio Blackout', time: new Date(Date.now() - 21600000), severity: 'minor' },
        { id: '5', type: 'aurora', title: 'Aurora Visible 55°N', time: new Date(Date.now() - 28800000), severity: 'minor' },
    ];

    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                    Event Feed
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">{displayEvents.length} events</span>
                    <motion.span
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        className="text-gray-400"
                    >
                        ▼
                    </motion.span>
                </div>
            </div>

            {/* Event List */}
            <motion.div
                initial={false}
                animate={{ height: isCollapsed ? 0 : 'auto' }}
                className="overflow-hidden"
            >
                <div className="px-4 pb-4 space-y-2 max-h-[400px] overflow-y-auto">
                    {displayEvents.slice(0, 10).map((event, index) => {
                        const Icon = EVENT_ICONS[event.type];
                        const colorClass = EVENT_COLORS[event.severity];

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedEvent(event)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-white/5 transition-colors ${colorClass}`}
                            >
                                <div className="p-2 rounded-lg bg-white/5">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{event.title}</p>
                                    <p className="text-[10px] text-gray-400" suppressHydrationWarning>
                                        {getRelativeTime(event.time)}
                                    </p>
                                </div>
                                <div className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-medium ${colorClass}`}>
                                    {event.severity}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Detail Modal */}
            {selectedEvent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedEvent(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass-panel rounded-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {React.createElement(EVENT_ICONS[selectedEvent.type], { className: 'w-6 h-6 text-purple-400' })}
                            <div>
                                <h3 className="text-lg font-bold text-white">{selectedEvent.title}</h3>
                                <p className="text-sm text-gray-400" suppressHydrationWarning>
                                    {selectedEvent.time.toLocaleString('en-US', { timeZone: 'UTC' })} UTC
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300">
                            {selectedEvent.description || 'No additional details available for this event.'}
                        </p>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="mt-4 w-full py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
