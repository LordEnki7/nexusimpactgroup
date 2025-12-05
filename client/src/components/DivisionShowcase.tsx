import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

// Images
import carenImg from "@assets/generated_images/futuristic_car_hud_interface.png";
import pulseImg from "@assets/generated_images/digital_identity_scan.png";
import assistantImg from "@assets/generated_images/ai_hologram_assistant.png";
import financeImg from "@assets/generated_images/financial_dashboard_hologram.png";
import dnaImg from "@assets/generated_images/cosmic_dna_strand.png";
import tradeImg from "@assets/generated_images/futuristic_global_trade_map.png";

const showcaseItems = [
  {
    id: "caren",
    title: "C.A.R.E.N.",
    subtitle: "Your Roadside Guardian",
    description: "Real-time protection for real moments. Advanced telemetry and safety response.",
    image: carenImg,
    align: "left"
  },
  {
    id: "pulse",
    title: "Real Pulse",
    subtitle: "The Truth Engine",
    description: "Biometric identity verification that cannot be forged. Trust is the new currency.",
    image: pulseImg,
    align: "right"
  },
  {
    id: "finance",
    title: "Friendly Financial",
    subtitle: "Wealth Without Borders",
    description: "Next-generation banking infrastructure for the global citizen.",
    image: financeImg,
    align: "left"
  },
  {
    id: "assistant",
    title: "My Life Assistant",
    subtitle: "Hyper-Personalized AI",
    description: "An intelligence that knows you better than you know yourself.",
    image: assistantImg,
    align: "right"
  },
  {
    id: "dna",
    title: "Eternal Chase",
    subtitle: "Infinite Worlds",
    description: "Immersive entertainment universes powered by neural rendering.",
    image: dnaImg,
    align: "left"
  },
  {
    id: "zapp",
    title: "Zapp Manufacturing",
    subtitle: "Global Supply Chain",
    description: "Autonomous trade routes and smart manufacturing at scale.",
    image: tradeImg,
    align: "right"
  }
];

function ShowcaseCard({ item, index }: { item: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="min-h-[80vh] flex items-center justify-center py-20 relative overflow-hidden">
      <div className={`container mx-auto px-4 flex flex-col ${item.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 relative z-10`}>
        
        {/* Image Side */}
        <div className="w-full md:w-1/2 relative group">
          <motion.div 
            style={{ y, opacity }}
            className="relative rounded-2xl overflow-hidden border border-[#14C1D7]/20 shadow-[0_0_50px_rgba(11,27,63,0.5)]"
          >
            <div className="absolute inset-0 bg-[#14C1D7]/10 mix-blend-overlay z-10" />
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
            />
            
            {/* Holographic overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 font-mono text-[#14C1D7] text-xs tracking-widest">
              SYS.ID: {item.id.toUpperCase()}_V.2.0
            </div>
          </motion.div>
        </div>

        {/* Text Side */}
        <div className="w-full md:w-1/2 space-y-6">
          <motion.div
            initial={{ x: item.align === 'left' ? 50 : -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-mono text-[#DAA520] text-sm tracking-widest uppercase mb-2">{item.subtitle}</h3>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">{item.title}</h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 border-l-2 border-[#14C1D7] pl-6">
              {item.description}
            </p>
            
            <button className="group flex items-center gap-3 text-white hover:text-[#14C1D7] transition-colors">
              <span className="font-mono uppercase tracking-wider text-sm">Explore Division</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14C1D7]/20 to-transparent" />
    </div>
  );
}

export default function DivisionShowcase() {
  return (
    <section className="bg-[#050A14] relative">
      {showcaseItems.map((item, index) => (
        <ShowcaseCard key={item.id} item={item} index={index} />
      ))}
    </section>
  );
}