import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { PhoneFrame } from "@/components/Shell";
import Lumi from "@/components/Lumi";

export default function Splash() {
  const [, go] = useLocation();
  const { state } = useStore();
  const next = state.child ? "/inicio" : "/bienvenida";

  useEffect(() => {
    const t = setTimeout(() => go(next), 2600);
    return () => clearTimeout(t);
  }, [go, next]);

  return (
    <PhoneFrame>
      <button
        onClick={() => go(next)}
        className="min-h-screen w-full flex flex-col items-center justify-center gap-6 px-8 overflow-hidden relative"
        aria-label="Entrar a Panka"
      >
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 10 + (i % 4) * 8,
              height: 10 + (i % 4) * 8,
              left: `${(i * 37) % 92}%`,
              top: `${(i * 53) % 92}%`,
              background: ["#8b5cf6", "#ff6b5b", "#fbb424", "#1fb58f", "#3b9df5"][i % 5],
              opacity: 0.18,
            }}
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 2.5 + (i % 3), repeat: Infinity }}
          />
        ))}

        <motion.img
          src="./panka-logo.png"
          alt="Panka. Cada palabra abre un mundo."
          className="w-[82%] max-w-[340px]"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.9 }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Lumi size={110} mood="cheer" />
        </motion.div>
        <motion.p
          className="text-ink-soft font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Leer y escribir, jugando
        </motion.p>
      </button>
    </PhoneFrame>
  );
}
