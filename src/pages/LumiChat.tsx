import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send, Volume2 } from "lucide-react";
import Lumi from "@/components/Lumi";
import { SoundWave } from "@/components/ui";
import { useStore } from "@/lib/store";

interface Msg {
  from: "lumi" | "me";
  text: string;
  audio?: boolean;
}

type Mode = "free" | "story-character" | "story-place" | "riddle";

const QUICK = ["¿Cuál es tu animal favorito?", "¿Querés inventar una historia juntos?", "Contame una adivinanza", "Decime una palabra nueva"];

const ANIMALS: Record<string, string> = {
  perro: "¡Los perros son súper leales! ¿Sabías que PERRO tiene dos R juntas? Suena fuerte: ¡rrr!",
  gato: "¡Miau! Los gatos duermen casi todo el día. GATO empieza con G, como GLOBO.",
  dinosaurio: "¡Rawr! DINOSAURIO es una palabra larguísima: di-no-sau-rio. ¡Tiene 4 sílabas!",
  pajaro: "¡Pío pío! Los pájaros cantan para hablar entre ellos, como nosotros con las palabras.",
  caballo: "¡Los caballos corren rapidísimo! CABALLO tiene LL, que suena como en LLUVIA.",
  leon: "¡El león es el rey de la selva! LEÓN lleva tilde en la O. ¿La ves?",
};

const RIDDLE = { q: "Blanca por dentro, verde por fuera. Si no sabés, esperá. ¿Qué es?", a: "pera" };
const WORDS = [
  "LUCIÉRNAGA: un bichito que brilla en la oscuridad. ¡Como yo! ✨",
  "ARCOÍRIS: los colores que aparecen cuando sale el sol después de la lluvia. 🌈",
  "VALIENTE: alguien que se anima a hacer algo aunque le dé un poquito de miedo. 💪",
];

function normalize(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function LumiChat() {
  const { state, earnStars } = useStore();
  const name = state.child!.name;
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "lumi", text: `¡Hola, ${name}! Soy Lumi. Me encanta charlar y aprender palabras nuevas. ¿De qué querés hablar?` },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mode, setMode] = useState<Mode>("free");
  const [storyChar, setStoryChar] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing]);

  const reply = (t: string, delay = 1100) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "lumi", text: t }]);
    }, delay);
  };

  const think = (input: string): string => {
    const n = normalize(input);
    if (mode === "story-character") {
      setStoryChar(input.trim());
      setMode("story-place");
      return `¡Me encanta! ¿Y dónde vive ${input.trim()}? ¿En el mar, en una montaña, en una nube…?`;
    }
    if (mode === "story-place") {
      setMode("free");
      earnStars(2);
      return `Había una vez ${storyChar} que vivía en ${input.trim()}. Una noche vio una lucecita que titilaba… ¡era yo, Lumi! Nos hicimos amigos y desde entonces leemos cuentos juntos. FIN. ⭐ ¡Ganaste 2 estrellas por inventar conmigo!`;
    }
    if (mode === "riddle") {
      setMode("free");
      return n.includes(RIDDLE.a) ? "¡Sííí! ¡Es la PERA! 🍐 Sos un genio de las adivinanzas." : "¡Casi! Era la PERA 🍐. Fijate: «si no sabés, ESPERA»… ¡la respuesta estaba escondida!";
    }
    if (n.includes("animal")) return "¡Me gustan todos! Pero las luciérnagas somos mis favoritas, obvio. ¿Y a vos cuál te gusta más?";
    const animal = Object.keys(ANIMALS).find((a) => n.includes(a));
    if (animal) return ANIMALS[animal];
    if (n.includes("historia") || n.includes("cuento") || n.includes("inventar")) {
      setMode("story-character");
      return "¡Sí! Inventemos una historia. ¿Quién es el protagonista? Puede ser un animal, una persona o algo mágico.";
    }
    if (n.includes("adivin")) {
      setMode("riddle");
      return `Ahí va: ${RIDDLE.q}`;
    }
    if (n.includes("palabra")) {
      setWordIdx((w) => w + 1);
      return `Palabra nueva: ${WORDS[wordIdx % WORDS.length]}`;
    }
    if (/\bhola\b/.test(n)) return `¡Hola, ${name}! ¿Leíste algún cuento hoy?`;
    if (/\b(si|sii+|claro)\b/.test(n)) return "¡Qué bueno! Leer todos los días te hace cada vez más fuerte con las palabras. 💜";
    if (/\bno\b/.test(n)) return "¡No pasa nada! Si querés, te recomiendo «El oso y la miel», es cortito y muy dulce. 🐻🍯";
    return "¡Qué interesante! Contame más. Si querés, podemos inventar una historia o te digo una palabra nueva.";
  };

  const send = (t: string, audio = false) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t, audio }]);
    setText("");
    reply(think(t));
  };

  const recordAudio = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      // El audio se "transcribe" con una respuesta posible según el momento de la charla.
      const said = mode === "story-character" ? "un perro astronauta" : mode === "story-place" ? "la luna" : mode === "riddle" ? "una pera" : "Me gusta el perro";
      send(said, true);
    }, 2500);
  };

  const speak = (t: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "es-AR";
    u.pitch = 1.3;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)]">
      <header className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-line bg-paper">
        <Lumi size={56} mood={typing ? "talk" : "happy"} float={false} />
        <div>
          <h1 className="text-xl font-black">Lumi</h1>
          <p className="text-sm font-bold text-mint">{typing ? "escribiendo…" : "Tu amiga luciérnaga"}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`max-w-[85%] rounded-3xl px-4 py-3 font-bold text-lg leading-snug ${
              m.from === "me" ? "self-end bg-grape text-white rounded-br-md" : "self-start bg-white border border-line rounded-bl-md"
            }`}
          >
            {m.audio && <span className="block text-sm opacity-80 mb-1">🎤 Audio · 0:03</span>}
            {m.text}
            {m.from === "lumi" && (
              <button onClick={() => speak(m.text)} aria-label="Escuchar mensaje" className="ml-2 align-middle text-grape">
                <Volume2 size={18} />
              </button>
            )}
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="self-start bg-white border border-line rounded-3xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((k) => (
                <motion.span key={k} className="w-2.5 h-2.5 rounded-full bg-grape" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: k * 0.15 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={end} />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full bg-grape-soft text-grape-dark font-extrabold text-sm px-4 py-2 border border-grape/20">
            {q}
          </button>
        ))}
      </div>

      <form
        className="flex items-center gap-2 px-4 pb-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={recordAudio}
          disabled={recording}
          aria-label="Mandar un audio"
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${recording ? "bg-coral text-white" : "bg-mint text-white"}`}
        >
          <Mic size={22} />
        </motion.button>
        {recording ? (
          <div className="flex-1 flex items-center gap-3 bg-coral-soft rounded-full px-4 h-12">
            <SoundWave bars={10} />
            <span className="font-bold text-coral text-sm">Grabando…</span>
          </div>
        ) : (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribile a Lumi…"
            aria-label="Mensaje para Lumi"
            className="flex-1 h-12 rounded-full bg-white border-2 border-line px-4 font-bold outline-none focus:border-grape"
          />
        )}
        <button type="submit" aria-label="Enviar" disabled={!text.trim()} className="w-12 h-12 rounded-full bg-grape text-white flex items-center justify-center shrink-0 disabled:opacity-40">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
