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
  CircleDot
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

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

  const panelTabs = [
    { id: "orchestrator", label: "Orchestrator", icon: Crown, color: "from-[#14C1D7] to-[#DAA520]" },
    { id: "dashboard", label: "Dashboard", icon: Activity, color: "from-[#14C1D7] to-[#14C1D7]" },
    { id: "approvals", label: "Approvals", icon: ThumbsUp, color: "from-green-500 to-emerald-500" },
    { id: "specialists", label: "Specialists", icon: Cpu, color: "from-teal-500 to-emerald-500" },
    { id: "agents", label: "Exec Agents", icon: Bot, color: "from-[#DAA520] to-[#14C1D7]" },
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
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold font-heading text-[#DAA520]">Division Status</h2>
                    <span className="text-xs text-gray-500 font-mono">Real-time monitoring</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboard?.divisions.map((division, index) => {
                      const Icon = getCategoryIcon(division.category);
                      return (
                        <motion.div
                          key={division.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="group p-4 rounded-xl border border-[#14C1D7]/20 bg-[#0B1B3F]/20 hover:border-[#14C1D7]/50 transition-all cursor-pointer"
                          data-testid={`card-division-${division.id}`}
                          onClick={() => division.externalUrl && window.open(division.externalUrl, "_blank")}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-[#14C1D7]/10 border border-[#14C1D7]/20">
                                <Icon className="w-5 h-5 text-[#14C1D7]" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm">{division.name}</h3>
                                <p className="text-xs text-gray-500">{division.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(division.status)} animate-pulse`} />
                              {division.externalUrl && (
                                <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">{division.description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                              Tier {division.tier || 3}
                            </span>
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${
                              division.status === "live" ? "text-green-400" : 
                              division.status === "active" ? "text-cyan-400" : "text-yellow-400"
                            }`}>
                              {division.status.replace("_", " ")}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {(!dashboard?.divisions || dashboard.divisions.length === 0) && (
                    <div className="p-8 rounded-xl border border-[#14C1D7]/20 bg-[#0B1B3F]/20 text-center">
                      <p className="text-gray-500 mb-4">No divisions configured yet.</p>
                      <button 
                        onClick={async () => {
                          await fetch("/api/seed-divisions", { method: "POST" });
                          refetch();
                        }}
                        className="px-4 py-2 bg-[#14C1D7] text-black font-bold rounded-lg hover:bg-[#14C1D7]/80 transition-colors"
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
