"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Loader2, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Item {
    _id: string;
    name: string;
    price: number;
    description: string;
    mysticalProperties: string;
    image: string;
}

export default function ShopPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [purchaseStep, setPurchaseStep] = useState<"details" | "checkout" | "success">("details");

    const [formData, setFormData] = useState({ uniqueCode: "", paymentMethod: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<{ _id: string, name: string }[]>([]);

    useEffect(() => {
        Promise.all([
            fetch("/api/shop/items").then(res => res.json()),
            fetch("/api/admin/payment-methods").then(res => res.json())
        ]).then(([itemsData, paymentsData]) => {
            setItems(itemsData);
            setPaymentMethods(paymentsData);
            if (paymentsData.length > 0) {
                setFormData(prev => ({ ...prev, paymentMethod: paymentsData[0].name }));
            }
            setLoading(false);
        });
    }, []);

    const handlePurchase = async () => {
        if (!formData.uniqueCode) {
            setError("The Sacred Code is required for the path to open.");
            return;
        }
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/shop/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId: selectedItem?._id,
                    ...formData
                })
            });
            const result = await res.json();

            if (res.ok) {
                setOrderNumber(result.orderNumber);
                setPurchaseStep("success");
            } else {
                setError(result.error || "The connection was severed. Verify your code.");
            }
        } catch {
            setError("A spiritual disruption occurred. Check your network.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-obsidian flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-obsidian text-foreground pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <header className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-serif gold-gradient-text mb-6">Sacred Artifacts</h1>
                    <p className="text-gold/60 max-w-2xl mx-auto uppercase tracking-widest text-xs md:text-sm">
                        Only those who have stepped into the light may possess these tools of progress.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass rounded-2xl overflow-hidden border-gold/20 flex flex-col group hover:border-gold/50 transition-all duration-500"
                        >
                            <div className="aspect-[4/5] relative overflow-hidden bg-obsidian-light">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gold/5">
                                        <ShoppingBag size={120} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-gold font-bold text-2xl">${item.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-2xl font-serif text-gold mb-3">{item.name}</h3>
                                <p className="text-foreground/60 text-sm mb-6 leading-relaxed line-clamp-3">
                                    {item.description}
                                </p>
                                <button
                                    onClick={() => { setSelectedItem(item); setPurchaseStep("details"); }}
                                    className="mt-auto w-full py-4 border border-gold/30 text-gold uppercase tracking-widest text-xs font-bold hover:bg-gold hover:text-obsidian transition-all flex items-center justify-center gap-2 group-hover:border-gold"
                                >
                                    Acquire Artifact <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Acquisition Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-obsidian/95 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border-gold/30 flex flex-col md:flex-row relative"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 z-10 text-gold/40 hover:text-gold transition-all"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="w-full md:w-1/2 bg-obsidian-light min-h-[300px] relative">
                                {selectedItem.image ? (
                                    <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gold/10">
                                        <ShoppingBag size={80} />
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                                {purchaseStep === "details" ? (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-serif text-gold">{selectedItem.name}</h2>
                                        <div className="flex items-center gap-4 py-3 border-y border-gold/10">
                                            <span className="text-xl font-bold text-gold">${selectedItem.price.toLocaleString()}</span>
                                            <span className="text-[10px] text-gold/40 uppercase tracking-widest">Ritual Worth</span>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-foreground/70 text-sm leading-relaxed italic border-l-2 border-gold/20 pl-4">
                                                &quot;{selectedItem.description}&quot;
                                            </p>
                                            <div className="bg-gold/5 p-4 rounded-xl border border-gold/10">
                                                <p className="text-gold/60 text-[10px] uppercase font-bold mb-2">Mystical Properties</p>
                                                <p className="text-xs text-foreground/80 leading-relaxed font-light">
                                                    {selectedItem.mysticalProperties || "Properties revealed upon possession."}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setPurchaseStep("checkout")}
                                            className="w-full py-4 bg-gold text-obsidian font-bold uppercase tracking-widest text-xs rounded-md hover:bg-gold-light transition-all flex items-center justify-center gap-2 mt-8"
                                        >
                                            Proceed to Acquisition <ShieldCheck size={16} />
                                        </button>
                                    </div>
                                ) : purchaseStep === "checkout" ? (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-serif text-gold">Finalize Ritual</h2>
                                        <p className="text-xs text-gold/40 uppercase tracking-widest mb-8">Verification Required</p>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] text-gold/60 uppercase block mb-2 font-bold">Sacred Registration Code</label>
                                                <input
                                                    placeholder="RC-XXXX-XXXX"
                                                    value={formData.uniqueCode}
                                                    onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })}
                                                    className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold text-lg tracking-widest font-mono text-center focus:border-gold outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] text-gold/60 uppercase block mb-2 font-bold">Preferred Offering Method</label>
                                                <select
                                                    value={formData.paymentMethod}
                                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                    className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold text-sm focus:border-gold outline-none transition-all appearance-none text-center"
                                                >
                                                    <option value="">Select Method</option>
                                                    {paymentMethods.map(m => (
                                                        <option key={m._id} value={m.name}>{m.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {error && (
                                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-[10px]">
                                                    <AlertCircle size={14} /> {error}
                                                </div>
                                            )}

                                            <button
                                                onClick={handlePurchase}
                                                disabled={isSubmitting}
                                                className="w-full py-4 bg-gold text-obsidian font-bold uppercase tracking-widest text-sm rounded-md hover:bg-gold-light transition-all flex items-center justify-center gap-2 mt-4"
                                            >
                                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Initiate Order <Sparkles size={16} /></>}
                                            </button>
                                            <button
                                                onClick={() => setPurchaseStep("details")}
                                                className="w-full py-2 text-gold/30 text-[10px] uppercase font-bold tracking-widest"
                                            >
                                                Go Back
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 space-y-6">
                                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/30">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-serif text-gold mb-2">Order Recorded</h2>
                                            <p className="text-[10px] text-gold/40 uppercase tracking-widest mb-8">Process Initiated</p>
                                        </div>
                                        <div className="bg-obsidian-light border border-dashed border-gold/20 p-6 rounded-2xl">
                                            <p className="text-[10px] text-gold/40 uppercase mb-2">Order Reference</p>
                                            <p className="text-3xl font-mono text-gold font-bold">{orderNumber}</p>
                                        </div>
                                        <p className="text-xs text-foreground/60 leading-relaxed px-4">
                                            Your request of the {selectedItem.name} has been received.
                                            Check your member email for payment instructions and the shipping protocol.
                                        </p>
                                        <button
                                            onClick={() => setSelectedItem(null)}
                                            className="w-full py-4 bg-transparent border border-gold/30 text-gold uppercase tracking-[0.3em] text-[10px] font-bold mt-8 hover:bg-gold/5 transition-all"
                                        >
                                            Close Record
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
