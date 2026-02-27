import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  emoji: string;
  opacity: number;
  angle: number;
  angularVel: number;
}

const EMOJIS = ["🐝", "🍯", "🌼", "🌸", "✨", "🐝", "🍯", "🐝"];

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Init particles
    const count = Math.min(25, Math.floor(w() / 60));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      size: 14 + Math.random() * 14,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      opacity: 0.15 + Math.random() * 0.25,
      angle: Math.random() * Math.PI * 2,
      angularVel: (Math.random() - 0.5) * 0.01,
    }));

    let hidden = false;
    const onVisibility = () => { hidden = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMouse);

    const animate = () => {
      if (hidden) { animRef.current = requestAnimationFrame(animate); return; }

      ctx.clearRect(0, 0, w(), h());
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        // Mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 0.15;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angularVel;

        // Wrap
        if (p.x < -30) p.x = w() + 30;
        if (p.x > w() + 30) p.x = -30;
        if (p.y < -30) p.y = h() + 30;
        if (p.y > h() + 30) p.y = -30;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-auto" />;
}
