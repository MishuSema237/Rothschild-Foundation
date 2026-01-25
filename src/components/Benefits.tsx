"use client";

import { motion } from "framer-motion";

const benefits = [
    "Transform big dreams into reality",
    "Elevate supernatural beliefs",
    "Elevate from low class to high society",
    "Monthly wage of $100,000 USD",
    "Open-door Membership ID",
    "Welcome benefit of $30,000,000",
    "Free global flights & elite dining",
];

export default function Benefits() {
    return (
        <section className="py-24 bg-obsidian relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif gold-gradient-text mb-6 md:mb-8">Rewards of the Chosen</h2>
                        <p className="text-foreground/60 text-base md:text-lg mb-8 md:mb-10 font-light max-w-xl">
                            Our objective is to raise challenges and give them fortune, accept the weak and make them stronger, and turn the poor into rich and famous.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-1 border border-gold rounded-full flex-shrink-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gold rounded-full" />
                                    </div>
                                    <span className="text-foreground/80 font-light">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            {/* Sacred Triangle Visual */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-[1px] border-gold/10 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[20%] border-[1px] border-gold/20 rounded-[40%]"
                                />
                                <div className="z-10 text-[180px] text-gold/20 font-serif opacity-30 select-none">🔺</div>
                                <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="text-gold font-bold text-6xl italic">$30M</p>
                                    <p className="text-gold/60 uppercase tracking-widest text-xs mt-2">Welcome Benefit</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
