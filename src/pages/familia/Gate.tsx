import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Delete, Lock, X } from "lucide-react";
import { PhoneFrame } from "@/components/Shell";
import { useStore } from "@/lib/store";

// Clave simulada para que los chicos no entren solos a la zona de adultos.
const DEMO_PIN = "1234";

export default function FamilyGate() {
  const [, go] = useLocation();
  const { setFamilyUnlocked } = useStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const press = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === DEMO_PIN) setFamilyUnlocked(true);
        else {
          setError(true);
          setPin("");
        }
      }, 250);
    }
  };

  return (
    <PhoneFrame className="bg-ink text-white">
      <div className="min-h-screen flex flex-col items-center px-8 pt-6 pb-10 bg-ink">
        <button onClick={() => go("/inicio")} aria-label="Volver" className="self-start w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
          <X size={20} />
        </button>
        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mt-6">
          <Lock size={30} />
        </div>
        <h1 className="text-2xl font-black mt-4">Zona familias</h1>
        <p className="font-semibold text-white/70 text-center mt-1">Ingresá la clave de 4 números</p>

        <motion.div className="flex gap-4 my-8" animate={error ? { x: [-12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`w-5 h-5 rounded-full border-2 ${i < pin.length ? "bg-sun border-sun" : "border-white/50"}`} />
          ))}
        </motion.div>
        <p className={`h-6 font-bold text-sm ${error ? "text-coral" : "text-white/60"}`} role="status">
          {error ? "Clave incorrecta. Probá de nuevo." : `Demo: la clave es ${DEMO_PIN}`}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <Key key={d} onClick={() => press(d)}>{d}</Key>
          ))}
          <span />
          <Key onClick={() => press("0")}>0</Key>
          <Key onClick={() => setPin(pin.slice(0, -1))} label="Borrar">
            <Delete size={24} />
          </Key>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Key({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88, backgroundColor: "rgba(255,255,255,0.25)" }}
      onClick={onClick}
      aria-label={label}
      className="w-20 h-20 rounded-full bg-white/10 text-3xl font-black flex items-center justify-center"
    >
      {children}
    </motion.button>
  );
}
