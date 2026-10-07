import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export function celebrate() {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors: ["#8b5cf6", "#ff6b5b", "#fbb424", "#1fb58f", "#3b9df5"],
    disableForReducedMotion: true,
  });
}

type Variant = "primary" | "soft" | "ghost" | "coral" | "mint";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-grape text-white shadow-[0_6px_0_var(--color-grape-dark)] active:shadow-[0_2px_0_var(--color-grape-dark)] active:translate-y-1",
  coral: "bg-coral text-white shadow-[0_6px_0_#d94a3c] active:shadow-[0_2px_0_#d94a3c] active:translate-y-1",
  mint: "bg-mint text-white shadow-[0_6px_0_#16896b] active:shadow-[0_2px_0_#16896b] active:translate-y-1",
  soft: "bg-grape-soft text-grape-dark",
  ghost: "bg-white text-ink border-2 border-line",
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "lg";
  full?: boolean;
}

export function Button({ variant = "primary", size = "lg", full, className = "", children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition-all disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 ${
        size === "lg" ? "px-6 py-4 text-lg" : "px-4 py-2.5 text-base"
      } ${full ? "w-full" : ""} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ className = "", children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  const base = `rounded-3xl bg-white border border-line shadow-[0_2px_0_var(--color-line)] ${className}`;
  if (onClick) {
    return (
      <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} className={`${base} text-left w-full`}>
        {children}
      </motion.button>
    );
  }
  return <div className={base}>{children}</div>;
}

export function ProgressBar({ value, color = "bg-grape", className = "h-3" }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`w-full rounded-full bg-line/70 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold border-2 transition-colors ${
        active ? "bg-grape border-grape text-white" : "bg-white border-line text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, back, right }: { title: string; subtitle?: string; back?: string; right?: ReactNode }) {
  const [, go] = useLocation();
  return (
    <header className="flex items-start gap-3 px-5 pt-6 pb-4">
      {back && (
        <button
          onClick={() => go(back)}
          aria-label="Volver"
          className="mt-1 w-10 h-10 shrink-0 rounded-2xl bg-white border border-line flex items-center justify-center"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-[28px] leading-tight font-black">{title}</h1>
        {subtitle && <p className="text-ink-soft font-semibold mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function SpeechBubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative bg-white border-2 border-line rounded-3xl px-4 py-3 font-bold ${className}`}>
      {children}
      <span className="absolute -left-2 top-6 w-4 h-4 bg-white border-l-2 border-b-2 border-line rotate-45" />
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[400px] px-4 flex flex-col gap-2 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-ink text-white rounded-2xl px-4 py-3 font-bold shadow-xl flex items-center gap-3"
          >
            {t.emoji && <span className="text-2xl">{t.emoji}</span>}
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Simula una grabación de audio: devuelve una onda animada. */
export function SoundWave({ color = "bg-coral", bars = 14 }: { color?: string; bars?: number }) {
  return (
    <div className="flex items-center gap-1 h-10" aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <motion.span
          key={i}
          className={`w-1.5 rounded-full ${color}`}
          animate={{ height: [6, 10 + ((i * 7) % 26), 6] }}
          transition={{ duration: 0.5 + (i % 4) * 0.12, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

/** Reinicia la demo con una confirmación dentro de la página (sin ventanas del navegador). */
export function ResetDemo({ className = "" }: { className?: string }) {
  const { reset } = useStore();
  const [, go] = useLocation();
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button onClick={() => setAsking(true)} className={`flex items-center justify-center gap-2 text-sm font-bold text-ink-soft py-2 ${className}`}>
        <RotateCcw size={14} /> Reiniciar la demo
      </button>
    );
  }
  return (
    <div className={`rounded-2xl bg-coral-soft p-3 flex flex-col gap-2 ${className}`} role="alertdialog" aria-label="Confirmar reinicio">
      <p className="font-bold text-sm text-center">¿Borrar todo y empezar la demo de cero?</p>
      <div className="flex gap-2">
        <button onClick={() => setAsking(false)} className="flex-1 rounded-xl bg-white border border-line py-2 font-extrabold">Cancelar</button>
        <button
          onClick={() => {
            reset();
            go("/");
          }}
          className="flex-1 rounded-xl bg-coral text-white py-2 font-extrabold"
        >
          Sí, reiniciar
        </button>
      </div>
    </div>
  );
}
