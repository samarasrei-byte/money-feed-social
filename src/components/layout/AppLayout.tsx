import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-4 pb-20 md:pb-4">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
