import React from 'react';
import { motion } from 'framer-motion';

type Variant = 'principal' | 'teacher' | 'admin';

interface DecorativeShapesProps {
  variant?: Variant;
  className?: string;
}

const palettes: Record<Variant, { primary: string; accent: string; soft: string }> = {
  principal: { primary: '#0b3b66', accent: '#1f6f9b', soft: '#dbeff6' },
  teacher: { primary: '#0b3b66', accent: '#2a8fc6', soft: '#e6f4fb' },
  admin: { primary: '#0b3b66', accent: '#195b8a', soft: '#e3f0f8' },
};

export function DecorativeShapes({ variant = 'teacher', className = '' }: DecorativeShapesProps) {
  const colors = palettes[variant];

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`pointer-events-none ${className}`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="block"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.95" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0.85" />
          </linearGradient>
          <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="40" result="b" />
            <feBlend in="SourceGraphic" in2="b" />
          </filter>
        </defs>

        {/* large soft blob */}
        <motion.path
          d="M300 80 C420 20 600 0 760 80 C920 160 980 300 900 380 C820 460 600 480 420 420 C240 360 180 200 300 80 Z"
          fill="url(#g1)"
          opacity="0.12"
          filter="url(#f1)"
          animate={{ translateY: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'loop' }}
        />

        {/* smaller accent circles */}
        <motion.circle
          cx="980"
          cy="80"
          r="36"
          fill={colors.accent}
          opacity="0.14"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.circle
          cx="110"
          cy="520"
          r="26"
          fill={colors.primary}
          opacity="0.08"
          animate={{ scale: [1, 0.96, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* subtle pattern of lines (data motif) */}
        <g stroke={colors.accent} strokeWidth={1.2} opacity={0.06}>
          <line x1="220" y1="360" x2="360" y2="300" />
          <line x1="260" y1="380" x2="420" y2="320" />
          <line x1="280" y1="400" x2="480" y2="340" />
        </g>
      </svg>
    </motion.div>
  );
}

export default DecorativeShapes;
