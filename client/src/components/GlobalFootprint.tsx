import { motion } from "framer-motion";
import mapImg from "@assets/generated_images/futuristic_global_trade_map.png";

const locations = [
  { id: 1, name: "New York", x: "28%", y: "35%" },
  { id: 2, name: "London", x: "48%", y: "28%" },
  { id: 3, name: "Dubai", x: "62%", y: "42%" },
  { id: 4, name: "Singapore", x: "78%", y: "55%" },
  { id: 5, name: "Dominican Rep.", x: "29%", y: "45%" },
  { id: 6, name: "Lagos", x: "50%", y: "50%" },
];

export default function GlobalFootprint() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Global Footprint
        </h2>
        <p className="text-gray-400 font-mono">Operating across 3 continents and expanding.</p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto aspect-[16/9] bg-[#0B1B3F]/20 rounded-3xl overflow-hidden border border-[#14C1D7]/20">
        <img 
          src={mapImg} 
          alt="Global Map" 
          className="w-full h-full object-cover opacity-60 grayscale mix-blend-luminosity" 
        />
        
        <div className="absolute inset-0 bg-[#0B1B3F]/40 mix-blend-multiply" />

        {locations.map((loc) => (
          <motion.div
            key={loc.id}
            className="absolute w-4 h-4"
            style={{ left: loc.x, top: loc.y }}
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#DAA520] font-mono text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {loc.name}
            </span>
            <div className="w-3 h-3 bg-[#14C1D7] rounded-full shadow-[0_0_15px_#14C1D7] animate-pulse" />
            <div className="absolute inset-0 w-full h-full border border-[#14C1D7] rounded-full animate-ping opacity-75" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}