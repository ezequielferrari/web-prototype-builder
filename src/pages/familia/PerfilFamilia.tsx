import { useState } from "react";
import { useLocation } from "wouter";
import { Button, Card, PageHeader, ResetDemo } from "@/components/ui";
import { AVATARS, INTERESTS } from "@/lib/content";
import { useStore, type FamilyProfile } from "@/lib/store";

const READING_PREFS = ["Cuentos clásicos", "Animales", "Humor", "Aventuras", "Ciencia", "Poesía y canciones", "Leyendas de mi región"];
const input = "w-full rounded-2xl border-2 border-line bg-white px-4 py-3 font-bold outline-none focus:border-grape";

export default function PerfilFamilia() {
  const [, go] = useLocation();
  const { state, update, toast } = useStore();
  const [child, setChild] = useState(state.child!);
  const [fam, setFam] = useState<FamilyProfile>(
    state.family ?? { adultName: "", relation: "Mamá", context: "", location: "", culture: "", readingPrefs: [] },
  );

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const save = () => {
    update(() => ({ child: { ...child, name: child.name.trim() || state.child!.name }, family: fam }));
    toast("Cambios guardados", "✅");
  };

  return (
    <div>
      <PageHeader title="Personalización" subtitle="Para recomendar cuentos cercanos a su mundo" />
      <div className="px-5 flex flex-col gap-4">
        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-black text-lg">Sobre {child.name}</h2>
          <label className="font-extrabold">
            Nombre
            <input className={`${input} mt-1`} value={child.name} onChange={(e) => setChild({ ...child, name: e.target.value })} />
          </label>
          <div>
            <p className="font-extrabold mb-1">Edad</p>
            <div className="grid grid-cols-4 gap-2">
              {[5, 6, 7, 8].map((a) => (
                <button key={a} onClick={() => setChild({ ...child, age: a })} aria-pressed={child.age === a} className={`rounded-2xl py-2.5 font-black border-2 ${child.age === a ? "bg-grape border-grape text-white" : "bg-white border-line"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-extrabold mb-1">Personaje</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setChild({ ...child, avatar: a })} aria-pressed={child.avatar === a} className={`shrink-0 w-12 h-12 rounded-2xl text-2xl border-2 ${child.avatar === a ? "border-grape bg-grape-soft" : "border-line bg-white"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-extrabold mb-1">Intereses</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setChild({ ...child, interests: toggle(child.interests, i.id) })}
                  aria-pressed={child.interests.includes(i.id)}
                  className={`rounded-full px-3 py-1.5 font-bold border-2 text-sm ${child.interests.includes(i.id) ? "bg-grape-soft border-grape text-grape-dark" : "bg-white border-line"}`}
                >
                  {i.emoji} {i.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-black text-lg">Contexto familiar</h2>
          <label className="font-extrabold">
            Tu nombre
            <input className={`${input} mt-1`} value={fam.adultName} onChange={(e) => setFam({ ...fam, adultName: e.target.value })} />
          </label>
          <label className="font-extrabold">
            ¿Con quién vive?
            <input className={`${input} mt-1`} placeholder="Ej.: con mamá, la abuela y un hermano" value={fam.context} onChange={(e) => setFam({ ...fam, context: e.target.value })} />
          </label>
          <label className="font-extrabold">
            Ubicación
            <input className={`${input} mt-1`} placeholder="Ej.: Rosario, Santa Fe" value={fam.location} onChange={(e) => setFam({ ...fam, location: e.target.value })} />
          </label>
          <label className="font-extrabold">
            Cultura, costumbres e idiomas
            <input className={`${input} mt-1`} placeholder="Ej.: hablamos guaraní en casa" value={fam.culture} onChange={(e) => setFam({ ...fam, culture: e.target.value })} />
          </label>
          <div>
            <p className="font-extrabold mb-1">Preferencias de lectura</p>
            <div className="flex flex-wrap gap-2">
              {READING_PREFS.map((p) => (
                <button
                  key={p}
                  onClick={() => setFam({ ...fam, readingPrefs: toggle(fam.readingPrefs, p) })}
                  aria-pressed={fam.readingPrefs.includes(p)}
                  className={`rounded-full px-3 py-1.5 font-bold border-2 text-sm ${fam.readingPrefs.includes(p) ? "bg-grape border-grape text-white" : "bg-white border-line"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Button full onClick={save}>Guardar cambios</Button>
        <Button full variant="ghost" onClick={() => go("/familia/bienestar")}>Ajustar tiempo de uso ({state.dailyLimit} min)</Button>
        <ResetDemo />
      </div>
    </div>
  );
}
