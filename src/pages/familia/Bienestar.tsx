import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Plus, RotateCcw, Sun } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

const MESSAGES = [
  { emoji: "👀", text: "Cada 20 minutos, una pausa: mirar por la ventana descansa los ojos." },
  { emoji: "🤸", text: "Después de usar Panka, ¡a moverse! Saltar, bailar o salir al patio." },
  { emoji: "🌙", text: "Nada de pantallas una hora antes de dormir: mejor un cuento en papel." },
  { emoji: "🤝", text: "Las pantallas rinden más acompañadas: preguntá qué está leyendo." },
];

export default function Bienestar() {
  const { state, update, toast } = useStore();
  const [reminders, setReminders] = useState({ pausa: true, noche: true, aviso: true });
  const pct = Math.min(100, (state.usageToday / state.dailyLimit) * 100);
  const left = Math.max(0, state.dailyLimit - state.usageToday);
  const color = pct >= 100 ? "#ff6b5b" : pct >= 80 ? "#fbb424" : "#1fb58f";
  const R = 70;
  const C = 2 * Math.PI * R;

  const simulate = () => {
    const next = state.usageToday + 5;
    update(() => ({ usageToday: next }));
    const remaining = state.dailyLimit - next;
    if (remaining <= 0) toast(`${state.child?.name} llegó al límite de hoy. Panka le va a proponer jugar afuera.`, "🌙");
    else if (remaining <= 5) toast(`Aviso: a ${state.child?.name} le quedan ${remaining} minutos.`, "⏰");
  };

  return (
    <div>
      <PageHeader title="Bienestar digital" subtitle="Uso sano y equilibrado de pantallas" />
      <div className="px-5 flex flex-col gap-4">
        <Card className="p-5 flex flex-col items-center">
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r={R} fill="none" stroke="#ece4d8" strokeWidth="14" />
              <motion.circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C * (1 - pct / 100) }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{state.usageToday}</span>
              <span className="text-sm font-bold text-ink-soft">de {state.dailyLimit} min hoy</span>
            </div>
          </div>
          <p className="font-extrabold mt-3" style={{ color }}>
            {pct >= 100 ? "Llegó al límite de hoy" : pct >= 80 ? `Quedan ${left} minutos` : `Le quedan ${left} minutos para hoy`}
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={simulate} className="flex items-center gap-1 rounded-xl bg-grape-soft text-grape-dark font-extrabold text-sm px-3 py-2">
              <Plus size={16} /> Simular 5 min de uso
            </button>
            <button onClick={() => update(() => ({ usageToday: 0 }))} className="flex items-center gap-1 rounded-xl bg-white border border-line font-extrabold text-sm px-3 py-2">
              <RotateCcw size={14} /> Reiniciar día
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-baseline">
            <h2 className="font-black text-lg">Límite diario</h2>
            <span className="text-2xl font-black text-grape">{state.dailyLimit} min</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={state.dailyLimit}
            onChange={(e) => update(() => ({ dailyLimit: Number(e.target.value) }))}
            aria-label="Minutos por día"
            className="w-full mt-4 accent-[#8b5cf6] h-2"
          />
          <div className="flex justify-between text-xs font-bold text-ink-soft mt-1">
            <span>10 min</span>
            <span>Recomendado: 20 a 30</span>
            <span>60 min</span>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-black text-lg mb-2">Avisos</h2>
          <Toggle icon={<Bell size={18} />} label="Avisar 5 minutos antes del límite" on={reminders.aviso} onChange={(v) => setReminders({ ...reminders, aviso: v })} />
          <Toggle icon={<Sun size={18} />} label="Recordar una pausa cada 20 minutos" on={reminders.pausa} onChange={(v) => setReminders({ ...reminders, pausa: v })} />
          <Toggle icon={<Moon size={18} />} label="Bloquear después de las 20:00" on={reminders.noche} onChange={(v) => setReminders({ ...reminders, noche: v })} />
        </Card>

        <section>
          <h2 className="font-black text-lg mb-2">Consejos de bienestar</h2>
          <div className="flex flex-col gap-2">
            {MESSAGES.map((m) => (
              <div key={m.text} className="bg-mint-soft rounded-2xl p-4 flex gap-3 items-center font-semibold">
                <span className="text-3xl">{m.emoji}</span>
                {m.text}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Toggle({ icon, label, on, onChange }: { icon: React.ReactNode; label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="w-full flex items-center gap-3 py-2.5 text-left font-semibold">
      <span className="text-ink-soft">{icon}</span>
      <span className="flex-1">{label}</span>
      <span className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? "bg-mint" : "bg-line"}`}>
        <motion.span className="block w-5 h-5 rounded-full bg-white shadow" animate={{ x: on ? 20 : 0 }} />
      </span>
    </button>
  );
}
