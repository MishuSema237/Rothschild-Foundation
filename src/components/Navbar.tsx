"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShoppingBag, LayoutDashboard, Home, Search, Menu, X, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
    { name: "Home", path: "/", icon: Home },
    { name: "Artifacts", path: "/shop", icon: ShoppingBag },
    { name: "Tracking", path: "/track", icon: Search },
    { name: "Recruitment", path: "/#induction", icon: Sparkles },
    { name: "Contact", path: "/contact", icon: Mail },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => setIsOpen(false), [pathname]);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-4xl">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass rounded-2xl md:rounded-full px-6 py-3 border-gold/20 flex items-center justify-between relative"
            >
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:border-gold transition-all">
                        <span className="text-gold text-[10px] font-serif">R&C</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1 lg:gap-2">
                    {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all whitespace-nowrap ${isActive
                                    ? "bg-gold text-obsidian font-bold shadow-lg shadow-gold/20"
                                    : "text-gold/60 hover:text-gold hover:bg-gold/5"
                                    }`}
                                title={link.name}
                            >
                                <Icon size={14} className={isActive ? "text-obsidian" : "text-gold/40"} />
                                <span className="text-[10px] uppercase tracking-widest hidden lg:block">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-all"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-4 glass bg-obsidian/95 backdrop-blur-2xl rounded-2xl border border-gold/20 p-4 md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col gap-2">
                                {NAV_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.path;

                                    return (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            className={`p-4 rounded-xl flex items-center gap-4 transition-all ${isActive
                                                ? "bg-gold text-obsidian font-bold"
                                                : "text-gold/60 hover:bg-gold/5"
                                                }`}
                                        >
                                            <Icon size={18} className={isActive ? "text-obsidian" : "text-gold/40"} />
                                            <span className="text-xs uppercase tracking-[0.2em]">{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </nav>
    );
}
