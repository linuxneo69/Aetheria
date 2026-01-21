"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
    hasXClass: boolean;
    message?: string;
}

export function WarningBanner({ hasXClass, message }: WarningBannerProps) {
    if (!hasXClass) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-red-900/50 border-b border-red-500/50 backdrop-blur-md sticky top-0 z-50 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-3 text-red-100">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                </motion.div>

                <span className="font-bold tracking-wide uppercase">
                    {message || "Warning: X-Class Solar Flare Detected"}
                </span>
            </div>
        </motion.div>
    );
}
