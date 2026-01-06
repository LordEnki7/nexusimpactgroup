import { motion } from "framer-motion";
import { Calendar, ArrowRight, User, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Revolutionizing Roadside Safety",
    excerpt: "Discover how C.A.R.E.N. uses artificial intelligence to predict and prevent roadside emergencies before they happen.",
    category: "Technology",
    author: "NIG Research Team",
    date: "Jan 5, 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "The Future of Identity Verification",
    excerpt: "Real Pulse Verifier's biometric technology is setting new standards in digital trust and security.",
    category: "Security",
    author: "Dr. Sarah Kim",
    date: "Jan 3, 2026",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "5 Steps to Rebuild Your Credit Score",
    excerpt: "The Remedy Club shares proven strategies for credit repair and financial freedom.",
    category: "Finance",
    author: "The Remedy Club",
    date: "Jan 1, 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Global Trade Made Simple with Zapp",
    excerpt: "How our escrow-protected platform is empowering entrepreneurs worldwide.",
    category: "Business",
    author: "Zapp Team",
    date: "Dec 28, 2025",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "The NIG Ecosystem: A Year in Review",
    excerpt: "Looking back at our achievements and forward to what's next for Nexus Impact Group.",
    category: "Company News",
    author: "NIG Leadership",
    date: "Dec 25, 2025",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop"
  }
];

export default function Blog() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,193,215,0.1)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <h2 className="text-[#DAA520] font-mono tracking-widest uppercase text-sm mb-4">Latest Updates</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">News & Insights</h3>
          </div>
          <a 
            href="#" 
            className="mt-6 md:mt-0 flex items-center gap-2 text-[#14C1D7] hover:text-white transition-colors font-mono text-sm uppercase tracking-wider"
            data-testid="link-view-all-posts"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          {featuredPost && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              data-testid={`card-blog-${featuredPost.id}`}
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-[#DAA520] text-black font-mono text-xs uppercase tracking-wider rounded mb-4">
                    Featured
                  </span>
                  <h4 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 group-hover:text-[#14C1D7] transition-colors">
                    {featuredPost.title}
                  </h4>
                  <p className="text-gray-300 line-clamp-2">{featuredPost.excerpt}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {featuredPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" /> {featuredPost.category}
                </span>
              </div>
            </motion.article>
          )}

          {/* Regular Posts */}
          <div className="space-y-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex gap-6 cursor-pointer p-4 rounded-xl hover:bg-[#0B1B3F]/30 transition-colors"
                data-testid={`card-blog-${post.id}`}
              >
                <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#14C1D7] font-mono text-xs uppercase tracking-wider">{post.category}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500 text-xs">{post.date}</span>
                  </div>
                  <h4 className="text-white font-semibold group-hover:text-[#14C1D7] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
