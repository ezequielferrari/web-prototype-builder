import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic } from "lucide-react";
import Lumi from "@/components/Lumi";
import { Button, PageHeader, SoundWave, SpeechBubble, celebrate } from "@/components/ui";
import { useStore } from "@/lib/store";

const FEELINGS = [
  { emoji: "😄", label: "Feliz" },
  { emoji: "🤩", label: "Orgulloso/a" },
  { emoji: "🤔", label: "Con dudas" },
  { emoji: "😴", label: "Cansado/a" },
];

const STARTERS = ["Aprendí una palabra nueva:", "Leí solito/a", "Me gustó el cuento de", "Me costó"];

const POSITIVE = [
  "¡Qué bueno que lo cuentes! Pensar en lo que aprendiste hace que lo recuerdes mejor.",
  "¡Me encantó leerte! Cada día sabés un poquito más.",
  "¡Gracias por contarme! Mañana seguimos aprendiendo juntos.",
];

export default function Aprendi() {
  const { state, update, earnStars, unlockBadge } = useStore();
  const [feeling, setFeeling] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  const record = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setAudio(true);
    }, 2500);
  };

  const save = () => {
    const entry = audio && !text.trim() ? "🎤 Mensaje de voz" : text.trim();
    update((s) => ({
      reflections: [{ date: new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric" }), text: `${feeling ?? ""} ${entry}`.trim(), kind: audio ? "audio" : "texto" }, ...s.reflections],
    }));
    earnStars(2);
    unlockBadge("pensador");
    setSaved(POSITIVE[state.reflections.length % POSITIVE.length]);
    celebrate();
  };

  const reset = () => {
    setSaved(null);
    setText("");
    setAudio(false);
    setFeeling(null);
  };

  return (
    <div>
      <PageHeader title="¿Qué aprendiste hoy?" back="/inicio" />
      <div className="px-5">
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-3 py-6">
              <Lumi size={140} mood="cheer" />
              <p className="text-2xl font-black">{saved}</p>
              <p className="font-extrabold text-sun">+2 estrellas</p>
              <Button variant="ghost" onClick={reset}>Contar algo más</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <div className="flex items-end gap-1">
                <Lumi size={80} mood="talk" />
                <SpeechBubble className="flex-1 mb-4">Antes de terminar el día, contame: ¿qué aprendiste hoy?</SpeechBubble>
              </div>

              <div>
                <p className="font-extrabold mb-2">¿Cómo te sentiste?</p>
                <div className="grid grid-cols-4 gap-2">
                  {FEELINGS.map((f) => (
                    <motion.button
                      key={f.label}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setFeeling(f.emoji)}
                      aria-pressed={feeling === f.emoji}
                      className={`rounded-2xl border-2 py-2 flex flex-col items-center text-xs font-extrabold ${feeling === f.emoji ? "bg-sun-soft border-sun" : "bg-white border-line"}`}
                    >
                      <span className="text-4xl">{f.emoji}</span>
                      {f.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-extrabold mb-2">Escribilo o grabalo</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => {
                        setText(`${s} `);
                        area.current?.focus();
                      }} className="rounded-full bg-grape-soft text-grape-dark font-bold text-sm px-3 py-1.5">
                      {s}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={area}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="Hoy aprendí…"
                  aria-label="Qué aprendiste hoy"
                  className="read-text w-full rounded-3xl border-2 border-line bg-white p-4 text-xl outline-none focus:border-grape"
                />
                <div className="flex items-center gap-3 mt-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={record}
                    disabled={recording}
                    aria-label="Grabar audio"
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${recording ? "bg-coral" : "bg-mint"}`}
                  >
                    <Mic size={26} />
                  </motion.button>
                  {recording ? (
                    <SoundWave />
                  ) : audio ? (
                    <span className="font-extrabold text-mint">🎤 Audio grabado (0:05)</span>
                  ) : (
                    <span className="font-bold text-ink-soft">o tocá para contarlo con tu voz</span>
                  )}
                </div>
              </div>

              <Button full disabled={!text.trim() && !audio} onClick={save}>Guardar en mi diario</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {state.reflections.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black mb-3">Mi diario</h2>
            <ul className="flex flex-col gap-2">
              {state.reflections.slice(0, 5).map((r, i) => (
                <li key={i} className="bg-white rounded-2xl border border-line p-3">
                  <p className="text-xs font-extrabold text-ink-soft capitalize">{r.date}</p>
                  <p className="read-text text-lg">{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
