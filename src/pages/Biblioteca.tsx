import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { BookOpen, Headphones, Heart, Play, Video } from "lucide-react";
import { Chip, PageHeader } from "@/components/ui";
import { AGE_BANDS, BOOKS, LEVEL_NAMES, ageToBand, type AgeBand, type BookKind, type Level } from "@/lib/content";
import { useStore } from "@/lib/store";

const KIND_ICON: Record<BookKind, typeof BookOpen> = { cuento: BookOpen, audio: Headphones, video: Video };
const KIND_LABEL: Record<BookKind, string> = { cuento: "Cuento", audio: "Audiolibro", video: "Video" };

export default function Biblioteca() {
  const [, go] = useLocation();
  const { state, update } = useStore();
  const [age, setAge] = useState<AgeBand>(ageToBand(state.child!.age));
  const [level, setLevel] = useState<Level | 0>(0);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const books = BOOKS.filter(
    (b) => (onlyFavs ? state.favorites.includes(b.id) : b.age === age && (level === 0 || b.level === level)),
  );

  const toggleFav = (id: string) =>
    update((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }));

  return (
    <div>
      <PageHeader title="Cuentos" subtitle="Cuentos, audiolibros y videos" />

      <div className="px-5">
        <div className="bg-white border border-line rounded-2xl p-1 flex gap-1" role="tablist" aria-label="Edad">
          {AGE_BANDS.map((a) => (
            <button
              key={a}
              role="tab"
              aria-selected={!onlyFavs && age === a}
              onClick={() => {
                setAge(a);
                setOnlyFavs(false);
              }}
              className="relative flex-1 py-2.5 font-extrabold rounded-xl"
            >
              {!onlyFavs && age === a && <motion.span layoutId="age-pill" className="absolute inset-0 bg-grape rounded-xl" />}
              <span className={`relative ${!onlyFavs && age === a ? "text-white" : "text-ink-soft"}`}>{a} años</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-4">
        <Chip active={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)}>❤️ Favoritos</Chip>
        <Chip active={!onlyFavs && level === 0} onClick={() => { setLevel(0); setOnlyFavs(false); }}>Todos</Chip>
        {([1, 2, 3] as Level[]).map((l) => (
          <Chip key={l} active={!onlyFavs && level === l} onClick={() => { setLevel(l); setOnlyFavs(false); }}>
            Nivel {l} · {LEVEL_NAMES[l]}
          </Chip>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${age}-${level}-${onlyFavs}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-5 grid grid-cols-2 gap-3"
        >
          {books.length === 0 && (
            <p className="col-span-2 text-center font-bold text-ink-soft py-10">
              {onlyFavs ? "Todavía no tenés favoritos. Tocá el corazón de un cuento para guardarlo." : "No hay cuentos con este filtro."}
            </p>
          )}
          {books.map((b, i) => {
            const Icon = KIND_ICON[b.kind];
            const fav = state.favorites.includes(b.id);
            const p = state.bookProgress[b.id] ?? 0;
            return (
              <motion.article
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-line overflow-hidden shadow-[0_3px_0_var(--color-line)]"
              >
                <div className={`relative h-32 bg-gradient-to-br ${b.cover} flex items-center justify-center text-6xl`}>
                  <button onClick={() => go(`/biblioteca/${b.id}`)} aria-label={`Abrir ${b.title}`} className="absolute inset-0 flex items-center justify-center">
                    {b.emoji}
                  </button>
                  <button
                    onClick={() => toggleFav(b.id)}
                    aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
                    aria-pressed={fav}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
                  >
                    <motion.span key={String(fav)} initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                      <Heart size={18} className={fav ? "text-coral fill-coral" : "text-ink-soft"} />
                    </motion.span>
                  </button>
                  <span className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-extrabold flex items-center gap-1">
                    <Icon size={12} /> {KIND_LABEL[b.kind]}
                  </span>
                  {p > 0 && (
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/40">
                      <div className="h-full bg-white" style={{ width: `${p}%` }} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-black leading-tight min-h-10">{b.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-ink-soft">
                      {p === 100 ? "✅ Leído" : p > 0 ? `${p}%` : `${b.minutes} min`}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => go(`/biblioteca/${b.id}`)}
                      aria-label={`Reproducir ${b.title}`}
                      className="w-10 h-10 rounded-full bg-grape text-white flex items-center justify-center shadow-[0_3px_0_var(--color-grape-dark)]"
                    >
                      <Play size={16} className="fill-white ml-0.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
