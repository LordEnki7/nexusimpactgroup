import Hero from "@/components/Hero";
import EcosystemGrid from "@/components/EcosystemGrid";
import MissionStrip from "@/components/MissionStrip";
import DivisionShowcase from "@/components/DivisionShowcase";
import CaseStudies from "@/components/CaseStudies";
import Timeline from "@/components/Timeline";
import ComparisonCharts from "@/components/ComparisonCharts";
import SocialProof from "@/components/SocialProof";
import BookingSection from "@/components/BookingSection";
import FAQ from "@/components/FAQ";
import QuoteForm from "@/components/QuoteForm";
import Blog from "@/components/Blog";
import NewsletterBanner from "@/components/NewsletterBanner";
import GlobalFootprint from "@/components/GlobalFootprint";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#14C1D7] selection:text-black">
      <Hero />
      <EcosystemGrid />
      <MissionStrip />
      <DivisionShowcase />
      <CaseStudies />
      <Timeline />
      <ComparisonCharts />
      <SocialProof />
      <BookingSection />
      <FAQ />
      <QuoteForm />
      <Blog />
      <NewsletterBanner />
      <GlobalFootprint />
      <Footer />
    </main>
  );
}
