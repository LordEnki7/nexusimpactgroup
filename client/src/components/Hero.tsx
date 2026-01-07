import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronRight, Play, X } from "lucide-react";
import { useState } from "react";
import heroBg from "@assets/generated_images/dark_sci-fi_nebula_background.png";
import ringsLogo from "@assets/generated_images/3d_interlocking_rings_logo.png";
import heroVideo from "@assets/generated_videos/futuristic_nig_ecosystem_hero_video.mp4";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black" />

      {/* Animated Particles - CSS animations for better performance */}
      <div className="absolute inset-0 z-15">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#14C1D7] rounded-full animate-pulse"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              opacity: 0.4,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating Rings Logo - GPU accelerated */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          initial={{ rotateY: 0, scale: 1 }}
          animate={{ 
            rotateY: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative gpu-accelerated"
          style={{ 
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <img 
            src={ringsLogo} 
            alt="Nexus Rings" 
            className="w-64 h-64 md:w-96 md:h-96 object-contain"
            style={{ 
              filter: "drop-shadow(0 0 50px rgba(20,193,215,0.5))",
              willChange: "transform",
            }}
            loading="eager"
          />
          
          {/* Simplified glow effect */}
          <div className="absolute inset-0 bg-[#14C1D7]/10 blur-2xl rounded-full" />
        </motion.div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-30 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="font-heading text-sm font-bold tracking-[0.3em] text-[#DAA520] uppercase">
            Nexus Impact Group
          </h2>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-tight">
            Everything <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14C1D7] to-white text-glow-cyan">
              Connects Here.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-300 font-light leading-relaxed">
            The world's first fully integrated ecosystem for safety, identity, automation, finance, connection, entertainment, and global trade.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(20, 193, 215, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-transparent border border-[#14C1D7] text-[#14C1D7] font-mono text-sm tracking-wider uppercase overflow-hidden"
              data-testid="button-explore"
            >
              <span className="absolute inset-0 w-full h-full bg-[#14C1D7]/10 group-hover:bg-[#14C1D7]/20 transition-all duration-300" />
              <span className="relative flex items-center gap-2 font-bold">
                Explore Ecosystem <ChevronRight className="w-4 h-4" />
              </span>
            </motion.button>

            <motion.button
              onClick={() => setShowVideo(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(218, 165, 32, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-transparent border border-[#DAA520] text-[#DAA520] font-mono text-sm tracking-wider uppercase overflow-hidden"
              data-testid="button-watch-vision"
            >
              <span className="absolute inset-0 w-full h-full bg-[#DAA520]/10 group-hover:bg-[#DAA520]/20 transition-all duration-300" />
              <span className="relative flex items-center gap-2 font-bold">
                Watch Vision <Play className="w-4 h-4 fill-current" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-[#DAA520] flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Scroll to enter</span>
        <ArrowDown className="w-5 h-5" />
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-5xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-12 right-0 text-white hover:text-[#14C1D7] transition-colors"
                data-testid="button-close-video"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="rounded-xl overflow-hidden border border-[#14C1D7]/30 shadow-[0_0_50px_rgba(20,193,215,0.3)]">
                <video
                  src={heroVideo}
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  className="w-full aspect-video"
                  data-testid="video-hero"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-center mt-4 text-[#DAA520] font-mono text-sm uppercase tracking-widest">
                The NIG Vision
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
