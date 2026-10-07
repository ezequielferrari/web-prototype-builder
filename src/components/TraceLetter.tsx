import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

// Lienzo para trazar una letra con el dedo o el mouse, sobre una guía punteada.
export default function TraceLetter({ letter, onDone }: { letter: string; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [strokes, setStrokes] = useState(0);
  const [ink, setInk] = useState(0);

  const paintGuide = () => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const { width, height } = c;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `bold ${height * 0.78}px Andika, Nunito, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.setLineDash([10, 12]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#c9bff0";
    ctx.strokeText(letter, width / 2, height * 0.55);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    c.width = c.clientWidth * ratio;
    c.height = c.clientHeight * ratio;
    // Esperar a que cargue la tipografía para dibujar la guía con la letra correcta.
    document.fonts?.ready.then(paintGuide);
    paintGuide();
  }, [letter]);

  const pos = (e: React.PointerEvent) => {
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    canvas.current!.setPointerCapture(e.pointerId);
    const ctx = canvas.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvas.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 18 * (window.devicePixelRatio || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setInk((i) => i + 1);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setStrokes((s) => s + 1);
  };

  const clear = () => {
    paintGuide();
    setStrokes(0);
    setInk(0);
  };

  const ready = ink > 40 && strokes >= 1;

  return (
    <div className="flex flex-col gap-3">
      <canvas
        ref={canvas}
        aria-label={`Trazá la letra ${letter}`}
        className="w-full aspect-square bg-white rounded-3xl border-4 border-line touch-none"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <div className="flex gap-3">
        <button onClick={clear} className="flex items-center gap-2 font-extrabold text-ink-soft px-4 py-3 rounded-2xl bg-white border-2 border-line">
          <RotateCcw size={18} /> Borrar
        </button>
        <button
          onClick={onDone}
          disabled={!ready}
          className="flex-1 rounded-2xl font-black text-lg text-white bg-mint shadow-[0_5px_0_#16896b] disabled:opacity-40 disabled:shadow-none"
        >
          {ready ? "¡Listo!" : "Seguí el camino punteado"}
        </button>
      </div>
    </div>
  );
}
