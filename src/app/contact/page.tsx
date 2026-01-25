"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                setError("Error submitting form. Try again later.");
            }
        } catch {
            setError("Error submitting form. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-obsidian text-foreground pt-32 pb-20 px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 rounded-3xl border-gold/30 text-center max-w-md w-full"
                >
                    <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
                    <h1 className="text-3xl font-serif text-gold mb-4">Message Received</h1>
                    <p className="text-foreground/60 mb-8">
                        Your communication has been securely transmitted. Our administrators will review the record.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="w-full py-4 bg-transparent border border-gold/30 text-gold uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gold/5 transition-all"
                    >
                        Send Another Record
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-obsidian text-foreground pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif gold-gradient-text mb-4">Contact Portal</h1>
                    <p className="text-gold/40 uppercase tracking-[0.3em] text-[10px] md:text-xs">
                        Direct communication with the administration
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar info */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-2xl border-gold/10">
                            <Mail className="text-gold mb-3" size={24} />
                            <h3 className="text-gold font-serif text-lg mb-1">Electronic Mail</h3>
                            <p className="text-xs text-foreground/40 break-all">{process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@rothschildportal.com"}</p>
                        </div>
                        <div className="glass p-6 rounded-2xl border-gold/10">
                            <MessageSquare className="text-gold mb-3" size={24} />
                            <h3 className="text-gold font-serif text-lg mb-1">Sacred Support</h3>
                            <p className="text-xs text-foreground/40">Available for verified members 24/7</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="glass p-8 md:p-10 rounded-3xl border-gold/20">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gold/60 uppercase tracking-widest block font-bold">Identity</label>
                                        <input
                                            required
                                            placeholder="Your Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold focus:border-gold outline-none transition-all placeholder:text-gold/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gold/60 uppercase tracking-widest block font-bold">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold focus:border-gold outline-none transition-all placeholder:text-gold/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gold/60 uppercase tracking-widest block font-bold">Subject</label>
                                        <input
                                            required
                                            placeholder="Reason for communication"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold focus:border-gold outline-none transition-all placeholder:text-gold/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gold/60 uppercase tracking-widest block font-bold">Message</label>
                                        <textarea
                                            required
                                            rows={6}
                                            placeholder="Your detailed message..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold focus:border-gold outline-none transition-all resize-none placeholder:text-gold/20"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gold text-obsidian font-bold uppercase tracking-widest text-xs rounded-md hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
