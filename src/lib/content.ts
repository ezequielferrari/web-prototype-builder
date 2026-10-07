// Contenido simulado de la demo. Todo está escrito a mano: no hay backend.

export type AgeBand = "5-6" | "6-7" | "7-8";
export type Level = 1 | 2 | 3;
export type BookKind = "cuento" | "audio" | "video";

export interface Question {
  q: string;
  options: string[];
  answer: number;
}

export interface Book {
  id: string;
  title: string;
  kind: BookKind;
  age: AgeBand;
  level: Level;
  minutes: number;
  emoji: string;
  cover: string; // clases de gradiente de Tailwind
  pages: string[];
  questions: Question[];
}

export const AGE_BANDS: AgeBand[] = ["5-6", "6-7", "7-8"];

export function ageToBand(age: number): AgeBand {
  if (age <= 5) return "5-6";
  if (age === 6) return "6-7";
  return "7-8";
}

export const LEVEL_NAMES: Record<Level, string> = {
  1: "Explorador",
  2: "Lector",
  3: "Gran lector",
};

export const BOOKS: Book[] = [
  {
    id: "oso-miel",
    title: "El oso y la miel",
    kind: "cuento",
    age: "5-6",
    level: 1,
    minutes: 4,
    emoji: "🐻",
    cover: "from-amber-300 to-orange-400",
    pages: [
      "Oso tiene sed de miel.",
      "Oso ve un panal en el árbol.",
      "Las abejas dicen: ¡zzz, zzz!",
      "Oso pide permiso. Las abejas le dan un poco.",
      "Oso dice: ¡Gracias, amigas!",
    ],
    questions: [
      { q: "¿Qué quería el oso?", options: ["Miel", "Pan", "Agua"], answer: 0 },
      { q: "¿Qué hizo el oso antes de comer?", options: ["Se fue", "Pidió permiso", "Gritó"], answer: 1 },
    ],
  },
  {
    id: "luna-sola",
    title: "La luna no está sola",
    kind: "audio",
    age: "5-6",
    level: 1,
    minutes: 5,
    emoji: "🌙",
    cover: "from-indigo-400 to-violet-500",
    pages: [
      "La luna mira el cielo.",
      "Ve una estrella. Ve otra estrella.",
      "¡Son muchas! La luna sonríe.",
      "La luna no está sola. Tiene amigas que brillan.",
    ],
    questions: [
      { q: "¿Quiénes acompañan a la luna?", options: ["Las nubes", "Las estrellas", "Los pájaros"], answer: 1 },
    ],
  },
  {
    id: "colores",
    title: "Los colores del parque",
    kind: "video",
    age: "5-6",
    level: 2,
    minutes: 3,
    emoji: "🌈",
    cover: "from-pink-300 to-rose-400",
    pages: [
      "En el parque hay un tobogán rojo.",
      "La hamaca es amarilla.",
      "El pasto es verde y el cielo es azul.",
      "¿Qué color te gusta más a vos?",
    ],
    questions: [
      { q: "¿De qué color es la hamaca?", options: ["Roja", "Amarilla", "Azul"], answer: 1 },
    ],
  },
  {
    id: "tortuga",
    title: "Tula, la tortuga curiosa",
    kind: "cuento",
    age: "6-7",
    level: 1,
    minutes: 6,
    emoji: "🐢",
    cover: "from-emerald-300 to-teal-500",
    pages: [
      "Tula es una tortuga muy curiosa.",
      "Un día encontró una caracola en la playa.",
      "Se la puso en la oreja y escuchó el mar.",
      "—¡El mar canta! —dijo Tula, feliz.",
      "Desde ese día, Tula escucha el mar todas las tardes.",
    ],
    questions: [
      { q: "¿Qué encontró Tula?", options: ["Una piedra", "Una caracola", "Un pez"], answer: 1 },
      { q: "¿Qué escuchó Tula?", options: ["El mar", "La lluvia", "Un perro"], answer: 0 },
    ],
  },
  {
    id: "dragon",
    title: "El dragón que estornudaba",
    kind: "cuento",
    age: "6-7",
    level: 2,
    minutes: 8,
    emoji: "🐲",
    cover: "from-lime-300 to-green-500",
    pages: [
      "Draco era un dragón que no podía echar fuego.",
      "Cada vez que lo intentaba… ¡achís! Salían burbujas.",
      "Los otros dragones se reían de él.",
      "Un día, el pueblo se quedó sin agua para regar las flores.",
      "Draco estornudó burbujas sobre el jardín y las flores volvieron a crecer.",
      "Desde entonces, todos quieren las burbujas de Draco.",
    ],
    questions: [
      { q: "¿Qué le salía a Draco cuando estornudaba?", options: ["Fuego", "Burbujas", "Humo"], answer: 1 },
      { q: "¿Cómo ayudó Draco al pueblo?", options: ["Regó el jardín", "Cocinó", "Voló lejos"], answer: 0 },
    ],
  },
  {
    id: "espacio",
    title: "Viaje a la Luna",
    kind: "video",
    age: "6-7",
    level: 3,
    minutes: 7,
    emoji: "🚀",
    cover: "from-sky-400 to-indigo-500",
    pages: [
      "Mila construyó un cohete con cajas de cartón.",
      "Contó hacia atrás: tres, dos, uno… ¡despegue!",
      "Con su imaginación llegó a la Luna y saltó muy alto.",
      "Cuando su mamá la llamó a cenar, Mila aterrizó en la cocina.",
    ],
    questions: [
      { q: "¿Con qué hizo Mila el cohete?", options: ["Con cajas", "Con madera", "Con papel"], answer: 0 },
    ],
  },
  {
    id: "robot",
    title: "El robot que quería leer",
    kind: "cuento",
    age: "7-8",
    level: 2,
    minutes: 10,
    emoji: "🤖",
    cover: "from-cyan-300 to-blue-500",
    pages: [
      "Bip era un robot que sabía hacer cuentas muy rápido.",
      "Pero había algo que Bip no sabía hacer: leer cuentos.",
      "Una niña llamada Juana le enseñó las letras, una por una.",
      "Primero leyó palabras cortas: sol, mar, pan.",
      "Después leyó frases enteras. ¡Sus luces se encendían de alegría!",
      "Ahora Bip le lee un cuento a Juana todas las noches.",
    ],
    questions: [
      { q: "¿Qué no sabía hacer Bip?", options: ["Contar", "Leer", "Caminar"], answer: 1 },
      { q: "¿Quién le enseñó a leer?", options: ["Su mamá", "Juana", "Otro robot"], answer: 1 },
      { q: "¿Qué palabras leyó primero?", options: ["Palabras largas", "Palabras cortas", "Números"], answer: 1 },
    ],
  },
  {
    id: "zorro",
    title: "El zorro y las uvas",
    kind: "audio",
    age: "7-8",
    level: 2,
    minutes: 6,
    emoji: "🦊",
    cover: "from-orange-300 to-red-400",
    pages: [
      "Un zorro con hambre vio unas uvas muy altas.",
      "Saltó una vez, saltó dos veces, pero no llegó.",
      "Se alejó diciendo: «Total, seguro estaban verdes».",
      "A veces decimos que algo no nos gusta solo porque no lo podemos tener.",
    ],
    questions: [
      { q: "¿Por qué el zorro no comió las uvas?", options: ["No llegaba", "Estaban verdes", "No tenía hambre"], answer: 0 },
    ],
  },
  {
    id: "estrellas-mar",
    title: "Las estrellas de mar",
    kind: "cuento",
    age: "7-8",
    level: 3,
    minutes: 9,
    emoji: "⭐",
    cover: "from-yellow-300 to-amber-500",
    pages: [
      "Después de la tormenta, la playa amaneció llena de estrellas de mar.",
      "Tomás las devolvía al agua, una por una.",
      "Un señor le dijo: «Son miles, no vas a poder salvarlas a todas».",
      "Tomás levantó otra estrella, la tiró al mar y respondió:",
      "«A esta sí la salvé».",
    ],
    questions: [
      { q: "¿Qué hacía Tomás?", options: ["Juntaba caracoles", "Devolvía estrellas al mar", "Nadaba"], answer: 1 },
      { q: "¿Qué nos enseña el cuento?", options: ["Que cada ayuda cuenta", "Que el mar es frío", "Que hay que correr"], answer: 0 },
    ],
  },
];

export const READING_SENTENCES: Record<Level, string[]> = {
  1: ["Mi mamá me mima.", "El sol sale.", "La pala es de Lola.", "Ema ama a su gato."],
  2: [
    "El perro corre por el parque verde.",
    "La luna brilla en el cielo de noche.",
    "Mi abuela hace pan con mucho amor.",
  ],
  3: [
    "El pequeño conejo corrió rápido por el campo lleno de flores.",
    "Cuando llueve, me gusta mirar las gotas que bajan por la ventana.",
    "María leyó un cuento mágico antes de dormir y soñó con dragones.",
  ],
};

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

export const BADGES: Badge[] = [
  { id: "primer-cuento", label: "Primer cuento", emoji: "📖", desc: "Terminaste tu primer cuento" },
  { id: "voz-clara", label: "Voz clara", emoji: "🎤", desc: "Leíste en voz alta" },
  { id: "escritor", label: "Escritor/a", emoji: "✏️", desc: "Creaste tu propio cuento" },
  { id: "explorador", label: "Explorador/a", emoji: "🧭", desc: "Hiciste una actividad fuera de la pantalla" },
  { id: "pensador", label: "Pensador/a", emoji: "💭", desc: "Contaste qué aprendiste hoy" },
  { id: "racha", label: "Racha de 7 días", emoji: "🔥", desc: "Leíste 7 días seguidos" },
];

export type ActivityKind = "foto" | "audio" | "texto";

export interface OfflineActivity {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  evidence: ActivityKind;
  color: string;
}

export const OFFLINE_ACTIVITIES: OfflineActivity[] = [
  {
    id: "dibujar",
    title: "Dibujá un personaje",
    desc: "Elegí tu personaje favorito del último cuento y dibujalo en un papel.",
    emoji: "🎨",
    evidence: "foto",
    color: "bg-coral-soft",
  },
  {
    id: "leer-familiar",
    title: "Leele a alguien de tu familia",
    desc: "Elegí un cuento corto y leéselo a alguien de tu casa.",
    emoji: "👵",
    evidence: "audio",
    color: "bg-sun-soft",
  },
  {
    id: "buscar-letra",
    title: "Cazá objetos con la letra M",
    desc: "Buscá en tu casa tres cosas que empiecen con M. ¿Encontraste una mesa?",
    emoji: "🔎",
    evidence: "foto",
    color: "bg-mint-soft",
  },
  {
    id: "inventar",
    title: "Inventá una historia",
    desc: "Contale a tu familia una historia inventada con un perro, una nube y un sombrero.",
    emoji: "🗣️",
    evidence: "audio",
    color: "bg-sky-soft",
  },
  {
    id: "carta",
    title: "Escribí una cartita",
    desc: "Escribile un mensaje cortito a alguien que quieras mucho.",
    emoji: "💌",
    evidence: "texto",
    color: "bg-grape-soft",
  },
];

export const INTERESTS = [
  { id: "animales", label: "Animales", emoji: "🐶" },
  { id: "espacio", label: "Espacio", emoji: "🚀" },
  { id: "dinosaurios", label: "Dinosaurios", emoji: "🦖" },
  { id: "deportes", label: "Deportes", emoji: "⚽" },
  { id: "musica", label: "Música", emoji: "🎵" },
  { id: "magia", label: "Magia", emoji: "🪄" },
  { id: "naturaleza", label: "Naturaleza", emoji: "🌳" },
  { id: "cocina", label: "Cocina", emoji: "🍪" },
];

export const AVATARS = ["🦊", "🐼", "🐸", "🦁", "🐰", "🐙", "🦄", "🐯"];
