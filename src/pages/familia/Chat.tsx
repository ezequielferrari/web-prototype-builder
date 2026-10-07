import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, Mic, Play, Send } from "lucide-react";
import { BOOKS, LEVEL_NAMES } from "@/lib/content";
import { nowTime, useStore, type ChatMessage } from "@/lib/store";

// Chat estilo WhatsApp con el asistente de Panka para la familia (simulado).

const QUICK = ["¿Cómo viene esta semana?", "Proponeme una actividad", "Recordame leer a las 19", "¿Qué cuento le recomendás?"];

export default function ChatFamilia() {
  const { state, update } = useStore();
  const child = state.child!;
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  const msgs: ChatMessage[] = state.familyChat.length
    ? state.familyChat
    : [
        { from: "bot", text: `¡Hola${state.family?.adultName ? `, ${state.family.adultName}` : ""}! 👋 Soy el asistente de Panka. Por acá te cuento cómo viene ${child.name} y te mando ideas para leer en casa.`, time: "09:00" },
        { from: "bot", text: `📊 Resumen de ayer: ${child.name} leyó 18 minutos y ganó 4 estrellas ⭐. ¡Va muy bien!`, time: "09:01" },
      ];

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs.length, typing]);

  const answer = (t: string): string => {
    const n = t.toLowerCase();
    const level = state.diagnostic?.level ?? 1;
    if (n.includes("semana") || n.includes("viene") || n.includes("progreso")) {
      const read = Object.values(state.bookProgress).filter((p) => p === 100).length;
      return `📈 Esta semana ${child.name}:\n• Leyó ${101 + state.usageToday} minutos\n• Terminó ${read} cuento${read === 1 ? "" : "s"}\n• Creó ${state.stories.length} cuento${state.stories.length === 1 ? "" : "s"} propio${state.stories.length === 1 ? "" : "s"}\n• Ganó ${state.stars} estrellas ⭐\nEstá en nivel ${level} (${LEVEL_NAMES[level]}). ¡Felicitalo/a hoy! 🎉`;
    }
    if (n.includes("actividad")) return "🔎 Idea para hoy: jueguen a «cazar letras». Elijan una letra (por ejemplo, la M) y busquen 3 cosas de la casa que empiecen con ella. Si sacan una foto, la suben en «Fuera de la pantalla».";
    if (n.includes("record") || n.includes("19")) return "⏰ ¡Listo! Te voy a escribir todos los días a las 19:00 para recordarte el momento de lectura.";
    if (n.includes("cuento") || n.includes("recomend")) {
      const b = BOOKS.find((x) => x.level === level && (state.bookProgress[x.id] ?? 0) < 100) ?? BOOKS[0];
      return `📚 Te recomiendo «${b.title}» ${b.emoji}. Es de nivel ${b.level} y dura ${b.minutes} minutos. Después de leerlo, preguntale qué parte le gustó más.`;
    }
    if (n.includes("audio")) return "🎧 ¡Gracias por el audio! Lo guardé para que lo escuche el equipo de Panka.";
    return "¡Gracias por escribir! Podés preguntarme cómo viene, pedirme una actividad o un cuento recomendado. 😊";
  };

  const send = (t: string, audio = false) => {
    if (!t.trim()) return;
    const mine: ChatMessage = { from: "me", text: t, audio, time: nowTime() };
    update(() => ({ familyChat: [...msgs, mine] }));
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      update((s) => ({ familyChat: [...(s.familyChat.length ? s.familyChat : [...msgs, mine]), { from: "bot", text: answer(t), time: nowTime() }] }));
    }, 1300);
  };

  const recordAudio = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      send("Audio", true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8.5rem)]">
      <header className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
        <img src="./panka-symbol.png" alt="" className="w-11 h-11 rounded-full bg-white p-1.5 object-contain" />
        <div>
          <h1 className="font-black leading-tight">Panka · Asistente</h1>
          <p className="text-xs font-semibold opacity-80">{typing ? "escribiendo…" : "en línea"}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5 bg-[#efe7dd] bg-[radial-gradient(#e2d6c6_1px,transparent_1px)] [background-size:18px_18px]">
        <span className="self-center bg-white/80 rounded-lg px-3 py-1 text-xs font-bold text-ink-soft mb-1">HOY</span>
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[82%] rounded-xl px-3 py-2 text-[15px] shadow-sm whitespace-pre-line ${m.from === "me" ? "self-end bg-[#d9fdd3] rounded-tr-sm" : "self-start bg-white rounded-tl-sm"}`}
          >
            {m.audio ? (
              <span className="flex items-center gap-2 min-w-44">
                <Play size={18} className="text-[#075e54] fill-[#075e54]" />
                <span className="flex-1 h-1 rounded-full bg-[#075e54]/30">
                  <span className="block h-full w-1/3 bg-[#075e54] rounded-full" />
                </span>
                <span className="text-xs text-ink-soft">0:04</span>
              </span>
            ) : (
              m.text
            )}
            <span className="flex items-center justify-end gap-1 text-[11px] text-ink-soft mt-0.5">
              {m.time}
              {m.from === "me" && <CheckCheck size={14} className="text-sky" />}
            </span>
          </motion.div>
        ))}
        {typing && (
          <div className="self-start bg-white rounded-xl px-3 py-2.5 flex gap-1 shadow-sm">
            {[0, 1, 2].map((k) => (
              <motion.span key={k} className="w-2 h-2 rounded-full bg-ink-soft" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.2 }} />
            ))}
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="bg-[#efe7dd] flex gap-2 overflow-x-auto no-scrollbar px-3 py-2">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full bg-white text-[#075e54] font-bold text-sm px-3 py-1.5 shadow-sm">
            {q}
          </button>
        ))}
      </div>

      <form
        className="bg-[#efe7dd] flex items-center gap-2 px-3 pb-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <input
          value={recording ? "🔴 Grabando audio…" : text}
          readOnly={recording}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mensaje"
          aria-label="Mensaje"
          className="flex-1 h-12 rounded-full bg-white px-4 font-semibold outline-none"
        />
        {text.trim() ? (
          <button type="submit" aria-label="Enviar" className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center">
            <Send size={20} />
          </button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={recordAudio}
            aria-label="Grabar audio"
            className={`w-12 h-12 rounded-full text-white flex items-center justify-center ${recording ? "bg-coral" : "bg-[#00a884]"}`}
          >
            <Mic size={22} />
          </motion.button>
        )}
      </form>
    </div>
  );
}
