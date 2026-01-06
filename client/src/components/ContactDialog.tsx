import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  division?: string;
}

export default function ContactDialog({ isOpen, onClose, division = "" }: ContactDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    division: division,
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/inquiries", {
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
        onClose();
        setSubmitted(false);
        setFormData({ name: "", email: "", division: "", message: "" });
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-panel rounded-2xl p-8 shadow-2xl border border-[#14C1D7]/30"
            data-testid="contact-dialog"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              data-testid="button-close-dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <>
                <h2 className="text-2xl font-heading font-bold text-white mb-2">Get in Touch</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Interested in learning more? Send us a message.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      placeholder="John Doe"
                      data-testid="input-name"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      placeholder="john@example.com"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Division of Interest
                    </label>
                    <select
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors"
                      data-testid="select-division"
                    >
                      <option value="">General Inquiry</option>
                      <option value="C.A.R.E.N.">C.A.R.E.N.</option>
                      <option value="Real Pulse Verifier">Real Pulse Verifier</option>
                      <option value="My Life Assistant">My Life Assistant</option>
                      <option value="The Remedy Club">The Remedy Club</option>
                      <option value="Rent-A-Buddy">Rent-A-Buddy</option>
                      <option value="Eternal Chase">Eternal Chase</option>
                      <option value="Project DNA Music">Project DNA Music</option>
                      <option value="Zapp Marketing and Manufacturing">Zapp Marketing and Manufacturing</option>
                      <option value="Studio Artist Live">Studio Artist Live</option>
                      <option value="Right Time Notary">Right Time Notary</option>
                      <option value="The Shock Factor">The Shock Factor</option>
                      <option value="ClearSpace">ClearSpace</option>
                      <option value="CAD and Me">CAD and Me</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#DAA520] uppercase tracking-wider mb-2 block">
                      Message
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full bg-black/50 border border-[#14C1D7]/30 rounded px-4 py-3 text-white focus:outline-none focus:border-[#14C1D7] transition-colors resize-none"
                      placeholder="Tell us about your interest..."
                      data-testid="textarea-message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-[#14C1D7] hover:bg-[#14C1D7]/80 text-black font-mono uppercase tracking-wider py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    data-testid="button-submit"
                  >
                    {mutation.isPending ? "Sending..." : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-[#14C1D7] mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">We'll be in touch soon.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}