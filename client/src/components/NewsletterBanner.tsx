import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to subscribe");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      mutation.mutate(email);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#0B1B3F] via-[#14C1D7]/10 to-[#0B1B3F] border-y border-[#14C1D7]/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block p-3 rounded-full bg-[#14C1D7]/10 mb-6">
              <Mail className="w-8 h-8 text-[#14C1D7]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Stay Connected to the Nexus
            </h2>
            <p className="text-gray-400 mb-8">
              Be the first to know about new divisions, partnerships, and innovations.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-black/50 border border-[#14C1D7]/30 rounded-lg px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#14C1D7] transition-colors"
                  data-testid="input-newsletter-email"
                />
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[#DAA520] hover:bg-[#DAA520]/80 text-black font-mono uppercase tracking-wider px-8 py-4 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                  data-testid="button-subscribe"
                >
                  {mutation.isPending ? "..." : "Subscribe"}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-[#14C1D7]"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-mono">Thanks for subscribing!</span>
              </motion.div>
            )}

            {mutation.isError && (
              <p className="text-red-400 text-sm mt-4">
                {mutation.error?.message || "Something went wrong. Please try again."}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}