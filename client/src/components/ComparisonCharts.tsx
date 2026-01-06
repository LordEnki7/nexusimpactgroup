import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";

const comparisons = [
  {
    category: "Roadside Safety",
    nigService: "C.A.R.E.N.",
    features: [
      { name: "24/7 Automated Response", nig: true, competitors: false },
      { name: "Real-time GPS Tracking", nig: true, competitors: true },
      { name: "AI-Powered Risk Assessment", nig: true, competitors: false },
      { name: "Integrated Emergency Services", nig: true, competitors: false },
      { name: "Predictive Maintenance Alerts", nig: true, competitors: false },
    ],
    nigAdvantage: "73% faster response time"
  },
  {
    category: "Identity Verification",
    nigService: "Real Pulse Verifier",
    features: [
      { name: "Biometric Authentication", nig: true, competitors: true },
      { name: "Liveness Detection", nig: true, competitors: false },
      { name: "Cross-Platform Integration", nig: true, competitors: false },
      { name: "Fraud Prevention AI", nig: true, competitors: false },
      { name: "Privacy-First Architecture", nig: true, competitors: false },
    ],
    nigAdvantage: "99.7% fraud detection accuracy"
  },
  {
    category: "Credit Repair",
    nigService: "The Remedy Club",
    features: [
      { name: "Personalized Action Plans", nig: true, competitors: true },
      { name: "Legal Dispute Resolution", nig: true, competitors: false },
      { name: "Credit Monitoring", nig: true, competitors: true },
      { name: "Debt Negotiation", nig: true, competitors: false },
      { name: "Financial Education", nig: true, competitors: true },
    ],
    nigAdvantage: "Average 127-point score increase"
  }
];

export default function ComparisonCharts() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-[#0B1B3F]/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Why Choose NIG</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">The NIG Advantage</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            See how our integrated ecosystem outperforms fragmented solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {comparisons.map((comparison, idx) => (
            <motion.div
              key={comparison.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#14C1D7]/20 to-transparent p-6 border-b border-[#14C1D7]/20">
                <span className="text-[#DAA520] font-mono text-xs uppercase tracking-wider">{comparison.category}</span>
                <h4 className="text-xl font-heading font-bold text-white mt-1">{comparison.nigService}</h4>
              </div>

              {/* Comparison Table */}
              <div className="p-6">
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Feature</span>
                  <div className="flex gap-8">
                    <span className="text-[#14C1D7]">NIG</span>
                    <span className="text-gray-500">Others</span>
                  </div>
                </div>

                {comparison.features.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0">
                    <span className="text-gray-300 text-sm">{feature.name}</span>
                    <div className="flex gap-8">
                      <div className="w-8 flex justify-center">
                        {feature.nig ? (
                          <Check className="w-5 h-5 text-[#14C1D7]" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="w-8 flex justify-center">
                        {feature.competitors ? (
                          <Check className="w-5 h-5 text-gray-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500/50" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* NIG Advantage Badge */}
                <div className="mt-6 flex items-center gap-2 bg-[#DAA520]/10 border border-[#DAA520]/30 rounded-lg p-4">
                  <Zap className="w-5 h-5 text-[#DAA520]" />
                  <div>
                    <span className="text-[#DAA520] font-mono text-xs uppercase tracking-wider">NIG Advantage</span>
                    <p className="text-white font-semibold">{comparison.nigAdvantage}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
