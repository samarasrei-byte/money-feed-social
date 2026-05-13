import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { memo } from "react";

const MeshBackground = memo(() => (
  <div className="fixed inset-0 pointer-events-none dark:block hidden overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#ff2e68] opacity-[0.05] blur-[180px] will-change-transform animate-float" />
    <div className="absolute top-[40%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-[#9d4eff] opacity-[0.04] blur-[180px] will-change-transform animate-float" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#00f2ff] opacity-[0.03] blur-[150px] will-change-transform animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute inset-0 opacity-[0.012] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
  </div>
));

MeshBackground.displayName = "MeshBackground";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <MeshBackground />
      <Header />
      <main className="pb-16 md:pb-4 relative z-10">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}