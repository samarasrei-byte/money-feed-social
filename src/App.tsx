import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import Ranking from "./pages/Ranking";
import Affiliate from "./pages/Affiliate";
import Install from "./pages/Install";
import Admin from "./pages/Admin";
import BrandArea from "./pages/BrandArea";
import Products from "./pages/Products";
import TikTok from "./pages/TikTok";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/install" element={<Install />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* App routes with layout */}
            <Route element={<AppLayout />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/communities/:id" element={<CommunityDetail />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/brands" element={<BrandArea />} />
              <Route path="/products" element={<Products />} />
              <Route path="/tiktok" element={<TikTok />} />
              <Route path="/create" element={<Feed />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
