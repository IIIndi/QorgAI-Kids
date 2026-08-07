import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AgeGroup = "8-9" | "10-11";
export type Profile = { name: string; age: AgeGroup; createdAt: string; lang?: string };

const KEY = "qorgai-profile-v1";

type Ctx = {
  profile: Profile | null;
  ready: boolean;
  save: (p: { name: string; age: AgeGroup }) => void;
  update: (p: Partial<Pick<Profile, "name" | "age" | "lang">>) => void;
  signOut: () => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile(JSON.parse(raw) as Profile);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const save = (p: { name: string; age: AgeGroup }) => {
    const next: Profile = {
      name: p.name.trim().slice(0, 24),
      age: p.age,
      createdAt: new Date().toISOString(),
    };
    setProfile(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const update = (p: Partial<Pick<Profile, "name" | "age" | "lang">>) => {
    setProfile((cur) => {
      if (!cur) return cur;
      const next = { ...cur, ...p };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const signOut = () => {
    setProfile(null);
    localStorage.removeItem(KEY);
  };

  return (
    <ProfileContext.Provider value={{ profile, ready, save, update, signOut }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
