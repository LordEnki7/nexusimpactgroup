import { motion } from "framer-motion";
import { Calendar, Phone, Clock, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function BookingSection() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'callback'>('calendar');
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferredTime: "",
    division: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const callbackMutation = useMutation({
    mutationFn: async (data: typeof callbackForm) => {
      const response = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setCallbackForm({ name: "", phone: "", email: "", preferredTime: "", division: "" });
      }, 3000);
    },
  });

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callbackMutation.mutate(callbackForm);
  };

  const divisions = [
    "C.A.R.E.N.", "Real Pulse Verifier", "My Life Assistant", "The Remedy Club",
    "Rent-A-Buddy", "Eternal Chase", "Project DNA Music", "Zapp Marketing and Manufacturing",
    "Studio Artist Live", "Right Time Notary", "The Shock Factor", "ClearSpace", "CAD and Me"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#0B1B3F]/30 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,193,215,0.1)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Get Started</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Book a Consultation</h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Ready to transform your business? Schedule a free consultation with our team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                activeTab === 'calendar'
                  ? 'bg-[#14C1D7] text-black'
                  : 'bg-transparent border border-gray-600 text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7]'
              }`}
              data-testid="tab-calendar"
            >
              <Calendar className="w-4 h-4" /> Schedule Meeting
            </button>
            <button
              onClick={() => setActiveTab('callback')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                activeTab === 'callback'
                  ? 'bg-[#14C1D7] text-black'
                  : 'bg-transparent border border-gray-600 text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7]'
              }`}
              data-testid="tab-callback"
            >
              <Phone className="w-4 h-4" /> Request Callback
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-2xl p-8"
          >
            {activeTab === 'calendar' ? (
              <div className="text-center">
                <div className="bg-black/50 rounded-xl p-8 border border-[#14C1D7]/10">
                  <Calendar className="w-16 h-16 text-[#14C1D7] mx-auto mb-4" />
                  <h4 className="text-2xl font-heading font-bold text-white mb-2">Schedule Your Consultation</h4>
                  <p className="text-gray-400 mb-6">
                    Choose a convenient time to meet with our team. We'll discuss your needs and how NIG can help.
                  </p>
                  <div className="bg-[#14C1D7]/10 border border-[#14C1D7]/30 rounded-lg p-6 inline-block">
                    <p className="text-[#14C1D7] font-mono text-sm uppercase tracking-wider mb-2">Coming Soon</p>
                    <p className="text-white">Calendly integration will be available here.</p>
                    <p className="text-gray-400 text-sm mt-2">For now, use the callback request form.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {!submitted ? (
                  <form onSubmit={handleCallbackSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={callbackForm.name}
                          onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                          className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                          placeholder="John Doe"
                          data-testid="input-callback-name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={callbackForm.phone}
                          onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                          className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                          placeholder="+1 (555) 000-0000"
                          data-testid="input-callback-phone"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={callbackForm.email}
                          onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                          className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                          placeholder="john@example.com"
                          data-testid="input-callback-email"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                          Preferred Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={callbackForm.preferredTime}
                            onChange={(e) => setCallbackForm({ ...callbackForm, preferredTime: e.target.value })}
                            className="w-full bg-black/50 border border-[#14C1D7]/30 rounded pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                            data-testid="select-callback-time"
                          >
                            <option value="">Anytime</option>
                            <option value="morning">Morning (9am - 12pm)</option>
                            <option value="afternoon">Afternoon (12pm - 5pm)</option>
                            <option value="evening">Evening (5pm - 8pm)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                        Division of Interest
                      </label>
                      <select
                        value={callbackForm.division}
                        onChange={(e) => setCallbackForm({ ...callbackForm, division: e.target.value })}
                        className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                        data-testid="select-callback-division"
                      >
                        <option value="">General Inquiry</option>
                        {divisions.map((div) => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={callbackMutation.isPending}
                      className="w-full bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-mono uppercase tracking-wider py-4 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      data-testid="btn-request-callback"
                    >
                      {callbackMutation.isPending ? "Submitting..." : (
                        <>
                          Request Callback <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-[#14C1D7] mx-auto mb-4" />
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">Request Received!</h3>
                    <p className="text-gray-400">We'll call you back within 24 hours.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
