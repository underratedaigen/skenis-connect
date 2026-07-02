import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const interactiveSelector =
  "a, button, input, textarea, select, [role='button'], [data-cursor='magnetic']";

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(-120);
  const y = useMotionValue(-120);
  const smoothX = useSpring(x, { stiffness: 720, damping: 42, mass: 0.18 });
  const smoothY = useSpring(y, { stiffness: 720, damping: 42, mass: 0.18 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !supportsFinePointer) return;

    document.body.classList.add("skenis-cursor-enabled");

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target instanceof Element ? event.target : null;
      setActive(Boolean(target?.closest(interactiveSelector)));
    };

    const onPointerDown = () => setPressed(true);
    const onPointerUp = () => setPressed(false);
    const onPointerLeave = () => setVisible(false);
    const onPointerEnter = () => setVisible(true);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);

    return () => {
      document.body.classList.remove("skenis-cursor-enabled");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
    };
  }, [prefersReducedMotion, x, y]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x: smoothX, y: smoothY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: pressed ? 0.72 : active ? 1.72 : 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 30 }}
      >
        <div className="h-4 w-4 rounded-full bg-brand-500 shadow-[0_0_30px_rgba(28,155,141,0.55)]" />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-500/45 bg-brand-100/10 backdrop-blur-[1px]" />
      </motion.div>
    </motion.div>
  );
}
