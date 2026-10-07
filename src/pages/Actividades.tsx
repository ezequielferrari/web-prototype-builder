import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Mic, PenLine, X } from "lucide-react";
import Lumi from "@/components/Lumi";
import { Button, PageHeader, SoundWave, SpeechBubble, celebrate } from "@/components/ui";
import { OFFLINE_ACTIVITIES, type ActivityKind, type OfflineActivity } from "@/lib/content";
import { useStore } from "@/lib/store";

const EVIDENCE: Record<ActivityKind, { icon: typeof Camera; label: string }> = {
  foto: { icon: Camera, label: "Sacar una foto" },
  audio: { icon: Mic, label: "Grabar un audio" },
  texto: { icon: PenLine, label: "Escribir" },
};

export default function Actividades() {
  const { state, update, earnStars, unlockBadge } = useStore();
  const [open, setOpen] = useState<OfflineActivity | null>(null);
  const doneCount = Object.keys(state.completedActivities).length;

  const complete = (a: OfflineActivity, kind: ActivityKind) => {
    update((s) => ({ completedActivities: { ...s.completedActivities, [a.id]: kind } }));
    earnStars(3);
    unlockBadge("explorador");
    celebrate();
  };

  return (
    <div>
      <PageHeader title="Fuera de la pantalla" subtitle="Juegos para hacer en casa" />
      <div className="px-5">
        <div className="flex items-end gap-1 mb-4">
          <Lumi size={64} mood="happy" />
          <SpeechBubble className="flex-1 mb-3">
            ¡Hora de jugar lejos de la pantalla! Cuando termines, mostrame lo que hiciste. Llevás {doneCount} de {OFFLINE_ACTIVITIES.length}.
          </SpeechBubble>
        </div>

        <ul className="flex flex-col gap-3">
          {OFFLINE_ACTIVITIES.map((a) => {
            const done = state.completedActivities[a.id];
            const Ev = EVIDENCE[a.evidence];
            return (
              <li key={a.id}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOpen(a)}
                  className={`${a.color} w-full rounded-3xl p-4 flex items-center gap-4 text-left border-2 ${done ? "border-mint" : "border-white"} shadow-[0_4px_0_var(--color-line)]`}
                >
                  <span className="text-5xl">{a.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-black text-lg leading-tight">{a.title}</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-ink-soft mt-1">
                      <Ev.icon size={14} /> {Ev.label}
                    </span>
                  </span>
                  {done && (
                    <span className="w-9 h-9 rounded-full bg-mint text-white flex items-center justify-center" aria-label="Hecha">
                      <Check size={20} strokeWidth={3} />
                    </span>
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {open && <ActivitySheet activity={open} done={!!state.completedActivities[open.id]} onClose={() => setOpen(null)} onComplete={complete} />}
      </AnimatePresence>
    </div>
  );
}

function ActivitySheet({
  activity,
  done,
  onClose,
  onComplete,
}: {
  activity: OfflineActivity;
  done: boolean;
  onClose: () => void;
  onComplete: (a: OfflineActivity, k: ActivityKind) => void;
}) {
  const [kind, setKind] = useState<ActivityKind>(activity.evidence);
  const [phase, setPhase] = useState<"pick" | "working" | "sent">(done ? "sent" : "pick");
  const [text, setText] = useState("");

  const upload = () => {
    setPhase("working");
    setTimeout(() => {
      setPhase("sent");
      onComplete(activity, kind);
    }, kind === "texto" ? 600 : 2200);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={activity.title}
        className="w-full max-w-[430px] bg-paper rounded-t-[2rem] p-5 pb-8"
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        exit={{ y: 400 }}
        transition={{ type: "spring", bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="text-5xl">{activity.emoji}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-black leading-tight">{activity.title}</h2>
            <p className="read-text text-lg mt-1">{activity.desc}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="w-10 h-10 rounded-2xl bg-white border border-line flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        {phase === "pick" && (
          <>
            <p className="font-extrabold mt-5 mb-2">¿Cómo me lo mostrás?</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(EVIDENCE) as ActivityKind[]).map((k) => {
                const E = EVIDENCE[k];
                return (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                    className={`rounded-2xl border-2 py-3 flex flex-col items-center gap-1 font-extrabold text-sm ${kind === k ? "bg-grape border-grape text-white" : "bg-white border-line"}`}
                  >
                    <E.icon size={24} /> {k === "foto" ? "Foto" : k === "audio" ? "Audio" : "Texto"}
                  </button>
                );
              })}
            </div>
            {kind === "texto" && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Escribí acá…"
                aria-label="Tu texto"
                className="read-text w-full mt-3 rounded-2xl border-2 border-line bg-white p-3 text-lg outline-none focus:border-grape"
              />
            )}
            <Button full className="mt-4" disabled={kind === "texto" && !text.trim()} onClick={upload}>
              {kind === "foto" ? "📷 Sacar foto" : kind === "audio" ? "🎤 Grabar" : "Enviar"}
            </Button>
          </>
        )}

        {phase === "working" && (
          <div className="flex flex-col items-center gap-3 py-8">
            {kind === "audio" ? (
              <>
                <SoundWave />
                <p className="font-black text-coral">Grabando…</p>
              </>
            ) : (
              <>
                <motion.div className="w-40 h-28 rounded-2xl bg-ink/90 flex items-center justify-center" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.4, repeat: 2 }}>
                  <Camera className="text-white" size={40} />
                </motion.div>
                <p className="font-black">Subiendo la foto…</p>
              </>
            )}
          </div>
        )}

        {phase === "sent" && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Lumi size={100} mood="cheer" />
            <p className="text-2xl font-black">¡Increíble trabajo!</p>
            <p className="font-bold text-ink-soft">Tu familia lo va a ver en su panel. +3 estrellas</p>
            <Button className="mt-3" onClick={onClose}>Volver</Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
