"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Loader2, User, MapPin, DollarSign, Calendar, Mail,
    Phone, ExternalLink, ShieldCheck, Send, Plus, Trash2,
    CreditCard, ChevronRight, MessageSquare
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"registrations" | "payments">("registrations");

    // Data states
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Messaging state
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const [messageData, setMessageData] = useState({ subject: "Update on your Induction", message: "" });
    const [sending, setSending] = useState(false);

    // Payment state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPayment, setNewPayment] = useState({ name: "", details: "", description: "" });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        } else if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [regRes, payRes] = await Promise.all([
                fetch("/api/admin/registrations"),
                fetch("/api/admin/payment-methods")
            ]);
            setRegistrations(await regRes.json());
            setPaymentMethods(await payRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageData.message) return;
        setSending(true);
        try {
            const res = await fetch("/api/admin/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: selectedApplicant.email,
                    applicantName: selectedApplicant.name,
                    ...messageData
                })
            });
            if (res.ok) {
                alert("Message sent successfully");
                setShowMessageModal(false);
                setMessageData({ ...messageData, message: "" });
            }
        } catch (err) {
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleAddPayment = async () => {
        try {
            const res = await fetch("/api/admin/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPayment)
            });
            if (res.ok) {
                fetchData();
                setShowPaymentModal(false);
                setNewPayment({ name: "", details: "", description: "" });
            }
        } catch (err) {
            alert("Failed to add payment method");
        }
    };

    const handleDeletePayment = async (id: string) => {
        if (!confirm("Remove this payment method?")) return;
        try {
            await fetch(`/api/admin/payment-methods?id=${id}`, { method: "DELETE" });
            fetchData();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-obsidian flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-obsidian text-foreground p-6 md:p-12">
            <div className="container mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gold/10 pb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif gold-gradient-text flex items-center gap-4">
                            Sacred Portal
                        </h1>
                        <p className="text-gold/40 uppercase tracking-widest text-[10px] mt-2">Management Terminal</p>
                    </div>

                    <div className="flex bg-obsidian-light p-1 rounded-lg border border-gold/10">
                        <button
                            onClick={() => setActiveTab("registrations")}
                            className={`px-4 py-2 text-xs uppercase tracking-widest rounded-md transition-all ${activeTab === 'registrations' ? 'bg-gold text-obsidian font-bold' : 'text-gold/60 hover:text-gold'}`}
                        >
                            Registrations
                        </button>
                        <button
                            onClick={() => setActiveTab("payments")}
                            className={`px-4 py-2 text-xs uppercase tracking-widest rounded-md transition-all ${activeTab === 'payments' ? 'bg-gold text-obsidian font-bold' : 'text-gold/60 hover:text-gold'}`}
                        >
                            Payments
                        </button>
                    </div>

                    <button
                        onClick={() => router.push("/api/auth/signout")}
                        className="px-6 py-2 border border-gold/30 text-gold/60 text-xs hover:border-gold hover:text-gold transition-all uppercase rounded-md"
                    >
                        Withdraw
                    </button>
                </header>

                {activeTab === "registrations" ? (
                    <div className="space-y-8">
                        {registrations.length === 0 ? (
                            <div className="glass p-20 text-center rounded-3xl border-gold/10">
                                <p className="text-gold/20 font-serif text-2xl italic">The book of records is currently empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {registrations.map((reg) => (
                                    <div key={reg._id} className="glass rounded-2xl overflow-hidden border-gold/20 hover:border-gold/40 transition-all flex flex-col sm:flex-row group">
                                        <div className="w-full sm:w-48 bg-obsidian-light relative aspect-square sm:aspect-auto">
                                            {reg.personalPhoto ? (
                                                <Image src={reg.personalPhoto} alt={reg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gold/10">
                                                    <User size={64} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-serif text-gold">{reg.name}</h3>
                                                    <p className="text-[10px] text-gold/40 flex items-center gap-1 mt-1 uppercase tracking-wider">
                                                        <MapPin size={10} /> {reg.city}, {reg.country}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="px-2 py-0.5 bg-gold/10 text-gold text-[8px] font-bold uppercase rounded border border-gold/20">
                                                        {reg.status || 'PENDING'}
                                                    </span>
                                                    <p className="text-[8px] text-gold/30 uppercase">{reg.paymentMethod}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                                                <div className="flex items-center gap-2 text-foreground/60"><Calendar size={12} className="text-gold/40" /> <span>{reg.dateOfBirth}</span></div>
                                                <div className="flex items-center gap-2 text-foreground/60"><DollarSign size={12} className="text-gold/40" /> <span>{reg.salary}</span></div>
                                                <div className="flex items-center gap-2 text-foreground/60 overflow-hidden"><Mail size={12} className="text-gold/40" /> <span className="truncate">{reg.email}</span></div>
                                                <div className="flex items-center gap-2 text-foreground/60"><Phone size={12} className="text-gold/40" /> <span>{reg.phone}</span></div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 pt-4">
                                                <a href={reg.idCardPhoto} target="_blank" className="flex items-center justify-center gap-1 py-1.5 bg-obsidian-light border border-gold/20 text-gold/60 text-[8px] uppercase tracking-tighter hover:border-gold hover:text-gold transition-all">
                                                    <ShieldCheck size={12} /> ID Card
                                                </a>
                                                <button
                                                    onClick={() => { setSelectedApplicant(reg); setShowMessageModal(true); }}
                                                    className="flex items-center justify-center gap-1 py-1.5 bg-gold/5 border border-gold/20 text-gold text-[8px] uppercase tracking-tighter hover:bg-gold/20 transition-all"
                                                >
                                                    <MessageSquare size={12} /> Inbox
                                                </button>
                                                <a href={`https://wa.me/${reg.phone.replace(/\D/g, '')}`} target="_blank" className="flex items-center justify-center gap-1 py-1.5 bg-gold/10 border border-gold/20 text-gold text-[8px] uppercase tracking-tighter hover:bg-gold hover:text-obsidian transition-all">
                                                    <ExternalLink size={12} /> Contact
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-gold">Accepted Mediums</h2>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian text-xs font-bold uppercase rounded-md hover:bg-gold-light transition-all"
                            >
                                <Plus size={16} /> New Method
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paymentMethods.map((m) => (
                                <div key={m._id} className="glass p-6 rounded-xl border-gold/10 flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-gold font-bold text-sm tracking-wide">{m.name}</h4>
                                            <p className="text-[10px] text-gold/40 uppercase">{m.description || 'No description'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePayment(m._id)}
                                        className="text-red-500/20 group-hover:text-red-500 transition-all p-2 hover:bg-red-500/10 rounded-full"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Messaging Modal */}
            {showMessageModal && selectedApplicant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-obsidian/90 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass max-w-2xl w-full p-8 rounded-3xl border-gold/40">
                        <h2 className="text-2xl font-serif text-gold mb-2">Sacred Communication</h2>
                        <p className="text-xs text-gold/40 mb-8 uppercase tracking-widest">Invoicing: {selectedApplicant.name}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gold/60 uppercase block mb-1">Subject</label>
                                <input
                                    value={messageData.subject}
                                    onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                                    className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gold/60 uppercase block mb-1">Ritual Instructions / Payment Details</label>
                                <textarea
                                    rows={8}
                                    value={messageData.message}
                                    onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                                    placeholder="Enter the payment instructions or initiation details..."
                                    className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold text-sm resize-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowMessageModal(false)} className="flex-1 py-3 text-gold/40 text-[10px] uppercase font-bold tracking-widest">Cancel</button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending}
                                    className="flex-1 py-3 bg-gold text-obsidian text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 rounded-md"
                                >
                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Send Email</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-obsidian/90 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass max-w-md w-full p-8 rounded-3xl border-gold/40">
                        <h2 className="text-2xl font-serif text-gold mb-6">New Medium</h2>
                        <div className="space-y-4">
                            <input
                                placeholder="Method Name (e.g. USDT BEP20)"
                                value={newPayment.name}
                                onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                                className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold text-sm"
                            />
                            <input
                                placeholder="Description (Optional)"
                                value={newPayment.description}
                                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                                className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold text-sm"
                            />
                            <textarea
                                placeholder="Payment Details (Confidential)"
                                value={newPayment.details}
                                onChange={(e) => setNewPayment({ ...newPayment, details: e.target.value })}
                                className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold text-sm h-32"
                            />
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowPaymentModal(false)} className="flex-1 text-gold/40 text-[10px] uppercase">Cancel</button>
                                <button onClick={handleAddPayment} className="flex-1 py-3 bg-gold text-obsidian text-[10px] uppercase font-bold rounded-md">Create</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
