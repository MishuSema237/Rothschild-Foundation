"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, User, MapPin, DollarSign, Calendar, Mail, Phone, ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchRegistrations();
        }
    }, [status]);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/admin/registrations");
            const data = await res.json();
            setRegistrations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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
                <header className="flex justify-between items-center mb-12 border-b border-gold/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-serif gold-gradient-text">Sacred Dashboard</h1>
                        <p className="text-gold/40 uppercase tracking-widest text-xs mt-2">Member Registrations</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-gold text-sm font-bold">Inquisitor Admin</p>
                            <p className="text-gold/40 text-[10px] uppercase">Authenticated Session</p>
                        </div>
                        <button
                            onClick={() => router.push("/api/auth/signout")}
                            className="px-4 py-2 border border-gold/30 text-gold/60 text-xs hover:border-gold hover:text-gold transition-all uppercase"
                        >
                            Withdraw
                        </button>
                    </div>
                </header>

                {registrations.length === 0 ? (
                    <div className="glass p-20 text-center rounded-3xl border-gold/10">
                        <p className="text-gold/20 font-serif text-2xl italic">The book of records is currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {registrations.map((reg) => (
                            <div key={reg._id} className="glass rounded-2xl overflow-hidden border-gold/20 hover:border-gold/40 transition-all flex flex-col sm:flex-row">
                                {/* Photo Side */}
                                <div className="w-full sm:w-48 bg-obsidian-light relative aspect-square sm:aspect-auto">
                                    {reg.personalPhoto ? (
                                        <Image src={reg.personalPhoto} alt={reg.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gold/10">
                                            <User size={64} />
                                        </div>
                                    )}
                                </div>

                                {/* Info Side */}
                                <div className="flex-grow p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-serif text-gold">{reg.name}</h3>
                                            <p className="text-xs text-gold/40 flex items-center gap-1 mt-1">
                                                <MapPin size={12} /> {reg.city}, {reg.country}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase rounded border border-gold/20">
                                            {reg.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="flex items-center gap-2 text-foreground/60">
                                            <Calendar size={14} className="text-gold/40" />
                                            <span>{reg.dateOfBirth}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/60">
                                            <DollarSign size={14} className="text-gold/40" />
                                            <span>{reg.salary}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/60 overflow-hidden">
                                            <Mail size={14} className="text-gold/40" />
                                            <span className="truncate">{reg.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/60">
                                            <Phone size={14} className="text-gold/40" />
                                            <span>{reg.phone}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center gap-3">
                                        <a
                                            href={reg.idCardPhoto}
                                            target="_blank"
                                            className="flex-1 py-2 bg-obsidian-light border border-gold/20 text-gold/60 text-[10px] text-center uppercase tracking-widest hover:border-gold hover:text-gold transition-all inline-flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheck size={14} /> ID Card
                                        </a>
                                        <a
                                            href={`https://wa.me/${reg.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            className="flex-1 py-2 bg-gold/10 border border-gold/20 text-gold text-[10px] text-center uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all inline-flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={14} /> Contact
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
