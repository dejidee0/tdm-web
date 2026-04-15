"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal — wraps children in a scroll-triggered CSS reveal animation.
 * The animation class is applied via CSS (globals.css), triggered by
 * IntersectionObserver adding the `.revealed` class. Zero framer-motion.
 *
 * @param {string}  direction  "up" | "left" | "right" | "fade" | "scale"
 * @param {number}  delay      Transition delay in milliseconds
 * @param {number}  threshold  Intersection threshold (0–1, default 0.12)
 * @param {string}  as         HTML tag to render as (default "div")
 */
export default function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  threshold = 0.12,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const dirClass = {
    up: "reveal-up",
    left: "reveal-left",
    right: "reveal-right",
    fade: "reveal-fade",
    scale: "reveal-scale",
  }[direction] ?? "reveal-up";

  return (
    <Tag
      ref={ref}
      className={`${dirClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
