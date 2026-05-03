import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ExternalLink, Tag, Users, TrendingUp, Code, CheckCircle, ChevronRight, X, Loader2, ShoppingBag, DollarSign, Handshake, FileText, Star } from "lucide-react";

type Listing = {
  id: number;
  title: string;
  tagline: string;
  problem: string;
  targetCustomer: string;
  demoUrl?: string;
  revenueModel: string;
  techStack: string;
  category: string;
  tier: string;
  priceMin: number;
  priceMax: number;
  status: string;
  dealTypes: string;
  whatBuyerGets: string;
  featured: boolean;
};

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; range: string }> = {
  starter:       { label: "Starter",       color: "text-emerald-400",  bg: "bg-emerald-400/10 border-emerald-400/30",  range: "$2.5K–$7.5K"    },
  launch_ready:  { label: "Launch-Ready",  color: "text-[#14C1D7]",    bg: "bg-[#14C1D7]/10 border-[#14C1D7]/30",     range: "$10K–$25K"       },
  premium:       { label: "Premium",       color: "text-[#DAA520]",    bg: "bg-[#DAA520]/10 border-[#DAA520]/30",     range: "$25K–$75K+"      },
  full_business: { label: "Full Business", color: "text-purple-400",   bg: "bg-purple-400/10 border-purple-400/30",   range: "$50K–$150K+"     },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  available:   { label: "Available",   color: "text-emerald-400" },
  under_offer: { label: "Under Offer", color: "text-yellow-400"  },
  sold:        { label: "Sold",        color: "text-red-400"     },
};

const DEAL_LABELS: Record<string, { icon: React.ReactNode; label: string; desc: string }> = {
  license:     { icon: <FileText className="w-4 h-4" />,    label: "Concept License",        desc: "Use the idea, brand & demo. NIG may retain resale rights." },
  full_ip:     { icon: <ShoppingBag className="w-4 h-4" />, label: "Full IP Sale",           desc: "Everything: name, logo, code, domain, docs, full ownership." },
  partnership: { icon: <Handshake className="w-4 h-4" />,   label: "Partnership / Rev Share", desc: "NIG retains ownership. You fund or market it together." },
};

function formatPrice(min: number, max: number) {
  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 0)}K` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}+`;
}

function InquiryModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", dealType: "", budget: "", message: "" });

  const submit = useMutation({
    mutationFn: (data: typeof form) =>
      apiRequest("POST", "/api/marketplace/inquiry", {
        listingId: listing.id,
        listingTitle: listing.title,
        ...data,
      }),
    onSuccess: () => {
      toast({ title: "Interest submitted!", description: "We'll reach out within 24 hours to discuss next steps." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Please try again.", variant: "destructive" }),
  });

  const deals = listing.dealTypes.split(",").map(d => d.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0d1f3c] border border-[#14C1D7]/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0d1f3c] border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#14C1D7] font-mono uppercase tracking-widest mb-1">Express Interest</p>
            <h3 className="text-white font-bold text-lg">{listing.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1" data-testid="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">Deal Type *</label>
            <div className="grid gap-2">
              {deals.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, dealType: d }))}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${form.dealType === d ? "border-[#14C1D7] bg-[#14C1D7]/10" : "border-white/10 hover:border-white/20"}`}
                  data-testid={`deal-type-${d}`}
                >
                  <span className={`mt-0.5 ${form.dealType === d ? "text-[#14C1D7]" : "text-gray-500"}`}>{DEAL_LABELS[d]?.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${form.dealType === d ? "text-[#14C1D7]" : "text-white"}`}>{DEAL_LABELS[d]?.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{DEAL_LABELS[d]?.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {(["name", "email", "company"] as const).map(field => (
            <div key={field}>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}{field !== "company" ? " *" : ""}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full bg-[#0B1B3F] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#14C1D7]/50 placeholder-gray-600"
                placeholder={field === "email" ? "you@company.com" : field === "company" ? "Optional" : "Your full name"}
                data-testid={`input-${field}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">Budget Range</label>
            <select
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              className="w-full bg-[#0B1B3F] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#14C1D7]/50"
              data-testid="select-budget"
            >
              <option value="">Select your budget</option>
              <option>Under $10,000</option>
              <option>$10,000 – $25,000</option>
              <option>$25,000 – $50,000</option>
              <option>$50,000 – $100,000</option>
              <option>$100,000+</option>
              <option>Open to discuss</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">Message *</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={3}
              className="w-full bg-[#0B1B3F] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#14C1D7]/50 placeholder-gray-600 resize-none"
              placeholder="Tell us about yourself and why this app interests you..."
              data-testid="textarea-message"
            />
          </div>

          <button
            onClick={() => submit.mutate(form)}
            disabled={!form.name || !form.email || !form.dealType || !form.message || submit.isPending}
            className="w-full bg-[#DAA520] hover:bg-[#c4941c] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            data-testid="button-submit-inquiry"
          >
            {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            Submit Interest — NDA Next
          </button>
          <p className="text-xs text-gray-500 text-center">We'll review your submission and reach out within 24 hours. No access is granted until payment clears.</p>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ listing, onClose, onInquire }: { listing: Listing; onClose: () => void; onInquire: () => void }) {
  const tier = TIER_CONFIG[listing.tier] || TIER_CONFIG.launch_ready;
  const status = STATUS_CONFIG[listing.status] || STATUS_CONFIG.available;
  const deals = listing.dealTypes.split(",").map(d => d.trim()).filter(Boolean);
  const buyerGets = (() => { try { return JSON.parse(listing.whatBuyerGets); } catch { return listing.whatBuyerGets.split(",").map(s => s.trim()); } })();
  const tech = listing.techStack.split(",").map(s => s.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0d1f3c] border border-[#14C1D7]/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0d1f3c] border-b border-white/5 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${tier.bg} ${tier.color}`}>{tier.label}</span>
              <span className={`text-xs font-mono ${status.color}`}>● {status.label}</span>
              {listing.featured && <span className="text-xs font-mono text-[#DAA520] flex items-center gap-1"><Star className="w-3 h-3 fill-[#DAA520]" /> Featured</span>}
            </div>
            <h2 className="text-white font-bold text-xl">{listing.title}</h2>
            <p className="text-gray-400 text-sm">{listing.tagline}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0" data-testid="detail-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B1B3F] rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Price Range</p>
              <p className="text-[#DAA520] font-bold text-lg">{formatPrice(listing.priceMin, listing.priceMax)}</p>
            </div>
            <div className="bg-[#0B1B3F] rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Category</p>
              <p className="text-white font-semibold">{listing.category}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-2">The Problem It Solves</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{listing.problem}</p>
          </div>

          <div>
            <h4 className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-2">Target Customer</h4>
            <p className="text-gray-300 text-sm leading-relaxed flex items-start gap-2">
              <Users className="w-4 h-4 text-[#14C1D7] flex-shrink-0 mt-0.5" />{listing.targetCustomer}
            </p>
          </div>

          <div>
            <h4 className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-2">Revenue Model</h4>
            <p className="text-gray-300 text-sm leading-relaxed flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-[#14C1D7] flex-shrink-0 mt-0.5" />{listing.revenueModel}
            </p>
          </div>

          <div>
            <h4 className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {tech.map(t => (
                <span key={t} className="text-xs bg-[#0B1B3F] border border-[#14C1D7]/20 text-[#14C1D7] px-2 py-1 rounded font-mono flex items-center gap-1">
                  <Code className="w-3 h-3" />{t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-3">What Buyer Receives</h4>
            <ul className="space-y-2">
              {buyerGets.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-3">Available Deal Types</h4>
            <div className="grid gap-2">
              {deals.map(d => (
                <div key={d} className="flex items-start gap-3 bg-[#0B1B3F] rounded-lg p-3 border border-white/5">
                  <span className="text-[#14C1D7] mt-0.5">{DEAL_LABELS[d]?.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{DEAL_LABELS[d]?.label}</p>
                    <p className="text-xs text-gray-400">{DEAL_LABELS[d]?.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {listing.demoUrl && (
            <a href={listing.demoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#14C1D7] hover:underline"
              data-testid="link-demo">
              <ExternalLink className="w-4 h-4" /> View Live Demo
            </a>
          )}

          {listing.status !== "sold" && (
            <button
              onClick={onInquire}
              className="w-full bg-[#DAA520] hover:bg-[#c4941c] text-black font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              data-testid="button-express-interest"
            >
              <ChevronRight className="w-4 h-4" /> Express Interest — Start the Conversation
            </button>
          )}
          {listing.status === "sold" && (
            <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-3 rounded-xl text-center text-sm">
              This app has been sold
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const tier = TIER_CONFIG[listing.tier] || TIER_CONFIG.launch_ready;
  const status = STATUS_CONFIG[listing.status] || STATUS_CONFIG.available;

  return (
    <div
      onClick={onClick}
      className="group bg-[#0d1f3c] border border-white/5 hover:border-[#14C1D7]/30 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,193,215,0.08)] flex flex-col"
      data-testid={`card-listing-${listing.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${tier.bg} ${tier.color}`}>{tier.label}</span>
          {listing.featured && <span className="text-xs font-mono text-[#DAA520] flex items-center gap-1"><Star className="w-3 h-3 fill-[#DAA520]" /></span>}
        </div>
        <span className={`text-xs font-mono ${status.color}`}>● {status.label}</span>
      </div>

      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#14C1D7] transition-colors">{listing.title}</h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">{listing.tagline}</p>

      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-500 font-mono">{listing.category}</span>
      </div>

      <div className="border-t border-white/5 pt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-mono">Price Range</p>
          <p className="text-[#DAA520] font-bold">{formatPrice(listing.priceMin, listing.priceMax)}</p>
        </div>
        <span className="text-xs text-[#14C1D7] font-mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View Details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [filterTier, setFilterTier] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/marketplace"],
  });

  const categories = ["all", ...Array.from(new Set(listings.map(l => l.category))).sort()];
  const tiers = ["all", "starter", "launch_ready", "premium", "full_business"];
  const statuses = ["all", "available", "under_offer", "sold"];

  const filtered = listings.filter(l => {
    if (filterTier !== "all" && l.tier !== filterTier) return false;
    if (filterCategory !== "all" && l.category !== filterCategory) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });

  const featured = filtered.filter(l => l.featured);
  const rest = filtered.filter(l => !l.featured);

  return (
    <div className="min-h-screen bg-[#0B1B3F] text-white">
      {/* Top nav */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm" data-testid="link-home">
              <ArrowLeft className="w-4 h-4" /> Back to NIG
            </a>
            <span className="text-white/20">|</span>
            <span className="text-white font-bold font-mono tracking-wider">NIG App Marketplace</span>
          </div>
          <span className="text-xs text-[#14C1D7] font-mono bg-[#14C1D7]/10 border border-[#14C1D7]/20 px-3 py-1 rounded-full">
            {listings.filter(l => l.status === "available").length} apps available
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1B3F] via-[#0d1f3c] to-black" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #14C1D7 0%, transparent 50%), radial-gradient(circle at 80% 20%, #DAA520 0%, transparent 40%)" }} />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-xs font-mono px-4 py-2 rounded-full mb-6">
            <DollarSign className="w-3.5 h-3.5" /> Launch-Ready App Concepts — Skip the Idea Stage
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Launch Faster With
            <br />
            <span className="text-[#14C1D7]">Ready-Built App Concepts</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Working demos, branding, user flow, monetization plans, and buyer-ready handoff packages.
            Built for entrepreneurs, investors, creators, and companies ready to move now.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { label: "Apps Available", value: listings.filter(l => l.status === "available").length.toString() },
              { label: "Deal Types",     value: "3" },
              { label: "Min Investment", value: "$2.5K" },
              { label: "Handoff Time",  value: "< 7 days" },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[#DAA520]" data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="border-b border-white/5 bg-black/20">
        <div className="container mx-auto px-4 py-10">
          <p className="text-xs text-[#DAA520] font-mono uppercase tracking-widest text-center mb-6">Buyer Flow</p>
          <div className="flex flex-wrap justify-center gap-2 items-center text-sm text-gray-400">
            {["Browse Apps", "View Details", "Submit Interest", "Sign NDA", "Private Walkthrough", "Choose Deal Type", "Payment Clears", "Receive Handoff Package"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="bg-[#0d1f3c] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono">{step}</span>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 font-mono self-center">TIER:</span>
            {tiers.map(t => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-all ${filterTier === t ? "bg-[#14C1D7] text-black font-bold" : "bg-[#0d1f3c] border border-white/10 text-gray-400 hover:border-[#14C1D7]/30"}`}
                data-testid={`filter-tier-${t}`}
              >
                {t === "all" ? "All Tiers" : TIER_CONFIG[t]?.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="text-xs bg-[#0d1f3c] border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg font-mono focus:outline-none focus:border-[#14C1D7]/30"
              data-testid="filter-category"
            >
              {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs bg-[#0d1f3c] border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg font-mono focus:outline-none focus:border-[#14C1D7]/30"
              data-testid="filter-status"
            >
              {statuses.map(s => <option key={s} value={s}>{s === "all" ? "All Statuses" : STATUS_CONFIG[s]?.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#14C1D7] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-gray-500">
            <p className="text-lg font-semibold mb-2">No apps match your filters</p>
            <button onClick={() => { setFilterTier("all"); setFilterCategory("all"); setFilterStatus("all"); }} className="text-[#14C1D7] text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-10">
                <p className="text-xs text-[#DAA520] font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-[#DAA520]" /> Featured
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {featured.map(l => <AppCard key={l.id} listing={l} onClick={() => setSelectedListing(l)} />)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rest.map(l => <AppCard key={l.id} listing={l} onClick={() => setSelectedListing(l)} />)}
            </div>
          </>
        )}
      </div>

      {/* Deal types explainer */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-4 py-16">
          <p className="text-xs text-[#14C1D7] font-mono uppercase tracking-widest text-center mb-2">Deal Structures</p>
          <h2 className="text-2xl font-bold text-center mb-10">Three Ways to Buy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.entries(DEAL_LABELS).map(([key, val]) => (
              <div key={key} className="bg-[#0d1f3c] border border-white/5 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#14C1D7]/10 border border-[#14C1D7]/20 flex items-center justify-center mx-auto mb-4 text-[#14C1D7]">
                  {val.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{val.label}</h3>
                <p className="text-sm text-gray-400">{val.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-8 font-mono">No admin or code access is granted until payment clears. NDA required before private demos.</p>
        </div>
      </div>

      {/* Modals */}
      {selectedListing && !showInquiry && (
        <DetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onInquire={() => setShowInquiry(true)}
        />
      )}
      {selectedListing && showInquiry && (
        <InquiryModal
          listing={selectedListing}
          onClose={() => { setShowInquiry(false); setSelectedListing(null); }}
        />
      )}
    </div>
  );
}
