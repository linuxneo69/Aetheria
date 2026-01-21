"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RefreshCcw, Maximize2 } from 'lucide-react';

interface SDOImage {
    id: string;
    name: string;
    wavelength: string;
    color: string;
    url: string;
    description: string;
}

const SDO_IMAGES: SDOImage[] = [
    {
        id: 'aia171',
        name: 'AIA 171',
        wavelength: '171 Å',
        color: 'Gold',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg',
        description: 'Shows the quiet corona and coronal loops. 600,000 K plasma.'
    },
    {
        id: 'aia304',
        name: 'AIA 304',
        wavelength: '304 Å',
        color: 'Red',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg',
        description: 'Chromosphere and transition region. Shows filaments and prominences.'
    },
    {
        id: 'aia193',
        name: 'AIA 193',
        wavelength: '193 Å',
        color: 'Bronze',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg',
        description: 'Corona at 1.2 million K. Shows coronal holes as dark regions.'
    },
    {
        id: 'hmi_ic',
        name: 'HMI Continuum',
        wavelength: 'Visible',
        color: 'Orange',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIIC.jpg',
        description: 'Visible light view. Shows sunspots clearly.'
    },
    {
        id: 'hmi_mag',
        name: 'HMI Magnetogram',
        wavelength: 'Magnetic',
        color: 'Gray',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIB.jpg',
        description: 'Magnetic field polarity. White = positive, Black = negative.'
    },
    {
        id: 'aia131',
        name: 'AIA 131',
        wavelength: '131 Å',
        color: 'Teal',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0131.jpg',
        description: 'Flare plasma at 10 million K. Highlights active regions.'
    }
];

export function SolarImageryGrid() {
    const [selectedImage, setSelectedImage] = React.useState<SDOImage | null>(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [lastUpdate, setLastUpdate] = React.useState(new Date());

    const handleRefresh = () => {
        setIsRefreshing(true);
        setLastUpdate(new Date());
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-gray-300 text-sm uppercase tracking-widest font-medium">
                        Solar Dynamics Observatory
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1" suppressHydrationWarning>
                        Last update: {lastUpdate.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <RefreshCcw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Image Grid - Larger */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SDO_IMAGES.map((img, index) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedImage(img)}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-white/10 bg-black/30 shadow-lg hover:shadow-2xl transition-all"
                    >
                        {/* High-Tech Scan Line */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 pointer-events-none"
                            animate={{ top: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        <Image
                            src={`/api/proxy-image?url=${encodeURIComponent(img.url)}&t=${isRefreshing ? Date.now() : ''}`}
                            alt={img.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                        />

                        {/* Color indicator strip */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r z-20 ${img.color === 'Gold' ? 'from-yellow-500 to-orange-500' :
                            img.color === 'Red' ? 'from-red-500 to-pink-500' :
                                img.color === 'Bronze' ? 'from-orange-500 to-yellow-600' :
                                    img.color === 'Orange' ? 'from-orange-400 to-orange-600' :
                                        img.color === 'Gray' ? 'from-gray-400 to-gray-600' :
                                            'from-teal-400 to-cyan-500'
                            }`} />

                        {/* Hover Overlay with Telemetry Feel */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex flex-col justify-end">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-black text-white tracking-widest uppercase">{img.name}</p>
                                    <p className="text-[10px] text-orange-400 font-mono">{img.wavelength}</p>
                                </div>
                                <Maximize2 className="w-4 h-4 text-white/50" />
                            </div>

                            {/* Decorative brackets in hover */}
                            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30" />
                            <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30" />
                        </div>

                        {/* Always visible Label */}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 z-20">
                            <span className="text-[8px] text-white font-mono tracking-tighter uppercase">{img.wavelength}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Enhanced Modal with Navigation */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="max-w-4xl w-full glass-panel rounded-2xl p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedImage.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{selectedImage.wavelength} • {selectedImage.color} Channel</p>
                            </div>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <span className="text-white text-2xl">×</span>
                            </button>
                        </div>

                        {/* Large Image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-black">
                            <Image
                                src={`/api/proxy-image?url=${encodeURIComponent(selectedImage.url.replace('512', '2048'))}`}
                                alt={selectedImage.name}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-300 mb-4">{selectedImage.description}</p>

                        {/* Navigation Arrows */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = SDO_IMAGES.findIndex(i => i.id === selectedImage.id);
                                    const prevIndex = (currentIndex - 1 + SDO_IMAGES.length) % SDO_IMAGES.length;
                                    setSelectedImage(SDO_IMAGES[prevIndex]);
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = SDO_IMAGES.findIndex(i => i.id === selectedImage.id);
                                    const nextIndex = (currentIndex + 1) % SDO_IMAGES.length;
                                    setSelectedImage(SDO_IMAGES[nextIndex]);
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2"
                            >
                                Next →
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
