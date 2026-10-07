import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Flame, Lock, Star } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { Card, PageHeader, ResetDemo } from "@/components/ui";
import { BADGES, LEVEL_NAMES } from "@/lib/content";
import { useStore } from "@/lib/store";

const WEEK = [
  { d: "L", min: 12 },
  { d: "M", min: 18 },
  { d: "X", min: 9 },
  { d: "J", min: 22 },
  { d: "V", min: 15 },
  { d: "S", min: 25 },
  { d: "D", min: 0 },
];

export default function Perfil() {
  const [, go] = useLocation();
  const { state, update } = useStore();
  const child = state.child!;
  const level = state.diagnostic?.level ?? 1;
  const read = Object.values(state.bookProgress).filter((p) => p === 100).length;
  const week = WEEK.map((w, i) => (i === 6 ? { ...w, min: state.usageToday } : w));

  return (
    <div>
      <PageHeader title="Mi perfil" back="/inicio" />
      <div className="px-5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-grape-soft to-sun-soft border-4 border-white shadow-lg flex items-center justify-center text-6xl"
          >
            {child.avatar}
          </motion.div>
          <div>
            <h2 className="text-3xl font-black">{child.name}</h2>
            <p className="font-bold text-ink-soft">{child.age} años</p>
            <span className="inline-block mt-1 rounded-xl bg-grape text-white font-extrabold text-sm px-3 py-1">
              Nivel {level} · {LEVEL_NAMES[level]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Star className="text-sun fill-sun" />} value={state.stars} label="estrellas" bg="bg-sun-soft" />
          <Stat icon={<Flame className="text-coral fill-coral" />} value={`${state.streak} días`} label="seguidos leyendo" bg="bg-coral-soft" />
          <Stat icon={<span className="text-2xl">📚</span>} value={read} label="cuentos leídos" bg="bg-grape-soft" />
          <Stat icon={<span className="text-2xl">✏️</span>} value={state.stories.length} label="cuentos creados" bg="bg-mint-soft" />
        </div>

        <Card className="p-5">
          <h3 className="font-black text-lg mb-2">Minutos leyendo esta semana</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={week} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-week" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" interval={0} axisLine={false} tickLine={false} tick={{ fontWeight: 800, fill: "#5b6688" }} />
                <Area type="monotone" dataKey="min" stroke="#8b5cf6" strokeWidth={3} fill="url(#g-week)" dot={{ r: 4, fill: "#8b5cf6" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <section>
          <div className="flex justify-between items-baseline mb-3">
            <h3 className="font-black text-xl">Mis medallas</h3>
            <span className="font-extrabold text-grape">{state.badges.length}/{BADGES.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => {
              const on = state.badges.includes(b.id);
              return (
                <div key={b.id} className={`rounded-3xl p-3 flex flex-col items-center text-center gap-1 border-2 ${on ? "bg-white border-sun" : "bg-line/40 border-transparent"}`} title={b.desc}>
                  <span className={`text-4xl ${on ? "" : "grayscale opacity-40"}`}>{on ? b.emoji : "🔒"}</span>
                  <span className={`text-xs font-extrabold leading-tight ${on ? "" : "text-ink-soft"}`}>{b.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <Card className="p-5">
          <h3 className="font-black text-lg">Letras para leer</h3>
          <p className="text-sm font-semibold text-ink-soft mb-3">Elegí cómo querés ver los cuentos.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { upper: true, label: "MAYÚSCULAS", sample: "OSO" },
              { upper: false, label: "minúsculas", sample: "oso" },
            ].map((o) => (
              <button
                key={o.label}
                onClick={() => update(() => ({ upperCase: o.upper }))}
                aria-pressed={state.upperCase === o.upper}
                className={`rounded-2xl border-4 py-3 flex flex-col items-center ${state.upperCase === o.upper ? "border-grape bg-grape-soft" : "border-line bg-white"}`}
              >
                <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-read)" }}>{o.sample}</span>
                <span className="text-xs font-extrabold">{o.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <button onClick={() => go("/familia")} className="rounded-3xl bg-ink text-white p-4 font-extrabold flex items-center justify-center gap-2">
          <Lock size={18} /> Zona familias
        </button>
        <ResetDemo />
      </div>
    </div>
  );
}

function Stat({ icon, value, label, bg }: { icon: React.ReactNode; value: React.ReactNode; label: string; bg: string }) {
  return (
    <div className={`${bg} rounded-3xl p-4`}>
      {icon}
      <p className="text-2xl font-black mt-1">{value}</p>
      <p className="text-sm font-bold text-ink-soft">{label}</p>
    </div>
  );
}
