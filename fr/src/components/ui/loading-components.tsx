import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      className={cn(
        "relative",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-purple-400"></div>
      <div className="absolute inset-1 rounded-full border border-transparent border-t-cyan-300 border-l-pink-300"></div>
    </motion.div>
  );
};

interface PulsingDotsProps {
  className?: string;
}

export const PulsingDots: React.FC<PulsingDotsProps> = ({ className }) => {
  return (
    <div className={cn("flex space-x-2", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

interface LoadingBeamProps {
  className?: string;
}

export const LoadingBeam: React.FC<LoadingBeamProps> = ({ className }) => {
  return (
    <div className={cn("relative w-full h-1 bg-white/10 rounded-full overflow-hidden", className)}>
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        style={{ width: '30%' }}
        animate={{
          x: ['-100%', '350%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

interface LoadingCardProps {
  title: string;
  description: string;
  progress?: number;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title,
  description,
  progress,
  className
}) => {
  return (
    <motion.div
      className={cn(
        "glass-morphism rounded-3xl p-8 text-center",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-6">
        <LoadingSpinner size="lg" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/70 mb-6">{description}</p>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <PulsingDots />
      </div>
    </motion.div>
  );
};

interface MagicSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MagicSpinner: React.FC<MagicSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-purple-400"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Middle rotating ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-300 border-l-pink-300"
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner pulsing core */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Glowing effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 blur-lg"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

interface FloatingElementsProps {
  className?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() > 0.5 ? 20 : -20, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

interface WaveLoaderProps {
  className?: string;
}

export const WaveLoader: React.FC<WaveLoaderProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-8 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

interface ParticleFieldProps {
  className?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
