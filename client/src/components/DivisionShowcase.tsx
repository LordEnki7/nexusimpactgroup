import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

// Division logos
import carenLogo from "@assets/caren_webapp_logo_1767677583106.png";
import realPulseLogo from "@assets/hero-image_1767679529900.png";
import myLifeAssistantLogo from "@assets/My_Life_Assistant_Logo_1767680675223.png";
import remedyLogo from "@assets/The_Remedy_Club_logo_design_1767676977106.png";
import rentABuddyLogo from "@assets/logo_1767677865961.png";
import eternalChaseLogo from "@assets/Gemini_Generated_Image_h4tze0h4tze0h4tz_1767678310554.png";
import projectDnaLogo from "@assets/logo_Real_(1)_1767678004955.jpg";
import zappLogo from "@assets/Zapp_1767683679271.png";
import studioArtistLogo from "@assets/5-3d_(1)_1767685101771.jpg";
import rightTimeNotaryLogo from "@assets/Right_Time_Notary_logo_1767685417489.png";
import shockFactorLogo from "@assets/theshockfactor_1767683156627.jpg";
import clearSpaceLogo from "@assets/ClearSpace_1024x1024_1767682474294.png";
import cadAndMeLogo from "@assets/Coronary_Artery_Disease_1767683576054.png";

const showcaseItems = [
  {
    id: "caren",
    title: "C.A.R.E.N.",
    subtitle: "Your Roadside Guardian",
    description: "Citizen Assistance for Roadside Encounters and Navigation. Real-time protection for real moments with advanced telemetry and safety response.",
    image: carenLogo,
    align: "left"
  },
  {
    id: "pulse",
    title: "Real Pulse Verifier",
    subtitle: "The Truth Engine",
    description: "Biometric identity verification that cannot be forged. Trust is the new currency with true identity validation.",
    image: realPulseLogo,
    align: "right"
  },
  {
    id: "assistant",
    title: "My Life Assistant",
    subtitle: "Hyper-Personalized AI",
    description: "An AI personal concierge that knows you better than you know yourself. Managing your life with intelligence.",
    image: myLifeAssistantLogo,
    align: "left"
  },
  {
    id: "remedy",
    title: "The Remedy Club",
    subtitle: "Credit & Debt Freedom",
    description: "Fix your credit. Empower your future. Advanced credit and legal solutions with Mr. Delete Credit Counseling.",
    image: remedyLogo,
    align: "right"
  },
  {
    id: "buddy",
    title: "Rent-A-Buddy",
    subtitle: "Platonic Connection",
    description: "Meaningful platonic connections for companionship, events, and life experiences. Never face moments alone.",
    image: rentABuddyLogo,
    align: "left"
  },
  {
    id: "eternal",
    title: "Eternal Chase",
    subtitle: "Immersive Entertainment",
    description: "The Pursuit of Love - immersive entertainment universes powered by neural rendering and storytelling.",
    image: eternalChaseLogo,
    align: "right"
  },
  {
    id: "dna",
    title: "Project DNA Music",
    subtitle: "Sonic Engineering",
    description: "Shakim & Project DNA - where music meets innovation. Cutting-edge sonic engineering and production.",
    image: projectDnaLogo,
    align: "left"
  },
  {
    id: "zapp",
    title: "Zapp Marketing & Manufacturing",
    subtitle: "Global Supply Chain",
    description: "40,000+ products with 100% escrow-protected global delivery. Autonomous trade routes and smart manufacturing.",
    image: zappLogo,
    align: "right"
  },
  {
    id: "studio",
    title: "Studio Artist Live",
    subtitle: "Creative Performance Platform",
    description: "Live creative performance and artist collaboration platform. Where artistry meets technology.",
    image: studioArtistLogo,
    align: "left"
  },
  {
    id: "notary",
    title: "Right Time Notary",
    subtitle: "Mobile Notary Services",
    description: "Reliable, friendly, and professional mobile notary services. We come to you when you need it.",
    image: rightTimeNotaryLogo,
    align: "right"
  },
  {
    id: "shock",
    title: "The Shock Factor",
    subtitle: "Podcast Entertainment",
    description: "Bold conversations, shocking revelations. The podcast that electrifies your mind and challenges the norm.",
    image: shockFactorLogo,
    align: "left"
  },
  {
    id: "clearspace",
    title: "ClearSpace",
    subtitle: "iPhone Image Cleaner",
    description: "Clean up your iPhone photos effortlessly. Smart AI-powered image organization and storage optimization.",
    image: clearSpaceLogo,
    align: "right"
  },
  {
    id: "cad",
    title: "CAD and Me",
    subtitle: "Health Awareness Audiobook",
    description: "Coronary Artery Disease and Me by S. Williams. A personal journey through heart health awareness and education.",
    image: cadAndMeLogo,
    align: "left"
  }
];

function ShowcaseCard({ item, index }: { item: typeof showcaseItems[0], index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="min-h-[60vh] flex items-center justify-center py-16 relative overflow-hidden">
      <div className={`container mx-auto px-4 flex flex-col ${item.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 relative z-10`}>
        
        {/* Image Side */}
        <div className="w-full md:w-1/2 relative group">
          <motion.div 
            style={{ y, opacity }}
            className="relative rounded-2xl overflow-hidden border border-[#14C1D7]/20 shadow-[0_0_50px_rgba(11,27,63,0.5)] max-w-md mx-auto"
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
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">{item.title}</h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 border-l-2 border-[#14C1D7] pl-6">
              {item.description}
            </p>
            
            <button 
              className="group flex items-center gap-3 text-white hover:text-[#14C1D7] transition-colors"
              data-testid={`btn-explore-${item.id}`}
            >
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
    <section className="bg-black relative">
      {/* Section Header */}
      <div className="py-20 text-center">
        <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Deep Dive</h2>
        <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Explore Our Ecosystem</h3>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto px-4">
          13 innovative divisions working together to transform how you live, work, and connect.
        </p>
      </div>
      
      {showcaseItems.map((item, index) => (
        <ShowcaseCard key={item.id} item={item} index={index} />
      ))}
    </section>
  );
}
