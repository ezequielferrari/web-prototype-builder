import { motion } from "framer-motion";

// Lumi es una luciérnaga: su colita se enciende cuando aprende algo nuevo.
// mood: "happy" (sonríe), "talk" (mueve la boca), "cheer" (festeja), "think" (piensa)

type Mood = "happy" | "talk" | "cheer" | "think";

interface Props {
  size?: number;
  mood?: Mood;
  float?: boolean;
  className?: string;
}

export default function Lumi({ size = 120, mood = "happy", float = true, className = "" }: Props) {
  const glow = mood === "cheer" ? [0.75, 1, 0.75] : [0.45, 0.85, 0.45];

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={float ? { y: [0, -6, 0], rotate: mood === "cheer" ? [-4, 4, -4] : 0 } : undefined}
      transition={{ duration: mood === "cheer" ? 0.8 : 3, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} role="img">
        <defs>
          <radialGradient id="lumi-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe27a" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffd23f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lumi-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a47bff" />
            <stop offset="100%" stopColor="#7c4dff" />
          </linearGradient>
        </defs>

        {/* halo de luz de la colita */}
        <motion.circle
          cx="60"
          cy="92"
          r="30"
          fill="url(#lumi-glow)"
          animate={{ opacity: glow }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />

        {/* alas */}
        <motion.g
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          style={{ transformOrigin: "60px 62px" }}
        >
          <ellipse cx="34" cy="58" rx="18" ry="12" fill="#dff3ff" opacity="0.9" transform="rotate(-25 34 58)" />
          <ellipse cx="86" cy="58" rx="18" ry="12" fill="#dff3ff" opacity="0.9" transform="rotate(25 86 58)" />
        </motion.g>

        {/* colita luminosa */}
        <motion.ellipse
          cx="60"
          cy="88"
          rx="17"
          ry="15"
          fill="#ffd23f"
          animate={{ fill: ["#ffd23f", "#fff0a8", "#ffd23f"] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />

        {/* cuerpo y cabeza */}
        <ellipse cx="60" cy="72" rx="20" ry="16" fill="url(#lumi-body)" />
        <circle cx="60" cy="46" r="26" fill="url(#lumi-body)" />

        {/* antenas */}
        <path d="M50 23 Q44 10 36 9" stroke="#6d3fe0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M70 23 Q76 10 84 9" stroke="#6d3fe0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="35" cy="9" r="5" fill="#ffd23f" />
        <circle cx="85" cy="9" r="5" fill="#ffd23f" />

        {/* ojos */}
        {mood === "think" ? (
          <>
            <path d="M44 45 q6 -5 12 0" stroke="#1b2a5c" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M64 45 q6 -5 12 0" stroke="#1b2a5c" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="49" cy="44" r="8" fill="white" />
            <circle cx="71" cy="44" r="8" fill="white" />
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
              style={{ transformOrigin: "60px 44px" }}
            >
              <circle cx="50" cy="45" r="4.5" fill="#1b2a5c" />
              <circle cx="72" cy="45" r="4.5" fill="#1b2a5c" />
              <circle cx="51.5" cy="43.5" r="1.5" fill="white" />
              <circle cx="73.5" cy="43.5" r="1.5" fill="white" />
            </motion.g>
          </>
        )}

        {/* cachetes */}
        <circle cx="40" cy="55" r="4" fill="#ff8fa3" opacity="0.6" />
        <circle cx="80" cy="55" r="4" fill="#ff8fa3" opacity="0.6" />

        {/* boca */}
        {mood === "talk" ? (
          <motion.ellipse
            cx="60"
            cy="57"
            rx="5"
            fill="#1b2a5c"
            animate={{ ry: [1.5, 4.5, 1.5] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        ) : mood === "cheer" ? (
          <path d="M50 54 Q60 66 70 54 Z" fill="#1b2a5c" />
        ) : mood === "think" ? (
          <circle cx="62" cy="57" r="2.5" fill="#1b2a5c" />
        ) : (
          <path d="M52 55 Q60 62 68 55" stroke="#1b2a5c" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </svg>

      {mood === "cheer" &&
        [0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute text-sun"
            style={{ left: `${[5, 80, 0, 85][i]}%`, top: `${[10, 15, 60, 55][i]}%`, fontSize: size * 0.14 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
          >
            ✦
          </motion.span>
        ))}
    </motion.div>
  );
}
