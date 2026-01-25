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
  Briefcase
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
  
  const { data, isLoading, refetch, error } = useQuery<{ success: boolean; data: DashboardData }>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000,
    enabled: true, // Always fetch for now
    retry: false,
  });

  const dashboard = data?.data;

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
              <a 
                href="/api/logout"
                className="flex items-center gap-2 px-3 py-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 text-sm"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14C1D7]"></div>
            </div>
          ) : (
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

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <CFOAgentPanel />
                <COOAgentPanel />
                <CTOAgentPanel />
                <CMOAgentPanel />
                <CHROAgentPanel />
              </div>
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
