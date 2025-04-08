
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Communities from "./pages/Communities";
import PublicCommunities from "./pages/PublicCommunities";
import CommunityDetail from "./pages/CommunityDetail";
import CommunityCreate from "./pages/CommunityCreate";
import Wallet from "./pages/Wallet";
import Members from "./pages/Members";
import Contributions from "./pages/Contributions";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/auth/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RouteGuard>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/communities/public" element={<PublicCommunities />} />
                <Route path="/communities/:id" element={<CommunityDetail />} />
                <Route path="/communities/new" element={<CommunityCreate />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/members" element={<Members />} />
                <Route path="/contributions" element={<Contributions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteGuard>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
