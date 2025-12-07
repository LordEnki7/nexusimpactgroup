import { motion } from "framer-motion";
import { Shield, Activity, Bot, Wallet, Users, Globe, Music, Factory, Hexagon } from "lucide-react";
import { useState } from "react";
import ContactDialog from "./ContactDialog";

const divisions = [
  {
    id: 1,
    title: "C.A.R.E.N.",
    icon: Shield,
    description: "Automated Roadside Guardian",
    color: "cyan",
    onClick: () => {}
  },
  {
    id: 2,
    title: "Real Pulse Verifier",
    icon: Activity,
    description: "True Identity Validation",
    color: "cyan"
  },
  {
    id: 3,
    title: "My Life Assistant",
    icon: Bot,
    description: "AI Personal Concierge",
    color: "cyan"
  },
  {
    id: 4,
    title: "Friendly Financial",
    icon: Wallet,
    description: "Future of Banking",
    color: "gold"
  },
  {
    id: 5,
    title: "NIG CORE ECOSYSTEM",
    icon: Hexagon,
    description: "Central Intelligence",
    color: "core", // Special
    size: "large"
  },
  {
    id: 6,
    title: "Rent-A-Buddy",
    icon: Users,
    description: "Platonic Connection",
    color: "cyan"
  },
  {
    id: 7,
    title: "Eternal Chase",
    icon: Globe,
    description: "Immersive Entertainment",
    color: "cyan"
  },
  {
    id: 8,
    title: "Project DNA Music",
    icon: Music,
    description: "Sonic Engineering",
    color: "cyan"
  },
  {
    id: 9,
    title: "Zapp Marketing",
    icon: Factory,
    description: "Global Manufacturing",
    color: "cyan"
  }
];

export default function EcosystemGrid() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState("");

  const handleDivisionClick = (title: string) => {
    setSelectedDivision(title);
    setDialogOpen(true);
  };

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,193,215,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,193,215,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">The Ecosystem</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Our Divisions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {divisions.map((division) => (
            <motion.div
              key={division.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              onClick={() => handleDivisionClick(division.title)}
              className={`
                relative group cursor-pointer overflow-hidden rounded-xl border
                ${division.size === 'large' ? 'md:col-span-3 lg:col-span-1 lg:row-span-1 border-[#DAA520] bg-[#DAA520]/5 box-glow-gold' : 'border-[#14C1D7]/30 bg-[#0B1B3F]/20 hover:border-[#14C1D7]'}
                backdrop-blur-sm transition-all duration-500
                flex flex-col items-center justify-center p-10 min-h-[250px]
              `}
              data-testid={`card-division-${division.id}`}
            >
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#14C1D7]/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out" />

              <div className={`
                mb-6 p-4 rounded-full border 
                ${division.color === 'gold' || division.color === 'core' ? 'border-[#DAA520] text-[#DAA520]' : 'border-[#14C1D7] text-[#14C1D7]'}
                group-hover:scale-110 transition-transform duration-300
              `}>
                <division.icon className="w-10 h-10" strokeWidth={1} />
              </div>

              <h4 className={`
                text-xl font-heading font-bold mb-2 text-center
                ${division.color === 'core' ? 'text-[#DAA520] text-2xl' : 'text-white'}
              `}>
                {division.title}
              </h4>

              <p className="text-gray-400 font-mono text-xs uppercase tracking-wider text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {division.description}
              </p>

              {/* Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#14C1D7] opacity-50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#14C1D7] opacity-50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#14C1D7] opacity-50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#14C1D7] opacity-50" />
            </motion.div>
          ))}
        </div>
      </div>

      <ContactDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        division={selectedDivision}
      />
    </section>
  );
}