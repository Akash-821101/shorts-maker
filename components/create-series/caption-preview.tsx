"use client";

import { CaptionStyle } from "@/lib/data/captions";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

export function CaptionPreview({ styleConfig }: { styleConfig: CaptionStyle }) {
  const sentence = "Make viral shorts fast";
  const words = sentence.split(" ");
  const [key, setKey] = useState(0);

  // Re-trigger animation loop every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getAnimationVariants = (index: number): Variants => {
    const delay = index * 0.15; // Faster, more snappy delay

    switch (styleConfig.animationType) {
      case "pop":
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: {
            scale: [0.5, 1.1, 1],
            opacity: 1,
            transition: { delay, duration: 0.4, times: [0, 0.6, 1] }
          }
        };
      case "bounce":
        return {
          initial: { y: -20, opacity: 0 },
          animate: {
            y: 0,
            opacity: 1,
            transition: { delay, duration: 0.5, type: "spring", bounce: 0.6 }
          }
        };
      case "slide-up":
        return {
          initial: { y: 15, opacity: 0 },
          animate: {
            y: 0,
            opacity: 1,
            transition: { delay, duration: 0.3 }
          }
        };
      case "typewriter":
      case "fade":
      default:
        return {
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: { delay, duration: 0.2 }
          }
        };
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center p-4 overflow-hidden rounded-xl relative"
      style={{
        backgroundColor: styleConfig.backgroundColor || "transparent"
      }}
    >
      <div
        key={key}
        className="flex flex-wrap justify-center gap-x-1.5 gap-y-1 text-center relative z-10 text-lg sm:text-xl"
        style={{
          fontFamily: styleConfig.fontFamily,
          fontWeight: styleConfig.fontWeight,
          textTransform: styleConfig.textTransform,
          textShadow: styleConfig.dropShadow,
          WebkitTextStroke: styleConfig.strokeWidth
            ? `${styleConfig.strokeWidth}px ${styleConfig.strokeColor}`
            : undefined,
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${key}-${i}`}
            variants={getAnimationVariants(i)}
            initial="initial"
            animate="animate"
            className="inline-block"
            style={{ color: styleConfig.textColor }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Subtle background placeholder graphic to show contrast */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
    </div>
  );
}
