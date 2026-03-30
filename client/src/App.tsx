import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import CommandCenter from "@/pages/CommandCenter";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
          navigate("/login");
        }
      })
      .catch(() => {
        setStatus("unauthenticated");
        navigate("/login");
      });
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1B3F]">
        <div className="w-8 h-8 border-2 border-[#14C1D7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "authenticated") return <Component />;
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={CommandCenter} />}
      </Route>
      <Route path="/command-center">
        {() => <ProtectedRoute component={CommandCenter} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
