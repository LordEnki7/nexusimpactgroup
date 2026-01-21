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
  Home
} from "lucide-react";
import { Link } from "wouter";

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
  const { data, isLoading, refetch } = useQuery<{ success: boolean; data: DashboardData }>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000,
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
