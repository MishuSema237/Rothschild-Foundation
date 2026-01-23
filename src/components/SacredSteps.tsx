"use client";

import { motion } from "framer-motion";

const steps = [
    {
        title: "1. Registration Process",
        description: "This is the first and most important stage. It involves your official registration by the Head Master who will enter your name into the book of records, confirming your intention and readiness to join this great organization.",
    },
    {
        title: "2. Initiation Process",
        description: "Once registration is completed, you will undergo the initiation process. This stage connects you spiritually and symbolically to the light and principles of the organization. It marks your acceptance into the circle and prepares you for the blessings that follow.",
    },
    {
        title: "3. Final Installation Ceremony",
        description: "This is the last and most significant phase. During this sacred ceremony, you will receive your benefits, be ordained as a full member, and be presented with your Certificate of Membership along with other valuable items that signify your new status within the organization.",
    },
];

export default function SacredSteps() {
    return (
        <section id="steps" className="py-24 bg-obsidian-light relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-serif gold-gradient-text mb-4">The Sacred Path</h2>
                    <div className="h-0.5 w-24 bg-gold mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="glass p-10 rounded-lg relative group h-full flex flex-col"
                        >
                            <div className="absolute -top-6 left-10 w-12 h-12 bg-gold flex items-center justify-center text-obsidian font-bold text-xl rounded-full sacred-glow group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                            <h3 className="text-2xl font-serif text-gold mb-6 mt-4">{step.title}</h3>
                            <p className="text-foreground/70 leading-relaxed font-light flex-grow">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 text-center glass p-12 max-w-4xl mx-auto rounded-xl border- gold/30"
                >
                    <p className="text-xl md:text-2xl font-serif italic text-gold/90 leading-relaxed">
                        &quot;Each of these steps is essential and must be completed in proper sequence for one to fully partake in the privileges and honors reserved for members.&quot;
                    </p>
                    <p className="mt-8 text-gold font-bold tracking-[0.3em] uppercase">Follow the light!!!</p>
                </motion.div>
            </div>
        </section>
    );
}
