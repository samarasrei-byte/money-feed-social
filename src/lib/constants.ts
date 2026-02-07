// App constants
export const APP_NAME = "Only Shop";
export const APP_TAGLINE = "A rede social onde o feed gera dinheiro";

// Plan tiers
export const PLAN_TIERS = {
  FREE: 0,
  STARTER: 1,
  PARTNER: 2,
  BUSINESS: 3,
  PRO: 4,
} as const;

// User roles
export const USER_ROLES = {
  VIEWER: "viewer",
  LEARNER: "learner",
  AFFILIATE: "affiliate",
  AGENCY: "agency",
  BRAND: "brand",
  ADMIN: "admin",
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: "Feed", href: "/feed", icon: "Home" },
  { label: "Comunidades", href: "/communities", icon: "Users" },
  { label: "Ranking", href: "/ranking", icon: "Trophy" },
  { label: "Perfil", href: "/profile", icon: "User" },
] as const;

export const PROTECTED_ROUTES = [
  "/feed",
  "/profile",
  "/dashboard",
  "/communities",
  "/affiliate",
] as const;
