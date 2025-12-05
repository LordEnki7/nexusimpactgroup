import { motion } from "framer-motion";
import { ShieldCheck, Activity, Dna } from "lucide-react";

export default function MissionStrip() {
  return (
    <section className="py-24 bg-gradient-to-r from-black via-[#0B1B3F] to-black relative overflow-hidden border-y border-[#1A1A1A]">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight mb-12 max-w-4xl mx-auto">
            We build technology that <span className="text-[#DAA520]">protects</span>, <span className="text-[#14C1D7]">empowers</span>, and <span className="text-white">elevates</span> humanity.
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mt-16">
            {[
              { icon: ShieldCheck, label: "Safety" },
              { icon: Activity, label: "Truth" },
              { icon: Dna, label: "Potential" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1, color: "#DAA520" }}
                className="flex flex-col items-center gap-4 group cursor-pointer text-gray-400 hover:text-[#DAA520] transition-colors"
              >
                <item.icon className="w-12 h-12 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(218,165,32,0.5)]" strokeWidth={1} />
                <span className="font-mono text-sm tracking-[0.2em] uppercase">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}