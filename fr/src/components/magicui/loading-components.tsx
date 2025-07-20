import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "neon" | "gradient" | "pulse";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = "md",
  variant = "neon"
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const variantClasses = {
    neon: "border-neon-blue border-t-transparent",
    gradient: "border-transparent border-t-neon-purple",
    pulse: "border-neon-green border-t-transparent"
  };

  return (
    <motion.div
      className={cn(
        "border-2 rounded-full animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        filter: variant === "neon" ? "drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))" : undefined
      }}
    />
  );
};

interface LoadingBeamProps {
  className?: string;
  isLoading?: boolean;
}

export const LoadingBeam: React.FC<LoadingBeamProps> = ({
  className,
  isLoading = true
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn("relative w-full h-1 bg-white/10 rounded-full overflow-hidden", className)}>
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green rounded-full"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: "50%",
          boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)"
        }}
      />
    </div>
  );
};

interface LoadingPulseProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({
  className,
  children,
  isLoading = true
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <motion.div
      className={cn("relative", className)}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-green/20 rounded-xl animate-pulse" />
    </motion.div>
  );
};

interface LoadingDotsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className,
  size = "md"
}) => {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div className={cn("flex space-x-2 items-center", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn(
            "rounded-full bg-neon-blue",
            dotSizes[size]
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
          style={{
            filter: "drop-shadow(0 0 4px rgba(0, 240, 255, 0.8))"
          }}
        />
      ))}
    </div>
  );
};
