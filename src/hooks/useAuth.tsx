import { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface UserRole {
  role: "viewer" | "learner" | "affiliate" | "agency" | "brand" | "admin";
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [{ data: profileData }, { data: roleData }] = await Promise.all([
        supabase.from("profiles").select("id, user_id, username, display_name, avatar_url, bio").eq("user_id", userId).single(),
        supabase.from("user_roles").select("role").eq("user_id", userId).single(),
      ]);

      if (profileData) setProfile(profileData as Profile);
      if (roleData) setUserRole(roleData as UserRole);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
        }

        if (event === "SIGNED_OUT") {
          setProfile(null);
          setUserRole(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signUp = useCallback(async (email: string, password: string, username?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });

      if (error) throw error;

      if (data.user && username) {
        await supabase.from("profiles").update({ username }).eq("user_id", data.user.id);
      }

      toast({
        title: "Conta criada!",
        description: "Verifique seu email para confirmar o cadastro.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Até logo!", description: "Você saiu da sua conta." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
    }
  }, [toast]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
      throw error;
    }
  }, [user, toast]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }), [user, session, profile, userRole, loading, signUp, signIn, signOut, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}