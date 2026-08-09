import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type AgeGroup = "8-9" | "10-11" | "other";
export type Profile = { name: string; age: AgeGroup; createdAt: string; lang?: string };

const KEY = "qorgai-profile-v1";
const NAME_KEY = "qorgai_child_name";
const AGE_KEY = "qorgai_age_group";

const AGES: AgeGroup[] = ["8-9", "10-11", "other"];
const asAge = (v: unknown): AgeGroup => (AGES.includes(v as AgeGroup) ? (v as AgeGroup) : "8-9");

type Ctx = {
  profile: Profile | null;
  ready: boolean;
  save: (p: { name: string; age: AgeGroup }) => void;
  update: (p: Partial<Pick<Profile, "name" | "age" | "lang">>) => void;
  signOut: () => void;
};

const ProfileContext = createContext<Ctx | null>(null);

function readLocal(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Profile;
      if (p?.name) return { ...p, age: asAge(p.age) };
    }
    // Запасной путь: отдельные простые ключи хранения.
    const name = localStorage.getItem(NAME_KEY);
    if (name) {
      return { name, age: asAge(localStorage.getItem(AGE_KEY)), createdAt: new Date().toISOString() };
    }
    return null;
  } catch {
    return null;
  }
}

function writeLocal(p: Profile | null) {
  try {
    if (p) {
      localStorage.setItem(KEY, JSON.stringify(p));
      localStorage.setItem(NAME_KEY, p.name);
      localStorage.setItem(AGE_KEY, p.age);
    } else {
      localStorage.removeItem(KEY);
      localStorage.removeItem(NAME_KEY);
      localStorage.removeItem(AGE_KEY);
    }
  } catch {
    /* ignore */
  }
}


export function ProfileProvider({ children }: { children: ReactNode }) {
  const { userId, ready: authReady } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  // Загружаем сохранённый профиль из базы; локальные данные переносим в облако один раз.
  useEffect(() => {
    if (!authReady) return;
    let active = true;

    void (async () => {
      const local = readLocal();
      if (!userId) {
        if (active) {
          setProfile(local);
          setReady(true);
        }
        return;
      }

      const { data } = await supabase
        .from("child_profiles")
        .select("name, age, lang, created_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (!active) return;

      if (data && data.name) {
        const loaded: Profile = {
          name: data.name,
          age: (data.age as AgeGroup) ?? "8-9",
          createdAt: data.created_at,
          lang: data.lang,
        };
        setProfile(loaded);
        localStorage.setItem(KEY, JSON.stringify(loaded));
      } else if (local) {
        setProfile(local);
        await supabase.from("child_profiles").upsert({
          user_id: userId,
          name: local.name,
          age: local.age,
          lang: local.lang ?? "ru",
        });
      }
      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, [authReady, userId]);

  const persist = (next: Profile | null) => {
    setProfile(next);
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
    if (!userId) return;
    if (next) {
      void supabase.from("child_profiles").upsert({
        user_id: userId,
        name: next.name,
        age: next.age,
        lang: next.lang ?? "ru",
      });
    } else {
      void supabase.from("child_profiles").update({ name: "" }).eq("user_id", userId);
    }
  };

  const save = (p: { name: string; age: AgeGroup }) =>
    persist({
      name: p.name.trim().slice(0, 24),
      age: p.age,
      createdAt: new Date().toISOString(),
      lang: profile?.lang ?? "ru",
    });

  const update = (p: Partial<Pick<Profile, "name" | "age" | "lang">>) => {
    if (!profile) return;
    persist({ ...profile, ...p });
  };

  // Выход меняет только видимый профиль ребёнка — прогресс в базе сохраняется
  // и восстанавливается при следующем входе.
  const signOut = () => persist(null);

  return (
    <ProfileContext.Provider value={{ profile, ready, save, update, signOut }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
