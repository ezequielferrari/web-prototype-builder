import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Check, Lock, Star } from "lucide-react";
import Lumi from "@/components/Lumi";
import { Card, ProgressBar, SpeechBubble } from "@/components/ui";
import { BOOKS, ageToBand } from "@/lib/content";
import { useStore } from "@/lib/store";

const TILES = [
  { path: "/biblioteca", emoji: "📚", label: "Cuentos", desc: "Leé y escuchá", color: "bg-grape-soft" },
  { path: "/leer", emoji: "🎤", label: "Leer en voz alta", desc: "Ganá estrellas", color: "bg-coral-soft" },
  { path: "/crear", emoji: "✏️", label: "Crear", desc: "Inventá tu cuento", color: "bg-sun-soft" },
  { path: "/lumi", emoji: "✨", label: "Charlar con Lumi", desc: "Tu amiga luciérnaga", color: "bg-mint-soft" },
  { path: "/actividades", emoji: "🌳", label: "Fuera de la pantalla", desc: "Jugá en casa", color: "bg-sky-soft" },
  { path: "/aprendi", emoji: "💭", label: "¿Qué aprendí hoy?", desc: "Contale a Lumi", color: "bg-grape-soft" },
];

const MISSIONS = [
  { badge: "voz-clara", label: "Leer una frase en voz alta", path: "/leer" },
  { badge: "escritor", label: "Crear un cuento", path: "/crear" },
  { badge: "explorador", label: "Una actividad fuera de la pantalla", path: "/actividades" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export default function Inicio() {
  const [, go] = useLocation();
  const { state } = useStore();
  const child = state.child!;
  const done = MISSIONS.filter((m) => state.badges.includes(m.badge)).length;
  const band = ageToBand(child.age);
  const level = state.diagnostic?.level ?? 1;
  const continueBooks = BOOKS.filter((b) => (state.bookProgress[b.id] ?? 0) > 0 && state.bookProgress[b.id] < 100);
  const recommended = BOOKS.filter((b) => b.age === band && b.level <= level + 1 && !continueBooks.includes(b)).slice(0, 3);
  const shelf = [...continueBooks, ...recommended];
  const usagePct = (state.usageToday / state.dailyLimit) * 100;
  const tip =
    done === MISSIONS.length
      ? "¡Completaste todas las misiones de hoy! Sos una estrella."
      : `Hoy tenés ${MISSIONS.length - done} ${MISSIONS.length - done === 1 ? "misión" : "misiones"} para hacer. ¿Arrancamos?`;

  return (
    <div className="px-5 pt-5">
      <header className="flex items-center gap-3">
        <button onClick={() => go("/perfil")} aria-label="Mi perfil" className="w-14 h-14 rounded-2xl bg-white border-2 border-line text-3xl flex items-center justify-center">
          {child.avatar}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-ink-soft font-bold leading-none">¡Hola,</p>
          <h1 className="text-3xl font-black truncate">{child.name}!</h1>
        </div>
        <div className="flex items-center gap-1 bg-sun-soft rounded-2xl px-3 py-2 font-black text-lg" aria-label={`${state.stars} estrellas`}>
          <Star className="text-sun fill-sun" size={22} /> {state.stars}
        </div>
        <button onClick={() => go("/familia")} aria-label="Zona familias" className="w-11 h-11 rounded-2xl bg-white border border-line flex items-center justify-center text-ink-soft">
          <Lock size={18} />
        </button>
      </header>

      <div className="flex items-end gap-1 mt-4">
        <Lumi size={92} mood={done === MISSIONS.length ? "cheer" : "happy"} />
        <SpeechBubble className="flex-1 mb-5">{tip}</SpeechBubble>
      </div>

      {!state.diagnostic && (
        <Card onClick={() => go("/diagnostico")} className="p-4 mt-2 flex items-center gap-3 bg-sun-soft border-sun/40">
          <span className="text-4xl">🎯</span>
          <span className="flex-1">
            <span className="block font-black">Jugá el juego inicial</span>
            <span className="block text-sm font-semibold text-ink-soft">Así Lumi elige cuentos para vos</span>
          </span>
        </Card>
      )}

      <section className="mt-4 rounded-3xl p-5 text-white bg-gradient-to-br from-grape to-[#b26bff] shadow-[0_6px_0_var(--color-grape-dark)]" aria-label="Misiones de hoy">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-black">Misiones de hoy</h2>
          <span className="font-black bg-white/20 rounded-xl px-3 py-1">{done}/{MISSIONS.length}</span>
        </div>
        <ul className="flex flex-col gap-2">
          {MISSIONS.map((m) => {
            const ok = state.badges.includes(m.badge);
            return (
              <li key={m.badge}>
                <button onClick={() => go(m.path)} className="w-full flex items-center gap-3 bg-white/15 rounded-2xl px-3 py-2.5 text-left font-bold">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-sun text-ink" : "border-2 border-white/60"}`}>
                    {ok && <Check size={18} strokeWidth={3} />}
                  </span>
                  <span className={ok ? "line-through opacity-75" : ""}>{m.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4">
          <div className="flex justify-between text-sm font-bold mb-1 opacity-90">
            <span>Tiempo de hoy</span>
            <span>{state.usageToday} de {state.dailyLimit} min</span>
          </div>
          <ProgressBar value={usagePct} color={usagePct >= 85 ? "bg-coral" : "bg-sun"} className="h-2.5 bg-white/25" />
        </div>
      </section>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 mt-6">
        {TILES.map((t) => (
          <motion.button
            key={t.path}
            variants={item}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(t.path)}
            className={`${t.color} rounded-3xl p-4 text-left min-h-32 flex flex-col justify-between border-2 border-white shadow-[0_4px_0_var(--color-line)]`}
          >
            <span className="text-4xl">{t.emoji}</span>
            <span>
              <span className="block font-black leading-tight">{t.label}</span>
              <span className="block text-sm font-semibold text-ink-soft">{t.desc}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>

      <div className="flex items-center justify-between mt-7 mb-3">
        <h2 className="text-xl font-black">Para leer ahora</h2>
        <button onClick={() => go("/biblioteca")} className="font-extrabold text-grape">Ver todos</button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {shelf.map((b) => {
          const p = state.bookProgress[b.id] ?? 0;
          return (
            <motion.button key={b.id} whileTap={{ scale: 0.95 }} onClick={() => go(`/biblioteca/${b.id}`)} className="shrink-0 w-36 text-left">
              <div className={`h-40 rounded-3xl bg-gradient-to-br ${b.cover} flex items-center justify-center text-6xl relative overflow-hidden`}>
                {b.emoji}
                {p > 0 && (
                  <div className="absolute bottom-0 inset-x-0 h-2 bg-white/40">
                    <div className="h-full bg-white" style={{ width: `${p}%` }} />
                  </div>
                )}
              </div>
              <p className="font-extrabold leading-tight mt-2">{b.title}</p>
              <p className="text-sm font-semibold text-ink-soft">{p > 0 ? `Vas por el ${p}%` : `${b.minutes} min`}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
