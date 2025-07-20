import { motion, useInView } from "framer-motion";
import { forwardRef, useRef } from "react";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextAnimateProps {
  children: ReactNode;
  className?: string;
  variant?: {
    hidden: { y?: number; opacity?: number };
    visible: { y?: number; opacity?: number };
  };
  duration?: number;
  delay?: number;
  by?: "word" | "character";
}

const defaultVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const TextAnimate = forwardRef<HTMLDivElement, TextAnimateProps>(
  (
    {
      children,
      className,
      variant = defaultVariants,
      duration = 0.4,
      delay = 0,
      by = "word",
    },
    ref
  ) => {
    const textRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(textRef, { once: true });

    const text = typeof children === "string" ? children : "";
    const segments = by === "word" ? text.split(" ") : text.split("");

    return (
      <div ref={ref || textRef} className={cn("overflow-hidden", className)}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            staggerChildren: 0.1,
          }}
        >
          {segments.map((segment, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={variant}
              transition={{
                duration: duration,
                delay: delay + index * 0.1,
                ease: "easeOut",
              }}
            >
              {segment}
              {by === "word" && index < segments.length - 1 && " "}
            </motion.span>
          ))}
        </motion.div>
      </div>
    );
  }
);

TextAnimate.displayName = "TextAnimate";
