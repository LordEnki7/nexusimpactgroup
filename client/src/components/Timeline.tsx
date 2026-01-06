import { motion } from "framer-motion";
import { Rocket, Target, Globe, Zap, Users, Award } from "lucide-react";

const milestones = [
  {
    year: "2020",
    title: "The Vision Begins",
    description: "Nexus Impact Group founded with a mission to create a fully integrated ecosystem connecting safety, identity, and innovation.",
    icon: Rocket,
    status: "complete"
  },
  {
    year: "2021",
    title: "Core Divisions Launch",
    description: "C.A.R.E.N., Real Pulse Verifier, and The Remedy Club become the first operational divisions.",
    icon: Target,
    status: "complete"
  },
  {
    year: "2022",
    title: "Ecosystem Expansion",
    description: "My Life Assistant, Rent-A-Buddy, and Project DNA Music join the ecosystem, expanding into AI and entertainment.",
    icon: Users,
    status: "complete"
  },
  {
    year: "2023",
    title: "Global Reach",
    description: "Zapp Marketing and Manufacturing launches with 40,000+ products and global trade capabilities.",
    icon: Globe,
    status: "complete"
  },
  {
    year: "2024",
    title: "Platform Maturity",
    description: "Integration of all 13 divisions under the NIG Core hub, creating seamless cross-platform experiences.",
    icon: Zap,
    status: "complete"
  },
  {
    year: "2025",
    title: "Industry Recognition",
    description: "NIG recognized as a pioneer in integrated ecosystem technology, setting new standards for innovation.",
    icon: Award,
    status: "current"
  },
  {
    year: "2026",
    title: "Global Domination",
    description: "Expansion into new markets and introduction of next-generation AI-powered services across all divisions.",
    icon: Rocket,
    status: "future"
  }
];

export default function Timeline() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14C1D7]/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Our Journey</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Building The Future</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            From vision to reality - the evolution of the world's first fully integrated ecosystem.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-[#14C1D7] via-[#DAA520] to-[#14C1D7]/30" />

          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <span className={`font-mono text-sm tracking-wider ${
                    milestone.status === 'complete' ? 'text-[#14C1D7]' :
                    milestone.status === 'current' ? 'text-[#DAA520]' :
                    'text-gray-500'
                  }`}>
                    {milestone.year}
                  </span>
                  <h4 className="text-xl font-heading font-bold text-white mt-1 mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    milestone.status === 'complete' ? 'border-[#14C1D7] bg-[#14C1D7]/20' :
                    milestone.status === 'current' ? 'border-[#DAA520] bg-[#DAA520]/20 animate-pulse' :
                    'border-gray-600 bg-black'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      milestone.status === 'complete' ? 'text-[#14C1D7]' :
                      milestone.status === 'current' ? 'text-[#DAA520]' :
                      'text-gray-500'
                    }`} />
                  </div>
                </div>

                {/* Empty space for opposite side */}
                <div className="w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
