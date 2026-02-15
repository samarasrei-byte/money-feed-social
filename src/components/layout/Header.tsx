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

export function Header() {
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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/40 safe-area-inset-top">
      <div className="container flex h-11 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/feed" className="flex items-center">
          <img src={logoImg} alt="OnlyShop" className="h-8 w-8 rounded-lg object-cover" />
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full h-8 pl-9 pr-4 rounded-lg bg-muted/40 border-0 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <div className="hidden md:block">
            <InstallPrompt variant="compact" />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 rounded-lg">
            <Search className="h-4 w-4" />
          </Button>

          {user && (
            <>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
              <CartSheet />
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                <Link to="/affiliate">
                  <Link2 className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg" onClick={markAllRead}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-xl">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-semibold">Notificações</p>
              </div>
              <ScrollArea className="max-h-80">
                {notifications.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.slice(0, 20).map((n) => (
                    <DropdownMenuItem key={n.id} className="flex items-start gap-3 px-3 py-2.5 cursor-pointer">
                      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                        <AvatarImage src={n.actor?.avatarUrl} />
                        <AvatarFallback className="text-xs bg-gradient-primary text-white">
                          {(n.actor?.displayName || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-tight">
                          {notifText(n.type, n.actor?.displayName)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                      {!n.read && <div className="h-2 w-2 rounded-full bg-gradient-primary shrink-0 mt-1.5" />}
                    </DropdownMenuItem>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-7 w-7 ring-1.5 ring-border">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-muted text-foreground text-[10px] font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.display_name || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile">Meu Perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/affiliate">Painel Afiliados</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/brands">Área de Marcas</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/products">Produtos</Link></DropdownMenuItem>
                {userRole?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2"><Shield className="h-4 w-4" />Painel Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild><Link to="/install">Instalar App</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 border-0 rounded-lg px-3">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
