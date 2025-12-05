import Hero from "@/components/Hero";
import EcosystemGrid from "@/components/EcosystemGrid";
import MissionStrip from "@/components/MissionStrip";
import DivisionShowcase from "@/components/DivisionShowcase";
import GlobalFootprint from "@/components/GlobalFootprint";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#14C1D7] selection:text-black">
      <Hero />
      <EcosystemGrid />
      <MissionStrip />
      <DivisionShowcase />
      <GlobalFootprint />
      <Footer />
    </main>
  );
}