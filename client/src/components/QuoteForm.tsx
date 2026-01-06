import { motion } from "framer-motion";
import { Code, Send, CheckCircle, DollarSign, Clock, Briefcase } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const projectTypes = [
    "Mobile App (iOS/Android)",
    "Web Application",
    "Enterprise Platform",
    "E-commerce Solution",
    "AI/Machine Learning",
    "IoT/Hardware Integration",
    "API Development",
    "Full Ecosystem (Like NIG)",
    "Other"
  ];

  const budgets = [
    "Under $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000 - $250,000",
    "$250,000+",
    "Not Sure Yet"
  ];

  const timelines = [
    "ASAP (Rush)",
    "1-2 Months",
    "3-6 Months",
    "6-12 Months",
    "Flexible"
  ];

  if (submitted) {
    return (
      <section className="py-24 bg-gradient-to-b from-black via-[#0B1B3F]/20 to-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-[#0B1B3F]/50 border border-[#14C1D7]/30 rounded-2xl p-12">
              <CheckCircle className="w-20 h-20 text-[#14C1D7] mx-auto mb-6" />
              <h3 className="text-3xl font-heading font-bold text-white mb-4">Quote Request Received!</h3>
              <p className="text-gray-400 mb-6">
                Thank you for your interest in working with NIG. Our team will review your project and send a detailed proposal within 48 hours.
              </p>
              <p className="text-[#DAA520] font-mono text-sm">
                Check your email for a confirmation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 bg-gradient-to-b from-black via-[#0B1B3F]/20 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(218,165,32,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(218,165,32,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Build With Us</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Request a Quote</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Let us bring your app idea to life. The same team that built 13 NIG divisions is ready to build for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Side Info */}
            <div className="space-y-6">
              <div className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-xl p-6">
                <Code className="w-10 h-10 text-[#14C1D7] mb-4" />
                <h4 className="text-white font-semibold mb-2">Expert Development</h4>
                <p className="text-gray-400 text-sm">Full-stack development using cutting-edge technologies.</p>
              </div>
              <div className="bg-[#0B1B3F]/50 border border-[#DAA520]/20 rounded-xl p-6">
                <DollarSign className="w-10 h-10 text-[#DAA520] mb-4" />
                <h4 className="text-white font-semibold mb-2">Transparent Pricing</h4>
                <p className="text-gray-400 text-sm">Clear quotes with no hidden fees. Pay only for what you need.</p>
              </div>
              <div className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-xl p-6">
                <Clock className="w-10 h-10 text-[#14C1D7] mb-4" />
                <h4 className="text-white font-semibold mb-2">Fast Delivery</h4>
                <p className="text-gray-400 text-sm">Agile development process with regular updates and on-time delivery.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-2xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      placeholder="John Doe"
                      data-testid="input-quote-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      placeholder="john@company.com"
                      data-testid="input-quote-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                    Company Name
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      placeholder="Your Company"
                      data-testid="input-quote-company"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                    Project Type *
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                    data-testid="select-quote-type"
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      data-testid="select-quote-budget"
                    >
                      <option value="">Select budget</option>
                      {budgets.map((budget) => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      data-testid="select-quote-timeline"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                    Project Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors resize-none"
                    placeholder="Tell us about your project idea, goals, and any specific requirements..."
                    data-testid="textarea-quote-description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-[#DAA520] to-[#DAA520]/80 hover:from-[#DAA520]/90 hover:to-[#DAA520]/70 text-black font-mono uppercase tracking-wider py-4 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  data-testid="btn-submit-quote"
                >
                  {mutation.isPending ? "Submitting..." : (
                    <>
                      Get Your Free Quote <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
