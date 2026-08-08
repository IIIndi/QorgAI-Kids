import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Ctx = { userId: string | null; ready: boolean };

const AuthContext = createContext<Ctx>({ userId: null, ready: false });

/**
 * Каждое устройство получает постоянный анонимный аккаунт в Lovable Cloud.
 * Весь прогресс привязан к его user id, поэтому переживает перезагрузку страницы
 * и выход из детского профиля.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUserId(session?.user.id ?? null);
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      let id = data.session?.user.id ?? null;
      if (!id) {
        const { data: anon } = await supabase.auth.signInAnonymously();
        id = anon.session?.user.id ?? null;
      }
      if (!active) return;
      setUserId(id);
      setReady(true);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ userId, ready }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
