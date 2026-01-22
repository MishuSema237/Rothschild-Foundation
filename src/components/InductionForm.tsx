"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";

const STEPS = ["Personal Info", "Economic Status", "Verification", "Sacred Offerings"];

export default function InductionForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        city: "",
        dateOfBirth: "",
        maritalStatus: "Single",
        occupation: "",
        salary: "",
        email: "",
        phone: "",
        paymentMethod: "Bank Transfer",
        personalPhoto: "",
        idCardPhoto: "",
    });

    const [previews, setPreviews] = useState({
        personal: "",
        idCard: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'personalPhoto' | 'idCardPhoto') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [type === 'personalPhoto' ? 'personal' : 'idCard']: reader.result as string }));
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary (Simplified client-side for this demo, usually should be via server API)
        // For this build, we will send to our /api/upload route or handle in main register API
        // Actually, handling inside /api/register as base64 is easier for small files, 
        // but for 8k quality images we should use a proper upload.
        // I'll stick to updating the state with base64 for now so we can send it in one JSON.
        const base64 = await toBase64(file);
        setFormData(prev => ({ ...prev, [type]: base64 }));
    };

    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // First, we'll actually upload to a real API in /api/register
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setComplete(true);
                // Redirect to WhatsApp after 2 seconds
                setTimeout(() => {
                    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') || "447402829950";
                    const message = encodeURIComponent(`Hello Rothschild & Co, I have just completed my registration on the website. My name is ${formData.name}. I am ready to proceed with the Initiation.`);
                    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (complete) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center glass rounded-2xl max-w-2xl mx-auto border-gold/50 animate-pulse">
                <Sparkles className="w-16 h-16 text-gold mb-6" />
                <h2 className="text-3xl font-serif text-gold mb-4">Registration Sacredly Recorded</h2>
                <p className="text-foreground/70 mb-8 tracking-wide">
                    Your details have been entered into the Book of Records.
                    Redirecting you to the Head Master via WhatsApp for final instructions...
                </p>
                <div className="flex items-center gap-2 text-gold">
                    <Loader2 className="animate-spin" />
                    <span>Synchronizing with WhatsApp...</span>
                </div>
            </div>
        );
    }

    return (
        <div id="induction" className="max-w-4xl mx-auto py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-3xl overflow-hidden border-gold/30 shadow-2xl"
            >
                {/* Progress Bar */}
                <div className="bg-obsidian-light p-6 flex justify-between border-b border-gold/10">
                    {STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${i <= currentStep ? "bg-gold text-obsidian border-gold" : "border-gold/30 text-gold/30"
                                }`}>
                                {i + 1}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest hidden md:block ${i <= currentStep ? "text-gold" : "text-gold/30"
                                }`}>{step}</span>
                        </div>
                    ))}
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="As per ID" />
                                    <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                                    <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                                    <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1234..." />
                                    <div className="space-y-2">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest">Marital Status</label>
                                        <select
                                            name="maritalStatus"
                                            value={formData.maritalStatus}
                                            onChange={handleInputChange}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold focus:border-gold outline-none transition-all appearance-none"
                                        >
                                            <option>Single</option>
                                            <option>Married</option>
                                            <option>Divorced</option>
                                            <option>Widowed</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="Country" name="country" value={formData.country} onChange={handleInputChange} />
                                    <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                    <FormInput label="Occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} />
                                    <FormInput label="Expected Annual Salary" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. $50,000" />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest block">Personal Picture</label>
                                        <div className="relative h-48 border-2 border-dashed border-gold/20 rounded-xl overflow-hidden group">
                                            {previews.personal ? (
                                                <img src={previews.personal} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gold/40">
                                                    <Upload className="w-8 h-8 mb-2" />
                                                    <span className="text-xs">Select Photo</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'personalPhoto')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest block">National Identity Card</label>
                                        <div className="relative h-48 border-2 border-dashed border-gold/20 rounded-xl overflow-hidden group">
                                            {previews.idCard ? (
                                                <img src={previews.idCard} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gold/40">
                                                    <Upload className="w-8 h-8 mb-2" />
                                                    <span className="text-xs">Scan ID Card</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'idCardPhoto')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 text-center"
                            >
                                <div className="space-y-2 mb-8">
                                    <label className="text-gold/60 text-xs uppercase tracking-widest">Preferred Payment Method for Initiation</label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full max-w-md mx-auto bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold focus:border-gold outline-none text-center"
                                    >
                                        <option>Bank Transfer</option>
                                        <option>Bitcoin (BTC)</option>
                                        <option>Ethereum (ETH)</option>
                                        <option>USDT (Tether)</option>
                                        <option>Western Union</option>
                                    </select>
                                </div>
                                <div className="p-6 glass border-red-500/20 rounded-xl">
                                    <p className="text-red-400 font-serif mb-2">Notice of Initiation Fee</p>
                                    <p className="text-xs text-foreground/50 tracking-wide uppercase italic">
                                        Initiation: $333 + Offerings: $333 = Total: $666
                                    </p>
                                </div>
                                <p className="text-sm text-foreground/40 mt-4 px-10">
                                    By clicking 'Submit Induction', you confirm your faithful readiness to join the fellowship. Payment details will be sent to you following verification.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 flex justify-between gap-4">
                        <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            disabled={currentStep === 0 || loading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-md text-gold transition-all ${currentStep === 0 ? "opacity-0 invisible" : "hover:bg-gold/10"
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        {currentStep === STEPS.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-10 py-3 bg-gold text-obsidian rounded-md font-bold uppercase tracking-widest hover:bg-gold-light transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <span>Submit Induction</span>}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={loading}
                                className="flex items-center gap-2 px-10 py-3 bg-gold text-obsidian rounded-md font-bold uppercase tracking-widest hover:bg-gold-light transition-all"
                            >
                                <span>Continue</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function FormInput({ label, name, type = "text", value, onChange, placeholder = "" }: any) {
    return (
        <div className="space-y-2">
            <label className="text-gold/60 text-xs uppercase tracking-widest">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold placeholder:text-gold/20 focus:border-gold outline-none transition-all"
            />
        </div>
    );
}
