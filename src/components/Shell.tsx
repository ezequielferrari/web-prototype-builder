import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Home, BookOpen, Mic, Pencil, Sparkles, LayoutDashboard, HeartPulse, MessageCircle, UserCog, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

// Marco tipo celular: en computadora la app se ve centrada como un teléfono.
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { state } = useStore();
  return (
    <div className="min-h-screen w-full flex justify-center bg-[radial-gradient(circle_at_20%_10%,#efe6ff,transparent_45%),radial-gradient(circle_at_85%_90%,#ffe8d9,transparent_45%)] bg-paper">
      <div
        className={`relative w-full max-w-[430px] min-h-screen bg-paper sm:shadow-2xl sm:border-x sm:border-line ${
          state.upperCase ? "case-upper" : ""
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

const KID_NAV = [
  { path: "/inicio", icon: Home, label: "Inicio" },
  { path: "/biblioteca", icon: BookOpen, label: "Cuentos" },
  { path: "/leer", icon: Mic, label: "Leer" },
  { path: "/crear", icon: Pencil, label: "Crear" },
  { path: "/lumi", icon: Sparkles, label: "Lumi" },
];

const FAMILY_NAV = [
  { path: "/familia", icon: LayoutDashboard, label: "Panel" },
  { path: "/familia/bienestar", icon: HeartPulse, label: "Bienestar" },
  { path: "/familia/chat", icon: MessageCircle, label: "Chat" },
  { path: "/familia/perfil", icon: UserCog, label: "Perfil" },
  { path: "/inicio", icon: LogOut, label: "Salir" },
];

function BottomNav({ items, layoutId }: { items: typeof KID_NAV; layoutId: string }) {
  const [location, go] = useLocation();
  const { setFamilyUnlocked } = useStore();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 bg-paper/90 backdrop-blur border-t border-line">
      <ul className="flex justify-around">
        {items.map((it) => {
          const active = location === it.path || (it.path !== "/familia" && it.path !== "/inicio" && location.startsWith(it.path + "/"));
          return (
            <li key={it.path}>
              <button
                onClick={() => {
                  if (it.label === "Salir") setFamilyUnlocked(false);
                  go(it.path);
                }}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[60px]"
              >
                {active && (
                  <motion.span layoutId={layoutId} className="absolute inset-0 rounded-2xl bg-grape-soft" transition={{ type: "spring", bounce: 0.3, duration: 0.4 }} />
                )}
                <it.icon size={24} strokeWidth={active ? 2.6 : 2} className={`relative ${active ? "text-grape" : "text-ink-soft"}`} />
                <span className={`relative text-xs font-extrabold ${active ? "text-grape" : "text-ink-soft"}`}>{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function UsageBanner() {
  const { state } = useStore();
  const left = state.dailyLimit - state.usageToday;
  if (left > 5) return null;
  return (
    <div role="status" className={`mx-4 mt-3 rounded-2xl px-4 py-2.5 font-bold text-sm flex items-center gap-2 ${left <= 0 ? "bg-coral text-white" : "bg-sun-soft text-ink"}`}>
      <span className="text-xl">{left <= 0 ? "🌙" : "⏰"}</span>
      {left <= 0
        ? "¡Llegaste a tu tiempo de hoy! Es un buen momento para jugar afuera."
        : `Te quedan ${left} minutos de Panka por hoy.`}
    </div>
  );
}

export function KidLayout({ children }: { children: ReactNode }) {
  return (
    <PhoneFrame>
      <UsageBanner />
      <main className="pb-28">{children}</main>
      <BottomNav items={KID_NAV} layoutId="kid-nav" />
    </PhoneFrame>
  );
}

export function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <PhoneFrame className="bg-[#f7f8fc]">
      <div className="bg-ink text-white text-xs font-extrabold tracking-wide text-center py-1.5">ZONA FAMILIAS</div>
      <main className="pb-28">{children}</main>
      <BottomNav items={FAMILY_NAV} layoutId="family-nav" />
    </PhoneFrame>
  );
}
