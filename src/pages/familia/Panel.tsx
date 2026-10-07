import { useState } from "react";
import { useLocation } from "wouter";
import { Bar, BarChart, ResponsiveContainer, XAxis, Cell } from "recharts";
import { BookOpen, Check, ChevronDown, Clock, Home, MonitorSmartphone, Users } from "lucide-react";
import { Card, ProgressBar } from "@/components/ui";
import { BOOKS, INTERESTS, LEVEL_NAMES, OFFLINE_ACTIVITIES } from "@/lib/content";
import { useStore } from "@/lib/store";

const WEEK = [
  { d: "Lun", min: 12 },
  { d: "Mar", min: 18 },
  { d: "Mié", min: 9 },
  { d: "Jue", min: 22 },
  { d: "Vie", min: 15 },
  { d: "Sáb", min: 25 },
];

const HABITS = [
  "Leer juntos 15 minutos por día",
  "Tener un rincón de lectura en casa",
  "Preguntar «¿qué aprendiste hoy?»",
  "Nada de pantallas una hora antes de dormir",
  "Contar un cuento antes de dormir",
  "Visitar la biblioteca o una librería",
];

const GUIDE = [
  {
    icon: BookOpen,
    title: "Lectura en casa",
    color: "text-grape bg-grape-soft",
    tips: [
      "Leé en voz alta con emoción: cambiá la voz de cada personaje.",
      "Antes de dar vuelta la página, preguntá: «¿qué creés que va a pasar?».",
      "Señalá las palabras con el dedo mientras leés.",
      "Dejá que elija el cuento, aunque lo repita muchas veces: también aprende así.",
    ],
  },
  {
    icon: MonitorSmartphone,
    title: "Pantallas saludables",
    color: "text-coral bg-coral-soft",
    tips: [
      "Entre 5 y 8 años, 20 a 30 minutos de pantalla educativa por día es suficiente.",
      "Mejor acompañado: sentate al lado y comentá lo que ve.",
      "Usá Panka de día, no antes de dormir.",
      "Alterná siempre con juego físico y actividades fuera de la pantalla.",
    ],
  },
  {
    icon: Users,
    title: "Actividades en familia",
    color: "text-mint bg-mint-soft",
    tips: [
      "Hagan la lista del súper juntos: que escriba algunas palabras.",
      "Jueguen al «veo veo» con letras: «veo algo que empieza con P».",
      "Lean juntos carteles por la calle o en el colectivo.",
      "Inventen el final alternativo de un cuento conocido.",
    ],
  },
];

export default function Panel() {
  const [, go] = useLocation();
  const { state, update } = useStore();
  const child = state.child!;
  const fam = state.family;
  const [open, setOpen] = useState(0);
  const level = state.diagnostic?.level ?? 1;
  const doneActs = Object.keys(state.completedActivities);
  const read = Object.values(state.bookProgress).filter((p) => p === 100).length;
  const week = [...WEEK, { d: "Hoy", min: state.usageToday }];
  const weekTotal = week.reduce((a, w) => a + w.min, 0);
  const recommendedMin = child.age <= 6 ? 20 : 30;

  const interest = INTERESTS.find((i) => child.interests.includes(i.id));
  const nextBook = BOOKS.find((b) => b.level === level && (state.bookProgress[b.id] ?? 0) < 100);
  const recos = [
    state.diagnostic && state.diagnostic.scores.escritura < state.diagnostic.scores.comprension
      ? `La escritura viene un poco atrás de la comprensión: propongan escribir juntos la lista de compras o una cartita.`
      : `Va muy bien con la escritura: propongan crear un cuento nuevo en la sección «Crear».`,
    nextBook ? `Cuento recomendado para su nivel: «${nextBook.title}» (${nextBook.minutes} min).` : "Ya leyó todos los cuentos de su nivel: es momento de probar el siguiente.",
    interest ? `Le encanta el tema «${interest.label}» ${interest.emoji}: busquen juntos un libro sobre eso en la biblioteca del barrio.` : "Contanos sus intereses en «Perfil» para recomendarle cuentos.",
    fam?.culture ? `Aprovechen sus costumbres (${fam.culture}) para contar historias familiares en voz alta.` : "Compartan historias de la familia: los chicos aprenden mucho escuchando relatos de sus abuelos.",
  ];

  const toggleHabit = (i: number) => update((s) => ({ habits: s.habits.includes(i) ? s.habits.filter((h) => h !== i) : [...s.habits, i] }));

  return (
    <div className="px-5 pt-5 flex flex-col gap-4">
      <header>
        <p className="font-bold text-ink-soft">Hola{fam?.adultName ? `, ${fam.adultName}` : ""} 👋</p>
        <h1 className="text-[28px] font-black leading-tight">Así viene {child.name}</h1>
      </header>

      <Card className="p-4 flex items-center gap-4">
        <span className="w-16 h-16 rounded-2xl bg-grape-soft flex items-center justify-center text-4xl">{child.avatar}</span>
        <div className="flex-1">
          <p className="font-black text-lg">{child.name}, {child.age} años</p>
          <p className="font-bold text-ink-soft text-sm">Nivel {level} · {LEVEL_NAMES[level]}</p>
          {!state.diagnostic && (
            <button onClick={() => go("/diagnostico")} className="text-sm font-extrabold text-grape mt-1">Hacer la evaluación inicial →</button>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-black">🔥 {state.streak}</p>
          <p className="text-xs font-bold text-ink-soft">días seguidos</p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <MiniStat value={`${weekTotal}`} label="min esta semana" color="text-grape" />
        <MiniStat value={`${doneActs.length + read + state.stories.length}`} label="actividades hechas" color="text-coral" />
        <MiniStat value={`${state.stars}`} label="estrellas" color="text-sun" />
      </div>

      <Card className="p-5">
        <div className="flex justify-between items-baseline">
          <h2 className="font-black text-lg">Tiempo de lectura</h2>
          <span className="text-sm font-bold text-ink-soft">meta: {recommendedMin} min/día</span>
        </div>
        <div className="h-40 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="d" interval={0} axisLine={false} tickLine={false} tick={{ fontWeight: 800, fill: "#5b6688", fontSize: 12 }} />
              <Bar dataKey="min" radius={[8, 8, 8, 8]}>
                {week.map((w) => (
                  <Cell key={w.d} fill={w.d === "Hoy" ? "#ff6b5b" : w.min >= recommendedMin ? "#1fb58f" : "#8b5cf6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {state.diagnostic && (
        <Card className="p-5">
          <h2 className="font-black text-lg mb-3">Evaluación inicial</h2>
          <div className="flex flex-col gap-3">
            {(
              [
                ["Comprensión lectora", state.diagnostic.scores.comprension, "bg-grape"],
                ["Escritura", state.diagnostic.scores.escritura, "bg-coral"],
                ["Oralidad", state.diagnostic.scores.oralidad, "bg-mint"],
              ] as const
            ).map(([l, v, c]) => (
              <div key={l}>
                <div className="flex justify-between text-sm font-extrabold mb-1">
                  <span>{l}</span>
                  <span>{v}%</span>
                </div>
                <ProgressBar value={v} color={c} className="h-2.5" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 bg-sun-soft border-sun/30">
        <h2 className="font-black text-lg mb-2">💡 Recomendaciones para esta semana</h2>
        <ul className="flex flex-col gap-2 font-semibold">
          {recos.map((r) => (
            <li key={r} className="flex gap-2">
              <span>•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="font-black text-lg mb-3">Lo que hizo en Panka</h2>
        <ul className="flex flex-col gap-2.5 text-sm font-semibold">
          {state.reflections.slice(0, 2).map((r, i) => (
            <Feed key={`r${i}`} emoji="💭" text={`Contó qué aprendió: «${r.text}»`} />
          ))}
          {state.stories.slice(0, 2).map((s) => (
            <Feed key={s.id} emoji="✏️" text={`Creó el cuento «${s.title}»`} />
          ))}
          {doneActs.map((id) => {
            const a = OFFLINE_ACTIVITIES.find((x) => x.id === id);
            return a ? <Feed key={id} emoji={a.emoji} text={`${a.title} · envió ${state.completedActivities[id] === "foto" ? "una foto 📷" : state.completedActivities[id] === "audio" ? "un audio 🎤" : "un texto ✍️"}`} /> : null;
          })}
          {Object.entries(state.bookProgress)
            .filter(([, p]) => p > 0)
            .slice(0, 3)
            .map(([id, p]) => {
              const b = BOOKS.find((x) => x.id === id);
              return b ? <Feed key={id} emoji={b.emoji} text={`${p === 100 ? "Terminó" : "Está leyendo"} «${b.title}»${p < 100 ? ` (${p}%)` : ""}`} /> : null;
            })}
        </ul>
      </Card>

      <section>
        <h2 className="font-black text-xl mb-3">Guía para familias</h2>
        <div className="flex flex-col gap-2">
          {GUIDE.map((g, i) => (
            <Card key={g.title} className="overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="w-full flex items-center gap-3 p-4 text-left">
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${g.color}`}>
                  <g.icon size={22} />
                </span>
                <span className="flex-1 font-black">{g.title}</span>
                <ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <ul className="px-4 pb-4 flex flex-col gap-2 font-semibold text-ink-soft">
                  {g.tips.map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check size={18} className="text-mint shrink-0 mt-0.5" /> {t}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </section>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-lg flex items-center gap-2"><Home size={20} /> Hábitos en casa</h2>
          <span className="font-extrabold text-mint">{state.habits.length}/{HABITS.length}</span>
        </div>
        <ul className="flex flex-col gap-1">
          {HABITS.map((h, i) => {
            const on = state.habits.includes(i);
            return (
              <li key={h}>
                <button onClick={() => toggleHabit(i)} aria-pressed={on} className="w-full flex items-center gap-3 py-2 text-left font-semibold">
                  <span className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 ${on ? "bg-mint border-mint text-white" : "border-line"}`}>
                    {on && <Check size={16} strokeWidth={3} />}
                  </span>
                  <span className={on ? "text-ink-soft" : ""}>{h}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="font-black text-lg mb-3 flex items-center gap-2"><Clock size={20} /> Tiempo recomendado por día</h2>
        {[
          ["5 a 6 años", "15 a 20 min", 55],
          ["7 a 8 años", "20 a 30 min", 85],
        ].map(([age, t, v]) => (
          <div key={age as string} className="mb-3">
            <div className="flex justify-between text-sm font-extrabold mb-1">
              <span>{age}</span>
              <span>{t}</span>
            </div>
            <ProgressBar value={v as number} color="bg-sky" className="h-2.5" />
          </div>
        ))}
        <p className="text-sm font-semibold text-ink-soft">Siempre combinado con lectura en papel y juego libre.</p>
      </Card>
    </div>
  );
}

function MiniStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-3 text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-ink-soft leading-tight">{label}</p>
    </div>
  );
}

function Feed({ emoji, text }: { emoji: string; text: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="text-xl leading-none">{emoji}</span>
      <span>{text}</span>
    </li>
  );
}
