import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  fromRef: React.RefObject<HTMLDivElement | null>;
  toRef: React.RefObject<HTMLDivElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  // Note: These props are kept for API compatibility but simplified for demo
  containerRef: _containerRef,
  fromRef: _fromRef,
  toRef: _toRef,
  curvature: _curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor: _pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#00f0ff",
  gradientStopColor = "#bf00ff",
  startXOffset: _startXOffset = 0,
  startYOffset: _startYOffset = 0,
  endXOffset: _endXOffset = 0,
  endYOffset: _endYOffset = 0,
}) => {
  const id = React.useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  return (
    <svg
      ref={svgRef}
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className
      )}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      style={{
        transform: "translateZ(0)",
      }}
    >
      <defs>
        <linearGradient
          className={cn("transform-gpu")}
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="0"
          y2="100"
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        ref={pathRef}
        d="M 20 50 Q 50 20 80 50"
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: reverse ? "reverse" : "loop",
        }}
      />
    </svg>
  );
};
