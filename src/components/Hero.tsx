"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
            {/* Background with Hero Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/chosen_initiation_placeholder.png"
                    alt="Sacred Background"
                    fill
                    className="object-cover opacity-60 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative w-40 h-40 sacred-glow rounded-full overflow-hidden border border-gold/20">
                        <Image
                            src="/illuminati_eyes_emblem.png"
                            alt="Rothschild & Co Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif gold-gradient-text mb-6 tracking-tighter"
                >
                    Rothschild & Co
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-xl md:text-2xl text-gold/80 max-w-2xl mx-auto mb-10 font-light tracking-widest uppercase"
                >
                    Follow the Light
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    <a
                        href="#steps"
                        className="inline-block px-10 py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all duration-500 rounded-sm tracking-widest uppercase font-bold text-sm"
                    >
                        Begin Your Journey
                    </a>
                </motion.div>
            </div>

            {/* Floating Sparkles/Particles (Subtle) */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gold rounded-full opacity-20"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                        }}
                        animate={{
                            y: [null, "-100%"],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
