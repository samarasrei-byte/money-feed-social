import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Dark mode mesh background — matches landing page */}
      <div className="fixed inset-0 pointer-events-none dark:block hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[hsl(330,81%,60%)] opacity-[0.06] blur-[150px]" />
        <div className="absolute top-[40%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-[hsl(270,91%,65%)] opacity-[0.04] blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[hsl(25,95%,53%)] opacity-[0.04] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
      </div>

      <Header />
      <main className="pb-16 md:pb-4 relative z-10">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
