"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowRight, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationInput } from "@/lib/validations";

const STEPS = ["Personal Info", "Economic Status", "Verification", "Sacred Offerings"];

export default function InductionForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);
    const [registrationCode, setRegistrationCode] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<{ _id: string, name: string }[]>([]);
    const [previews, setPreviews] = useState({ personal: "", idCardFront: "", idCardBack: "" });

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<RegistrationInput>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            maritalStatus: "Single",
            paymentMethod: "",
        }
    });

    useEffect(() => {
        fetch("/api/admin/payment-methods")
            .then(res => res.json())
            .then(data => {
                setPaymentMethods(data);
                if (data.length > 0) setValue("paymentMethod", data[0].name);
            });
    }, [setValue]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'personalPhoto' | 'idCardFront' | 'idCardBack') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [type === 'personalPhoto' ? 'personal' : type]: reader.result as string }));
        };
        reader.readAsDataURL(file);

        const base64 = await toBase64(file);
        setValue(type, base64 as string);
        trigger(type);
    };

    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    type StepField = keyof RegistrationInput;

    const nextStep = async () => {
        const fields: Record<number, StepField[]> = {
            0: ["name", "dateOfBirth", "email", "phone", "maritalStatus"],
            1: ["country", "city", "occupation", "salary"],
            2: ["personalPhoto", "idCardFront", "idCardBack"],
            3: ["paymentMethod"],
        };

        const isStepValid = await trigger(fields[currentStep]);
        if (isStepValid) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: RegistrationInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                setRegistrationCode(result.uniqueCode);
                setComplete(true);
                setTimeout(() => {
                    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\+/g, '') || "447402829950";
                    const message = encodeURIComponent(`Hello Rothschild & Co, I have just completed my registration on the website. My name is ${data.name}. My Sacred Code is ${result.uniqueCode}. I am ready to proceed with the Initiation.`);
                    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
                }, 8000);
            } else {
                setError((result as { error?: string }).error || "A sacred connection error occurred. Please verify your details.");
            }
        } catch (err: unknown) {
            console.error(err);
            setError("The communication path is blocked. Check your network connection.");
        } finally {
            setLoading(false);
        }
    };

    if (complete) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center glass rounded-2xl max-w-2xl mx-auto border-gold/50">
                <Sparkles className="w-16 h-16 text-gold mb-6 animate-pulse" />
                <h2 className="text-3xl font-serif text-gold mb-4">Registration Recorded</h2>

                <div className="w-full bg-obsidian-light border border-dashed border-gold/30 p-6 rounded-xl mb-8">
                    <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">Your Sacred Registration Code</p>
                    <p className="text-4xl md:text-5xl font-bold tracking-tighter text-gold mb-2">{registrationCode}</p>
                    <p className="text-[10px] text-gold/40 uppercase tracking-widest">Keep this code safe for Artifacts access and tracking</p>
                </div>

                <p className="text-foreground/70 mb-8 tracking-wide text-sm md:text-base">
                    Your details have been entered into the Book of Records.<br className="hidden md:block" />
                    Redirecting you to the Head Master via WhatsApp...
                </p>
                <div className="flex items-center gap-2 text-gold">
                    <Loader2 className="animate-spin" />
                    <span className="text-sm">Synchronizing with WhatsApp...</span>
                </div>
            </div>
        );
    }

    return (
        <div id="induction" className="max-w-4xl mx-auto py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl md:rounded-3xl overflow-hidden border-gold/30 shadow-2xl"
            >
                <div className="bg-obsidian-light p-4 md:p-6 flex justify-between border-b border-gold/10">
                    {STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-1 md:gap-2">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold border transition-all ${i <= currentStep ? "bg-gold text-obsidian border-gold" : "border-gold/30 text-gold/30"
                                }`}>
                                {i + 1}
                            </div>
                            <span className={`text-[8px] md:text-[10px] uppercase tracking-widest hidden sm:block ${i <= currentStep ? "text-gold" : "text-gold/30"
                                }`}>{step.split(' ')[0]}</span>
                        </div>
                    ))}
                </div>

                <div className="p-5 md:p-12">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <FormInput label="Full Name" {...register("name")} error={errors.name?.message} placeholder="As per ID" />
                                    </div>
                                    <FormInput label="Date of Birth" type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} />
                                    <div className="space-y-2">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest">Marital Status</label>
                                        <select
                                            {...register("maritalStatus")}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-3 text-gold focus:border-gold outline-none transition-all appearance-none"
                                        >
                                            <option>Single</option>
                                            <option>Married</option>
                                            <option>Divorced</option>
                                            <option>Widowed</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput label="Email Address" type="email" {...register("email")} error={errors.email?.message} placeholder="your@email.com" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput label="Phone Number" {...register("phone")} error={errors.phone?.message} placeholder="+1234..." />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <FormInput label="Occupation" {...register("occupation")} error={errors.occupation?.message} />
                                    </div>
                                    <FormInput label="Country" {...register("country")} error={errors.country?.message} />
                                    <FormInput label="City" {...register("city")} error={errors.city?.message} />
                                    <div className="md:col-span-2">
                                        <FormInput label="Expected Annual Salary" {...register("salary")} error={errors.salary?.message} placeholder="e.g. $50,000" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-gold/60 text-xs uppercase tracking-widest block">Personal Picture</label>
                                    <div className={`relative h-40 md:h-48 border-2 border-dashed rounded-xl overflow-hidden group transition-all ${errors.personalPhoto ? "border-red-500/50 bg-red-500/5" : "border-gold/20"}`}>
                                        {previews.personal ? (
                                            <Image src={previews.personal} alt="Personal Preview" fill className="object-cover" unoptimized />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gold/40">
                                                <Upload className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                                                <span className="text-[10px] md:text-xs">Select Photo</span>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'personalPhoto')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    {errors.personalPhoto && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.personalPhoto.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div className="space-y-4">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest block">National ID (FRONT)</label>
                                        <div className={`relative h-40 md:h-48 border-2 border-dashed rounded-xl overflow-hidden group transition-all ${errors.idCardFront ? "border-red-500/50 bg-red-500/5" : "border-gold/20"}`}>
                                            {previews.idCardFront ? (
                                                <Image src={previews.idCardFront} alt="ID Front Preview" fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gold/40">
                                                    <Upload className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                                                    <span className="text-[10px] md:text-xs">Scan ID Front</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'idCardFront')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        {errors.idCardFront && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.idCardFront.message}</p>}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest block">National ID (BACK)</label>
                                        <div className={`relative h-40 md:h-48 border-2 border-dashed rounded-xl overflow-hidden group transition-all ${errors.idCardBack ? "border-red-500/50 bg-red-500/5" : "border-gold/20"}`}>
                                            {previews.idCardBack ? (
                                                <Image src={previews.idCardBack} alt="ID Back Preview" fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gold/40">
                                                    <Upload className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                                                    <span className="text-[10px] md:text-xs">Scan ID Back</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'idCardBack')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        {errors.idCardBack && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.idCardBack.message}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="space-y-4 text-left">
                                    <div className="space-y-2 justify-center flex items-center flex-col">
                                        <label className="text-gold/60 text-xs uppercase tracking-widest">Preferred Payment Method for Initiation</label>
                                        <select
                                            {...register("paymentMethod")}
                                            className="w-full bg-obsidian-light border border-gold/20 rounded-md p-4 text-gold focus:border-gold outline-none transition-all appearance-none text-center"
                                        >
                                            <option value="">Select Method</option>
                                            {paymentMethods.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    {errors.paymentMethod && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.paymentMethod.message}</p>}
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm mb-6 max-w-md mx-auto">
                                        <AlertCircle className="shrink-0" size={18} />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="p-6 glass border-red-500/20 text-center rounded-xl">
                                    <p className="text-red-400 font-serif mb-2">Notice of Initiation Fee</p>
                                    <p className="text-xs text-foreground/50 tracking-wide uppercase italic">
                                        Initiation: $333 + Offerings: $333 = Total: $666
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 flex flex-col-reverse md:flex-row justify-between gap-4">
                        <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            disabled={currentStep === 0 || loading}
                            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-md text-gold transition-all w-full md:w-auto ${currentStep === 0 ? "opacity-0 invisible" : "hover:bg-gold/10"}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm md:text-base">Previous Step</span>
                        </button>

                        {currentStep === STEPS.length - 1 ? (
                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 px-6 md:px-10 py-4 bg-gold text-obsidian rounded-md font-bold uppercase tracking-widest hover:bg-gold-light transition-all disabled:opacity-50 text-sm md:text-base w-full md:w-auto shadow-lg shadow-gold/20"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <span>Submit Induction</span>}
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 px-6 md:px-10 py-4 bg-gold text-obsidian rounded-md font-bold uppercase tracking-widest hover:bg-gold-light transition-all text-sm md:text-base w-full md:w-auto shadow-lg shadow-gold/20"
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

function FormInput({ label, error, type = "text", ...rest }: { label: string, error?: string, type?: string, [key: string]: unknown }) {
    return (
        <div className="space-y-2">
            <label className="text-gold/60 text-xs uppercase tracking-widest">{label}</label>
            <input
                type={type}
                {...rest}
                className={`w-full bg-obsidian-light border rounded-md p-3 text-gold placeholder:text-gold/20 focus:border-gold outline-none transition-all ${error ? "border-red-500" : "border-gold/20"}`}
            />
            {error && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} /> {error}</p>}
        </div>
    );
}
