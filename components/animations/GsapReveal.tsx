"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GsapRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
}

export function GsapReveal({
  children,
  className,
  delay = 0,
  stagger = 0.12,
  direction = "up",
  distance = 40,
  duration = 0.7,
}: GsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const getTranslate = useCallback((): string => {
    switch (direction) {
      case "up": return `translate3d(0, ${distance}px, 0)`;
      case "down": return `translate3d(0, -${distance}px, 0)`;
      case "left": return `translate3d(${distance}px, 0, 0)`;
      case "right": return `translate3d(-${distance}px, 0, 0)`;
      case "none": return "translate3d(0, 0, 0)";
    }
  }, [direction, distance]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childElements = Array.from(container.children) as HTMLElement[];
    if (childElements.length === 0) return;

    // 1. Apply the initial hidden state with transform (the CSS class already sets opacity:0)
    const translate = getTranslate();
    childElements.forEach((el) => {
      el.style.transform = translate;
      el.style.willChange = "opacity, transform";
    });

    // 2. Function that triggers the reveal animation on each child
    const revealChildren = () => {
      childElements.forEach((el, index) => {
        const totalDelay = delay + index * stagger;
        el.style.transition = [
          `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${totalDelay}s`,
          `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${totalDelay}s`,
        ].join(", ");
        el.style.opacity = "1";
        el.style.transform = "translate3d(0, 0, 0)";
      });

      // Clean up willChange after all animations finish
      const cleanupDelay = (delay + childElements.length * stagger + duration) * 1000 + 200;
      setTimeout(() => {
        childElements.forEach((el) => {
          el.style.willChange = "";
        });
      }, cleanupDelay);
    };

    // 3. Start observing after a short delay.
    //    This ensures the browser has committed the initial hidden styles 
    //    from the CSS class before the IntersectionObserver fires.
    const startupTimeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true;
              revealChildren();
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -5% 0px",
        }
      );

      observer.observe(container);

      // Store observer ref for cleanup
      (container as any)._revealObserver = observer;
    }, 150); // 150ms delay guarantees the CSS has painted opacity:0

    return () => {
      clearTimeout(startupTimeout);
      const observer = (container as any)?._revealObserver;
      if (observer) {
        observer.disconnect();
      }
      // Cleanup inline styles
      childElements.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
        el.style.willChange = "";
      });
    };
  }, [delay, stagger, direction, distance, duration, getTranslate]);

  return (
    <div ref={containerRef} className={cn("gsap-reveal-hidden", className)}>
      {children}
    </div>
  );
}
