import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, Lock } from "lucide-react";
import { PhoneFrame } from "@/components/Shell";
import Lumi from "@/components/Lumi";
import { Button, SpeechBubble } from "@/components/ui";
import { AVATARS, INTERESTS } from "@/lib/content";
import { useStore, type FamilyProfile } from "@/lib/store";

type Step =
  | "who"
  | "k-name"
  | "k-age"
  | "k-avatar"
  | "k-likes"
  | "a-pin"
  | "a-child"
  | "a-context"
  | "a-prefs";

const KID_STEPS: Step[] = ["k-name", "k-age", "k-avatar", "k-likes"];
const ADULT_STEPS: Step[] = ["a-pin", "a-child", "a-context", "a-prefs"];

const READING_PREFS = ["Cuentos clásicos", "Animales", "Humor", "Aventuras", "Ciencia", "Poesía y canciones", "Leyendas de mi región"];
const LIMITS = [15, 20, 30, 45];

const inputCls =
  "w-full rounded-2xl border-2 border-line bg-white px-4 py-3.5 text-lg font-bold outline-none focus:border-grape placeholder:text-ink-soft/50";

export default function Onboarding() {
  const [, go] = useLocation();
  const { update, setFamilyUnlocked } = useStore();
  const [step, setStep] = useState<Step>("who");

  // datos del niño
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [likes, setLikes] = useState<string[]>([]);

  // datos del adulto
  const [pin, setPin] = useState("");
  const [family, setFamily] = useState<FamilyProfile>({
    adultName: "",
    relation: "Mamá",
    context: "",
    location: "",
    culture: "",
    readingPrefs: [],
  });
  const [limit, setLimit] = useState(30);

  const flow = step.startsWith("a-") ? ADULT_STEPS : KID_STEPS;
  const idx = flow.indexOf(step);

  const back = () => setStep(idx <= 0 ? "who" : flow[idx - 1]);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const finishKid = () => {
    update(() => ({ child: { name: name.trim(), age: age ?? 6, avatar, interests: likes } }));
    go("/diagnostico");
  };

  const finishAdult = () => {
    update(() => ({
      child: { name: name.trim(), age: age ?? 6, avatar, interests: likes },
      family,
      dailyLimit: limit,
    }));
    setFamilyUnlocked(true);
    go("/diagnostico");
  };

  const lumiLine: Record<Step, string> = {
    who: "¡Hola! Soy Lumi, una luciérnaga que ama los cuentos. ¿Quién está usando Panka?",
    "k-name": "¿Cómo te llamás?",
    "k-age": `¡Qué lindo nombre, ${name.trim() || "amigo"}! ¿Cuántos años tenés?`,
    "k-avatar": "Elegí tu compañero de aventuras.",
    "k-likes": "¿Qué cosas te gustan? Podés elegir varias.",
    "a-pin": "Esta parte es para personas grandes.",
    "a-child": "Contanos sobre quien va a leer.",
    "a-context": "Así elegimos cuentos cercanos a su mundo.",
    "a-prefs": "Último paso: lecturas y tiempo de uso.",
  };

  return (
    <PhoneFrame>
      <div className="min-h-screen flex flex-col px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 h-10">
          {step !== "who" && (
            <button onClick={back} aria-label="Volver" className="w-10 h-10 rounded-2xl bg-white border border-line flex items-center justify-center">
              <ChevronLeft size={22} />
            </button>
          )}
          {step !== "who" && (
            <div className="flex-1 flex gap-1.5" aria-label={`Paso ${idx + 1} de ${flow.length}`}>
              {flow.map((s, i) => (
                <div key={s} className={`h-2 flex-1 rounded-full ${i <= idx ? "bg-grape" : "bg-line"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-end gap-2 mt-4 mb-6">
          <Lumi size={step === "who" ? 110 : 80} mood={step === "k-likes" || step === "a-prefs" ? "cheer" : "talk"} />
          <SpeechBubble className="flex-1 mb-6 text-lg leading-snug">{lumiLine[step]}</SpeechBubble>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {step === "who" && (
              <div className="grid gap-4">
                <RoleCard emoji="🧒" title="Soy un chico o una chica" desc="Quiero leer, jugar y crear cuentos" color="bg-sun-soft" onClick={() => setStep("k-name")} />
                <RoleCard emoji="👨‍👩‍👧" title="Soy una persona adulta" desc="Acompaño a un chico o una chica" color="bg-mint-soft" onClick={() => setStep("a-pin")} />
              </div>
            )}

            {step === "k-name" && (
              <>
                <label htmlFor="kid-name" className="sr-only">Tu nombre</label>
                <input id="kid-name" className={`${inputCls} text-center text-2xl`} placeholder="Tu nombre" value={name} maxLength={20} autoFocus onChange={(e) => setName(e.target.value)} />
                <div className="mt-auto pt-6">
                  <Button full disabled={!name.trim()} onClick={() => setStep("k-age")}>Seguir</Button>
                </div>
              </>
            )}

            {(step === "k-age" || step === "a-child") && (
              <>
                {step === "a-child" && (
                  <>
                    <label className="font-extrabold mb-2" htmlFor="child-name">Nombre de la chica o el chico</label>
                    <input id="child-name" className={`${inputCls} mb-5`} placeholder="Por ejemplo, Sofía" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
                    <p className="font-extrabold mb-2">Edad</p>
                  </>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {[5, 6, 7, 8].map((a) => (
                    <motion.button
                      key={a}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setAge(a)}
                      aria-pressed={age === a}
                      className={`h-24 rounded-3xl text-4xl font-black border-4 transition-colors ${age === a ? "bg-grape text-white border-grape" : "bg-white border-line"}`}
                    >
                      {a}
                      <span className="block text-sm font-extrabold">años</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <Button full disabled={!age || !name.trim()} onClick={() => setStep(step === "k-age" ? "k-avatar" : "a-context")}>Seguir</Button>
                </div>
              </>
            )}

            {step === "k-avatar" && (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((a) => (
                    <motion.button
                      key={a}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setAvatar(a)}
                      aria-pressed={avatar === a}
                      aria-label={`Personaje ${a}`}
                      className={`aspect-square rounded-3xl text-4xl border-4 ${avatar === a ? "border-grape bg-grape-soft" : "border-line bg-white"}`}
                    >
                      {a}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <Button full onClick={() => setStep("k-likes")}>Seguir</Button>
                </div>
              </>
            )}

            {step === "k-likes" && (
              <>
                <InterestGrid likes={likes} onToggle={(id) => setLikes(toggle(likes, id))} />
                <div className="mt-auto pt-6">
                  <Button full onClick={finishKid}>¡Vamos!</Button>
                </div>
              </>
            )}

            {step === "a-pin" && (
              <>
                <div className="bg-white rounded-3xl border border-line p-5">
                  <div className="flex items-center gap-2 font-extrabold mb-3">
                    <Lock size={18} /> Creá una clave para la zona de familias
                  </div>
                  <input
                    className={`${inputCls} text-center tracking-[0.6em] text-2xl`}
                    inputMode="numeric"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    aria-label="Clave de 4 números"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  />
                  <p className="text-sm text-ink-soft font-semibold mt-3">
                    Es una demo: cualquier clave de 4 números funciona. Para volver a entrar, usá <b>1234</b>.
                  </p>
                </div>
                <div className="mt-auto pt-6">
                  <Button full disabled={pin.length !== 4} onClick={() => setStep("a-child")}>Seguir</Button>
                </div>
              </>
            )}

            {step === "a-context" && (
              <div className="flex flex-col gap-4">
                <Field label="Tu nombre">
                  <div className="flex gap-2">
                    <input className={inputCls} placeholder="Tu nombre" value={family.adultName} onChange={(e) => setFamily({ ...family, adultName: e.target.value })} />
                    <select
                      aria-label="Vínculo"
                      className="rounded-2xl border-2 border-line bg-white px-3 font-bold"
                      value={family.relation}
                      onChange={(e) => setFamily({ ...family, relation: e.target.value })}
                    >
                      {["Mamá", "Papá", "Abuela/o", "Tía/o", "Cuidador/a", "Docente"].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </Field>
                <Field label="¿Con quién vive?">
                  <input className={inputCls} placeholder="Ej.: con mamá, la abuela y un hermano" value={family.context} onChange={(e) => setFamily({ ...family, context: e.target.value })} />
                </Field>
                <Field label="¿Dónde viven?">
                  <input className={inputCls} placeholder="Ej.: Rosario, Santa Fe" value={family.location} onChange={(e) => setFamily({ ...family, location: e.target.value })} />
                </Field>
                <Field label="Costumbres, cultura e idiomas de la familia">
                  <input className={inputCls} placeholder="Ej.: hablamos guaraní, vamos al río los domingos" value={family.culture} onChange={(e) => setFamily({ ...family, culture: e.target.value })} />
                </Field>
                <Field label="¿Qué le gusta?">
                  <InterestGrid likes={likes} onToggle={(id) => setLikes(toggle(likes, id))} small />
                </Field>
                <Button full onClick={() => setStep("a-prefs")}>Seguir</Button>
              </div>
            )}

            {step === "a-prefs" && (
              <div className="flex flex-col gap-5">
                <Field label="Preferencias de lectura">
                  <div className="flex flex-wrap gap-2">
                    {READING_PREFS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setFamily({ ...family, readingPrefs: toggle(family.readingPrefs, p) })}
                        aria-pressed={family.readingPrefs.includes(p)}
                        className={`rounded-full px-4 py-2 font-bold border-2 ${family.readingPrefs.includes(p) ? "bg-grape border-grape text-white" : "bg-white border-line"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Tiempo máximo de uso por día">
                  <div className="grid grid-cols-4 gap-2">
                    {LIMITS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLimit(l)}
                        aria-pressed={limit === l}
                        className={`rounded-2xl py-3 font-black border-2 ${limit === l ? "bg-mint border-mint text-white" : "bg-white border-line"}`}
                      >
                        {l}
                        <span className="block text-xs font-bold">min</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-ink-soft font-semibold mt-2">Para chicos de 5 a 8 años se recomiendan entre 20 y 30 minutos de lectura con pantalla por día.</p>
                </Field>
                <div className="bg-sun-soft rounded-2xl p-4 font-bold text-sm">
                  Ahora le toca a {name.trim() || "tu hijo/a"}: vamos a jugar un ratito para conocer su nivel. ¡Pasale el dispositivo!
                </div>
                <Button full onClick={finishAdult}>Empezar</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}

function RoleCard({ emoji, title, desc, color, onClick }: { emoji: string; title: string; desc: string; color: string; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} className={`${color} rounded-3xl p-5 flex items-center gap-4 text-left border-2 border-white shadow-[0_4px_0_var(--color-line)]`}>
      <span className="text-5xl">{emoji}</span>
      <span>
        <span className="block text-xl font-black">{title}</span>
        <span className="block font-semibold text-ink-soft">{desc}</span>
      </span>
    </motion.button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-extrabold mb-2">{label}</p>
      {children}
    </div>
  );
}

function InterestGrid({ likes, onToggle, small }: { likes: string[]; onToggle: (id: string) => void; small?: boolean }) {
  return (
    <div className={`grid ${small ? "grid-cols-4 gap-2" : "grid-cols-2 gap-3"}`}>
      {INTERESTS.map((it) => {
        const on = likes.includes(it.id);
        return (
          <motion.button
            key={it.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onToggle(it.id)}
            aria-pressed={on}
            className={`rounded-2xl border-2 font-extrabold flex items-center gap-2 ${small ? "flex-col py-2 text-xs" : "px-4 py-3 text-base"} ${
              on ? "bg-grape-soft border-grape text-grape-dark" : "bg-white border-line"
            }`}
          >
            <span className={small ? "text-2xl" : "text-3xl"}>{it.emoji}</span>
            {it.label}
          </motion.button>
        );
      })}
    </div>
  );
}
