"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Loader2, AlertCircle, MapPin, CheckCircle2, Clock, Truck, Box } from "lucide-react";
import Image from "next/image";

interface TrackedOrder {
    orderNumber: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
    itemId: {
        name: string;
        price: number;
        image: string;
    };
}

export default function TrackPage() {
    const [registrationCode, setRegistrationCode] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<TrackedOrder | null>(null);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registrationCode || !orderNumber) return;

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await fetch("/api/shop/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationCode, orderNumber })
            });
            const data = await res.json();

            if (res.ok) {
                setOrder(data);
            } else {
                setError(data.error || "The records could not be found.");
            }
        } catch {
            setError("Connection to the portal was disrupted.");
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { key: "pending", label: "Order Received", icon: Clock },
        { key: "processing", label: "Ritual Preparation", icon: Box },
        { key: "shipped", label: "In Transit", icon: Truck },
        { key: "delivered", label: "Manifested", icon: CheckCircle2 }
    ];

    const currentStatusIndex = statusSteps.findIndex(s => s.key === order?.status);

    return (
        <main className="min-h-screen bg-obsidian text-foreground pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif gold-gradient-text mb-4">Sacred Tracking</h1>
                    <p className="text-gold/40 uppercase tracking-[0.3em] text-[10px] md:text-xs">
                        Monitor the manifestation of your artifacts
                    </p>
                </header>

                <div className="glass p-8 md:p-12 rounded-3xl border-gold/20 mb-12">
                    <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gold/60 uppercase tracking-widest block font-bold">Registration Code</label>
                            <input
                                placeholder="RC-XXXX-XXXX"
                                value={registrationCode}
                                onChange={(e) => setRegistrationCode(e.target.value)}
                                className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold font-mono focus:border-gold outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gold/60 uppercase tracking-widest block font-bold">Order Number</label>
                            <input
                                placeholder="ORD-XXXXXX"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold font-mono focus:border-gold outline-none transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 w-full py-4 bg-gold text-obsidian font-bold uppercase tracking-widest text-xs rounded-md hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Locate Order</>}
                        </button>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs"
                        >
                            <AlertCircle size={18} /> {error}
                        </motion.div>
                    )}
                </div>

                <AnimatePresence>
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="glass p-8 rounded-3xl border-gold/30">
                                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-gold/20 bg-obsidian-light shrink-0">
                                            {order.itemId.image ? (
                                                <Image src={order.itemId.image} alt={order.itemId.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gold/10">
                                                    <Package size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gold/40 uppercase tracking-widest mb-1">Acquired Artifact</p>
                                            <h2 className="text-2xl font-serif text-gold">{order.itemId.name}</h2>
                                            <p className="text-xs text-foreground/60 mt-2">Ordered on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] text-gold/40 uppercase tracking-widest mb-1">Current Status</p>
                                        <p className="text-xl font-bold text-gold uppercase tracking-tighter">{order.status}</p>
                                    </div>
                                </div>

                                <div className="relative pt-10 pb-4 px-4 overflow-x-auto no-scrollbar md:overflow-x-visible">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gold/10 -translate-y-1/2 hidden md:block" />

                                    <div className="flex justify-between min-w-[600px] md:min-w-0 relative">
                                        {statusSteps.map((step, idx) => {
                                            const isCompleted = idx <= currentStatusIndex;
                                            const isCurrent = idx === currentStatusIndex;
                                            const Icon = step.icon;

                                            return (
                                                <div key={step.key} className="flex flex-col items-center gap-3 relative z-10 w-1/4">
                                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted ? "bg-gold border-gold text-obsidian sacred-glow" : "bg-obsidian border-gold/20 text-gold/20"
                                                        } ${isCurrent ? "scale-125" : ""}`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <p className={`text-[10px] uppercase tracking-widest font-bold text-center ${isCompleted ? "text-gold" : "text-gold/20"
                                                        }`}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center p-8 bg-gold/5 rounded-2xl border border-gold/10">
                                <p className="text-xs text-gold/60 uppercase tracking-widest italic leading-relaxed">
                                    &quot;The path of progress is steady and focused. Your artifact is being handled with the highest earthly and spiritual care.&quot;
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
