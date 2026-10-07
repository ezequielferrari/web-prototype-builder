import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";
import Lumi from "@/components/Lumi";
import TraceLetter from "@/components/TraceLetter";
import { Button, PageHeader, SpeechBubble, celebrate } from "@/components/ui";
import { useStore, type CreatedStory } from "@/lib/store";

const CHARACTERS = [
  { id: "dragona", label: "una dragona", name: "Dragona", emoji: "🐉" },
  { id: "robot", label: "un robot", name: "Robot", emoji: "🤖" },
  { id: "gata", label: "una gata", name: "Gata", emoji: "🐱" },
  { id: "astronauta", label: "un astronauta", name: "Astronauta", emoji: "🧑‍🚀" },
  { id: "hada", label: "un hada", name: "Hada", emoji: "🧚" },
  { id: "dino", label: "un dinosaurio", name: "Dino", emoji: "🦕" },
];

const PLACES = [
  { id: "bosque", label: "un bosque encantado", emoji: "🌲", bg: "from-emerald-200 to-lime-100" },
  { id: "mar", label: "el fondo del mar", emoji: "🌊", bg: "from-sky-300 to-cyan-100" },
  { id: "espacio", label: "el espacio", emoji: "🪐", bg: "from-indigo-300 to-violet-200" },
  { id: "castillo", label: "un castillo", emoji: "🏰", bg: "from-pink-200 to-amber-100" },
  { id: "ciudad", label: "una ciudad grande", emoji: "🏙️", bg: "from-slate-200 to-sky-100" },
  { id: "selva", label: "la selva", emoji: "🌴", bg: "from-green-300 to-yellow-100" },
];

const FIND_WORDS = ["un mapa", "una llave", "un huevo", "una estrella", "un sombrero", "una pelota"];
const FEELINGS = ["muy feliz", "muy valiente", "con mucha curiosidad", "con ganas de bailar"];
const STICKERS = ["⭐", "🌈", "🎈", "🍭", "🦋", "🌸", "⚡", "🍕", "🎁", "🐞", "☁️", "💎"];

type Step = "trace" | "character" | "place" | "sentence" | "stickers" | "making" | "preview";
const ORDER: Step[] = ["trace", "character", "place", "sentence", "stickers"];

export default function Crear() {
  const { state, update, earnStars, unlockBadge } = useStore();
  const child = state.child!;
  const letter = (child.name.trim()[0] ?? "A").toUpperCase();
  const [step, setStep] = useState<Step>("trace");
  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [place, setPlace] = useState(PLACES[0]);
  const [found, setFound] = useState("");
  const [feeling, setFeeling] = useState(FEELINGS[0]);
  const [stickers, setStickers] = useState<string[]>([]);
  const [story, setStory] = useState<CreatedStory | null>(null);

  const idx = ORDER.indexOf(step);
  const go = (s: Step) => setStep(s);

  const make = () => {
    setStep("making");
    const title = `${character.name} y ${found || "el gran secreto"}`;
    const text = [
      `Había una vez ${character.label} que vivía en ${place.label}.`,
      `Un día, mientras jugaba, encontró ${found || "algo brillante"} escondido entre las hojas.`,
      `Se sintió ${feeling} y decidió buscar a sus amigos para compartir el descubrimiento.`,
      `Juntos vivieron una aventura increíble y aprendieron que las mejores cosas se disfrutan en compañía.`,
      `Fin. Un cuento de ${child.name}.`,
    ].join(" ");
    const s: CreatedStory = { id: String(Date.now()), title, character: character.emoji, place: place.id, text, stickers };
    setTimeout(() => {
      setStory(s);
      update((st) => ({ stories: [s, ...st.stories] }));
      earnStars(5);
      unlockBadge("escritor");
      setStep("preview");
      celebrate();
    }, 2200);
  };

  const restart = () => {
    setStory(null);
    setStickers([]);
    setFound("");
    setStep("trace");
  };

  const lumiSays: Partial<Record<Step, string>> = {
    trace: `Primero, trazá la letra ${letter}, la de tu nombre.`,
    character: "¿Quién va a ser el protagonista?",
    place: "¿Dónde pasa la historia?",
    sentence: "Completá la frase con las palabras que quieras.",
    stickers: "¡Decorá tu cuento con stickers!",
  };

  return (
    <div>
      <PageHeader title="Crear mi cuento" subtitle={idx >= 0 ? `Paso ${idx + 1} de ${ORDER.length}` : undefined} />
      <div className="px-5">
        {idx >= 0 && (
          <>
            <div className="flex gap-1.5 mb-4">
              {ORDER.map((s, i) => (
                <div key={s} className={`h-2 flex-1 rounded-full ${i <= idx ? "bg-sun" : "bg-line"}`} />
              ))}
            </div>
            <div className="flex items-end gap-1 mb-4">
              <Lumi size={60} mood="talk" />
              <SpeechBubble className="flex-1 mb-3">{lumiSays[step]}</SpeechBubble>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {step === "trace" && <TraceLetter letter={letter} onDone={() => go("character")} />}

            {step === "character" && (
              <PickGrid items={CHARACTERS} selected={character.id} onPick={(c) => setCharacter(c)} render={(c) => (
                <>
                  <span className="text-5xl">{c.emoji}</span>
                  <span className="font-black">{c.name}</span>
                </>
              )} />
            )}

            {step === "place" && (
              <PickGrid items={PLACES} selected={place.id} onPick={(p) => setPlace(p)} render={(p) => (
                <>
                  <span className="text-5xl">{p.emoji}</span>
                  <span className="font-black text-sm text-center leading-tight capitalize">{p.label}</span>
                </>
              )} />
            )}

            {step === "sentence" && (
              <div className="flex flex-col gap-4">
                <p className="read-text text-2xl font-bold leading-relaxed bg-white rounded-3xl border border-line p-5">
                  Había una vez {character.label} {character.emoji} que vivía en {place.label}. Un día encontró{" "}
                  <span className={`inline-block min-w-24 border-b-4 ${found ? "border-grape text-grape" : "border-dashed border-ink-soft/40"}`}>{found || " "}</span>{" "}
                  y se sintió <span className="text-coral">{feeling}</span>.
                </p>
                <div>
                  <p className="font-extrabold mb-2">Palabras sugeridas</p>
                  <div className="flex flex-wrap gap-2">
                    {FIND_WORDS.map((w) => (
                      <motion.button
                        key={w}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setFound(w)}
                        aria-pressed={found === w}
                        className={`read-text rounded-2xl px-4 py-2.5 text-lg font-bold border-2 ${found === w ? "bg-grape border-grape text-white" : "bg-white border-line"}`}
                      >
                        {w}
                      </motion.button>
                    ))}
                  </div>
                  <label className="block mt-3">
                    <span className="sr-only">Escribí tu propia palabra</span>
                    <input
                      value={FIND_WORDS.includes(found) ? "" : found}
                      onChange={(e) => setFound(e.target.value)}
                      placeholder="…o escribí la tuya"
                      maxLength={30}
                      className="read-text w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg font-bold outline-none focus:border-grape"
                    />
                  </label>
                </div>
                <div>
                  <p className="font-extrabold mb-2">¿Cómo se sintió?</p>
                  <div className="flex flex-wrap gap-2">
                    {FEELINGS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFeeling(f)}
                        aria-pressed={feeling === f}
                        className={`read-text rounded-2xl px-4 py-2 text-lg font-bold border-2 ${feeling === f ? "bg-coral border-coral text-white" : "bg-white border-line"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "stickers" && (
              <div className="flex flex-col gap-4">
                <div className={`relative h-44 rounded-3xl bg-gradient-to-br ${place.bg} flex items-center justify-center text-7xl overflow-hidden`}>
                  {character.emoji}
                  {stickers.map((s, k) => (
                    <motion.span
                      key={`${s}-${k}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute text-3xl"
                      style={{ left: `${8 + ((k * 29) % 80)}%`, top: `${8 + ((k * 41) % 70)}%` }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {STICKERS.map((s) => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setStickers(stickers.includes(s) ? stickers.filter((x) => x !== s) : [...stickers, s])}
                      aria-pressed={stickers.includes(s)}
                      aria-label={`Sticker ${s}`}
                      className={`aspect-square rounded-2xl text-3xl border-2 ${stickers.includes(s) ? "bg-sun-soft border-sun" : "bg-white border-line"}`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === "making" && (
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <Lumi size={130} mood="think" />
                <p className="text-2xl font-black">Lumi está armando tu cuento…</p>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                  <Sparkles className="text-sun" size={36} />
                </motion.div>
              </div>
            )}

            {step === "preview" && story && (
              <div className="flex flex-col gap-4">
                <article className="bg-white rounded-3xl border-2 border-line overflow-hidden shadow-[0_6px_0_var(--color-line)]">
                  <div className={`relative h-48 bg-gradient-to-br ${place.bg} flex items-center justify-center text-8xl`}>
                    {story.character}
                    {story.stickers.map((s, k) => (
                      <span key={k} className="absolute text-3xl" style={{ left: `${8 + ((k * 29) % 80)}%`, top: `${8 + ((k * 41) % 70)}%` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="p-5">
                    <h2 className="read-text text-2xl font-bold text-grape-dark mb-3">{story.title}</h2>
                    <p className="read-text text-xl leading-relaxed">{story.text}</p>
                  </div>
                </article>
                <p className="text-center font-black text-mint">¡Guardado en tu perfil! +5 estrellas</p>
                <Button full onClick={restart}>Crear otro cuento</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {idx > 0 && (
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => go(ORDER[idx - 1])} aria-label="Paso anterior">
              <ChevronLeft size={22} />
            </Button>
            {step === "stickers" ? (
              <Button variant="coral" className="flex-1" onClick={make}>
                <Sparkles size={20} /> Crear mi cuento
              </Button>
            ) : (
              <Button className="flex-1" disabled={step === "sentence" && !found.trim()} onClick={() => go(ORDER[idx + 1])}>
                Seguir
              </Button>
            )}
          </div>
        )}

        {step === "trace" && state.stories.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black mb-3">Mis cuentos</h2>
            <ul className="flex flex-col gap-2">
              {state.stories.slice(0, 4).map((s) => (
                <li key={s.id} className="bg-white rounded-2xl border border-line p-3 flex items-center gap-3">
                  <span className="text-3xl">{s.character}</span>
                  <span className="read-text font-bold">{s.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function PickGrid<T extends { id: string }>({
  items,
  selected,
  onPick,
  render,
}: {
  items: T[];
  selected: string;
  onPick: (t: T) => void;
  render: (t: T) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((it) => (
        <motion.button
          key={it.id}
          whileTap={{ scale: 0.93 }}
          onClick={() => onPick(it)}
          aria-pressed={selected === it.id}
          className={`rounded-3xl border-4 p-4 flex flex-col items-center gap-2 min-h-32 justify-center ${
            selected === it.id ? "border-grape bg-grape-soft" : "border-line bg-white"
          }`}
        >
          {render(it)}
        </motion.button>
      ))}
    </div>
  );
}
