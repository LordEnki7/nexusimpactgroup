import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Activity, 
  Shield, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Zap,
  Bot,
  TrendingUp,
  RefreshCw,
  Home,
  LogOut,
  Lock,
  Settings,
  Gauge,
  Code,
  Server,
  Megaphone,
  BarChart3,
  UserCog,
  Briefcase,
  Layers,
  Play,
  Pause,
  Bell,
  Search,
  FileCode,
  Share2,
  Crown,
  FileText,
  Target,
  Lightbulb,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Cpu,
  Rocket,
  Wrench,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Star,
  Database,
  Filter,
  Eye,
  CircleDot,
  UserPlus,
  Upload,
  Phone,
  Mail,
  Globe,
  Building2,
  X,
  Plus,
  ArrowRight,
  Sparkles,
  PieChart,
  Contact
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useRef } from "react";

type Division = {
  id: number;
  name: string;
  description: string;
  category: string;
  status: string;
  externalUrl: string | null;
  tier: number | null;
};

type AgentLog = {
  id: number;
  agentType: string;
  agentName: string;
  action: string;
  details: string | null;
  status: string;
  createdAt: string;
};

type DashboardData = {
  divisions: Division[];
  metrics: any[];
  incidents: any[];
  financials: any[];
  agentLogs: AgentLog[];
  summary: {
    totalDivisions: number;
    liveDivisions: number;
    comingSoonDivisions: number;
    openIncidents: number;
    totalIncidents: number;
  };
};

export default function CommandCenter() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  
  // Temporarily bypass auth for development/testing
  const bypassAuth = true;
  const effectiveAuth = bypassAuth || isAuthenticated;
  
  const [activePanel, setActivePanel] = useState<string>("orchestrator");

  const { data, isLoading, refetch, error } = useQuery<{ success: boolean; data: DashboardData }>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000,
    enabled: true,
    retry: false,
  });

  const dashboard = data?.data;

  const [pingResults, setPingResults] = useState<any[]>([]);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingLastChecked, setPingLastChecked] = useState<Date | null>(null);

  const runPing = async () => {
    setPingLoading(true);
    try {
      const res = await fetch("/api/divisions/ping");
      const json = await res.json();
      if (json.success) { setPingResults(json.results); setPingLastChecked(new Date()); }
    } catch {}
    setPingLoading(false);
  };

  // Auto-ping when dashboard tab opens, then every 5 min
  useEffect(() => {
    if (activePanel === "dashboard" && pingResults.length === 0) runPing();
  }, [activePanel]);

  const panelTabs = [
    { id: "orchestrator", label: "Orchestrator", icon: Crown, color: "from-[#14C1D7] to-[#DAA520]" },
    { id: "dashboard", label: "Dashboard", icon: Activity, color: "from-[#14C1D7] to-[#14C1D7]" },
    { id: "approvals", label: "Approvals", icon: ThumbsUp, color: "from-green-500 to-emerald-500" },
    { id: "specialists", label: "Specialists", icon: Cpu, color: "from-teal-500 to-emerald-500" },
    { id: "agents", label: "Exec Agents", icon: Bot, color: "from-[#DAA520] to-[#14C1D7]" },
    { id: "crm", label: "CRM", icon: Contact, color: "from-rose-500 to-pink-500" },
    { id: "security", label: "Security", icon: Shield, color: "from-emerald-500 to-teal-500" },
    { id: "reports", label: "Reports", icon: FileText, color: "from-blue-500 to-indigo-500" },
    { id: "memory", label: "Memory", icon: Database, color: "from-purple-500 to-pink-500" },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "safety": return Shield;
      case "security": return Shield;
      case "finance": return DollarSign;
      case "ai": return Bot;
      case "social": return Users;
      case "entertainment": return Zap;
      case "trade": return TrendingUp;
      case "core": return Activity;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500";
      case "active": return "bg-cyan-500";
      case "coming_soon": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,193,215,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,193,215,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10">
        <header className="border-b border-[#14C1D7]/20 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#14C1D7] to-[#DAA520] flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading tracking-tight">NIG CORE</h1>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Command Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 px-3 py-1.5 border border-[#14C1D7]/20 rounded-lg bg-[#0B1B3F]/30">
                  {user.profileImageUrl && (
                    <img src={user.profileImageUrl} alt="" className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-sm text-gray-400">{user.firstName || user.email || "Admin"}</span>
                </div>
              )}
              <button 
                onClick={() => refetch()}
                className="p-2 border border-[#14C1D7]/30 rounded-lg hover:bg-[#14C1D7]/10 transition-colors"
                data-testid="button-refresh"
              >
                <RefreshCw className="w-4 h-4 text-[#14C1D7]" />
              </button>
              <Link href="/">
                <button className="flex items-center gap-2 px-4 py-2 border border-[#DAA520]/30 rounded-lg hover:bg-[#DAA520]/10 transition-colors text-[#DAA520] text-sm" data-testid="link-home">
                  <Home className="w-4 h-4" />
                  <span>Main Site</span>
                </button>
              </Link>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
                className="flex items-center gap-2 px-3 py-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 text-sm"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-xl border border-[#14C1D7]/20 bg-[#0B1B3F]/30 backdrop-blur-sm">
            {panelTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    activePanel === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-black shadow-lg`
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14C1D7]"></div>
            </div>
          ) : (
            <>
              {activePanel === "orchestrator" && <OrchestratorPanel />}
              {activePanel === "approvals" && <ApprovalsPanel />}
              {activePanel === "specialists" && <SpecialistsPanel />}
              {activePanel === "crm" && <CRMPanel />}
              {activePanel === "security" && <SecurityPanel />}
              {activePanel === "reports" && <ReportsPanel />}
              {activePanel === "memory" && <MemoryPanel />}

              {activePanel === "dashboard" && (
              <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/30 backdrop-blur-sm"
                  data-testid="stat-total-divisions"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-mono uppercase">Total Divisions</span>
                    <Activity className="w-5 h-5 text-[#14C1D7]" />
                  </div>
                  <p className="text-3xl font-bold text-white">{dashboard?.summary.totalDivisions || 0}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm"
                  data-testid="stat-live-divisions"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-mono uppercase">Live</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-400">{dashboard?.summary.liveDivisions || 0}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm"
                  data-testid="stat-coming-soon"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-mono uppercase">Coming Soon</span>
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-400">{dashboard?.summary.comingSoonDivisions || 0}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl border border-red-500/30 bg-red-500/5 backdrop-blur-sm"
                  data-testid="stat-open-incidents"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-mono uppercase">Open Incidents</span>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-red-400">{dashboard?.summary.openIncidents || 0}</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Live Uptime Monitor */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold font-heading text-[#DAA520]">Live Division Uptime</h2>
                      {pingLastChecked && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Last checked: {pingLastChecked.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {pingResults.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-green-400">{pingResults.filter(r => r.status === "live").length} UP</span>
                          <span className="text-gray-600">|</span>
                          <span className="text-red-400">{pingResults.filter(r => r.status === "offline").length} DOWN</span>
                        </div>
                      )}
                      <button
                        onClick={runPing}
                        disabled={pingLoading}
                        data-testid="button-ping-divisions"
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#14C1D7]/10 border border-[#14C1D7]/30 rounded-lg text-[#14C1D7] text-xs font-bold hover:bg-[#14C1D7]/20 disabled:opacity-50 transition-all"
                      >
                        {pingLoading ? (
                          <><div className="w-3 h-3 border border-[#14C1D7] border-t-transparent rounded-full animate-spin" />Checking...</>
                        ) : (
                          <><Activity className="w-3 h-3" />Check Now</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Ping Results Grid */}
                  {pingLoading && pingResults.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-[#0B1B3F]/30 border border-white/5 animate-pulse" />
                      ))}
                    </div>
                  ) : pingResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pingResults.map((r, i) => (
                        <motion.div
                          key={r.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                            r.status === "live"
                              ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                              : r.status === "degraded"
                              ? "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40"
                              : "border-red-500/20 bg-red-500/5 hover:border-red-500/40"
                          }`}
                          onClick={() => window.open(`https://${r.domain}`, "_blank")}
                          data-testid={`ping-card-${i}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              r.status === "live" ? "bg-green-400 animate-pulse" :
                              r.status === "degraded" ? "bg-yellow-400 animate-pulse" : "bg-red-500"
                            }`} />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{r.name}</p>
                              <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                                {r.domain}
                                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right ml-2">
                            <p className={`text-xs font-bold uppercase ${
                              r.status === "live" ? "text-green-400" :
                              r.status === "degraded" ? "text-yellow-400" : "text-red-400"
                            }`}>{r.status}</p>
                            <p className="text-[10px] text-gray-500 font-mono">
                              {r.responseMs > 0 ? `${r.responseMs}ms` : "—"}
                              {r.httpStatus ? ` · ${r.httpStatus}` : ""}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl border border-[#14C1D7]/20 bg-[#0B1B3F]/20 text-center">
                      <Activity className="w-8 h-8 text-[#14C1D7]/40 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-4">Click "Check Now" to run a live ping of all division websites.</p>
                    </div>
                  )}

                  {(!dashboard?.divisions || dashboard.divisions.length === 0) && (
                    <div className="mt-4 p-4 rounded-xl border border-[#14C1D7]/20 bg-[#0B1B3F]/20 text-center">
                      <p className="text-gray-500 mb-3 text-sm">No divisions in database yet.</p>
                      <button
                        onClick={async () => { await fetch("/api/seed-divisions", { method: "POST" }); refetch(); }}
                        className="px-4 py-2 bg-[#14C1D7] text-black font-bold rounded-lg hover:bg-[#14C1D7]/80 transition-colors text-sm"
                        data-testid="button-seed-divisions"
                      >
                        Initialize Divisions
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold font-heading text-[#DAA520]">Agent Activity</h2>
                    <Bot className="w-5 h-5 text-[#14C1D7]" />
                  </div>

                  <div className="space-y-3">
                    {dashboard?.agentLogs && dashboard.agentLogs.length > 0 ? (
                      dashboard.agentLogs.map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg border border-[#14C1D7]/10 bg-[#0B1B3F]/10"
                          data-testid={`log-agent-${log.id}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-[#14C1D7]">{log.agentName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${
                              log.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{log.action}</p>
                          {log.details && (
                            <p className="text-[10px] text-gray-600 mt-1">{log.details}</p>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-[#14C1D7]/20 text-center">
                        <Bot className="w-8 h-8 text-[#14C1D7]/30 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No agent activity yet</p>
                        <p className="text-xs text-gray-600 mt-1">Agents will log their actions here</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-bold font-heading text-[#DAA520]">System Status</h2>
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    
                    <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <div>
                          <p className="text-sm font-bold text-green-400">All Systems Operational</p>
                          <p className="text-xs text-gray-500">Core AI: Standby</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              </>
              )}

              {activePanel === "agents" && (
              <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <CFOAgentPanel />
                <COOAgentPanel />
                <CTOAgentPanel />
                <CMOAgentPanel />
                <CHROAgentPanel />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <DivisionAgentsPanel />
                <SchedulerPanel />
              </div>
              </>
              )}
            </>
          )}
        </main>

        <footer className="border-t border-[#14C1D7]/10 py-6 mt-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs text-gray-600 font-mono">
              NIG CORE COMMAND CENTER v1.0 | Nexus Impact Group
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CFOAgentPanel() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cfo/analyze", { method: "POST" });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed - please try again");
      }
    } catch (e) {
      console.error("Analysis failed:", e);
      setError("Network error - please refresh and try again");
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setError("");
    try {
      const res = await fetch("/api/cfo/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to get answer");
      }
    } catch (e) {
      console.error("Ask failed:", e);
      setError("Network error - please try again");
    }
    setAsking(false);
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#DAA520] to-[#14C1D7]">
            <DollarSign className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#DAA520]">CFO Agent</h2>
            <p className="text-xs text-gray-500 font-mono">Financial Intelligence</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-[#DAA520] text-black font-bold rounded-lg hover:bg-[#DAA520]/80 transition-colors disabled:opacity-50"
          data-testid="button-run-analysis"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#DAA520]/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-[#DAA520] mb-4">Ask the CFO</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about finances, strategy, or projections..."
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-[#14C1D7]/20 text-white text-sm focus:outline-none focus:border-[#14C1D7]/50"
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              data-testid="input-cfo-question"
            />
            <button
              onClick={askQuestion}
              disabled={asking}
              className="px-4 py-2 bg-[#14C1D7] text-black font-bold rounded-lg hover:bg-[#14C1D7]/80 transition-colors disabled:opacity-50"
              data-testid="button-ask-cfo"
            >
              {asking ? "..." : "Ask"}
            </button>
          </div>
          {answer && (
            <div className="p-4 rounded-lg bg-black/30 border border-[#14C1D7]/10" data-testid="text-cfo-answer">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-[#DAA520]/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-[#DAA520] mb-4">Latest Analysis</h3>
          {analysis ? (
            <div className="space-y-4">
              <div data-testid="text-cfo-summary">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-gray-300">{analysis.summary}</p>
              </div>
              
              {analysis.alerts?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Alerts</p>
                  <div className="space-y-2">
                    {analysis.alerts.map((alert: any, i: number) => (
                      <div key={i} data-testid={`text-cfo-alert-${i}`} className={`p-2 rounded-lg text-xs ${
                        alert.severity === "critical" ? "bg-red-500/20 text-red-400" :
                        alert.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                        alert.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {analysis.recommendations?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {analysis.recommendations.slice(0, 3).map((rec: string, i: number) => (
                      <li key={i} data-testid={`text-cfo-rec-${i}`} className="text-xs text-gray-400 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-10 h-10 text-[#DAA520]/30 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No analysis yet</p>
              <p className="text-xs text-gray-600">Click "Run Analysis" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function COOAgentPanel() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/coo/analyze", { method: "POST" });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed - please try again");
      }
    } catch (e) {
      console.error("COO Analysis failed:", e);
      setError("Network error - please refresh and try again");
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setError("");
    try {
      const res = await fetch("/api/coo/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to get answer");
      }
    } catch (e) {
      console.error("COO Ask failed:", e);
      setError("Network error - please try again");
    }
    setAsking(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-400 bg-green-500/20";
      case "good": return "text-cyan-400 bg-cyan-500/20";
      case "fair": return "text-yellow-400 bg-yellow-500/20";
      case "poor": return "text-orange-400 bg-orange-500/20";
      case "critical": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#14C1D7] to-[#0B1B3F]">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#14C1D7]">COO Agent</h2>
            <p className="text-xs text-gray-500 font-mono">Operations Intelligence</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-[#14C1D7] text-black font-bold rounded-lg hover:bg-[#14C1D7]/80 transition-colors disabled:opacity-50"
          data-testid="button-run-coo-analysis"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-[#14C1D7] mb-4">Ask the COO</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about operations, divisions, or efficiency..."
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-[#14C1D7]/20 text-white text-sm focus:outline-none focus:border-[#14C1D7]/50"
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              data-testid="input-coo-question"
            />
            <button
              onClick={askQuestion}
              disabled={asking}
              className="px-4 py-2 bg-[#14C1D7] text-black font-bold rounded-lg hover:bg-[#14C1D7]/80 transition-colors disabled:opacity-50"
              data-testid="button-ask-coo"
            >
              {asking ? "..." : "Ask"}
            </button>
          </div>
          {answer && (
            <div className="p-4 rounded-lg bg-black/30 border border-[#14C1D7]/10" data-testid="text-coo-answer">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-[#14C1D7] mb-4">Operational Status</h3>
          {analysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">System Health</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getHealthColor(analysis.operationalHealth)}`}>
                  {analysis.operationalHealth}
                </span>
              </div>
              
              <div data-testid="text-coo-summary">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-gray-300">{analysis.summary}</p>
              </div>
              
              {analysis.bottlenecks?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Bottlenecks</p>
                  <div className="space-y-1">
                    {analysis.bottlenecks.slice(0, 3).map((item: string, i: number) => (
                      <div key={i} className="text-xs text-orange-400 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {analysis.recommendations?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {analysis.recommendations.slice(0, 3).map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-[#14C1D7] mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gauge className="w-10 h-10 text-[#14C1D7]/30 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No analysis yet</p>
              <p className="text-xs text-gray-600">Click "Run Analysis" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CTOAgentPanel() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cto/analyze", { method: "POST" });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed - please try again");
      }
    } catch (e) {
      console.error("CTO Analysis failed:", e);
      setError("Network error - please refresh and try again");
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setError("");
    try {
      const res = await fetch("/api/cto/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to get answer");
      }
    } catch (e) {
      console.error("CTO Ask failed:", e);
      setError("Network error - please try again");
    }
    setAsking(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-400 bg-green-500/20";
      case "good": return "text-emerald-400 bg-emerald-500/20";
      case "fair": return "text-yellow-400 bg-yellow-500/20";
      case "poor": return "text-orange-400 bg-orange-500/20";
      case "critical": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-[#0B1B3F]">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-emerald-400">CTO Agent</h2>
            <p className="text-xs text-gray-500 font-mono">Technical Intelligence</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-500/80 transition-colors disabled:opacity-50"
          data-testid="button-run-cto-analysis"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 rounded-xl border border-emerald-500/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-emerald-400 mb-4">Ask the CTO</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about architecture, security, or tech stack..."
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-emerald-500/20 text-white text-sm focus:outline-none focus:border-emerald-500/50"
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              data-testid="input-cto-question"
            />
            <button
              onClick={askQuestion}
              disabled={asking}
              className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-500/80 transition-colors disabled:opacity-50"
              data-testid="button-ask-cto"
            >
              {asking ? "..." : "Ask"}
            </button>
          </div>
          {answer && (
            <div className="p-4 rounded-lg bg-black/30 border border-emerald-500/10" data-testid="text-cto-answer">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-emerald-500/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-emerald-400 mb-4">Technical Status</h3>
          {analysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Tech Health</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getHealthColor(analysis.techHealth)}`}>
                  {analysis.techHealth}
                </span>
              </div>

              {analysis.systemStatus && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Uptime</p>
                    <p className="text-xs text-emerald-400 font-mono">{analysis.systemStatus.uptime}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Security</p>
                    <p className="text-xs text-emerald-400 font-mono">{analysis.systemStatus.security}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Performance</p>
                    <p className="text-xs text-emerald-400 font-mono">{analysis.systemStatus.performance}</p>
                  </div>
                </div>
              )}
              
              <div data-testid="text-cto-summary">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-gray-300">{analysis.summary}</p>
              </div>
              
              {analysis.securityAlerts?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Security Alerts</p>
                  <div className="space-y-1">
                    {analysis.securityAlerts.slice(0, 3).map((alert: any, i: number) => (
                      <div key={i} className={`p-2 rounded-lg text-xs ${
                        alert.severity === "critical" ? "bg-red-500/20 text-red-400" :
                        alert.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        <Shield className="w-3 h-3 inline mr-1" />
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Server className="w-10 h-10 text-emerald-500/30 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No analysis yet</p>
              <p className="text-xs text-gray-600">Click "Run Analysis" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CMOAgentPanel() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cmo/analyze", { method: "POST" });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed - please try again");
      }
    } catch (e) {
      console.error("CMO Analysis failed:", e);
      setError("Network error - please refresh and try again");
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setError("");
    try {
      const res = await fetch("/api/cmo/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to get answer");
      }
    } catch (e) {
      console.error("CMO Ask failed:", e);
      setError("Network error - please try again");
    }
    setAsking(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-400 bg-green-500/20";
      case "good": return "text-emerald-400 bg-emerald-500/20";
      case "fair": return "text-yellow-400 bg-yellow-500/20";
      case "poor": return "text-orange-400 bg-orange-500/20";
      case "critical": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-[#0B1B3F]">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-purple-400">CMO Agent</h2>
            <p className="text-xs text-gray-500 font-mono">Marketing Intelligence</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-500/80 transition-colors disabled:opacity-50"
          data-testid="button-run-cmo-analysis"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 rounded-xl border border-purple-500/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-purple-400 mb-4">Ask the CMO</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about brand strategy, campaigns, or growth..."
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-500/50"
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              data-testid="input-cmo-question"
            />
            <button
              onClick={askQuestion}
              disabled={asking}
              className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-500/80 transition-colors disabled:opacity-50"
              data-testid="button-ask-cmo"
            >
              {asking ? "..." : "Ask"}
            </button>
          </div>
          {answer && (
            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/10" data-testid="text-cmo-answer">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-purple-500/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-purple-400 mb-4">Marketing Status</h3>
          {analysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Marketing Health</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getHealthColor(analysis.marketingHealth)}`}>
                  {analysis.marketingHealth}
                </span>
              </div>

              {analysis.brandMetrics && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Awareness</p>
                    <p className="text-xs text-purple-400 font-mono">{analysis.brandMetrics.awareness}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Engagement</p>
                    <p className="text-xs text-purple-400 font-mono">{analysis.brandMetrics.engagement}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Sentiment</p>
                    <p className="text-xs text-purple-400 font-mono">{analysis.brandMetrics.sentiment}</p>
                  </div>
                </div>
              )}
              
              <div data-testid="text-cmo-summary">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-gray-300">{analysis.summary}</p>
              </div>
              
              {analysis.opportunities?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Growth Opportunities</p>
                  <ul className="space-y-1 text-xs text-gray-400">
                    {analysis.opportunities.slice(0, 3).map((opp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-10 h-10 text-purple-500/30 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No analysis yet</p>
              <p className="text-xs text-gray-600">Click "Run Analysis" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CHROAgentPanel() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chro/analyze", { method: "POST" });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed - please try again");
      }
    } catch (e) {
      console.error("CHRO Analysis failed:", e);
      setError("Network error - please refresh and try again");
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setError("");
    try {
      const res = await fetch("/api/chro/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to get answer");
      }
    } catch (e) {
      console.error("CHRO Ask failed:", e);
      setError("Network error - please try again");
    }
    setAsking(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-400 bg-green-500/20";
      case "good": return "text-emerald-400 bg-emerald-500/20";
      case "fair": return "text-yellow-400 bg-yellow-500/20";
      case "poor": return "text-orange-400 bg-orange-500/20";
      case "critical": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-[#0B1B3F]">
            <UserCog className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-pink-400">CHRO Agent</h2>
            <p className="text-xs text-gray-500 font-mono">HR Intelligence</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-500/80 transition-colors disabled:opacity-50"
          data-testid="button-run-chro-analysis"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 rounded-xl border border-pink-500/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-pink-400 mb-4">Ask the CHRO</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about hiring, team capacity, or productivity..."
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-pink-500/20 text-white text-sm focus:outline-none focus:border-pink-500/50"
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              data-testid="input-chro-question"
            />
            <button
              onClick={askQuestion}
              disabled={asking}
              className="px-4 py-2 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-500/80 transition-colors disabled:opacity-50"
              data-testid="button-ask-chro"
            >
              {asking ? "..." : "Ask"}
            </button>
          </div>
          {answer && (
            <div className="p-4 rounded-lg bg-black/30 border border-pink-500/10" data-testid="text-chro-answer">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-pink-500/30 bg-[#0B1B3F]/30">
          <h3 className="text-sm font-bold text-pink-400 mb-4">Workforce Status</h3>
          {analysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Team Health</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getHealthColor(analysis.teamHealth)}`}>
                  {analysis.teamHealth}
                </span>
              </div>

              {analysis.workforceMetrics && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Capacity</p>
                    <p className="text-xs text-pink-400 font-mono">{analysis.workforceMetrics.capacity}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Productivity</p>
                    <p className="text-xs text-pink-400 font-mono">{analysis.workforceMetrics.productivity}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Morale</p>
                    <p className="text-xs text-pink-400 font-mono">{analysis.workforceMetrics.morale}</p>
                  </div>
                </div>
              )}
              
              <div data-testid="text-chro-summary">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-gray-300">{analysis.summary}</p>
              </div>
              
              {analysis.hiringPriorities?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Hiring Priorities</p>
                  <div className="space-y-1">
                    {analysis.hiringPriorities.slice(0, 3).map((hire: any, i: number) => (
                      <div key={i} className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                        hire.priority === "critical" ? "bg-red-500/20 text-red-400" :
                        hire.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        <Briefcase className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium">{hire.role}</span>
                        <span className="text-gray-500">- {hire.division}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-pink-500/30 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No analysis yet</p>
              <p className="text-xs text-gray-600">Click "Run Analysis" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DivisionAgentsPanel() {
  const [cmoAgents, setCmoAgents] = useState<any[]>([]);
  const [ctoAgents, setCtoAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState({ cmo: false, cto: false });
  const [error, setError] = useState("");

  const runCMODivisionAgents = async () => {
    setLoading(prev => ({ ...prev, cmo: true }));
    setError("");
    try {
      const res = await fetch("/api/division/cmo/all", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCmoAgents(data.analyses || []);
      } else {
        setError(data.error || "Failed to run CMO division agents");
      }
    } catch (e) {
      setError("Network error");
    }
    setLoading(prev => ({ ...prev, cmo: false }));
  };

  const runCTODivisionAgents = async () => {
    setLoading(prev => ({ ...prev, cto: true }));
    setError("");
    try {
      const res = await fetch("/api/division/cto/all", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCtoAgents(data.analyses || []);
      } else {
        setError(data.error || "Failed to run CTO division agents");
      }
    } catch (e) {
      setError("Network error");
    }
    setLoading(prev => ({ ...prev, cto: false }));
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-400";
      case "good": return "text-emerald-400";
      case "fair": return "text-yellow-400";
      case "poor": return "text-orange-400";
      case "critical": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="p-6 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#14C1D7] to-[#0B1B3F]">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-heading text-[#14C1D7]">Division Agents</h2>
          <p className="text-xs text-gray-500 font-mono">Specialized sub-agents</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-purple-500/20 bg-black/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">CMO Division</span>
            </div>
            <button
              onClick={runCMODivisionAgents}
              disabled={loading.cmo}
              className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-500/80 disabled:opacity-50"
              data-testid="button-run-cmo-division"
            >
              {loading.cmo ? "Running..." : "Run All"}
            </button>
          </div>
          {cmoAgents.length > 0 ? (
            <div className="space-y-2">
              {cmoAgents.map((agent, i) => (
                <div key={i} className="p-2 rounded bg-black/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {agent.agentName === "Social Media Agent" && <Share2 className="w-3 h-3 text-purple-400" />}
                    {agent.agentName === "SEO Agent" && <Search className="w-3 h-3 text-purple-400" />}
                    {agent.agentName === "Content Agent" && <FileCode className="w-3 h-3 text-purple-400" />}
                    <span className="text-xs text-gray-300">{agent.agentName}</span>
                  </div>
                  <span className={`text-xs font-bold uppercase ${getHealthColor(agent.health)}`}>
                    {agent.health}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Click "Run All" to activate division agents</p>
          )}
        </div>

        <div className="p-4 rounded-lg border border-emerald-500/20 bg-black/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">CTO Division</span>
            </div>
            <button
              onClick={runCTODivisionAgents}
              disabled={loading.cto}
              className="px-3 py-1 text-xs bg-emerald-500 text-black rounded hover:bg-emerald-500/80 disabled:opacity-50"
              data-testid="button-run-cto-division"
            >
              {loading.cto ? "Running..." : "Run All"}
            </button>
          </div>
          {ctoAgents.length > 0 ? (
            <div className="space-y-2">
              {ctoAgents.map((agent, i) => (
                <div key={i} className="p-2 rounded bg-black/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {agent.agentName === "DevOps Agent" && <Server className="w-3 h-3 text-emerald-400" />}
                    {agent.agentName === "Security Agent" && <Shield className="w-3 h-3 text-emerald-400" />}
                    {agent.agentName === "Architecture Agent" && <Layers className="w-3 h-3 text-emerald-400" />}
                    <span className="text-xs text-gray-300">{agent.agentName}</span>
                  </div>
                  <span className={`text-xs font-bold uppercase ${getHealthColor(agent.health)}`}>
                    {agent.health}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Click "Run All" to activate division agents</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SchedulerPanel() {
  const [status, setStatus] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/scheduler/status");
      const data = await res.json();
      if (data.success) setStatus(data.status);
    } catch (e) {
      console.error("Failed to fetch scheduler status");
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts");
      const data = await res.json();
      if (data.success) setAlerts(data.alerts || []);
    } catch (e) {
      console.error("Failed to fetch alerts");
    }
  };

  const toggleScheduler = async () => {
    setLoading(true);
    try {
      const endpoint = status?.isRunning ? "/api/scheduler/stop" : "/api/scheduler/start";
      await fetch(endpoint, { method: "POST" });
      await fetchStatus();
    } catch (e) {
      console.error("Failed to toggle scheduler");
    }
    setLoading(false);
  };

  const runTask = async (taskId: string) => {
    try {
      await fetch(`/api/scheduler/run/${taskId}`, { method: "POST" });
      await fetchStatus();
    } catch (e) {
      console.error("Failed to run task");
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/resolve`, { method: "POST" });
      await fetchAlerts();
    } catch (e) {
      console.error("Failed to resolve alert");
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchAlerts();
    const interval = setInterval(() => {
      fetchStatus();
      fetchAlerts();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-xl border border-[#DAA520]/30 bg-[#0B1B3F]/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#DAA520] to-[#0B1B3F]">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#DAA520]">Scheduler & Alerts</h2>
            <p className="text-xs text-gray-500 font-mono">Automated tasks</p>
          </div>
        </div>
        <button
          onClick={toggleScheduler}
          disabled={loading}
          className={`px-4 py-2 font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
            status?.isRunning 
              ? "bg-red-500 text-white hover:bg-red-500/80" 
              : "bg-green-500 text-black hover:bg-green-500/80"
          }`}
          data-testid="button-toggle-scheduler"
        >
          {status?.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {loading ? "..." : status?.isRunning ? "Stop" : "Start"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status?.isRunning ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
            <span className="text-gray-400">{status?.isRunning ? "Running" : "Stopped"}</span>
          </div>
          <div className="text-gray-500">
            {status?.taskCount || 0} tasks | {alerts.length} alerts
          </div>
        </div>

        {status?.tasks && status.tasks.length > 0 && (
          <div className="p-4 rounded-lg border border-[#DAA520]/20 bg-black/20">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Scheduled Tasks</p>
            <div className="space-y-2">
              {status.tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded bg-black/30">
                  <div>
                    <p className="text-xs text-gray-300">{task.name}</p>
                    {task.lastRun && (
                      <p className="text-[10px] text-gray-500">
                        Last: {new Date(task.lastRun).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => runTask(task.id)}
                    className="px-2 py-1 text-[10px] bg-[#DAA520] text-black rounded hover:bg-[#DAA520]/80"
                  >
                    Run Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length > 0 && (
          <div className="p-4 rounded-lg border border-red-500/20 bg-black/20">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-3 h-3 text-red-400" />
              <p className="text-xs text-red-400 uppercase tracking-wider">Active Alerts</p>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alerts.slice(0, 5).map((alert: any) => (
                <div key={alert.id} className={`p-2 rounded text-xs flex items-center justify-between ${
                  alert.type === "critical" ? "bg-red-500/20 text-red-400" :
                  alert.type === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  <div>
                    <span className="font-bold">{alert.source}:</span> {alert.message}
                  </div>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="text-[10px] underline hover:no-underline"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-500/30 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}

function safeParse(val: any) {
  if (!val) return null;
  if (typeof val === "object") return val;
  try { return JSON.parse(val); } catch { return val; }
}

function OrchestratorPanel() {
  const [brief, setBrief] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [crossBusiness, setCrossBusiness] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState({ brief: false, overview: false, cross: false, ask: false });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLatestBrief();
    fetchOverview();
  }, []);

  const fetchLatestBrief = async () => {
    try {
      const res = await fetch("/api/orchestrator/daily-brief/latest");
      const data = await res.json();
      if (data.success && data.brief) setBrief(data.brief);
    } catch (e) { /* silent */ }
  };

  const fetchOverview = async () => {
    setLoading(prev => ({ ...prev, overview: true }));
    try {
      const res = await fetch("/api/orchestrator/overview");
      const data = await res.json();
      if (data.success) setOverview(data.overview);
    } catch (e) {
      setError("Failed to load overview");
    }
    setLoading(prev => ({ ...prev, overview: false }));
  };

  const generateBrief = async () => {
    setLoading(prev => ({ ...prev, brief: true }));
    setError("");
    try {
      const res = await fetch("/api/orchestrator/daily-brief", { method: "POST" });
      const data = await res.json();
      if (data.success && data.brief) {
        setBrief(data.brief);
      } else {
        setError(data.error || "Failed to generate brief");
      }
    } catch (e) {
      setError("Network error generating brief");
    }
    setLoading(prev => ({ ...prev, brief: false }));
  };

  const runCrossBusiness = async () => {
    setLoading(prev => ({ ...prev, cross: true }));
    setError("");
    try {
      const res = await fetch("/api/orchestrator/cross-business", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCrossBusiness(data.analysis);
      } else {
        setError(data.error || "Failed to run cross-business analysis");
      }
    } catch (e) {
      setError("Network error");
    }
    setLoading(prev => ({ ...prev, cross: false }));
  };

  const askOrchestrator = async () => {
    if (!question.trim()) return;
    setLoading(prev => ({ ...prev, ask: true }));
    setError("");
    try {
      const res = await fetch("/api/orchestrator/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Failed to get answer");
      }
    } catch (e) {
      setError("Network error");
    }
    setLoading(prev => ({ ...prev, ask: false }));
  };

  const getPriorityColor = (score: number) => {
    if (score >= 9) return "bg-red-500 text-white";
    if (score >= 7) return "bg-orange-500 text-white";
    if (score >= 5) return "bg-yellow-500 text-black";
    return "bg-blue-500 text-white";
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14C1D7] to-[#DAA520] flex items-center justify-center">
            <Crown className="w-7 h-7 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-[#14C1D7] to-[#DAA520] bg-clip-text text-transparent">Master Orchestrator</h2>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Central Intelligence Hub</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm" data-testid="text-orchestrator-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={generateBrief}
            disabled={loading.brief}
            className="p-4 rounded-xl border border-[#DAA520]/30 bg-[#0B1B3F]/30 hover:bg-[#DAA520]/10 transition-all text-left group"
            data-testid="button-generate-brief"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#DAA520]" />
              <span className="text-sm font-bold text-[#DAA520]">Generate Daily Brief</span>
            </div>
            <p className="text-xs text-gray-500">
              {loading.brief ? "Generating comprehensive brief..." : "Full ecosystem analysis & priorities"}
            </p>
          </button>

          <button
            onClick={fetchOverview}
            disabled={loading.overview}
            className="p-4 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/30 hover:bg-[#14C1D7]/10 transition-all text-left group"
            data-testid="button-ecosystem-overview"
          >
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-[#14C1D7]" />
              <span className="text-sm font-bold text-[#14C1D7]">Ecosystem Overview</span>
            </div>
            <p className="text-xs text-gray-500">
              {loading.overview ? "Loading overview..." : "Real-time ecosystem status"}
            </p>
          </button>

          <button
            onClick={runCrossBusiness}
            disabled={loading.cross}
            className="p-4 rounded-xl border border-emerald-500/30 bg-[#0B1B3F]/30 hover:bg-emerald-500/10 transition-all text-left group"
            data-testid="button-cross-business"
          >
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">Cross-Business Analysis</span>
            </div>
            <p className="text-xs text-gray-500">
              {loading.cross ? "Analyzing synergies..." : "Find cross-division opportunities"}
            </p>
          </button>
        </div>

        <div className="p-6 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/30 mb-8">
          <h3 className="text-sm font-bold text-[#DAA520] mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Ask the Orchestrator
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about strategy, operations, priorities, or any business question..."
              className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-[#14C1D7]/20 text-white text-sm focus:outline-none focus:border-[#14C1D7]/50"
              onKeyDown={(e) => e.key === "Enter" && askOrchestrator()}
              data-testid="input-orchestrator-question"
            />
            <button
              onClick={askOrchestrator}
              disabled={loading.ask}
              className="px-4 py-2 bg-gradient-to-r from-[#14C1D7] to-[#DAA520] text-black font-bold rounded-lg hover:opacity-80 transition-colors disabled:opacity-50 flex items-center gap-2"
              data-testid="button-ask-orchestrator"
            >
              <Send className="w-4 h-4" />
              {loading.ask ? "..." : "Ask"}
            </button>
          </div>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-black/30 border border-[#14C1D7]/10"
              data-testid="text-orchestrator-answer"
            >
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{answer}</p>
            </motion.div>
          )}
        </div>

        {overview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-[#14C1D7]/30 bg-[#0B1B3F]/30 mb-8"
            data-testid="section-ecosystem-overview"
          >
            <h3 className="text-sm font-bold text-[#14C1D7] mb-5">Ecosystem Overview</h3>

            {typeof overview === "string" ? (
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{overview}</p>
            ) : (
              <>
                {/* Top stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Total Divisions", value: overview.totalDivisions ?? 0, color: "text-[#14C1D7]" },
                    { label: "Live", value: overview.liveDivisions ?? 0, color: "text-emerald-400" },
                    { label: "Active", value: overview.activeDivisions ?? 0, color: "text-yellow-400" },
                    { label: "Open Incidents", value: overview.openIncidents ?? 0, color: overview.criticalIncidents > 0 ? "text-red-400" : "text-gray-300" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#0B1B3F]/60 rounded-lg p-3 border border-white/5 text-center">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Health + agents */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${overview.healthScore === "good" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : overview.healthScore === "degraded" ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400" : "border-red-500/40 bg-red-500/10 text-red-400"}`}>
                    Health: {overview.healthScore ?? "unknown"}
                  </span>
                  {overview.pendingProposals > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/40 bg-yellow-500/10 text-yellow-400">
                      {overview.pendingProposals} Pending Proposal{overview.pendingProposals !== 1 ? "s" : ""}
                    </span>
                  )}
                  {overview.recentExecutions > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#14C1D7]/40 bg-[#14C1D7]/10 text-[#14C1D7]">
                      {overview.recentExecutions} Recent Execution{overview.recentExecutions !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {overview.agentStatus && (
                  <p className="text-xs text-gray-400 mb-5">{overview.agentStatus}</p>
                )}

                {/* Division breakdown */}
                {Array.isArray(overview.divisionBreakdown) && overview.divisionBreakdown.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Division Status</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {overview.divisionBreakdown.map((div: any) => (
                        <div key={div.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B1B3F]/50 border border-white/5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${div.status === "live" ? "bg-emerald-400" : div.status === "active" ? "bg-yellow-400" : div.status === "configured" ? "bg-[#14C1D7]/60" : "bg-gray-600"}`} />
                            <span className="text-xs text-gray-200 truncate">{div.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="text-xs text-gray-500">{div.category}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${div.status === "live" ? "bg-emerald-500/20 text-emerald-400" : div.status === "active" ? "bg-yellow-500/20 text-yellow-400" : "bg-white/5 text-gray-500"}`}>
                              {div.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {crossBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-emerald-500/30 bg-[#0B1B3F]/30 mb-8"
            data-testid="section-cross-business"
          >
            <h3 className="text-sm font-bold text-emerald-400 mb-4">Cross-Business Analysis</h3>
            {typeof crossBusiness === "string" ? (
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{crossBusiness}</p>
            ) : (
              <div className="space-y-3">
                {crossBusiness.summary && (
                  <p className="text-sm text-gray-300 leading-relaxed">{crossBusiness.summary}</p>
                )}
                {crossBusiness.opportunities && (
                  <div>
                    <p className="text-xs text-emerald-400/70 uppercase tracking-wider mb-2">Opportunities</p>
                    <ul className="space-y-1">
                      {(Array.isArray(crossBusiness.opportunities) ? crossBusiness.opportunities : [crossBusiness.opportunities]).map((opp: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-300"><span className="text-emerald-400 mt-0.5">›</span>{opp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {crossBusiness.risks && (
                  <div>
                    <p className="text-xs text-red-400/70 uppercase tracking-wider mb-2">Risks</p>
                    <ul className="space-y-1">
                      {(Array.isArray(crossBusiness.risks) ? crossBusiness.risks : [crossBusiness.risks]).map((risk: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-300"><span className="text-red-400 mt-0.5">›</span>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {!crossBusiness.summary && !crossBusiness.opportunities && (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{JSON.stringify(crossBusiness, null, 2)}</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {brief && <DailyBriefView brief={brief} />}
      </motion.div>
    </div>
  );
}

function DailyBriefView({ brief }: { brief: any }) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getPriorityColor = (score: number) => {
    if (score >= 9) return "bg-red-500 text-white";
    if (score >= 7) return "bg-orange-500 text-white";
    if (score >= 5) return "bg-yellow-500 text-black";
    return "bg-blue-500 text-white";
  };

  const sections = [
    { key: "executiveSummary", title: "Executive Summary", icon: Crown, color: "text-[#DAA520]", borderColor: "border-[#DAA520]/30" },
    { key: "priorityActions", title: "Priority Actions", icon: Target, color: "text-red-400", borderColor: "border-red-500/30" },
    { key: "highValueOpportunities", title: "High-Value Opportunities", icon: Lightbulb, color: "text-emerald-400", borderColor: "border-emerald-500/30" },
    { key: "problemsBottlenecks", title: "Problems & Bottlenecks", icon: AlertTriangle, color: "text-orange-400", borderColor: "border-orange-500/30" },
    { key: "quickWins", title: "Quick Wins", icon: Zap, color: "text-yellow-400", borderColor: "border-yellow-500/30" },
    { key: "approvalQueue", title: "Approval Queue", icon: ThumbsUp, color: "text-green-400", borderColor: "border-green-500/30" },
    { key: "agentDeployments", title: "Agent Deployments", icon: Bot, color: "text-[#14C1D7]", borderColor: "border-[#14C1D7]/30" },
    { key: "crossBusinessSynergies", title: "Cross-Business Synergies", icon: Share2, color: "text-purple-400", borderColor: "border-purple-500/30" },
    { key: "endOfDayTargets", title: "End-of-Day Success Targets", icon: CheckCircle, color: "text-green-400", borderColor: "border-green-500/30" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      data-testid="section-daily-brief"
    >
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-5 h-5 text-[#DAA520]" />
        <h3 className="text-lg font-bold font-heading text-[#DAA520]">Daily Executive Brief</h3>
        {brief.createdAt && (
          <span className="text-xs text-gray-500 font-mono">
            {new Date(brief.createdAt).toLocaleDateString()} {new Date(brief.createdAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {sections.map(({ key, title, icon: Icon, color, borderColor }) => {
        const rawValue = brief[key];
        const parsed = safeParse(rawValue);
        const isExpanded = expandedSections[key] !== false;

        return (
          <div
            key={key}
            className={`rounded-xl border ${borderColor} bg-[#0B1B3F]/30 overflow-hidden`}
            data-testid={`brief-section-${key}`}
          >
            <button
              onClick={() => toggleSection(key)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              data-testid={`button-toggle-${key}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className={`text-sm font-bold ${color}`}>{title}</span>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {isExpanded && parsed && (
              <div className="px-4 pb-4">
                {key === "priorityActions" && Array.isArray(parsed) ? (
                  <div className="space-y-2">
                    {parsed.map((action: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-black/30 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">{typeof action === "string" ? action : action.action || action.title || JSON.stringify(action)}</p>
                          {action.reason && <p className="text-xs text-gray-500 mt-1">{action.reason}</p>}
                        </div>
                        {action.priority !== undefined && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPriorityColor(action.priority)}`}>
                            {action.priority}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(parsed) ? (
                  <div className="space-y-2">
                    {parsed.map((item: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-black/30">
                        <p className="text-sm text-gray-300">{typeof item === "string" ? item : item.title || item.action || item.description || JSON.stringify(item)}</p>
                        {item.details && <p className="text-xs text-gray-500 mt-1">{item.details}</p>}
                        {item.impact && <p className="text-xs text-emerald-400 mt-1">Impact: {item.impact}</p>}
                      </div>
                    ))}
                  </div>
                ) : typeof parsed === "string" ? (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{parsed}</p>
                ) : (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{JSON.stringify(parsed, null, 2)}</p>
                )}
              </div>
            )}

            {isExpanded && !parsed && (
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-500 italic">No data available</p>
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

function ApprovalsPanel() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchProposals();
    fetchHistory();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals?status=pending");
      const data = await res.json();
      if (data.success) setProposals(data.proposals || []);
    } catch (e) {
      setError("Failed to load proposals");
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const [approvedRes, rejectedRes] = await Promise.all([
        fetch("/api/proposals?status=approved"),
        fetch("/api/proposals?status=rejected")
      ]);
      const [approvedData, rejectedData] = await Promise.all([approvedRes.json(), rejectedRes.json()]);
      const combined = [...(approvedData.proposals || []), ...(rejectedData.proposals || [])];
      combined.sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
      setHistory(combined);
    } catch (e) { /* silent */ }
  };

  const handleAction = async (id: number, action: "approve" | "reject" | "execute") => {
    setActionLoading(prev => ({ ...prev, [id]: action }));
    setError("");
    try {
      const method = action === "execute" ? "POST" : "PUT";
      const url = action === "execute" ? `/api/proposals/${id}/execute` : `/api/proposals/${id}/${action}`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.success) {
        await fetchProposals();
        await fetchHistory();
      } else {
        setError(data.error || `Failed to ${action} proposal`);
      }
    } catch (e) {
      setError(`Network error during ${action}`);
    }
    setActionLoading(prev => ({ ...prev, [id]: "" }));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <ThumbsUp className="w-7 h-7 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading text-green-400">Approval Queue</h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Proposals awaiting review</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm" data-testid="text-approvals-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-8 rounded-xl border border-green-500/20 bg-[#0B1B3F]/30 text-center mb-8">
          <CheckCircle className="w-10 h-10 text-green-500/30 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No pending proposals</p>
          <p className="text-xs text-gray-600 mt-1">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {proposals.map((proposal: any) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 rounded-xl border border-green-500/30 bg-[#0B1B3F]/30"
              data-testid={`card-proposal-${proposal.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-1">{proposal.title}</h4>
                  <p className="text-xs text-gray-400">{proposal.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                  {proposal.priorityScore !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      proposal.priorityScore >= 9 ? "bg-red-500 text-white" :
                      proposal.priorityScore >= 7 ? "bg-orange-500 text-white" :
                      proposal.priorityScore >= 5 ? "bg-yellow-500 text-black" :
                      "bg-blue-500 text-white"
                    }`} data-testid={`badge-priority-${proposal.id}`}>
                      {proposal.priorityScore}
                    </span>
                  )}
                  {proposal.urgency && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getUrgencyColor(proposal.urgency)}`}>
                      {proposal.urgency}
                    </span>
                  )}
                </div>
              </div>

              {proposal.category && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#14C1D7]/10 text-[#14C1D7] border border-[#14C1D7]/20 mb-3">
                  {proposal.category}
                </span>
              )}

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleAction(proposal.id, "approve")}
                  disabled={!!actionLoading[proposal.id]}
                  className="px-3 py-1.5 bg-green-500 text-black text-xs font-bold rounded-lg hover:bg-green-500/80 disabled:opacity-50 flex items-center gap-1"
                  data-testid={`button-approve-${proposal.id}`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {actionLoading[proposal.id] === "approve" ? "..." : "Approve"}
                </button>
                <button
                  onClick={() => handleAction(proposal.id, "reject")}
                  disabled={!!actionLoading[proposal.id]}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-500/80 disabled:opacity-50 flex items-center gap-1"
                  data-testid={`button-reject-${proposal.id}`}
                >
                  <ThumbsDown className="w-3 h-3" />
                  {actionLoading[proposal.id] === "reject" ? "..." : "Reject"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          data-testid="button-toggle-history"
        >
          {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>Approved / Rejected History ({history.length})</span>
        </button>

        {showHistory && history.length > 0 && (
          <div className="space-y-3">
            {history.map((item: any) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  item.status === "approved" ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                }`}
                data-testid={`card-history-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.objective}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      item.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {item.status}
                    </span>
                    {item.status === "approved" && (
                      <button
                        onClick={() => handleAction(item.id, "execute")}
                        disabled={!!actionLoading[item.id]}
                        className="px-3 py-1 bg-[#14C1D7] text-black text-xs font-bold rounded-lg hover:bg-[#14C1D7]/80 disabled:opacity-50 flex items-center gap-1"
                        data-testid={`button-execute-${item.id}`}
                      >
                        <Play className="w-3 h-3" />
                        {actionLoading[item.id] === "execute" ? "..." : "Execute"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SpecialistResultView({ result, colors }: { result: any; colors: any }) {
  if (typeof result === "string") {
    return <p className="text-sm text-gray-300 whitespace-pre-wrap">{result}</p>;
  }

  const renderList = (items: any[], accentColor: string) => {
    if (!Array.isArray(items) || items.length === 0)
      return <p className="text-xs text-gray-500 italic">None identified yet</p>;
    return (
      <ul className="space-y-1">
        {items.map((item: any, i: number) => (
          <li key={i} className="flex gap-2 text-sm text-gray-300">
            <span className={`mt-0.5 flex-shrink-0 ${accentColor}`}>›</span>
            <span>{typeof item === "string" ? item : item.title || item.name || item.action || item.description || item.opportunity || item.stream || item.campaign || item.improvement || item.inefficiency || JSON.stringify(item)}</span>
          </li>
        ))}
      </ul>
    );
  };

  const sections: { label: string; key: string }[] = [
    { label: "Opportunities", key: "opportunities" },
    { label: "Market Trends", key: "market_trends" },
    { label: "Competitive Insights", key: "competitive_insights" },
    { label: "Revenue Streams", key: "revenue_streams" },
    { label: "Cross-Sell Opportunities", key: "cross_sell_opportunities" },
    { label: "Campaigns", key: "campaigns" },
    { label: "Funnel Optimizations", key: "funnel_optimizations" },
    { label: "Viral Opportunities", key: "viral_opportunities" },
    { label: "Inefficiencies Found", key: "inefficiencies" },
    { label: "Automations", key: "automations" },
    { label: "Workflow Improvements", key: "workflow_improvements" },
  ];

  const accent = colors.text || "text-[#14C1D7]";

  return (
    <div className="space-y-3">
      {result.summary && (
        <p className="text-sm text-gray-200 leading-relaxed border-b border-white/10 pb-3">{result.summary}</p>
      )}

      {result.total_estimated_new_revenue && result.total_estimated_new_revenue !== "$0" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Estimated New Revenue:</span>
          <span className={`text-sm font-bold ${accent}`}>{result.total_estimated_new_revenue}</span>
        </div>
      )}

      {typeof result.system_health_score === "number" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">System Health Score:</span>
          <span className={`text-sm font-bold ${result.system_health_score >= 70 ? "text-emerald-400" : result.system_health_score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
            {result.system_health_score}/100
          </span>
        </div>
      )}

      {sections.map(({ label, key }) =>
        Array.isArray(result[key]) ? (
          <div key={key}>
            <p className={`text-xs uppercase tracking-wider mb-2 ${accent} opacity-70`}>{label}</p>
            {renderList(result[key], accent)}
          </div>
        ) : null
      )}

      {result.summary === undefined && sections.every(({ key }) => !Array.isArray(result[key])) && (
        <p className="text-xs text-gray-400 italic">Analysis complete — no structured data returned.</p>
      )}
    </div>
  );
}

function SpecialistsPanel() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const specialists = [
    { id: "opportunity-hunter", name: "Opportunity Hunter", icon: Search, color: "teal", description: "Scans ecosystem for new revenue opportunities", endpoint: "/api/specialist/opportunity-hunter" },
    { id: "revenue-generator", name: "Revenue Generator", icon: DollarSign, color: "emerald", description: "Identifies paths to increase revenue", endpoint: "/api/specialist/revenue-generator" },
    { id: "growth-engine", name: "Growth Engine", icon: Rocket, color: "teal", description: "Analyzes growth strategies and scaling potential", endpoint: "/api/specialist/growth-engine" },
    { id: "system-optimizer", name: "System Optimizer", icon: Wrench, color: "emerald", description: "Finds inefficiencies and optimization paths", endpoint: "/api/specialist/system-optimizer" },
  ];

  const runSpecialist = async (id: string, endpoint: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        setResults(prev => ({ ...prev, [id]: data.analysis }));
      } else {
        setError(data.error || `Failed to run ${id}`);
      }
    } catch (e) {
      setError(`Network error running ${id}`);
    }
    setLoading(prev => ({ ...prev, [id]: false }));
  };

  const getColorClasses = (color: string) => {
    if (color === "teal") return { border: "border-teal-500/30", bg: "hover:bg-teal-500/10", text: "text-teal-400", btn: "bg-teal-500 text-black", icon: "bg-gradient-to-br from-teal-500 to-teal-700" };
    return { border: "border-emerald-500/30", bg: "hover:bg-emerald-500/10", text: "text-emerald-400", btn: "bg-emerald-500 text-black", icon: "bg-gradient-to-br from-emerald-500 to-emerald-700" };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
          <Cpu className="w-7 h-7 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading text-emerald-400">Specialist Agents</h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Focused intelligence units</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm" data-testid="text-specialists-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialists.map((spec) => {
          const Icon = spec.icon;
          const colors = getColorClasses(spec.color);
          const result = results[spec.id];

          return (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 rounded-xl border ${colors.border} bg-[#0B1B3F]/30`}
              data-testid={`card-specialist-${spec.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.icon}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${colors.text}`}>{spec.name}</h3>
                    <p className="text-xs text-gray-500">{spec.description}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => runSpecialist(spec.id, spec.endpoint)}
                disabled={loading[spec.id]}
                className={`w-full px-4 py-2 ${colors.btn} font-bold rounded-lg hover:opacity-80 transition-colors disabled:opacity-50 text-sm mb-4`}
                data-testid={`button-run-${spec.id}`}
              >
                {loading[spec.id] ? "Running Analysis..." : "Run Analysis"}
              </button>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-black/30 border border-white/5 max-h-80 overflow-y-auto"
                  data-testid={`result-${spec.id}`}
                >
                  <SpecialistResultView result={result} colors={colors} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ReportsPanel() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/execution-reports");
      const data = await res.json();
      if (data.success) setReports(data.reports || []);
    } catch (e) {
      setError("Failed to load reports");
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "success": return "bg-green-500/20 text-green-400";
      case "failed": return "bg-red-500/20 text-red-400";
      case "running": return "bg-blue-500/20 text-blue-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-blue-400">Execution Reports</h2>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Task execution history</p>
          </div>
        </div>
        <button
          onClick={fetchReports}
          className="p-2 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors"
          data-testid="button-refresh-reports"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm" data-testid="text-reports-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="p-8 rounded-xl border border-blue-500/20 bg-[#0B1B3F]/30 text-center">
          <FileText className="w-10 h-10 text-blue-500/30 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No execution reports yet</p>
          <p className="text-xs text-gray-600 mt-1">Reports appear after tasks are executed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-blue-500/20 bg-[#0B1B3F]/30 overflow-hidden"
              data-testid={`card-report-${report.id}`}
            >
              <button
                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                data-testid={`button-expand-report-${report.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-bold text-white">{report.taskTitle || report.title || "Task"}</h4>
                    <p className="text-xs text-gray-500 font-mono">{report.agent || report.agentName || "Agent"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.qualityScore !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#DAA520]" />
                      <span className="text-xs font-mono text-[#DAA520]">{report.qualityScore}</span>
                    </div>
                  )}
                  {report.duration && (
                    <span className="text-xs font-mono text-gray-500">{report.duration}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  {expandedId === report.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </button>

              {expandedId === report.id && (
                <div className="px-4 pb-4 border-t border-blue-500/10">
                  <div className="pt-3">
                    {report.result && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Result</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {typeof report.result === "string" ? report.result : JSON.stringify(safeParse(report.result), null, 2)}
                        </p>
                      </div>
                    )}
                    {report.details && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Details</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {typeof report.details === "string" ? report.details : JSON.stringify(safeParse(report.details), null, 2)}
                        </p>
                      </div>
                    )}
                    {report.createdAt && (
                      <p className="text-xs text-gray-600 mt-2 font-mono">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MemoryPanel() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMemory();
  }, [categoryFilter]);

  const fetchMemory = async () => {
    setLoading(true);
    try {
      const url = categoryFilter ? `/api/memory?category=${encodeURIComponent(categoryFilter)}` : "/api/memory";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries || []);
        if (!categoryFilter) {
          const catSet = new Set<string>((data.entries || []).map((e: any) => e.category).filter(Boolean));
          const cats = Array.from(catSet);
          setCategories(cats);
        }
      }
    } catch (e) {
      setError("Failed to load memory entries");
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Database className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-purple-400">Memory System</h2>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Institutional knowledge base</p>
          </div>
        </div>
        <button
          onClick={() => { setCategoryFilter(""); fetchMemory(); }}
          className="p-2 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
          data-testid="button-refresh-memory"
        >
          <RefreshCw className="w-4 h-4 text-purple-400" />
        </button>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              !categoryFilter ? "bg-purple-500 text-white" : "border border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            }`}
            data-testid="button-filter-all"
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                categoryFilter === cat ? "bg-purple-500 text-white" : "border border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              }`}
              data-testid={`button-filter-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm" data-testid="text-memory-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="p-8 rounded-xl border border-purple-500/20 bg-[#0B1B3F]/30 text-center">
          <Database className="w-10 h-10 text-purple-500/30 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No memory entries yet</p>
          <p className="text-xs text-gray-600 mt-1">Memory builds as agents learn and execute</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry: any) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl border border-purple-500/20 bg-[#0B1B3F]/30"
              data-testid={`card-memory-${entry.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{entry.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    {entry.category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {entry.category}
                      </span>
                    )}
                    {entry.agentSource && (
                      <span className="text-xs text-gray-500 font-mono">{entry.agentSource}</span>
                    )}
                  </div>
                </div>
                {entry.qualityScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#DAA520]" />
                    <span className="text-xs font-mono text-[#DAA520]">{entry.qualityScore}</span>
                  </div>
                )}
              </div>
              {entry.content && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-3">{entry.content}</p>
              )}
              {entry.createdAt && (
                <p className="text-[10px] text-gray-600 mt-2 font-mono">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// CRM PANEL
// ─────────────────────────────────────────────────────────────

const PIPELINE_STAGES = ["New Lead", "Contacted", "Qualified", "Proposal Sent", "Closed Won", "Closed Lost"];
const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Contacted": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Qualified": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Proposal Sent": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Closed Won": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Closed Lost": "bg-red-500/20 text-red-400 border-red-500/30",
};
const NIG_DIVISIONS = [
  "C.A.R.E.N.", "Real Pulse Verifier", "My Life Assistant", "The Remedy Club",
  "NIG Core", "Rent-A-Buddy", "Eternal Chase", "Project DNA Music",
  "Zapp Marketing and Manufacturing", "Studio Artist Live", "Right Time Notary",
  "The Shock Factor", "ClearSpace", "CAD and Me", "Global Trade Facilitators",
];

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expired — redirecting to login");
  }
  return res;
}

function CRMPanel() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contactDetail, setContactDetail] = useState<{ deals: any[]; activities: any[] } | null>(null);
  const [pipeline, setPipeline] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "pipeline">("list");
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [outreachDraft, setOutreachDraft] = useState<string>("");
  const [error, setError] = useState("");

  // Add contact form
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", jobTitle: "", linkedinUrl: "", source: "manual", tags: "", notes: "" });
  // Add deal form
  const [newDeal, setNewDeal] = useState({ division: NIG_DIVISIONS[0], stage: "New Lead", value: "0", notes: "" });
  // CSV import
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchContacts(); fetchPipeline(); }, []);
  useEffect(() => { const t = setTimeout(() => fetchContacts(), 300); return () => clearTimeout(t); }, [search]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/crm/contacts?search=${encodeURIComponent(search)}` : "/api/crm/contacts";
      const res = await apiFetch(url);
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } catch { setError("Failed to load contacts"); }
    setLoading(false);
  };

  const fetchPipeline = async () => {
    try {
      const res = await apiFetch("/api/crm/pipeline");
      const data = await res.json();
      if (data.success) setPipeline(data.summary);
    } catch {}
  };

  const selectContact = async (contact: any) => {
    setSelectedContact(contact);
    setOutreachDraft("");
    setRecommendations([]);
    try {
      const res = await apiFetch(`/api/crm/contacts/${contact.id}`);
      const data = await res.json();
      if (data.success) setContactDetail({ deals: data.deals, activities: data.activities });
    } catch {}
  };

  const addContact = async () => {
    if (!newContact.firstName && !newContact.email) return;
    try {
      const res = await apiFetch("/api/crm/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newContact) });
      const data = await res.json();
      if (data.success) { fetchContacts(); setShowAddContact(false); setNewContact({ firstName: "", lastName: "", email: "", phone: "", company: "", jobTitle: "", linkedinUrl: "", source: "manual", tags: "", notes: "" }); }
    } catch { setError("Failed to add contact"); }
  };

  const addDeal = async () => {
    if (!selectedContact) return;
    try {
      const res = await apiFetch("/api/crm/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newDeal, contactId: selectedContact.id, value: newDeal.value || "0" }) });
      const data = await res.json();
      if (data.success) { selectContact(selectedContact); fetchPipeline(); setShowAddDeal(false); }
    } catch { setError("Failed to add deal"); }
  };

  const updateDealStage = async (dealId: number, stage: string) => {
    try {
      await apiFetch(`/api/crm/deals/${dealId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) });
      if (selectedContact) selectContact(selectedContact);
      fetchPipeline();
    } catch {}
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Delete this contact and all their deals?")) return;
    await apiFetch(`/api/crm/contacts/${id}`, { method: "DELETE" });
    setSelectedContact(null); setContactDetail(null);
    fetchContacts(); fetchPipeline();
  };

  const generateOutreach = async (dealId: number) => {
    if (!selectedContact) return;
    setAiLoading("outreach");
    try {
      const res = await apiFetch(`/api/crm/outreach/${selectedContact.id}/${dealId}`, { method: "POST" });
      const data = await res.json();
      if (data.success) setOutreachDraft(data.draft);
    } catch { setError("AI outreach failed"); }
    setAiLoading(null);
  };

  const getRecommendations = async () => {
    if (!selectedContact) return;
    setAiLoading("recs");
    try {
      const res = await apiFetch(`/api/crm/recommendations/${selectedContact.id}`);
      const data = await res.json();
      if (data.success) setRecommendations(data.recommendations);
    } catch {}
    setAiLoading(null);
  };

  const summarize = async () => {
    if (!selectedContact) return;
    setAiLoading("summary");
    try {
      const res = await apiFetch(`/api/crm/summarize/${selectedContact.id}`, { method: "POST" });
      const data = await res.json();
      if (data.success) { setSelectedContact((c: any) => ({ ...c, aiSummary: data.summary })); }
    } catch {}
    setAiLoading(null);
  };

  const readFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportText((ev.target?.result as string) || "");
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const parseRow = (line: string): string[] => {
      const fields: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (ch === "," && !inQuotes) {
          fields.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      fields.push(cur.trim());
      return fields;
    };

    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = parseRow(lines[0]);
    return lines.slice(1)
      .filter((l) => l.trim())
      .map((line) => {
        const vals = parseRow(line);
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
        return obj;
      });
  };

  const handleCsvImport = async () => {
    try {
      const rows = parseCSV(importText);
      if (rows.length === 0) { setError("No valid rows found. Make sure your CSV has a header row and at least one data row."); return; }
      const res = await apiFetch("/api/crm/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: rows, filename: "csv_import.csv" }),
      });
      const data = await res.json();
      if (!data.success && !data.error) data.error = `Server error (status ${res.status})`;
      setImportResult(data);
      if (data.success) { fetchContacts(); fetchPipeline(); }
    } catch (e: any) { setError(e?.message || "Import failed — please check your CSV format and try again."); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Montserrat']">Sales CRM</h2>
          <p className="text-sm text-gray-400">AI-powered pipeline across all NIG divisions</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setView(view === "list" ? "pipeline" : "list")} className="flex items-center gap-2 px-3 py-2 border border-[#14C1D7]/30 rounded-lg text-[#14C1D7] text-sm hover:bg-[#14C1D7]/10 transition-colors">
            <PieChart className="w-4 h-4" />{view === "list" ? "Pipeline View" : "Contact List"}
          </button>
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 px-3 py-2 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm hover:bg-yellow-500/10 transition-colors">
            <Upload className="w-4 h-4" />Import CSV
          </button>
          <button onClick={() => setShowAddContact(true)} className="flex items-center gap-2 px-3 py-2 bg-rose-500 rounded-lg text-white text-sm font-bold hover:bg-rose-600 transition-colors">
            <UserPlus className="w-4 h-4" />Add Contact
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">{error}<button className="ml-3 text-red-300 hover:text-white" onClick={() => setError("")}>✕</button></p>}

      {/* Pipeline stats */}
      {pipeline && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Contacts", value: pipeline.totalContacts, color: "text-white" },
            { label: "Total Deals", value: pipeline.totalDeals, color: "text-rose-400" },
            { label: "Pipeline Value", value: `$${Number(pipeline.totalPipelineValue || 0).toLocaleString()}`, color: "text-[#DAA520]" },
            { label: "Closed Won", value: `$${Number(pipeline.closedWonValue || 0).toLocaleString()}`, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-white/10 bg-[#0B1B3F]/40 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pipeline View */}
      {view === "pipeline" && pipeline && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage} className="w-52 flex-shrink-0">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border mb-2 text-center ${STAGE_COLORS[stage]}`}>{stage} ({pipeline.byStage?.[stage] || 0})</div>
                <div className="space-y-2 min-h-16">
                  {contacts.flatMap(() => []).length === 0 && <p className="text-xs text-gray-600 text-center pt-4">—</p>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Switch to Contact List view to manage individual deals and move them through stages.</p>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Contact list */}
          <div className="lg:col-span-1 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50" data-testid="input-crm-search" />
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {loading && <p className="text-xs text-gray-500 text-center py-4">Loading...</p>}
              {!loading && contacts.length === 0 && <p className="text-xs text-gray-500 text-center py-8">No contacts yet. Add one or import a CSV.</p>}
              {contacts.map((c) => (
                <button key={c.id} onClick={() => selectContact(c)} data-testid={`contact-card-${c.id}`}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${selectedContact?.id === c.id ? "border-rose-500/50 bg-rose-500/10" : "border-white/5 bg-[#0B1B3F]/40 hover:border-white/20"}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(c.firstName?.[0] || c.email?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{c.company || c.email || "No info"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact detail */}
          <div className="lg:col-span-2">
            {!selectedContact ? (
              <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl p-12 text-center">
                <div>
                  <Contact className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Select a contact to view details</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Contact header */}
                <div className="p-5 rounded-xl border border-rose-500/20 bg-[#0B1B3F]/40">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg font-bold">
                        {(selectedContact.firstName?.[0] || selectedContact.email?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedContact.firstName} {selectedContact.lastName}</h3>
                        <p className="text-sm text-gray-400">{selectedContact.jobTitle}{selectedContact.jobTitle && selectedContact.company ? " @ " : ""}{selectedContact.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddDeal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-400 text-xs hover:bg-rose-500/30 transition-colors">
                        <Plus className="w-3 h-3" />Add Deal
                      </button>
                      <button onClick={() => deleteContact(selectedContact.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs hover:bg-red-500/20 transition-colors">
                        <X className="w-3 h-3" />Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-400">
                    {selectedContact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedContact.email}</span>}
                    {selectedContact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedContact.phone}</span>}
                    {selectedContact.linkedinUrl && <a href={selectedContact.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline"><Globe className="w-3 h-3" />LinkedIn</a>}
                    <span className="flex items-center gap-1 text-gray-600">Source: {selectedContact.source}</span>
                  </div>

                  {/* AI Summary */}
                  {selectedContact.aiSummary && (
                    <p className="mt-3 text-xs text-gray-300 bg-black/20 rounded-lg px-3 py-2 border border-white/5">{selectedContact.aiSummary}</p>
                  )}

                  {/* AI Buttons */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button onClick={summarize} disabled={aiLoading === "summary"} className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs hover:bg-purple-500/30 transition-colors disabled:opacity-50">
                      <Sparkles className="w-3 h-3" />{aiLoading === "summary" ? "Summarizing..." : "AI Summary"}
                    </button>
                    <button onClick={getRecommendations} disabled={aiLoading === "recs"} className="flex items-center gap-1 px-3 py-1.5 bg-[#14C1D7]/20 border border-[#14C1D7]/30 rounded-lg text-[#14C1D7] text-xs hover:bg-[#14C1D7]/30 transition-colors disabled:opacity-50">
                      <Sparkles className="w-3 h-3" />{aiLoading === "recs" ? "Analyzing..." : "Cross-Division Recs"}
                    </button>
                  </div>

                  {recommendations.length > 0 && (
                    <div className="mt-3 p-3 bg-[#14C1D7]/10 border border-[#14C1D7]/20 rounded-lg">
                      <p className="text-xs text-[#14C1D7] font-bold mb-2">Recommended divisions for this contact:</p>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.map((r) => (
                          <span key={r} className="px-2 py-1 bg-[#14C1D7]/20 text-[#14C1D7] text-xs rounded-full">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deals */}
                {contactDetail && contactDetail.deals.length > 0 && (
                  <div className="p-5 rounded-xl border border-white/10 bg-[#0B1B3F]/40">
                    <h4 className="text-sm font-bold text-white mb-3">Deals</h4>
                    <div className="space-y-3">
                      {contactDetail.deals.map((deal) => (
                        <div key={deal.id} className="p-3 rounded-lg bg-black/20 border border-white/5">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <p className="text-sm font-medium text-white">{deal.division}</p>
                              <p className="text-xs text-gray-500">${Number(deal.value || 0).toLocaleString()} · {deal.expectedCloseDate || "No close date"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <select value={deal.stage} onChange={(e) => updateDealStage(deal.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full border font-semibold bg-transparent cursor-pointer ${STAGE_COLORS[deal.stage]}`}
                                data-testid={`deal-stage-${deal.id}`}>
                                {PIPELINE_STAGES.map((s) => <option key={s} value={s} className="bg-[#0B1B3F] text-white">{s}</option>)}
                              </select>
                              <button onClick={() => generateOutreach(deal.id)} disabled={aiLoading === "outreach"} className="flex items-center gap-1 px-2 py-1 bg-rose-500/20 border border-rose-500/30 rounded text-rose-400 text-xs hover:bg-rose-500/30 transition-colors disabled:opacity-50">
                                <Send className="w-3 h-3" />{aiLoading === "outreach" ? "..." : "Draft"}
                              </button>
                            </div>
                          </div>
                          {deal.aiDraftOutreach && (
                            <div className="mt-2 p-2 bg-rose-500/5 border border-rose-500/20 rounded text-xs text-gray-300 whitespace-pre-wrap">{deal.aiDraftOutreach}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {outreachDraft && !contactDetail.deals.some((d) => d.aiDraftOutreach) && (
                      <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <p className="text-xs text-rose-400 font-bold mb-1">AI Outreach Draft</p>
                        <p className="text-xs text-gray-300 whitespace-pre-wrap">{outreachDraft}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Activity log */}
                {contactDetail && contactDetail.activities.length > 0 && (
                  <div className="p-5 rounded-xl border border-white/10 bg-[#0B1B3F]/40">
                    <h4 className="text-sm font-bold text-white mb-3">Activity</h4>
                    <div className="space-y-2">
                      {contactDetail.activities.slice(0, 5).map((a) => (
                        <div key={a.id} className="flex gap-3 text-xs">
                          <span className="text-gray-600 font-mono flex-shrink-0">{new Date(a.createdAt).toLocaleDateString()}</span>
                          <span className="text-[#14C1D7] capitalize flex-shrink-0">{a.type}</span>
                          <span className="text-gray-300">{a.subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1f4a] border border-rose-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Add Contact</h3>
              <button onClick={() => setShowAddContact(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["First Name*", "firstName"], ["Last Name", "lastName"], ["Email", "email"], ["Phone", "phone"], ["Company", "company"], ["Job Title", "jobTitle"]].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input value={(newContact as any)[key]} onChange={(e) => setNewContact((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500/50"
                    data-testid={`input-new-contact-${key}`} />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-500 mb-1 block">LinkedIn URL</label>
              <input value={newContact.linkedinUrl} onChange={(e) => setNewContact((p) => ({ ...p, linkedinUrl: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500/50" />
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-500 mb-1 block">Notes</label>
              <textarea value={newContact.notes} onChange={(e) => setNewContact((p) => ({ ...p, notes: e.target.value }))} rows={2}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500/50 resize-none" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddContact(false)} className="flex-1 py-2 border border-white/10 rounded-lg text-gray-400 text-sm hover:bg-white/5">Cancel</button>
              <button onClick={addContact} className="flex-1 py-2 bg-rose-500 rounded-lg text-white text-sm font-bold hover:bg-rose-600" data-testid="button-save-contact">Save Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddDeal && selectedContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d1f4a] border border-rose-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">New Deal for {selectedContact.firstName}</h3>
              <button onClick={() => setShowAddDeal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Division</label>
                <select value={newDeal.division} onChange={(e) => setNewDeal((p) => ({ ...p, division: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white focus:outline-none" data-testid="select-deal-division">
                  {NIG_DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Stage</label>
                <select value={newDeal.stage} onChange={(e) => setNewDeal((p) => ({ ...p, stage: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white focus:outline-none">
                  {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Deal Value ($)</label>
                <input type="number" value={newDeal.value} onChange={(e) => setNewDeal((p) => ({ ...p, value: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                <textarea value={newDeal.notes} onChange={(e) => setNewDeal((p) => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-sm text-white resize-none focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddDeal(false)} className="flex-1 py-2 border border-white/10 rounded-lg text-gray-400 text-sm hover:bg-white/5">Cancel</button>
              <button onClick={addDeal} className="flex-1 py-2 bg-rose-500 rounded-lg text-white text-sm font-bold hover:bg-rose-600" data-testid="button-save-deal">Create Deal</button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0d1f4a] border border-yellow-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Import Contacts</h3>
              <button onClick={() => { setShowImport(false); setImportText(""); setImportResult(null); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              data-testid="input-csv-file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { readFile(file); e.target.value = ""; }
              }}
            />

            {/* Drop zone */}
            <div
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all mb-4 cursor-pointer select-none ${
                isDragging
                  ? "border-yellow-400 bg-yellow-400/20 scale-[1.01]"
                  : "border-yellow-500/40 bg-yellow-500/5 hover:border-yellow-400/70 hover:bg-yellow-500/10"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) readFile(file);
              }}
            >
              <Upload className={`w-8 h-8 mb-2 transition-colors ${isDragging ? "text-yellow-400" : "text-yellow-400/50"}`} />
              <p className="text-sm font-semibold text-yellow-400">{isDragging ? "Drop it!" : "Drag & drop your CSV here"}</p>
              <p className="text-xs text-gray-500 mt-1">or</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="mt-2 px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-colors"
              >
                Choose File
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-2">
              Supports <span className="text-yellow-400">Yahoo Contacts</span>, <span className="text-yellow-400">LinkedIn</span>, Google, Outlook, and most standard CSV exports.
              <br />First Name, Last Name, and Email are auto-detected. First row must be headers.
            </p>

            {/* Preview row count */}
            {importText.trim() && (
              <p className="text-xs text-emerald-400 mb-2">
                ✓ {Math.max(0, importText.trim().split("\n").length - 1)} rows detected — ready to import
              </p>
            )}

            <textarea
              value={importText}
              onChange={(e) => { setImportText(e.target.value); setImportResult(null); }}
              rows={5}
              placeholder={"First Name,Last Name,Email Address,Company,Job Title\nJohn,Doe,john@example.com,Acme Inc,CEO"}
              className="w-full px-3 py-2 rounded-lg bg-[#0B1B3F] border border-white/10 text-xs text-gray-300 font-mono focus:outline-none focus:border-yellow-500/50 resize-y"
              data-testid="textarea-csv-import"
            />

            {importResult && (
              <div className={`mt-3 px-4 py-2 rounded-lg border text-sm ${importResult.success ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                {importResult.success
                  ? `✓ Imported ${importResult.imported} contacts${importResult.failed > 0 ? ` (${importResult.failed} skipped)` : ""}`
                  : `Error: ${importResult.error}`}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowImport(false); setImportText(""); setImportResult(null); }} className="flex-1 py-2 border border-white/10 rounded-lg text-gray-400 text-sm hover:bg-white/5">Close</button>
              <button onClick={handleCsvImport} disabled={!importText.trim()} className="flex-1 py-2 bg-yellow-500 rounded-lg text-black text-sm font-bold hover:bg-yellow-400 disabled:opacity-50" data-testid="button-import-csv">
                Import {importText.trim() ? `(${Math.max(0, importText.trim().split("\n").length - 1)} rows)` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NIG SECURITY INTEGRITY AGENT PANEL
// ─────────────────────────────────────────────────────────────────────────────
const RISK_COLORS: Record<string, string> = {
  CRITICAL: "text-red-400 bg-red-400/10 border-red-400/40",
  HIGH:     "text-orange-400 bg-orange-400/10 border-orange-400/40",
  MEDIUM:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/40",
  LOW:      "text-blue-400 bg-blue-400/10 border-blue-400/40",
  INFO:     "text-gray-400 bg-gray-400/10 border-gray-400/30",
};
const STATUS_COLORS: Record<string, string> = {
  clear:          "text-emerald-400",
  monitoring:     "text-blue-400",
  action_required:"text-yellow-400",
  escalated:      "text-red-400",
};

function SecurityPanel() {
  const [findings, setFindings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanning, setScanning] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "findings" | "events" | "ask">("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [scanContext, setScanContext] = useState("");
  const [showContextInput, setShowContextInput] = useState(false);

  const loadData = async () => {
    const [fRes, eRes] = await Promise.all([
      apiFetch("/api/security/findings"),
      apiFetch("/api/security/events"),
    ]);
    const fData = await fRes.json().catch(() => ({}));
    const eData = await eRes.json().catch(() => ({}));
    if (fData.findings) setFindings(fData.findings);
    if (eData.events) setEvents(eData.events);
  };

  useEffect(() => { loadData(); }, []);

  const runScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await apiFetch("/api/security/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: scanContext || undefined }),
      });
      const data = await res.json();
      setScanResult(data);
      setShowContextInput(false);
      setScanContext("");
      await loadData();
    } catch {
      setScanResult({ error: "Scan failed. Please try again." });
    }
    setScanning(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAskingQuestion(true);
    setAnswer("");
    try {
      const res = await apiFetch("/api/security/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer generated.");
    } catch {
      setAnswer("Error contacting Security Agent.");
    }
    setAskingQuestion(false);
  };

  const markFinding = async (id: number, status: string) => {
    setMarkingId(id);
    try {
      await apiFetch(`/api/security/findings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadData();
    } finally {
      setMarkingId(null);
    }
  };

  const openFindings = findings.filter(f => f.status === "open");
  const reviewedFindings = findings.filter(f => f.status !== "open");
  const criticalCount = findings.filter(f => f.riskLevel === "CRITICAL" && f.status === "open").length;
  const highCount = findings.filter(f => f.riskLevel === "HIGH" && f.status === "open").length;
  const filteredFindings = filterStatus === "all" ? findings : findings.filter(f => f.status === filterStatus);

  const systemStatus = criticalCount > 0 ? "escalated" : highCount > 0 ? "action_required" : openFindings.length > 0 ? "monitoring" : "clear";

  const subTabs = [
    { id: "overview", label: "Overview" },
    { id: "findings", label: `Findings (${openFindings.length})` },
    { id: "events", label: `Events (${events.length})` },
    { id: "ask", label: "Ask Agent" },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">NIG Security Integrity Agent</h2>
            <p className="text-xs text-gray-400">Continuous monitoring across all 12 NIG applications</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            systemStatus === "clear" ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" :
            systemStatus === "monitoring" ? "text-blue-400 border-blue-400/40 bg-blue-400/10" :
            systemStatus === "action_required" ? "text-yellow-400 border-yellow-400/40 bg-yellow-400/10" :
            "text-red-400 border-red-400/40 bg-red-400/10"
          }`}>
            {systemStatus.replace(/_/g, " ")}
          </span>
          <button
            onClick={() => setShowContextInput(!showContextInput)}
            className="px-3 py-1.5 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs hover:bg-emerald-500/10"
            data-testid="button-security-context-toggle"
          >
            Add Context
          </button>
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-lg text-black font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all"
            data-testid="button-security-scan"
          >
            {scanning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Scanning…</> : <><Shield className="w-4 h-4" /> Run Scan</>}
          </button>
        </div>
      </div>

      {/* Optional context input */}
      {showContextInput && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-xs text-gray-400 mb-2">Provide context for the scan (e.g., "Focus on failed logins", "Check CRM data integrity")</p>
          <textarea
            value={scanContext}
            onChange={e => setScanContext(e.target.value)}
            placeholder="Optional scan context…"
            className="w-full bg-[#0B1B3F]/60 border border-white/10 rounded-lg p-3 text-white text-sm resize-none outline-none focus:border-emerald-500/60"
            rows={2}
            data-testid="input-security-context"
          />
        </div>
      )}

      {/* Scan result banner */}
      {scanResult && !scanning && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl border ${
            scanResult.error ? "border-red-400/40 bg-red-400/10" :
            scanResult.status === "clear" ? "border-emerald-400/40 bg-emerald-400/5" :
            scanResult.status === "escalated" ? "border-red-400/40 bg-red-400/5" :
            "border-yellow-400/40 bg-yellow-400/5"
          }`}>
          {scanResult.error ? (
            <p className="text-red-400 text-sm">{scanResult.error}</p>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">
                  Scan Complete — {scanResult.findings?.length || 0} finding(s) detected
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Highest severity: <span className={RISK_COLORS[scanResult.highestSeverity]?.split(" ")[0]}>{scanResult.highestSeverity}</span>
                  {" · "}Duration: {((scanResult.scanDuration || 0) / 1000).toFixed(1)}s
                  {" · "}Quality: {scanResult.qualityScore}/10
                </p>
              </div>
              <span className={`text-sm font-bold uppercase ${STATUS_COLORS[scanResult.status] || "text-gray-400"}`}>
                {(scanResult.status || "").replace(/_/g, " ")}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-1">
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            data-testid={`tab-security-${t.id}`}
            className={`px-4 py-2 text-sm rounded-t-lg transition-all ${
              activeSubTab === t.id
                ? "bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Open Findings", value: openFindings.length, color: "text-white" },
              { label: "Critical", value: criticalCount, color: "text-red-400" },
              { label: "High", value: highCount, color: "text-orange-400" },
              { label: "Events Logged", value: events.length, color: "text-blue-400" },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl border border-white/10 bg-[#0B1B3F]/30">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-bold font-mono mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Protected apps */}
          <div className="p-5 rounded-xl border border-white/10 bg-[#0B1B3F]/20">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Protected Applications</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "C.A.R.E.N.", "Real Pulse Verifier", "My Life Assistant",
                "The Remedy Club", "Rent-A-Buddy", "Eternal Chase",
                "Project DNA Music", "Zapp Marketing", "Studio Artist Live",
                "ClearSpace", "Global Trade Facilitators", "NIG Core",
              ].map(app => (
                <div key={app} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  <span className="text-xs text-gray-300 truncate">{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent open findings preview */}
          {openFindings.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Recent Open Findings</p>
              {openFindings.slice(0, 5).map((f: any) => (
                <div key={f.id} className={`p-4 rounded-xl border ${RISK_COLORS[f.riskLevel] || RISK_COLORS.INFO} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{f.title}</span>
                    <span className="text-xs font-bold uppercase">{f.riskLevel}</span>
                  </div>
                  <p className="text-xs text-gray-300">{f.summary}</p>
                  <p className="text-xs text-gray-500">{f.affectedApp}</p>
                </div>
              ))}
            </div>
          )}

          {openFindings.length === 0 && !scanning && (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-10 h-10 mx-auto mb-3 text-emerald-500/40" />
              <p className="text-sm">No open findings — system is clean</p>
              <p className="text-xs mt-1">Run a scan to check for new threats</p>
            </div>
          )}
        </div>
      )}

      {/* Findings */}
      {activeSubTab === "findings" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {["all", "open", "reviewed", "resolved", "false_positive"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-full text-xs capitalize border transition-all ${
                  filterStatus === s ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "border-white/10 text-gray-400 hover:text-white"
                }`}
                data-testid={`filter-security-${s}`}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {filteredFindings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No findings in this category</p>
            </div>
          ) : (
            filteredFindings.map((f: any) => (
              <motion.div key={f.id} layout
                className={`p-5 rounded-xl border space-y-3 ${RISK_COLORS[f.riskLevel] || RISK_COLORS.INFO}`}
                data-testid={`card-finding-${f.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold">{f.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-current">{f.riskLevel}</span>
                      {f.escalationRequired && <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-400/30 px-2 py-0.5 rounded-full">Escalation Required</span>}
                      {f.ownerReviewNeeded && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-full">Owner Review Needed</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{f.affectedApp} · {f.category} · Confidence: {f.confidence}%</p>
                  </div>
                  <span className={`text-xs capitalize px-2 py-1 rounded-lg border ${
                    f.status === "open" ? "border-orange-400/30 text-orange-300 bg-orange-500/10" :
                    f.status === "resolved" ? "border-emerald-400/30 text-emerald-300 bg-emerald-500/10" :
                    "border-gray-400/20 text-gray-400 bg-white/5"
                  }`}>
                    {f.status?.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-xs text-gray-300">{f.summary}</p>

                {f.signals && (() => {
                  try {
                    const sigs = JSON.parse(f.signals);
                    if (sigs.length > 0) return (
                      <div className="flex flex-wrap gap-1">
                        {sigs.map((s: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{s}</span>
                        ))}
                      </div>
                    );
                  } catch {}
                  return null;
                })()}

                {f.recommendation && (
                  <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Recommendation</p>
                    <p className="text-xs text-gray-300">{f.recommendation}</p>
                  </div>
                )}

                {f.status === "open" && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => markFinding(f.id, "reviewed")}
                      disabled={markingId === f.id}
                      className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 border border-blue-400/30 text-blue-300 hover:bg-blue-500/20"
                      data-testid={`button-mark-reviewed-${f.id}`}
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => markFinding(f.id, "resolved")}
                      disabled={markingId === f.id}
                      className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20"
                      data-testid={`button-resolve-${f.id}`}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => markFinding(f.id, "false_positive")}
                      disabled={markingId === f.id}
                      className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                      data-testid={`button-false-positive-${f.id}`}
                    >
                      False Positive
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Events */}
      {activeSubTab === "events" && (
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No events logged yet</p>
            </div>
          ) : (
            events.map((e: any) => (
              <div key={e.id} className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${RISK_COLORS[e.severity] || RISK_COLORS.INFO}`}
                data-testid={`event-row-${e.id}`}>
                <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded border border-current mt-0.5 flex-shrink-0`}>{e.severity}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{e.eventType}</p>
                  <p className="text-gray-400 mt-0.5 line-clamp-2">{e.details}</p>
                  {e.source && <p className="text-gray-600 mt-1">Source: {e.source}</p>}
                </div>
                <p className="text-gray-600 flex-shrink-0">{new Date(e.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ask Agent */}
      {activeSubTab === "ask" && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Ask the Security Integrity Agent</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Ask anything about security posture, threat patterns, incident response, or recommendations for a specific app.
            </p>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. Are there any login anomalies across the CRM? What's the biggest risk right now?"
              className="w-full bg-[#0B1B3F]/60 border border-white/10 rounded-lg p-3 text-white text-sm resize-none outline-none focus:border-emerald-500/60 mb-3"
              rows={3}
              data-testid="input-security-question"
            />
            <button
              onClick={askQuestion}
              disabled={askingQuestion || !question.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-lg text-black font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all"
              data-testid="button-ask-security"
            >
              {askingQuestion ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Shield className="w-4 h-4" /> Ask Agent</>}
            </button>
          </div>

          {answer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl border border-emerald-500/20 bg-[#0B1B3F]/40">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">Security Agent Response</p>
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{answer}</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
