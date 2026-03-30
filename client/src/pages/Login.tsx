import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/command-center");
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1B3F]">
      <div className="w-full max-w-md px-8 py-10 rounded-2xl border border-[#14C1D7]/30 bg-[#0d1f4a] shadow-2xl shadow-[#14C1D7]/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14C1D7] to-[#DAA520] flex items-center justify-center mb-4 shadow-lg shadow-[#14C1D7]/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Command Center</h1>
          <p className="text-[#14C1D7]/70 text-sm mt-1">NIG Master Ecosystem Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[#14C1D7]/80 mb-2 font-medium">Access Password</label>
            <input
              data-testid="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access password"
              className="w-full px-4 py-3 rounded-lg bg-[#0B1B3F] border border-[#14C1D7]/30 text-white placeholder-white/30 focus:outline-none focus:border-[#14C1D7] focus:ring-1 focus:ring-[#14C1D7] transition-all"
              autoFocus
              required
            />
          </div>

          {error && (
            <p data-testid="text-login-error" className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            data-testid="button-login"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#14C1D7] to-[#0ea5b8] hover:from-[#0ea5b8] hover:to-[#14C1D7] disabled:opacity-50 transition-all shadow-lg shadow-[#14C1D7]/20"
          >
            {loading ? "Verifying..." : "Access Command Center"}
          </button>
        </form>
      </div>
    </div>
  );
}
