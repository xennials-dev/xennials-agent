import React from 'react';

export type LogoStyle = 'neon_orbit' | 'corp_minimal' | 'tech_wireframe' | 'edit_elegance';

interface LogoProps {
  style: LogoStyle;
  className?: string;
  size?: number | string;
}

export const LOGO_VARIANTS = [
  {
    id: 'neon_orbit' as LogoStyle,
    name: 'Xennials Neon Orbit',
    description: 'Neon purple and cyan gradients, featuring an interlocking cosmic loop representing infinite automation loops.',
    tag: 'Cyberpunk/Modern'
  },
  {
    id: 'corp_minimal' as LogoStyle,
    name: 'Xennials Corporate Minimal',
    description: 'Deep slate geometric emblem with sharp block boundaries, ideal for high-end enterprise audits and compliance.',
    tag: 'Executive/Classic'
  },
  {
    id: 'tech_wireframe' as LogoStyle,
    name: 'Xennials Tech Wireframe',
    description: 'Emerald green grid dots and crosshair ticks, showing a CAD layout representing systematic code orchestration.',
    tag: 'DevOps/Terminal'
  },
  {
    id: 'edit_elegance' as LogoStyle,
    name: 'Xennials Editorial Elegance',
    description: 'Serif gold emblem inside deep navy seal borders, projecting luxury strategy consulting and corporate heritage.',
    tag: 'Editorial/Luxury'
  }
];

export default function Logo({ style, className = '', size = 32 }: LogoProps) {
  const sizeNum = typeof size === 'number' ? size : parseInt(String(size), 10) || 32;

  switch (style) {
    case 'neon_orbit':
      return (
        <svg
          width={sizeNum}
          height={sizeNum}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="orbit-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06F2FF" />
              <stop offset="100%" stopColor="#0072FF" />
            </linearGradient>
            <linearGradient id="orbit-purple" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Inner space rings */}
          <circle cx="50" cy="50" r="38" stroke="#1E293B" strokeWidth="4" />
          {/* Cyan Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="32"
            ry="14"
            transform="rotate(-30 50 50)"
            stroke="url(#orbit-cyan)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />
          {/* Purple Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="32"
            ry="14"
            transform="rotate(30 50 50)"
            stroke="url(#orbit-purple)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />
          {/* Core Sphere */}
          <circle cx="50" cy="50" r="10" fill="#0F172A" stroke="#00D2FF" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="4" fill="#00FFC2" />
        </svg>
      );

    case 'corp_minimal':
      return (
        <svg
          width={sizeNum}
          height={sizeNum}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Solid square background borders */}
          <rect x="15" y="15" width="70" height="70" rx="4" stroke="#94A3B8" strokeWidth="6" />
          <rect x="23" y="23" width="54" height="54" rx="2" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
          {/* Corporate X shape */}
          <path
            d="M32 32 L44 50 L32 68 H42 L50 56 L58 68 H68 L56 50 L68 32 H58 L50 44 L42 32 H32Z"
            fill="#FFFFFF"
          />
          {/* Corner structural notches */}
          <rect x="11" y="11" width="10" height="10" fill="#1E293B" />
          <rect x="79" y="11" width="10" height="10" fill="#1E293B" />
          <rect x="11" y="79" width="10" height="10" fill="#1E293B" />
          <rect x="79" y="79" width="10" height="10" fill="#1E293B" />
        </svg>
      );

    case 'tech_wireframe':
      return (
        <svg
          width={sizeNum}
          height={sizeNum}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* CAD Matrix Background */}
          <path d="M10 50 H90 M50 10 V90" stroke="#166534" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="50" cy="50" r="40" stroke="#1E3A1E" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="25" stroke="#166534" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Compass / Wireframe tick marks */}
          <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="#10B981" strokeWidth="2" />
          
          {/* Matrix-Dot Pattern 'X' */}
          <circle cx="35" cy="35" r="4" fill="#10B981" />
          <circle cx="425" cy="42.5" r="3" fill="#10B981" />
          <circle cx="50" cy="50" r="5" fill="#34D399" />
          <circle cx="57.5" cy="57.5" r="3" fill="#10B981" />
          <circle cx="65" cy="65" r="4" fill="#10B981" />
          
          <circle cx="65" cy="35" r="4" fill="#10B981" />
          <circle cx="57.5" cy="42.5" r="3" fill="#10B981" />
          <circle cx="42.5" cy="57.5" r="3" fill="#10B981" />
          <circle cx="35" cy="65" r="4" fill="#10B981" />

          {/* Connectors */}
          <line x1="35" y1="35" x2="65" y2="65" stroke="#047857" strokeWidth="1.5" />
          <line x1="65" y1="35" x2="35" y2="65" stroke="#047857" strokeWidth="1.5" />
        </svg>
      );

    case 'edit_elegance':
      return (
        <svg
          width={sizeNum}
          height={sizeNum}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#FEE2E2" />
            </linearGradient>
          </defs>
          {/* Classic Circular Shield border */}
          <circle cx="50" cy="50" r="44" fill="#1E1B4B" stroke="url(#gold-shimmer)" strokeWidth="4.5" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="url(#gold-shimmer)" strokeWidth="1" strokeDasharray="3 1.5" />
          {/* Inner Golden Monogram */}
          <path
            d="M34 28 H46 V32 H41 L47.5 47 L54 32 H49 V28 H61 V32 H56 L47.5 53 H52.5 V57 H38 V53 H43 L37 39 L34 32 H30 V28 H34Z"
            fill="url(#gold-shimmer)"
          />
          {/* Laurel accents inside the seal */}
          <path d="M22 50 C22 65, 35 72, 50 72 C65 72, 78 65, 78 50" stroke="url(#gold-shimmer)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" />
          {/* Center crown star */}
          <polygon points="50,15 52,21 58,21 53,25 55,31 50,27 45,31 47,25 42,21 48,21" fill="url(#gold-shimmer)" />
        </svg>
      );

    default:
      return null;
  }
}
