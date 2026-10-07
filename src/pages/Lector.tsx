import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Redirect, useLocation, useParams } from "wouter";
import { ChevronLeft, ChevronRight, Pause, Volume2, X } from "lucide-react";
import { PhoneFrame } from "@/components/Shell";
import Lumi from "@/components/Lumi";
import { Button, ProgressBar, celebrate } from "@/components/ui";
import { BOOKS } from "@/lib/content";
import { useStore } from "@/lib/store";

// Lee en voz alta con la voz del navegador (si está disponible).
function speak(text: string, onEnd: () => void) {
  if (!("speechSynthesis" in window)) {
    setTimeout(onEnd, 2500);
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-AR";
  u.rate = 0.85;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("es"));
  if (voice) u.voice = voice;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export default function Lector() {
  const { id } = useParams<{ id: string }>();
  const [, go] = useLocation();
  const { state, update, earnStars, unlockBadge } = useStore();
  const book = BOOKS.find((b) => b.id === id);
  const [page, setPage] = useState(0);
  const [phase, setPhase] = useState<"read" | "quiz" | "end">("read");
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => stopSpeaking, []);

  useEffect(() => {
    if (!book) return;
    const pct = Math.round(((page + 1) / book.pages.length) * 100);
    update((s) => ({ bookProgress: { ...s.bookProgress, [book.id]: Math.max(s.bookProgress[book.id] ?? 0, pct) } }));
  }, [page, book, update]);

  // En audiolibros y videos, la narración avanza sola.
  useEffect(() => {
    if (!book || !playing || phase !== "read") return;
    speak(book.pages[page], () => {
      if (page < book.pages.length - 1) setPage((p) => p + 1);
      else {
        setPlaying(false);
        setPhase("quiz");
      }
    });
    return stopSpeaking;
  }, [playing, page, book, phase]);

  if (!state.child) return <Redirect to="/bienvenida" />;
  if (!book) return <Redirect to="/biblioteca" />;

  const last = page === book.pages.length - 1;
  const question = book.questions[q];

  const answer = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    const ok = k === question.answer;
    if (ok) setCorrect((c) => c + 1);
    setTimeout(() => {
      setPicked(null);
      if (q < book.questions.length - 1) setQ(q + 1);
      else {
        setPhase("end");
        earnStars(3 + correct + (ok ? 1 : 0));
        unlockBadge("primer-cuento");
        celebrate();
      }
    }, 1000);
  };

  return (
    <PhoneFrame>
      <div className="min-h-screen flex flex-col">
        <div className={`bg-gradient-to-br ${book.cover} px-5 pt-5 pb-6 rounded-b-[2rem]`}>
          <div className="flex items-center gap-3">
            <button onClick={() => go("/biblioteca")} aria-label="Cerrar" className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center">
              <X size={20} />
            </button>
            <h1 className="flex-1 font-black text-lg text-white drop-shadow-sm truncate">{book.title}</h1>
          </div>
          {phase === "read" && (
            <motion.div
              key={page}
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-[110px] text-center leading-none mt-4"
              aria-hidden="true"
            >
              {book.emoji}
            </motion.div>
          )}
          {phase === "read" && book.kind === "video" && (
            <p className="text-center text-white font-extrabold text-sm mt-2">🎬 Video animado (simulado)</p>
          )}
        </div>

        <div className="flex-1 flex flex-col px-5 pt-6 pb-8">
          <AnimatePresence mode="wait">
            {phase === "read" && (
              <motion.div key={`p${page}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
                <ProgressBar value={((page + 1) / book.pages.length) * 100} className="h-2" />
                <p className="text-sm font-extrabold text-ink-soft mt-2">Página {page + 1} de {book.pages.length}</p>
                <p className={`read-text text-[28px] leading-relaxed font-bold mt-6 flex-1 ${playing ? "text-grape-dark" : ""}`}>{book.pages[page]}</p>

                <div className="flex items-center justify-between gap-3 mt-6">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    aria-label="Página anterior"
                    className="w-14 h-14 rounded-2xl bg-white border-2 border-line flex items-center justify-center disabled:opacity-30"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <Button
                    variant={playing ? "coral" : "mint"}
                    className="flex-1"
                    onClick={() => {
                      if (playing) stopSpeaking();
                      setPlaying(!playing);
                    }}
                  >
                    {playing ? <Pause size={22} /> : <Volume2 size={22} />}
                    {playing ? "Pausar" : book.kind === "cuento" ? "Escuchar" : "Reproducir"}
                  </Button>
                  <button
                    onClick={() => (last ? setPhase("quiz") : setPage(page + 1))}
                    aria-label={last ? "Terminar" : "Página siguiente"}
                    className="w-14 h-14 rounded-2xl bg-grape text-white flex items-center justify-center shadow-[0_4px_0_var(--color-grape-dark)]"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              </motion.div>
            )}

            {phase === "quiz" && question && (
              <motion.div key={`q${q}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <div className="flex items-end gap-2">
                  <Lumi size={70} mood="think" />
                  <p className="font-extrabold text-ink-soft mb-4">Pregunta {q + 1} de {book.questions.length}</p>
                </div>
                <h2 className="read-text text-2xl font-bold">{question.q}</h2>
                {question.options.map((o, k) => (
                  <motion.button
                    key={o}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => answer(k)}
                    className={`read-text rounded-3xl border-4 p-4 text-left text-xl font-bold ${
                      picked === null
                        ? "border-line bg-white"
                        : k === question.answer
                          ? "border-mint bg-mint-soft"
                          : picked === k
                            ? "border-coral bg-coral-soft"
                            : "border-line bg-white opacity-50"
                    }`}
                  >
                    {o}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {phase === "end" && (
              <motion.div key="end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-4">
                <Lumi size={130} mood="cheer" />
                <h2 className="text-3xl font-black">¡Terminaste el cuento!</h2>
                <p className="font-bold text-ink-soft text-lg">
                  Respondiste bien {correct} de {book.questions.length} preguntas.
                </p>
                <div className="flex gap-1 text-4xl" aria-label="Estrellas ganadas">
                  {[0, 1, 2].map((s) => (
                    <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + s * 0.15, type: "spring" }}>
                      {s < Math.max(1, Math.round((correct / book.questions.length) * 3)) ? "⭐" : "☆"}
                    </motion.span>
                  ))}
                </div>
                <Button full onClick={() => go("/biblioteca")}>Elegir otro cuento</Button>
                <Button full variant="ghost" onClick={() => go("/actividades")}>Dibujar un personaje del cuento</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PhoneFrame>
  );
}
