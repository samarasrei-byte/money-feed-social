import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { memo } from "react";

const MeshBackground = memo(() => (
  <div className="fixed inset-0 pointer-events-none dark:block hidden overflow-hidden">
    <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[hsl(330,81%,60%)] opacity-[0.04] blur-[120px] will-change-transform" />
    <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[hsl(270,91%,65%)] opacity-[0.03] blur-[120px] will-change-transform" />
    <div className="absolute bottom-[-5%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-[hsl(25,95%,53%)] opacity-[0.03] blur-[100px] will-change-transform" />
    <div className="absolute inset-0 opacity-[0.008] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
  </div>
));

MeshBackground.displayName = "MeshBackground";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <MeshBackground />
      <Header />
      <main className="pb-16 md:pb-4 relative z-10">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}