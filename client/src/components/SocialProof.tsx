import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    content: "NIG's ecosystem has revolutionized how we operate. The seamless integration between divisions saved us countless hours and resources.",
    author: "Marcus Williams",
    role: "CEO, TechForward Inc.",
    rating: 5,
    division: "NIG Core"
  },
  {
    id: 2,
    content: "C.A.R.E.N. gave our fleet drivers peace of mind. Incident response time dropped by 70% in the first month alone.",
    author: "Patricia Chen",
    role: "Operations Director, Swift Logistics",
    rating: 5,
    division: "C.A.R.E.N."
  },
  {
    id: 3,
    content: "From 520 to 780 credit score in 8 months. The Remedy Club changed my financial life and opened doors I thought were closed forever.",
    author: "James Rodriguez",
    role: "First-time Homeowner",
    rating: 5,
    division: "The Remedy Club"
  },
  {
    id: 4,
    content: "Real Pulse Verifier eliminated fraud from our platform completely. Our users trust us more than ever.",
    author: "Dr. Sarah Mitchell",
    role: "CTO, SecureHealth",
    rating: 5,
    division: "Real Pulse Verifier"
  },
  {
    id: 5,
    content: "Zapp made global sourcing accessible for my small business. 40,000 products at my fingertips with full protection.",
    author: "Kevin O'Brien",
    role: "Founder, K&O Imports",
    rating: 5,
    division: "Zapp Marketing"
  },
  {
    id: 6,
    content: "My Life Assistant is like having a personal concierge 24/7. It handles my schedule, reminders, and even anticipates my needs.",
    author: "Angela Foster",
    role: "Executive Coach",
    rating: 5,
    division: "My Life Assistant"
  }
];

const stats = [
  { value: "13+", label: "Divisions" },
  { value: "40K+", label: "Products" },
  { value: "99.7%", label: "Accuracy" },
  { value: "127", label: "Avg Score Increase" }
];

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#0B1B3F]/30 via-black to-black relative overflow-hidden">
      {/* Stats Bar */}
      <div className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-[#0B1B3F]/30 border border-[#14C1D7]/20 rounded-xl"
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-[#14C1D7] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-mono text-xs uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">What People Say</h3>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0B1B3F]/50 border border-[#14C1D7]/20 rounded-2xl p-8 md:p-12"
            >
              <Quote className="w-12 h-12 text-[#DAA520] mb-6" />
              
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].content}"
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">
                    {testimonials[currentIndex].author}
                  </p>
                  <p className="text-gray-400">{testimonials[currentIndex].role}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#14C1D7]/10 border border-[#14C1D7]/30 rounded-full text-[#14C1D7] font-mono text-xs uppercase tracking-wider">
                    {testimonials[currentIndex].division}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#DAA520] fill-[#DAA520]" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full border border-gray-700 text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7] transition-colors"
              data-testid="btn-testimonial-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-[#14C1D7]' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  data-testid={`btn-testimonial-dot-${index}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full border border-gray-700 text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7] transition-colors"
              data-testid="btn-testimonial-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
