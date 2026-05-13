import { Link } from "react-router-dom";
import { Bell, Search, Link2, Shield, MessageSquare } from "lucide-react";
import { CartSheet } from "@/components/cart/CartSheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { APP_NAME } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import logoImg from "@/assets/color-palette-ref.png";
import { memo } from "react";

export const Header = memo(function Header() {
  const { user, profile, userRole, signOut } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  const initials = profile?.display_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

  const notifText = (type: string, actor?: string) => {
    switch (type) {
      case "like": return `${actor || "Alguém"} curtiu seu post`;
      case "comment": return `${actor || "Alguém"} comentou no seu post`;
      case "follow": return `${actor || "Alguém"} começou a te seguir`;
      default: return `${actor || "Alguém"} interagiu com você`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass safe-area-inset-top border-b border-white/[0.04]">
      <div className="flex h-12 items-center justify-between px-4 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-2.5 tap group">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center group-hover:rotate-6 transition-transform shadow-sm">
            <img src={logoImg} alt={APP_NAME} className="h-5.5 w-5.5 rounded-[4px] object-cover" />
          </div>
          <span className="font-black italic text-base tracking-tighter uppercase text-foreground">Only Shop</span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30" />
            <input
              type="text"
              placeholder="Buscar conteúdos..."
              className="w-full h-8 pl-9 pr-4 rounded-full bg-muted/30 border-0 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 font-medium"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <div className="hidden md:block">
            <InstallPrompt variant="compact" />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 rounded-full text-muted-foreground/50">
            <Search className="h-4 w-4" />
          </Button>

          {user && (
            <>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full text-muted-foreground/60 tap">
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
              <CartSheet />
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full text-muted-foreground/60 tap">
                <Link to="/affiliate">
                  <Link2 className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {/* Notifications */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full text-muted-foreground/60 tap" onClick={() => unreadCount > 0 && markAllRead()}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-3.5 min-w-[14px] bg-primary text-primary-foreground text-[8px] font-black rounded-full flex items-center justify-center px-0.5 ring-2 ring-background">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-80 rounded-3xl border-border/30 shadow-2xl backdrop-blur-3xl bg-background/95 mt-2 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/30">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-40">Notificações</p>
              </div>
              <ScrollArea className="max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="px-4 py-12 text-center text-xs text-muted-foreground/40">
                    <Bell className="h-8 w-8 mx-auto mb-3 opacity-10" />
                    Nenhuma notificação ainda
                  </div>
                ) : (
                  <div className="py-1">
                    {notifications.slice(0, 20).map((n) => (
                      <DropdownMenuItem key={n.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer focus:bg-muted/30 transition-colors">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={n.actor?.avatarUrl} />
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground/60 font-bold">
                            {(n.actor?.displayName || "U").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] leading-snug font-medium text-foreground/90">
                            <span className="font-bold text-foreground">{n.actor?.displayName || "Usuário"}</span> {notifText(n.type).replace(n.actor?.displayName || "Alguém", "").trim()}
                          </p>
                          <p className="text-[10px] text-muted-foreground/30 mt-1 font-medium">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                        {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />}
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-1 tap">
                  <Avatar className="h-7 w-7 border border-white/5">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-muted text-foreground/60 text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-3xl border-border/30 shadow-2xl backdrop-blur-3xl bg-background/95 mt-2 overflow-hidden">
                <div className="px-4 py-3">
                  <p className="text-[13px] font-bold truncate">{profile?.display_name || "Usuário"}</p>
                  <p className="text-[10px] text-muted-foreground/40 truncate font-medium">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/30" />
                <div className="py-1">
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/profile">Meu Perfil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/invites">Convites de marcas</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/discover">Smart Match</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/trending">🔥 Em Alta</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/affiliate">Painel Afiliados</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/brands">Área de Marcas</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30"><Link to="/settings">Configurações</Link></DropdownMenuItem>
                  {userRole?.role === "admin" && (
                    <DropdownMenuItem asChild className="text-[12px] py-2 px-4 focus:bg-muted/30 text-primary font-bold">
                      <Link to="/admin" className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" />Painel Admin</Link>
                    </DropdownMenuItem>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem onClick={signOut} className="text-[12px] py-2 px-4 text-destructive focus:bg-destructive/10 font-bold">Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="h-8 text-[11px] bg-foreground text-background hover:bg-foreground/90 border-0 rounded-full px-5 ml-2 font-bold tap shadow-lg">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";