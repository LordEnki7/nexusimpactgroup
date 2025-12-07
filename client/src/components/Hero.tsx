import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { ArrowDown, ChevronRight, Play } from "lucide-react";
import * as THREE from "three";
import heroBg from "@assets/generated_images/dark_sci-fi_nebula_background.png";

function RingsModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ring 1 - Top Center (Gold) */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 16, 100]} />
        <meshStandardMaterial
          color="#DAA520"
          metalness={1}
          roughness={0.15}
          emissive="#DAA520"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ring 2 - Bottom Left (Blue) */}
      <mesh position={[-1, -0.6, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 16, 100]} />
        <meshStandardMaterial
          color="#0B1B3F"
          metalness={0.9}
          roughness={0.2}
          emissive="#14C1D7"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Ring 3 - Bottom Right (Blue) */}
      <mesh position={[1, -0.6, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 16, 100]} />
        <meshStandardMaterial
          color="#0B1B3F"
          metalness={0.9}
          roughness={0.2}
          emissive="#14C1D7"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

export default function Hero() {
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

      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-20">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#14C1D7" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#DAA520" />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <RingsModel />
          </Float>
          <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.5} color="#14C1D7" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
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
    </section>
  );
}