import { motion } from "framer-motion";
import { Activity, Bot, Users, Globe, Music, Factory, Hexagon, LucideIcon, Palette, Stamp, Mic, Smartphone, Heart, ExternalLink } from "lucide-react";
import { useState } from "react";
import ContactDialog from "./ContactDialog";
import remedyLogo from "@assets/The_Remedy_Club_logo_design_1767676977106.png";
import carenLogo from "@assets/caren_webapp_logo_1767677583106.png";
import rentABuddyLogo from "@assets/logo_1767677865961.png";
import projectDnaLogo from "@assets/logo_Real_(1)_1767678004955.jpg";
import eternalChaseLogo from "@assets/Gemini_Generated_Image_h4tze0h4tze0h4tz_1767678310554.png";
import realPulseLogo from "@assets/hero-image_1767679529900.png";
import myLifeAssistantLogo from "@assets/My_Life_Assistant_Logo_1767680675223.png";
import nigCoreLogo from "@assets/NEXUS_Impact_Group_1764972734788.png";
import clearSpaceLogo from "@assets/ClearSpace_1024x1024_1767682474294.png";
import shockFactorLogo from "@assets/theshockfactor_1767683156627.jpg";
import cadAndMeLogo from "@assets/Coronary_Artery_Disease_1767683576054.png";
import zappLogo from "@assets/Zapp_1767683679271.png";
import studioArtistLogo from "@assets/5-3d_(1)_1767685101771.jpg";
import rightTimeNotaryLogo from "@assets/Right_Time_Notary_logo_1767685417489.png";

type Division = {
  id: number;
  title: string;
  description: string;
  color: string;
  size?: string;
  icon?: LucideIcon;
  logo?: string;
  link?: string;
};

const divisions: Division[] = [
  {
    id: 1,
    title: "C.A.R.E.N.",
    logo: carenLogo,
    description: "Automated Roadside Guardian",
    color: "cyan",
    link: "https://carenalert.com"
  },
  {
    id: 2,
    title: "Real Pulse Verifier",
    logo: realPulseLogo,
    description: "True Identity Validation",
    color: "cyan"
  },
  {
    id: 3,
    title: "My Life Assistant",
    logo: myLifeAssistantLogo,
    description: "AI Personal Concierge",
    color: "cyan",
    link: "https://mylifeassistant.vip"
  },
  {
    id: 4,
    title: "The Remedy Club",
    logo: remedyLogo,
    description: "Credit & Debt Freedom",
    color: "gold",
    link: "https://theremedyclub.vip"
  },
  {
    id: 5,
    title: "NIG CORE ECOSYSTEM",
    logo: nigCoreLogo,
    description: "Central Intelligence",
    color: "core",
    size: "large"
  },
  {
    id: 6,
    title: "Rent-A-Buddy",
    logo: rentABuddyLogo,
    description: "Platonic Connection",
    color: "cyan",
    link: "https://rent-a-buddy.info"
  },
  {
    id: 7,
    title: "Eternal Chase",
    logo: eternalChaseLogo,
    description: "Immersive Entertainment",
    color: "cyan",
    link: "https://eternalchase.stream"
  },
  {
    id: 8,
    title: "Project DNA Music",
    logo: projectDnaLogo,
    description: "Sonic Engineering",
    color: "cyan",
    link: "https://projectdnamusic.info"
  },
  {
    id: 9,
    title: "Zapp Marketing and Manufacturing",
    logo: zappLogo,
    description: "Global Manufacturing",
    color: "cyan",
    link: "https://zapp-ecommerce.online"
  },
  {
    id: 10,
    title: "Studio Artist Live",
    logo: studioArtistLogo,
    description: "Creative Performance Platform",
    color: "cyan",
    link: "https://studioartistlive.com"
  },
  {
    id: 11,
    title: "Right Time Notary",
    logo: rightTimeNotaryLogo,
    description: "Mobile Notary Services",
    color: "cyan"
  },
  {
    id: 12,
    title: "The Shock Factor",
    logo: shockFactorLogo,
    description: "Podcast Entertainment",
    color: "cyan"
  },
  {
    id: 13,
    title: "ClearSpace",
    logo: clearSpaceLogo,
    description: "iPhone Image Cleaner",
    color: "cyan",
    link: "https://clearspace.photos"
  },
  {
    id: 14,
    title: "CAD and Me",
    logo: cadAndMeLogo,
    description: "Coronary Artery Disease Audiobook",
    color: "cyan"
  }
];

export default function EcosystemGrid() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState("");

  const handleDivisionClick = (division: Division) => {
    if (division.link) {
      window.open(division.link, "_blank", "noopener,noreferrer");
    } else {
      setSelectedDivision(division.title);
      setDialogOpen(true);
    }
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
              onClick={() => handleDivisionClick(division)}
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

              {division.logo ? (
                <div className="mb-6 w-24 h-24 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img src={division.logo} alt={division.title} className="w-full h-full object-cover" />
                </div>
              ) : division.icon ? (
                <div className={`
                  mb-6 p-4 rounded-full border 
                  ${division.color === 'gold' || division.color === 'core' ? 'border-[#DAA520] text-[#DAA520]' : 'border-[#14C1D7] text-[#14C1D7]'}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {(() => {
                    const IconComponent = division.icon;
                    return <IconComponent className="w-10 h-10" strokeWidth={1} />;
                  })()}
                </div>
              ) : null}

              <h4 className={`
                text-xl font-heading font-bold mb-2 text-center
                ${division.color === 'core' ? 'text-[#DAA520] text-2xl' : 'text-white'}
              `}>
                {division.title}
              </h4>

              <p className="text-gray-400 font-mono text-xs uppercase tracking-wider text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {division.description}
              </p>

              {division.link ? (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[#14C1D7]/20 border border-[#14C1D7]/50 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-[#14C1D7] uppercase tracking-wider">Live</span>
                  <ExternalLink className="w-3 h-3 text-[#14C1D7]" />
                </div>
              ) : (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gray-800/50 border border-gray-600/50 rounded-full">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Coming Soon</span>
                </div>
              )}

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