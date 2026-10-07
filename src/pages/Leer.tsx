import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, RefreshCw, ChevronRight, Volume2 } from "lucide-react";
import Lumi from "@/components/Lumi";
import { Button, PageHeader, ProgressBar, SoundWave, SpeechBubble, celebrate } from "@/components/ui";
import { READING_SENTENCES } from "@/lib/content";
import { useStore } from "@/lib/store";

type Phase = "idle" | "rec" | "analyzing" | "result";

const PRAISE = [
  { min: 90, title: "¡Excelente lectura!", stars: 3 },
  { min: 78, title: "¡Muy bien! Leíste con mucha claridad.", stars: 2 },
  { min: 0, title: "¡Muy bien, seguí practicando!", stars: 1 },
];

export default function Leer() {
  const { state, earnStars, unlockBadge } = useStore();
  const level = state.diagnostic?.level ?? 1;
  const sentences = READING_SENTENCES[level];
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [word, setWord] = useState(-1);
  const [round, setRound] = useState(0);

  const sentence = sentences[idx % sentences.length];
  const words = sentence.split(" ");

  // Resultados simulados, distintos en cada intento.
  const metrics = useMemo(() => {
    const seed = (idx * 7 + round * 13) % 10;
    return { fluidez: 76 + seed * 2, pronunciacion: 82 + ((seed * 3) % 15), comprension: 74 + ((seed * 5) % 22) };
  }, [idx, round]);
  const avg = (metrics.fluidez + metrics.pronunciacion + metrics.comprension) / 3;
  const praise = PRAISE.find((p) => avg >= p.min)!;

  // Mientras "graba", resalta palabra por palabra como si siguiera la lectura.
  useEffect(() => {
    if (phase !== "rec") return;
    setWord(0);
    const t = setInterval(() => {
      setWord((w) => {
        if (w >= words.length - 1) {
          clearInterval(t);
          setTimeout(() => setPhase("analyzing"), 600);
          return w;
        }
        return w + 1;
      });
    }, 650);
    return () => clearInterval(t);
  }, [phase, words.length]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    const t = setTimeout(() => {
      setPhase("result");
      earnStars(praise.stars);
      unlockBadge("voz-clara");
      if (praise.stars >= 2) celebrate();
    }, 2200);
    return () => clearTimeout(t);
  }, [phase, earnStars, unlockBadge, praise.stars]);

  const listen = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(sentence);
    u.lang = "es-AR";
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  const next = (same: boolean) => {
    if (!same) setIdx(idx + 1);
    setRound(round + 1);
    setWord(-1);
    setPhase("idle");
  };

  return (
    <div>
      <PageHeader title="Leer en voz alta" subtitle="Leé la frase y ganá estrellas" />
      <div className="px-5">
        <div className="bg-white rounded-3xl border-2 border-line p-6 shadow-[0_4px_0_var(--color-line)]">
          <p className="text-xs font-black tracking-widest text-ink-soft mb-3">FRASE {(idx % sentences.length) + 1} · NIVEL {level}</p>
          <p className="read-text text-[30px] leading-snug font-bold flex flex-wrap gap-x-2.5 gap-y-1">
            {words.map((w, k) => (
              <motion.span
                key={k}
                animate={{
                  color: phase === "rec" && k === word ? "#ff6b5b" : phase !== "idle" && k < word ? "#8b5cf6" : "#1b2a5c",
                  scale: phase === "rec" && k === word ? 1.12 : 1,
                }}
                className="inline-block"
              >
                {w}
              </motion.span>
            ))}
          </p>
          {phase === "idle" && (
            <button onClick={listen} className="mt-4 flex items-center gap-2 font-extrabold text-grape">
              <Volume2 size={20} /> Escuchar cómo se lee
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center mt-8 gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPhase("rec")}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-coral to-[#ff8f6b] text-white flex flex-col items-center justify-center gap-2 font-black text-lg shadow-[0_8px_0_#d94a3c]"
              >
                <Mic size={48} />
                Grabar lectura
              </motion.button>
              <div className="flex items-end gap-1">
                <Lumi size={56} />
                <SpeechBubble className="mb-3 text-sm">Leé despacito y con tu voz más clara.</SpeechBubble>
              </div>
            </motion.div>
          )}

          {phase === "rec" && (
            <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center mt-10 gap-4">
              <div className="relative flex items-center justify-center w-40 h-40">
                {[0, 1, 2].map((k) => (
                  <motion.span
                    key={k}
                    className="absolute inset-0 rounded-full bg-coral/25"
                    animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: k * 0.5 }}
                  />
                ))}
                <span className="w-28 h-28 rounded-full bg-coral text-white flex items-center justify-center">
                  <Mic size={44} />
                </span>
              </div>
              <SoundWave />
              <p className="font-black text-coral text-lg">Grabando… ¡seguí leyendo!</p>
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div key="an" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center mt-12 gap-4 text-center">
              <Lumi size={110} mood="think" />
              <p className="text-2xl font-black">Lumi está escuchando tu lectura…</p>
              <div className="w-48">
                <motion.div className="h-3 rounded-full bg-grape" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.1 }} />
              </div>
              <p className="font-semibold text-ink-soft">Revisando fluidez, pronunciación y comprensión</p>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <Lumi size={100} mood="cheer" />
                <h2 className="text-3xl font-black mt-1">{praise.title}</h2>
                <div className="flex gap-1 text-4xl mt-2">
                  {[0, 1, 2].map((s) => (
                    <motion.span key={s} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + s * 0.15, type: "spring" }}>
                      {s < praise.stars ? "⭐" : "☆"}
                    </motion.span>
                  ))}
                </div>
                <p className="font-extrabold text-sun mt-1">+{praise.stars} {praise.stars === 1 ? "estrella" : "estrellas"}</p>
              </div>

              <div className="bg-white rounded-3xl border border-line p-5 flex flex-col gap-4">
                {(
                  [
                    ["🌊 Fluidez", metrics.fluidez, "bg-grape"],
                    ["🗣️ Pronunciación", metrics.pronunciacion, "bg-coral"],
                    ["💡 Comprensión", metrics.comprension, "bg-mint"],
                  ] as const
                ).map(([label, v, color]) => (
                  <div key={label}>
                    <div className="flex justify-between font-extrabold mb-1">
                      <span>{label}</span>
                      <span>{v}%</span>
                    </div>
                    <ProgressBar value={v} color={color} />
                  </div>
                ))}
              </div>

              <div className="rounded-3xl bg-sun-soft p-4 font-bold flex gap-3 items-center">
                <span className="text-3xl">💡</span>
                {metrics.fluidez < 85
                  ? "Probá leer la frase de corrido, sin frenar entre palabras."
                  : "¡Leíste muy fluido! La próxima, probá ponerle emoción a tu voz."}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => next(true)}>
                  <RefreshCw size={18} /> Otra vez
                </Button>
                <Button className="flex-1" onClick={() => next(false)}>
                  Siguiente <ChevronRight size={20} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
