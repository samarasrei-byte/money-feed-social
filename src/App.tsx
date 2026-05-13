import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Lazy Pages
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Feed = lazy(() => import("./pages/Feed"));
const Profile = lazy(() => import("./pages/Profile"));
const Communities = lazy(() => import("./pages/Communities"));
const CommunityDetail = lazy(() => import("./pages/CommunityDetail"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Install = lazy(() => import("./pages/Install"));
const Admin = lazy(() => import("./pages/Admin"));
const BrandArea = lazy(() => import("./pages/BrandArea"));
const Products = lazy(() => import("./pages/Products"));
const TikTok = lazy(() => import("./pages/TikTok"));
const Chat = lazy(() => import("./pages/Chat"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const RedirectLink = lazy(() => import("./pages/RedirectLink"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const CourseLearn = lazy(() => import("./pages/CourseLearn"));
const CourseBuilder = lazy(() => import("./pages/CourseBuilder"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const Reels = lazy(() => import("./pages/Reels"));
const Live = lazy(() => import("./pages/Live"));
const LiveShop = lazy(() => import("./pages/LiveShop"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AICopilot = lazy(() => import("./pages/AICopilot"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Discover = lazy(() => import("./pages/Discover"));
const Trending = lazy(() => import("./pages/Trending"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Invites = lazy(() => import("./pages/Invites"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const VSL = lazy(() => import("./pages/VSL"));
const Pitch = lazy(() => import("./pages/Pitch"));
const OnlyShop = lazy(() => import("./pages/OnlyShop"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-primary/20" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Suspense fallback={<PageLoader />}><PageWrapper><Landing /></PageWrapper></Suspense>} />
        <Route path="/auth" element={<Suspense fallback={<PageLoader />}><PageWrapper><Auth /></PageWrapper></Suspense>} />
        <Route path="/install" element={<Suspense fallback={<PageLoader />}><PageWrapper><Install /></PageWrapper></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<PageLoader />}><PageWrapper><Terms /></PageWrapper></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PageWrapper><Privacy /></PageWrapper></Suspense>} />
        <Route path="/r/:code" element={<Suspense fallback={<PageLoader />}><PageWrapper><RedirectLink /></PageWrapper></Suspense>} />
        <Route path="/vsl" element={<Suspense fallback={<PageLoader />}><PageWrapper><VSL /></PageWrapper></Suspense>} />
        <Route path="/pitch" element={<Suspense fallback={<PageLoader />}><PageWrapper><Pitch /></PageWrapper></Suspense>} />
        
        {/* App routes with layout and protection */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/feed" element={<Suspense fallback={<PageLoader />}><PageWrapper><Feed /></PageWrapper></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<PageLoader />}><PageWrapper><Profile /></PageWrapper></Suspense>} />
            <Route path="/communities" element={<Suspense fallback={<PageLoader />}><PageWrapper><Communities /></PageWrapper></Suspense>} />
            <Route path="/communities/:id" element={<Suspense fallback={<PageLoader />}><PageWrapper><CommunityDetail /></PageWrapper></Suspense>} />
            <Route path="/ranking" element={<Suspense fallback={<PageLoader />}><PageWrapper><Ranking /></PageWrapper></Suspense>} />
            <Route path="/affiliate" element={<Suspense fallback={<PageLoader />}><PageWrapper><Affiliate /></PageWrapper></Suspense>} />
            <Route path="/wallet" element={<Suspense fallback={<PageLoader />}><PageWrapper><Wallet /></PageWrapper></Suspense>} />
            <Route path="/admin" element={<Suspense fallback={<PageLoader />}><PageWrapper><Admin /></PageWrapper></Suspense>} />
            <Route path="/brands" element={<Suspense fallback={<PageLoader />}><PageWrapper><BrandArea /></PageWrapper></Suspense>} />
            <Route path="/products" element={<Suspense fallback={<PageLoader />}><PageWrapper><Products /></PageWrapper></Suspense>} />
            <Route path="/opportunities" element={<Suspense fallback={<PageLoader />}><PageWrapper><Opportunities /></PageWrapper></Suspense>} />
            <Route path="/discover" element={<Suspense fallback={<PageLoader />}><PageWrapper><Discover /></PageWrapper></Suspense>} />
            <Route path="/trending" element={<Suspense fallback={<PageLoader />}><PageWrapper><Trending /></PageWrapper></Suspense>} />
            <Route path="/invites" element={<Suspense fallback={<PageLoader />}><PageWrapper><Invites /></PageWrapper></Suspense>} />
            <Route path="/u/:username" element={<Suspense fallback={<PageLoader />}><PageWrapper><PublicProfile /></PageWrapper></Suspense>} />
            <Route path="/post/:id" element={<Suspense fallback={<PageLoader />}><PageWrapper><PostDetail /></PageWrapper></Suspense>} />
            <Route path="/tiktok" element={<Suspense fallback={<PageLoader />}><PageWrapper><TikTok /></PageWrapper></Suspense>} />
            <Route path="/chat" element={<Suspense fallback={<PageLoader />}><PageWrapper><Chat /></PageWrapper></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><PageWrapper><Checkout /></PageWrapper></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<PageLoader />}><PageWrapper><Settings /></PageWrapper></Suspense>} />
            <Route path="/create" element={<Suspense fallback={<PageLoader />}><PageWrapper><Feed /></PageWrapper></Suspense>} />
            <Route path="/reels" element={<Suspense fallback={<PageLoader />}><PageWrapper><Reels /></PageWrapper></Suspense>} />
            <Route path="/live" element={<Suspense fallback={<PageLoader />}><PageWrapper><Live /></PageWrapper></Suspense>} />
            <Route path="/live/:id" element={<Suspense fallback={<PageLoader />}><PageWrapper><LiveShop /></PageWrapper></Suspense>} />
            <Route path="/marketplace" element={<Suspense fallback={<PageLoader />}><PageWrapper><Marketplace /></PageWrapper></Suspense>} />
            <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><PageWrapper><Analytics /></PageWrapper></Suspense>} />
            <Route path="/ai" element={<Suspense fallback={<PageLoader />}><PageWrapper><AICopilot /></PageWrapper></Suspense>} />
            <Route path="/courses" element={<Suspense fallback={<PageLoader />}><PageWrapper><Courses /></PageWrapper></Suspense>} />
            <Route path="/courses/:id" element={<Suspense fallback={<PageLoader />}><PageWrapper><CourseDetail /></PageWrapper></Suspense>} />
            <Route path="/courses/:id/learn" element={<Suspense fallback={<PageLoader />}><PageWrapper><CourseLearn /></PageWrapper></Suspense>} />
            <Route path="/courses/:id/builder" element={<Suspense fallback={<PageLoader />}><PageWrapper><CourseBuilder /></PageWrapper></Suspense>} />
            <Route path="/onlyshop" element={<Suspense fallback={<PageLoader />}><PageWrapper><OnlyShop /></PageWrapper></Suspense>} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;