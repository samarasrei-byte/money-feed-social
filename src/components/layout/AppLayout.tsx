import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  const location = useLocation();
  const isFullscreenRoute = location.pathname === "/feed";

  return (
    <div className="min-h-screen bg-background">
      {!isFullscreenRoute && <Header />}
      <main className={isFullscreenRoute 
        ? "h-screen pb-16 md:pb-0" 
        : "container px-4 py-4 pb-20 md:pb-4"
      }>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
