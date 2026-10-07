import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Redirect, useLocation } from "wouter";
import { Mic, Check } from "lucide-react";
import { PhoneFrame } from "@/components/Shell";
import Lumi from "@/components/Lumi";
import { Button, ProgressBar, SoundWave, SpeechBubble, celebrate } from "@/components/ui";
import { LEVEL_NAMES, type Level } from "@/lib/content";
import { useStore } from "@/lib/store";

// Evaluación inicial simulada: comprensión lectora, escritura y oralidad.

type Area = "comprension" | "escritura" | "oralidad";

type Item =
  | { area: Area; kind: "choice"; prompt: string; text?: string; question?: string; options: { label: string; emoji?: string }[]; answer: number }
  | { area: Area; kind: "syllables"; prompt: string; emoji: string; syllables: string[]; answer: string }
  | { area: Area; kind: "oral"; prompt: string; scene: string };

const ITEMS: Item[] = [
  {
    area: "comprension",
    kind: "choice",
    prompt: "Leé y tocá la respuesta correcta.",
    text: "Ana tiene un gato. El gato es negro y duerme en la cama.",
    question: "¿De qué color es el gato?",
    options: [
      { label: "Blanco", emoji: "🤍" },
      { label: "Negro", emoji: "🖤" },
      { label: "Naranja", emoji: "🧡" },
    ],
    answer: 1,
  },
  {
    area: "comprension",
    kind: "choice",
    prompt: "¿Cuál de estas palabras dice SOL?",
    options: [{ label: "SAL" }, { label: "SOL" }, { label: "COL" }],
    answer: 1,
  },
  {
    area: "escritura",
    kind: "choice",
    prompt: "¿Con qué letra empieza RANA?",
    options: [
      { label: "M", emoji: "🐸" },
      { label: "R", emoji: "🐸" },
      { label: "S", emoji: "🐸" },
    ],
    answer: 1,
  },
  {
    area: "escritura",
    kind: "syllables",
    prompt: "Tocá las sílabas en orden para armar la palabra.",
    emoji: "🦆",
    syllables: ["TO", "PA"],
    answer: "PATO",
  },
  {
    area: "oralidad",
    kind: "oral",
    prompt: "Contale a Lumi qué pasa en esta imagen.",
    scene: "🏖️👧🪣🌞",
  },
];

export default function Diagnostico() {
  const [, go] = useLocation();
  const { state, update, earnStars } = useStore();
  const [i, setI] = useState(-1); // -1 = intro
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  if (!state.child) return <Redirect to="/bienvenida" />;

  const answer = (ok: boolean) => {
    const r = [...results, ok];
    setResults(r);
    if (i + 1 < ITEMS.length) setI(i + 1);
    else finish(r);
  };

  const finish = (r: boolean[]) => {
    const pct = (area: Area) => {
      const idx = ITEMS.map((it, k) => (it.area === area ? k : -1)).filter((k) => k >= 0);
      const ok = idx.filter((k) => r[k]).length;
      return Math.round(55 + (ok / idx.length) * 40);
    };
    const scores = { comprension: pct("comprension"), escritura: pct("escritura"), oralidad: pct("oralidad") };
    const avg = (scores.comprension + scores.escritura + scores.oralidad) / 3;
    const ageBonus = (state.child?.age ?? 6) >= 7 ? 1 : 0;
    const level = Math.min(3, (avg > 85 ? 2 : 1) + ageBonus) as Level;
    update(() => ({ diagnostic: { level, scores } }));
    earnStars(5);
    setDone(true);
    celebrate();
  };

  const item = ITEMS[i];

  return (
    <PhoneFrame>
      <div className="min-h-screen flex flex-col px-5 pt-6 pb-8">
        {i >= 0 && !done && (
          <div className="mb-5">
            <div className="flex justify-between text-sm font-extrabold text-ink-soft mb-2">
              <span>{{ comprension: "📖 Comprensión", escritura: "✏️ Escritura", oralidad: "🗣️ Oralidad" }[item.area]}</span>
              <span>{i + 1} de {ITEMS.length}</span>
            </div>
            <ProgressBar value={((i + 1) / ITEMS.length) * 100} />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={done ? "done" : i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            {i === -1 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                <Lumi size={150} mood="talk" />
                <h1 className="text-3xl font-black">¡Vamos a jugar un poquito, {state.child.name}!</h1>
                <p className="text-lg font-semibold text-ink-soft">Son 5 juegos cortitos. No hay respuestas malas: así Lumi conoce qué cuentos te van a gustar.</p>
                <Button full onClick={() => setI(0)}>¡Empezar!</Button>
                <button className="font-bold text-ink-soft underline" onClick={() => go("/inicio")}>Lo hago después</button>
              </div>
            )}

            {item && !done && item.kind === "choice" && <ChoiceItem item={item} onAnswer={answer} />}
            {item && !done && item.kind === "syllables" && <SyllableItem item={item} onAnswer={answer} />}
            {item && !done && item.kind === "oral" && <OralItem item={item} onAnswer={answer} />}

            {done && state.diagnostic && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <Lumi size={120} mood="cheer" />
                  <h1 className="text-3xl font-black">¡Lo hiciste genial!</h1>
                  <p className="font-bold text-ink-soft">Tu nivel para empezar:</p>
                  <span className="text-2xl font-black bg-grape text-white rounded-2xl px-5 py-2">
                    Nivel {state.diagnostic.level}: {LEVEL_NAMES[state.diagnostic.level]}
                  </span>
                </div>
                <div className="bg-white rounded-3xl border border-line p-5 flex flex-col gap-4">
                  {(
                    [
                      ["Comprensión", state.diagnostic.scores.comprension, "bg-grape"],
                      ["Escritura", state.diagnostic.scores.escritura, "bg-coral"],
                      ["Oralidad", state.diagnostic.scores.oralidad, "bg-mint"],
                    ] as const
                  ).map(([label, v, c]) => (
                    <div key={label}>
                      <div className="flex justify-between font-extrabold mb-1">
                        <span>{label}</span>
                        <span>{v}%</span>
                      </div>
                      <ProgressBar value={v} color={c} />
                    </div>
                  ))}
                </div>
                <div className="bg-sun-soft rounded-3xl p-5">
                  <p className="font-black mb-2">Lumi te recomienda:</p>
                  <ul className="font-semibold flex flex-col gap-1.5">
                    <li>📚 Cuentos cortos de nivel {state.diagnostic.level} sobre {state.child.interests.length ? "lo que más te gusta" : "animales y aventuras"}.</li>
                    <li>🎤 Leer en voz alta 5 minutos por día.</li>
                    <li>✏️ Jugar a armar palabras con sílabas.</li>
                  </ul>
                </div>
                <Button full onClick={() => go("/inicio")}>Ir a mi Panka</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}

function useFeedback(onAnswer: (ok: boolean) => void) {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (k: number, ok: boolean) => {
    if (picked !== null) return;
    setPicked(k);
    setTimeout(() => onAnswer(ok), 900);
  };
  return { picked, pick };
}

function ChoiceItem({ item, onAnswer }: { item: Extract<Item, { kind: "choice" }>; onAnswer: (ok: boolean) => void }) {
  const { picked, pick } = useFeedback(onAnswer);
  return (
    <div className="flex flex-col gap-5">
      <SpeechBubbleRow text={item.prompt} />
      {item.text && <p className="read-text text-2xl font-bold bg-white rounded-3xl border border-line p-5 leading-relaxed">{item.text}</p>}
      {item.question && <p className="font-black text-xl">{item.question}</p>}
      <div className="grid gap-3">
        {item.options.map((o, k) => {
          const state = picked === null ? "" : k === item.answer ? "bg-mint-soft border-mint" : picked === k ? "bg-coral-soft border-coral" : "opacity-50";
          return (
            <motion.button
              key={o.label}
              whileTap={{ scale: 0.96 }}
              onClick={() => pick(k, k === item.answer)}
              className={`rounded-3xl border-4 border-line bg-white p-4 flex items-center gap-4 text-left ${state}`}
            >
              {o.emoji && <span className="text-4xl">{o.emoji}</span>}
              <span className="read-text text-3xl font-bold">{o.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function SyllableItem({ item, onAnswer }: { item: Extract<Item, { kind: "syllables" }>; onAnswer: (ok: boolean) => void }) {
  const [built, setBuilt] = useState<string[]>([]);
  const word = built.join("");
  const full = built.length === item.syllables.length;
  const ok = word === item.answer;

  useEffect(() => {
    if (!full) return;
    const t = setTimeout(() => (ok ? onAnswer(true) : setBuilt([])), ok ? 900 : 1100);
    return () => clearTimeout(t);
  }, [full, ok, onAnswer]);

  return (
    <div className="flex flex-col gap-5 items-center">
      <SpeechBubbleRow text={item.prompt} />
      <span className="text-8xl">{item.emoji}</span>
      <div className={`min-h-20 w-full rounded-3xl border-4 border-dashed flex items-center justify-center read-text text-4xl font-bold ${full ? (ok ? "border-mint bg-mint-soft" : "border-coral bg-coral-soft") : "border-line"}`}>
        {word || <span className="text-ink-soft/40 text-xl">_ _ _ _</span>}
      </div>
      <div className="flex gap-4">
        {item.syllables.map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.9 }}
            disabled={built.includes(s)}
            onClick={() => setBuilt([...built, s])}
            className="w-24 h-24 rounded-3xl bg-sun text-white read-text text-3xl font-bold shadow-[0_6px_0_#d39514] disabled:opacity-30"
          >
            {s}
          </motion.button>
        ))}
      </div>
      <button className="font-bold text-ink-soft underline" onClick={() => onAnswer(false)}>No sé, pasar</button>
    </div>
  );
}

function OralItem({ item, onAnswer }: { item: Extract<Item, { kind: "oral" }>; onAnswer: (ok: boolean) => void }) {
  const [phase, setPhase] = useState<"idle" | "rec" | "ok">("idle");
  const record = () => {
    setPhase("rec");
    setTimeout(() => setPhase("ok"), 3000);
  };
  return (
    <div className="flex flex-col gap-5 items-center text-center">
      <SpeechBubbleRow text={item.prompt} />
      <div className="text-6xl bg-sky-soft rounded-3xl w-full py-8 whitespace-nowrap">{item.scene}</div>
      {phase === "idle" && (
        <motion.button whileTap={{ scale: 0.9 }} onClick={record} className="w-28 h-28 rounded-full bg-coral text-white flex flex-col items-center justify-center font-black shadow-[0_6px_0_#d94a3c]">
          <Mic size={40} /> Hablar
        </motion.button>
      )}
      {phase === "rec" && (
        <div className="flex flex-col items-center gap-2">
          <SoundWave />
          <p className="font-extrabold text-coral">Te estoy escuchando…</p>
        </div>
      )}
      {phase === "ok" && (
        <>
          <p className="font-black text-mint text-xl flex items-center gap-2"><Check /> ¡Qué bien lo contaste!</p>
          <Button full onClick={() => onAnswer(true)}>Ver mis resultados</Button>
        </>
      )}
    </div>
  );
}

function SpeechBubbleRow({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2 w-full">
      <Lumi size={64} mood="talk" />
      <SpeechBubble className="flex-1 mb-3 text-left">{text}</SpeechBubble>
    </div>
  );
}
