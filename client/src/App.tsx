import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StaffDetailPage from "@/pages/StaffDetailPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import NewsListPage from "@/pages/NewsListPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import DevelopersPage from "@/pages/DevelopersPage";
import ProjectsPage from "@/pages/ProjectsPage";
import NotFound from "@/pages/not-found";
import "./lib/i18n";

function Router() {
  return (
    <Switch>
      {/* Articles / news */}
      <Route path="/" component={NewsListPage} />
      <Route path="/news" component={NewsListPage} />
      <Route path="/news/:id" component={NewsDetailPage} />

      {/* Developers */}
      <Route path="/developers" component={DevelopersPage} />
      <Route path="/developers/:endpoint" component={StaffDetailPage} />

      {/* Projects */}
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:endpoint" component={ProjectDetailPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop>
          <Router />
        </ScrollToTop>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

function ScrollToTop({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return <>{children}</>;
}
