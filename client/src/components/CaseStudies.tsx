import { motion } from "framer-motion";
import { Quote, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

const caseStudies = [
  {
    id: 1,
    division: "C.A.R.E.N.",
    title: "Roadside Safety Revolution",
    client: "Commercial Fleet Operations",
    outcome: "73% reduction in roadside incidents",
    story: "A major logistics company implemented C.A.R.E.N. across their 500-vehicle fleet, resulting in faster emergency response times and dramatically improved driver safety.",
    testimonial: "C.A.R.E.N. has transformed how we handle roadside emergencies. Our drivers feel safer knowing help is always just a tap away.",
    author: "James Mitchell",
    role: "Fleet Safety Director",
    rating: 5
  },
  {
    id: 2,
    division: "The Remedy Club",
    title: "Credit Score Transformation",
    client: "Individual Client Success",
    outcome: "Average 127-point credit score increase",
    story: "Working with Mr. Delete Credit Counseling, clients have seen remarkable improvements in their credit profiles, opening doors to home ownership and financial freedom.",
    testimonial: "I went from denied for everything to approved for my dream home. The Remedy Club changed my life.",
    author: "Sarah Johnson",
    role: "Homeowner",
    rating: 5
  },
  {
    id: 3,
    division: "Zapp Marketing & Manufacturing",
    title: "Global Supply Chain Excellence",
    client: "E-commerce Entrepreneurs",
    outcome: "40,000+ products with 100% delivery guarantee",
    story: "Small business owners have leveraged Zapp's escrow-protected global sourcing to build profitable product lines without inventory risk.",
    testimonial: "From product idea to customer delivery, Zapp handled everything. My business grew 300% in the first year.",
    author: "Michael Chen",
    role: "E-commerce Business Owner",
    rating: 5
  },
  {
    id: 4,
    division: "Real Pulse Verifier",
    title: "Identity Fraud Prevention",
    client: "Financial Services Industry",
    outcome: "99.7% fraud detection accuracy",
    story: "A regional bank implemented Real Pulse biometric verification, virtually eliminating identity fraud and saving millions in potential losses.",
    testimonial: "Real Pulse gives us confidence that our customers are who they say they are. Fraud attempts dropped to nearly zero.",
    author: "David Park",
    role: "Chief Security Officer",
    rating: 5
  },
  {
    id: 5,
    division: "Right Time Notary",
    title: "Mobile Convenience Redefined",
    client: "Real Estate Professionals",
    outcome: "24/7 availability, 30-minute average response",
    story: "Real estate agents now close deals faster with on-demand notary services that meet clients anywhere, anytime.",
    testimonial: "Right Time Notary has become essential to our closing process. Professional, reliable, and always on time.",
    author: "Lisa Rodriguez",
    role: "Real Estate Broker",
    rating: 5
  }
];

export default function CaseStudies() {
  const [activeStudy, setActiveStudy] = useState(0);

  return (
    <section className="py-24 bg-gradient-to-b from-black via-[#0B1B3F]/30 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,193,215,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,193,215,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Success Stories</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Real Results, Real Impact</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            See how our ecosystem is transforming lives and businesses across industries.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Case Study Selector */}
          <div className="space-y-4">
            {caseStudies.map((study, index) => (
              <motion.button
                key={study.id}
                onClick={() => setActiveStudy(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                  activeStudy === index 
                    ? 'border-[#14C1D7] bg-[#14C1D7]/10' 
                    : 'border-gray-700 bg-black/30 hover:border-gray-500'
                }`}
                whileHover={{ x: 5 }}
                data-testid={`btn-case-study-${study.id}`}
              >
                <span className="text-[#DAA520] font-mono text-xs uppercase tracking-wider">{study.division}</span>
                <h4 className="text-white font-semibold mt-1">{study.title}</h4>
              </motion.button>
            ))}
          </div>

          {/* Active Case Study Detail */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeStudy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#DAA520] font-mono text-sm uppercase tracking-wider">
                  {caseStudies[activeStudy].division}
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400 text-sm">{caseStudies[activeStudy].client}</span>
              </div>

              <h4 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                {caseStudies[activeStudy].title}
              </h4>

              <div className="bg-[#14C1D7]/10 border border-[#14C1D7]/30 rounded-lg p-4 mb-6">
                <span className="text-[#14C1D7] font-mono text-sm uppercase tracking-wider">Key Outcome</span>
                <p className="text-white text-xl font-bold mt-1">{caseStudies[activeStudy].outcome}</p>
              </div>

              <p className="text-gray-300 leading-relaxed mb-8">
                {caseStudies[activeStudy].story}
              </p>

              {/* Testimonial */}
              <div className="border-l-4 border-[#DAA520] pl-6 py-2">
                <Quote className="w-8 h-8 text-[#DAA520] mb-3" />
                <p className="text-white italic text-lg leading-relaxed mb-4">
                  "{caseStudies[activeStudy].testimonial}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{caseStudies[activeStudy].author}</p>
                    <p className="text-gray-400 text-sm">{caseStudies[activeStudy].role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(caseStudies[activeStudy].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#DAA520] fill-[#DAA520]" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
