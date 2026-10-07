import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ActivityKind, Level } from "./content";

// Estado de la demo. Se guarda en el navegador (localStorage) para que la
// demo "recuerde" lo que se hizo, sin necesidad de backend.

export interface ChildProfile {
  name: string;
  age: number; // 5 a 8
  avatar: string;
  interests: string[];
}

export interface FamilyProfile {
  adultName: string;
  relation: string;
  context: string;
  location: string;
  culture: string;
  readingPrefs: string[];
}

export interface Diagnostic {
  level: Level;
  scores: { comprension: number; escritura: number; oralidad: number };
}

export interface Reflection {
  date: string;
  text: string;
  kind: "texto" | "audio";
}

export interface CreatedStory {
  id: string;
  title: string;
  character: string;
  place: string;
  text: string;
  stickers: string[];
}

export interface ChatMessage {
  from: "me" | "bot";
  text: string;
  audio?: boolean;
  time: string;
}

export interface AppState {
  child: ChildProfile | null;
  family: FamilyProfile | null;
  diagnostic: Diagnostic | null;
  dailyLimit: number; // minutos
  usageToday: number; // minutos (simulado)
  upperCase: boolean;
  stars: number;
  streak: number;
  badges: string[];
  favorites: string[];
  bookProgress: Record<string, number>; // 0 a 100
  completedActivities: Record<string, ActivityKind>;
  reflections: Reflection[];
  stories: CreatedStory[];
  habits: number[];
  familyChat: ChatMessage[];
}

export const DEFAULT_STATE: AppState = {
  child: null,
  family: null,
  diagnostic: null,
  dailyLimit: 30,
  usageToday: 12,
  upperCase: true,
  stars: 24,
  streak: 6,
  badges: ["primer-cuento"],
  favorites: ["dragon"],
  bookProgress: { "oso-miel": 100, dragon: 40, tortuga: 70 },
  completedActivities: {},
  reflections: [],
  stories: [],
  habits: [0, 3],
  familyChat: [],
};

const STORAGE_KEY = "panka.demo.v1";

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // Sin almacenamiento disponible: la demo arranca de cero.
  }
  return DEFAULT_STATE;
}

interface Toast {
  id: number;
  text: string;
  emoji?: string;
}

interface Store {
  state: AppState;
  update: (fn: (s: AppState) => Partial<AppState>) => void;
  earnStars: (n: number) => void;
  unlockBadge: (id: string) => void;
  toast: (text: string, emoji?: string) => void;
  toasts: Toast[];
  familyUnlocked: boolean;
  setFamilyUnlocked: (v: boolean) => void;
  reset: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [familyUnlocked, setFamilyUnlocked] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignorado a propósito: la demo sigue funcionando en memoria.
    }
  }, [state]);

  const update = useCallback((fn: (s: AppState) => Partial<AppState>) => {
    setState((s) => ({ ...s, ...fn(s) }));
  }, []);

  const toast = useCallback((text: string, emoji?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, emoji }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const earnStars = useCallback((n: number) => update((s) => ({ stars: s.stars + n })), [update]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const unlockBadge = useCallback(
    (id: string) => {
      if (stateRef.current.badges.includes(id)) return;
      update((s) => (s.badges.includes(id) ? {} : { badges: [...s.badges, id] }));
      setTimeout(() => toast("¡Ganaste una medalla nueva!", "🏅"), 400);
    },
    [update, toast],
  );

  // Cada minuto de uso real suma un minuto al contador de bienestar.
  useEffect(() => {
    const t = setInterval(() => update((s) => ({ usageToday: s.usageToday + 1 })), 60_000);
    return () => clearInterval(t);
  }, [update]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    setFamilyUnlocked(false);
  }, []);

  const value = useMemo(
    () => ({ state, update, earnStars, unlockBadge, toast, toasts, familyUnlocked, setFamilyUnlocked, reset }),
    [state, update, earnStars, unlockBadge, toast, toasts, familyUnlocked, reset],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

export function nowTime() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}
