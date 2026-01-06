import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    name: "General",
    faqs: [
      {
        question: "What is Nexus Impact Group?",
        answer: "Nexus Impact Group (NIG) is the world's first fully integrated ecosystem, connecting 13 innovative divisions that cover safety, identity verification, automation, finance, connection, entertainment, health, and global trade. Our mission is to create seamless solutions that enhance every aspect of modern life."
      },
      {
        question: "How do the divisions work together?",
        answer: "All 13 divisions are connected through our NIG Core hub, which enables seamless data sharing and cross-platform functionality. For example, your identity verified through Real Pulse can authenticate you across all NIG services instantly."
      },
      {
        question: "Is my data secure with NIG?",
        answer: "Absolutely. We employ enterprise-grade encryption, blockchain verification, and privacy-first architecture across all divisions. Your data is never sold to third parties and you maintain full control over your information."
      }
    ]
  },
  {
    name: "C.A.R.E.N.",
    faqs: [
      {
        question: "What does C.A.R.E.N. stand for?",
        answer: "C.A.R.E.N. stands for Citizen Assistance for Roadside Encounters and Navigation. It's an AI-powered system that provides real-time protection and emergency response for drivers."
      },
      {
        question: "How does C.A.R.E.N. detect emergencies?",
        answer: "C.A.R.E.N. uses advanced sensors and AI to detect accidents, sudden stops, and unusual patterns. It can automatically alert emergency services and provide your exact GPS location."
      }
    ]
  },
  {
    name: "The Remedy Club",
    faqs: [
      {
        question: "What services does The Remedy Club offer?",
        answer: "The Remedy Club, featuring Mr. Delete Credit Counseling, offers comprehensive credit repair, debt negotiation, legal dispute resolution, and financial education. We help clients improve their credit scores and achieve financial freedom."
      },
      {
        question: "How long does credit repair take?",
        answer: "Results vary by individual situation, but most clients see significant improvements within 60-90 days. Our average client achieves a 127-point credit score increase through our program."
      }
    ]
  },
  {
    name: "Zapp Marketing",
    faqs: [
      {
        question: "What products can I source through Zapp?",
        answer: "Zapp Marketing and Manufacturing offers access to over 40,000 products across all categories - from electronics to apparel, home goods to industrial equipment. We handle sourcing, quality control, and delivery."
      },
      {
        question: "How does the escrow protection work?",
        answer: "Your payment is held securely until you confirm receipt and satisfaction with your order. This protects both buyers and sellers in every transaction."
      }
    ]
  },
  {
    name: "App Development",
    faqs: [
      {
        question: "Can NIG build custom apps for my business?",
        answer: "Yes! Our development team has built all 13 NIG divisions and can create custom applications tailored to your needs. From mobile apps to enterprise platforms, we have the expertise to bring your vision to life."
      },
      {
        question: "What technologies do you use?",
        answer: "We use cutting-edge technologies including AI/ML, blockchain, React, Node.js, Python, and cloud-native architectures. We select the best stack for each project's unique requirements."
      },
      {
        question: "How do I get a quote for development?",
        answer: "Simply fill out our Request a Quote form with your project details. We'll review your requirements and provide a comprehensive proposal within 48 hours."
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const currentFaqs = faqCategories.find(cat => cat.name === activeCategory)?.faqs || [];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(218,165,32,0.1)_0%,transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Have Questions?</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Frequently Asked Questions</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Find answers to common questions about our ecosystem and services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {faqCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  setOpenQuestions([]);
                }}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
                  activeCategory === category.name
                    ? 'bg-[#14C1D7] text-black'
                    : 'bg-transparent border border-gray-700 text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7]'
                }`}
                data-testid={`faq-tab-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[#14C1D7]/20 rounded-xl overflow-hidden bg-[#0B1B3F]/30"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#14C1D7]/5 transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-5 h-5 text-[#DAA520] flex-shrink-0" />
                    <span className="text-white font-semibold">{faq.question}</span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#14C1D7] transition-transform duration-300 ${
                      openQuestions.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {openQuestions.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-[60px]">
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
