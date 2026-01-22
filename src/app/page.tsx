import Hero from "@/components/Hero";
import SacredSteps from "@/components/SacredSteps";
import Benefits from "@/components/Benefits";
import InductionForm from "@/components/InductionForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <SacredSteps />
      <Benefits />

      <section className="py-24 bg-obsidian-light relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif gold-gradient-text mb-4">Final Recruitment</h2>
            <p className="text-gold/60 tracking-[0.2em] uppercase text-sm">Submit your information securely</p>
          </div>

          <InductionForm />
        </div>
      </section>

      <footer className="py-12 border-t border-gold/10 text-center">
        <p className="text-gold/30 text-xs uppercase tracking-[0.5em] mb-4">Truth • Excellence • Value</p>
        <p className="text-gold/20 text-[10px] tracking-widest uppercase">© {new Date().getFullYear()} Rothschild & Co. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
