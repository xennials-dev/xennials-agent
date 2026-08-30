import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Video, 
  Cpu, 
  Play, 
  Volume2, 
  Heart, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon,
  Chrome,
  Layout,
  Sliders,
  Send,
  HelpCircle,
  FileCode,
  Tag
} from 'lucide-react';
import { cn } from '../../utils';

const ActiveStyleBadge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span 
    className={cn(
      "bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded tracking-wider inline-flex items-center gap-1.5",
      className
    )}
  >
    {children}
  </span>
);

export interface StyleTemplate {
  id: number;
  name: string;
  sourceImage: string;
  description: string;
  vintageEra: string;
  fontFamily: string;
  themeColors: {
    primary: string;
    secondary: string;
    bg: string;
    glow: string;
  };
}

const TEMPLATE_ROTATIONS: StyleTemplate[] = [
  {
    id: 1,
    name: "Zodiac Gravity Glow",
    sourceImage: "Image 1",
    description: "Vibrant cyan-blue dripping glows overlaying soft graffiti-style bubble curves representing cosmic elements.",
    vintageEra: "Mod-Neon Galactic",
    fontFamily: "Space Grotesk, sans-serif",
    themeColors: { primary: "#00F0FF", secondary: "#3B82F6", bg: "#060914", glow: "rgba(0, 240, 255, 0.4)" }
  },
  {
    id: 2,
    name: "Schott NYC Retro Badge",
    sourceImage: "Image 2",
    description: "Bold military-grade heritage layouts with double-ring borders, USA star badges, and hand-distressed retro blocks.",
    vintageEra: "1913 American Original",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#FFFFFF", secondary: "#94A3B8", bg: "#151515", glow: "rgba(255, 255, 255, 0.1)" }
  },
  {
    id: 3,
    name: "Chancery Filigree Calligraphy",
    sourceImage: "Image 3",
    description: "Highly ornate luxury emblems, cursive script capitals, and symmetrical decorative loops with flourish crests.",
    vintageEra: "Medieval Luxury Heraldic",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#E2E8F0", secondary: "#64748B", bg: "#0a0a0c", glow: "rgba(226, 232, 240, 0.15)" }
  },
  {
    id: 4,
    name: "Weston Gold Foil Saddle",
    sourceImage: "Image 4",
    description: "Victorian saloon-style shimmering metal gold, detailed foliage flourishes, and elegant high-contrast serif highlights.",
    vintageEra: "1884 Victorian Premium",
    fontFamily: "Playfair Display, serif",
    themeColors: { primary: "#F59E0B", secondary: "#D97706", bg: "#0D0C0A", glow: "rgba(245, 158, 11, 0.3)" }
  },
  {
    id: 5,
    name: "Pacific Surf Script",
    sourceImage: "Image 5",
    description: "Casual hand-brushed mid-century cursive typography with high-fidelity water droplet offsets and oceanic sea-foam hues.",
    vintageEra: "1954 Cali Surf Revival",
    fontFamily: "cursive",
    themeColors: { primary: "#2DD4BF", secondary: "#F43F5E", bg: "#040D1A", glow: "rgba(45, 212, 191, 0.4)" }
  },
  {
    id: 6,
    name: "Reno Casino Curved Arc",
    sourceImage: "Image 6",
    description: "Ached Americana casino signs, dual-band copper borders, and authentic golden-era state stars.",
    vintageEra: "1931 Reno Casino",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#F59E0B", secondary: "#EF4444", bg: "#1C1917", glow: "rgba(245, 158, 11, 0.2)" }
  },
  {
    id: 7,
    name: "Boise Gothic Garage",
    sourceImage: "Image 7",
    description: "Raw rugged dry-brush strokes with heavily eroded textures, carpentry details, and solid grease wood frames.",
    vintageEra: "1948 Boise Workshop",
    fontFamily: "sans-serif",
    themeColors: { primary: "#E2E8F0", secondary: "#64748B", bg: "#090D16", glow: "rgba(255,255,255,0.05)" }
  },
  {
    id: 8,
    name: "Sohio Oil Heavy Block",
    sourceImage: "Image 8",
    description: "Industrial midwestern metal bold letters, geometric star indicators, and heavy engine oil red and navy outlines.",
    vintageEra: "1960 Ohio Lubricants",
    fontFamily: "sans-serif",
    themeColors: { primary: "#3B82F6", secondary: "#EF4444", bg: "#0B0F19", glow: "rgba(59, 130, 246, 0.3)" }
  },
  {
    id: 9,
    name: "Gimbel Brothers Dry Goods",
    sourceImage: "Image 9",
    description: "Elegant commercial script calligraphy, delicate copper flourishes, and heritage department store letterheads.",
    vintageEra: "1922 Philadelphia Department",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#F1F5F9", secondary: "#475569", bg: "#0F1115", glow: "rgba(255,255,255,0.08)" }
  },
  {
    id: 10,
    name: "Saks Fifth Avenue Script",
    sourceImage: "Image 10",
    description: "Modern upscale luxury letterforms, signature calligraphic details, and black matte minimalist visual layouts.",
    vintageEra: "1950 NYC Luxury Retail",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#FFFFFF", secondary: "#D1D5DB", bg: "#050505", glow: "rgba(255,255,255,0.15)" }
  },
  {
    id: 11,
    name: "Stutz Bearcat Speedliner",
    sourceImage: "Image 11",
    description: "Industrial steel deco speedlines with sleek brass offsets and high-temperature black racing backdrops.",
    vintageEra: "1912 Indianapolis Bearcat",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#F59E0B", secondary: "#78350F", bg: "#080602", glow: "rgba(245, 158, 11, 0.4)" }
  },
  {
    id: 12,
    name: "Marmon Wasp Varsity Yellow",
    sourceImage: "Image 12",
    description: "Thick double varsity stripes paired with dark anthracite grid marks and bright gold-and-black track indicators.",
    vintageEra: "1911 Indy 500 Champion",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#FBBF24", secondary: "#000000", bg: "#11141A", glow: "rgba(251, 191, 36, 0.45)" }
  },
  {
    id: 13,
    name: "Nicolet Antique Watchmaker",
    sourceImage: "Image 13",
    description: "Exquisite hand-carved Roman serifs framed by circular brass mechanical gears and fine horology sub-registers.",
    vintageEra: "1886 Swiss Horology Guild",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#F97316", secondary: "#FDBA74", bg: "#0B0907", glow: "rgba(249, 115, 22, 0.3)" }
  },
  {
    id: 14,
    name: "Clisby Engine Works",
    sourceImage: "Image 14",
    description: "Aero-marine heavy casting typography with rivets, industrial blueprint grids, and dark combustion iron backdrops.",
    vintageEra: "1936 Australian Castings",
    fontFamily: "Courier New, monospace",
    themeColors: { primary: "#38BDF8", secondary: "#0284C7", bg: "#06121E", glow: "rgba(56, 189, 248, 0.4)" }
  },
  {
    id: 15,
    name: "Regent Street Linen Press",
    sourceImage: "Image 15",
    description: "Crisp hand-carved woodblocks, Victorian flower crest borders, and thick indigo linen weave backing patterns.",
    vintageEra: "1875 London Haberdashery",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#E2E8F0", secondary: "#4F46E5", bg: "#090910", glow: "rgba(226, 232, 240, 0.1)" }
  },
  {
    id: 16,
    name: "Red Lion Tavern Emblem",
    sourceImage: "Image 16",
    description: "Classic British pub layouts with double circular crest loops, Tudor rose markers, and rich crimson copper backing.",
    vintageEra: "1923 Yorkshire Brewhouse",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#EF4444", secondary: "#F87171", bg: "#180505", glow: "rgba(239, 68, 68, 0.3)" }
  },
  {
    id: 17,
    name: "Royal Mail Steam Packet",
    sourceImage: "Image 17",
    description: "Luxurious Royal crown emblems combined with pristine handwritten cursives and rich marine slate-blue headers.",
    vintageEra: "1839 London Oceanic Liner",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#38BDF8", secondary: "#E2E8F0", bg: "#030B14", glow: "rgba(56, 189, 248, 0.25)" }
  },
  {
    id: 18,
    name: "Vanderbilt Gilt Cup",
    sourceImage: "Image 18",
    description: "Deep gold-foil serif lettering accented with classic yachting flags and beautiful luxury hand-engraved borders.",
    vintageEra: "1904 Newport Regatta",
    fontFamily: "Playfair Display, serif",
    themeColors: { primary: "#fbbf24", secondary: "#d97706", bg: "#080602", glow: "rgba(251, 191, 36, 0.5)" }
  },
  {
    id: 19,
    name: "Broad Ripple Canal Mill",
    sourceImage: "Image 19",
    description: "Rustic wheat sheaf frames paired with classic timber stamps and warm walnut ink textures.",
    vintageEra: "1852 Indiana Grist Mill",
    fontFamily: "sans-serif",
    themeColors: { primary: "#F59E0B", secondary: "#78350F", bg: "#0F0D0A", glow: "rgba(245, 158, 11, 0.15)" }
  },
  {
    id: 20,
    name: "Cyberdyne Neon Grid",
    sourceImage: "Image 20",
    description: "An elegant Y2K cyberpunk layout featuring electric purple letters encased in deep neon wireframe grid structures.",
    vintageEra: "Y2K Cyberpunk Grid",
    fontFamily: "Space Grotesk, sans-serif",
    themeColors: { primary: "#D946EF", secondary: "#06B6D4", bg: "#090310", glow: "rgba(217, 70, 239, 0.5)" }
  },
  {
    id: 21,
    name: "Hyperion Solar Flare",
    sourceImage: "Image 21",
    description: "Vibrant yellow light glows tracing clean technical coordinates inside a solar corona backdrop.",
    vintageEra: "Helios Scientific Station",
    fontFamily: "Space Grotesk, sans-serif",
    themeColors: { primary: "#EAB308", secondary: "#CA8A04", bg: "#0D0901", glow: "rgba(234, 179, 8, 0.6)" }
  },
  {
    id: 22,
    name: "Ritz Heritage Monogram",
    sourceImage: "Image 22",
    description: "A super high-fidelity golden key crest flanking dual cursive monogram initials in pristine French white.",
    vintageEra: "1925 Paris Ritz Hotel",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#FBBF24", secondary: "#F3F4F6", bg: "#090704", glow: "rgba(251, 191, 36, 0.3)" }
  },
  {
    id: 23,
    name: "Y2K Bubble Jet",
    sourceImage: "Image 23",
    description: "Bold bubble letters in hot pink with thick black outlines, dripping with retro liquid-mercury drops.",
    vintageEra: "Y2K Pop Generation",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#EC4899", secondary: "#F472B6", bg: "#080105", glow: "rgba(236, 72, 153, 0.55)" }
  },
  {
    id: 24,
    name: "Atlantic Marine Anchor",
    sourceImage: "Image 24",
    description: "Classic anchor layouts with hand-stitched marine ropes and weathered navy linen backgrounds.",
    vintageEra: "1932 Coast Guard Station",
    fontFamily: "sans-serif",
    themeColors: { primary: "#38BDF8", secondary: "#F1F5F9", bg: "#020914", glow: "rgba(56, 189, 248, 0.2)" }
  },
  {
    id: 25,
    name: "Overland Stage Express",
    sourceImage: "Image 25",
    description: "Rugged western frontier fonts wrapped in star-shaped sheriff badges and wood-fired copper plating.",
    vintageEra: "1860 Wells Fargo Trail",
    fontFamily: "sans-serif",
    themeColors: { primary: "#F59E0B", secondary: "#B45309", bg: "#100902", glow: "rgba(245, 158, 11, 0.18)" }
  },
  {
    id: 26,
    name: "Deco Theater Skyline",
    sourceImage: "Image 26",
    description: "Art-deco skyscraper contours rendered in shimmering golden metallic rays and high-contrast charcoal lines.",
    vintageEra: "1929 Metropolis Cinema",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#fbbf24", secondary: "#94a3b8", bg: "#07080a", glow: "rgba(251, 191, 36, 0.4)" }
  },
  {
    id: 27,
    name: "Bessemer Cast Foundry",
    sourceImage: "Image 27",
    description: "Massive solid iron letters with industrial hammer markings and glowing thermodynamic metal run-off highlights.",
    vintageEra: "1888 Steel Foundry",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#EF4444", secondary: "#1E293B", bg: "#0B0707", glow: "rgba(239, 68, 68, 0.25)" }
  },
  {
    id: 28,
    name: "Krypton Cyber Lab",
    sourceImage: "Image 28",
    description: "Radiant toxic green wireframes outlining hyper-focused laser coordinates and radioactive reactor seals.",
    vintageEra: "Neo-Tokyo Lab Sector",
    fontFamily: "Courier New, monospace",
    themeColors: { primary: "#22C55E", secondary: "#16A34A", bg: "#030A04", glow: "rgba(34, 197, 94, 0.6)" }
  },
  {
    id: 29,
    name: "Empire Steam Laundry",
    sourceImage: "Image 29",
    description: "Graceful Victorian script lettering framed by elaborate ornate filigrees and copper engraving loops.",
    vintageEra: "1899 London Gilt Press",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#E2E8F0", secondary: "#64748B", bg: "#0D0E12", glow: "rgba(226, 232, 240, 0.1)" }
  },
  {
    id: 30,
    name: "Sohio Fuel Service",
    sourceImage: "Image 30",
    description: "Industrial midwestern metal bold letters, geometric star indicators, and heavy engine oil red and navy outlines.",
    vintageEra: "1960 Ohio Lubricants",
    fontFamily: "sans-serif",
    themeColors: { primary: "#3B82F6", secondary: "#EF4444", bg: "#0B0F19", glow: "rgba(59, 130, 246, 0.3)" }
  },
  {
    id: 31,
    name: "Stutz Bearcat Racing",
    sourceImage: "Image 31",
    description: "Industrial steel deco speedlines with sleek brass offsets and high-temperature black racing backdrops.",
    vintageEra: "1912 Indianapolis Bearcat",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#F59E0B", secondary: "#78350F", bg: "#080602", glow: "rgba(245, 158, 11, 0.4)" }
  },
  {
    id: 32,
    name: "Marmon Wasp Varsity",
    sourceImage: "Image 32",
    description: "Thick double varsity stripes paired with dark anthracite grid marks and bright gold-and-black track indicators.",
    vintageEra: "1911 Indy 500 Champion",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#FBBF24", secondary: "#000000", bg: "#11141A", glow: "rgba(251, 191, 36, 0.45)" }
  },
  {
    id: 33,
    name: "Solar Flare Interstellar",
    sourceImage: "Image 33",
    description: "High-temperature thermonuclear orange flares highlighting sleek astronomical coordinates in crisp monospacing.",
    vintageEra: "Voyager Helios Observatory",
    fontFamily: "Fira Code, monospace",
    themeColors: { primary: "#F97316", secondary: "#B91C1C", bg: "#060101", glow: "rgba(249, 115, 22, 0.55)" }
  },
  {
    id: 34,
    name: "Alpine Glacial Obsidian",
    sourceImage: "Image 34",
    description: "Pristine ice-blue neon markers paired with sharp glassmorphic shadows and obsidian rock frames.",
    vintageEra: "Scandinavian Peak Outpost",
    fontFamily: "Space Grotesk, sans-serif",
    themeColors: { primary: "#38BDF8", secondary: "#475569", bg: "#02070D", glow: "rgba(56, 189, 248, 0.4)" }
  }
];

export interface InspirationStyle {
  id: string;
  name: string;
  sourceImage: string;
  category: 'heritage' | 'cyberpunk';
  fontFamily: string;
  bgStr: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  tailwindProps: string;
  cssRules: string;
  remotionCode: string;
  iconTag: string;
}

export const INSPIRATION_STYLES: InspirationStyle[] = [
  {
    id: "clairevoyant",
    name: "Clairevoyant Liquid Goth",
    sourceImage: "Image 2: CLAIREVOYANT",
    category: "cyberpunk",
    fontFamily: "var(--font-serif-lux)",
    bgStr: "#040209",
    primaryColor: "#c084fc",
    secondaryColor: "#38bdf8",
    description: "Super high-contrast luxury serif bold typeface. Needle-sharp descenders interlock with custom orbital gradients, exuding heavy digital-gothic metallics.",
    tailwindProps: "font-serif-lux text-5xl font-black uppercase tracking-tight bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(192,132,252,0.45)]",
    cssRules: `.logo-clairevoyant {\n  font-family: 'Playfair Display', serif;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: -0.02em;\n  background: linear-gradient(135deg, #c084fc 20%, #38bdf8 80%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  filter: drop-shadow(0 0 12px rgba(192, 132, 252, 0.4));\n}`,
    remotionCode: `import { useCurrentFrame, interpolate, spring } from 'remotion';\n\nexport const ClairevoyantRemotion = ({ text }) => {\n  const frame = useCurrentFrame();\n  const scale = spring({ frame, fps: 30, config: { damping: 12 } });\n  const shimmer = interpolate(frame, [0, 60], [-100, 200]);\n\n  return (\n    <h1 style={{ transform: \`scale(\${scale})\` }} className="logo-clairevoyant">\n      {text}\n    </h1>\n  );\n};`,
    iconTag: "🔮"
  },
  {
    id: "indianapolis",
    name: "Indianapolis Motor Varsity",
    sourceImage: "Image 1: INDIANAPOLIS",
    category: "heritage",
    fontFamily: "var(--font-bungee)",
    bgStr: "#0C0204",
    primaryColor: "#EF4444",
    secondaryColor: "#FBBF24",
    description: "Heavy inline collegiate block typography. Decorated with double offset sports stripes, raw speed markings, and athletic golden border badges.",
    tailwindProps: "font-bungee text-4xl font-extrabold tracking-widest text-red-500 drop-shadow-[3px_3px_0px_#f59e0b]",
    cssRules: `.logo-indianapolis {\n  font-family: 'Bungee Inline', sans-serif;\n  color: #ef4444;\n  text-stroke: 1.5px #ef4444;\n  text-shadow: 2px 2px 0px #0c0204, 4px 4px 0px #f59e0b;\n  letter-spacing: 0.1em;\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const VarsityLogoAnim = ({ text }) => {\n  const frame = useCurrentFrame();\n  const slideY = interpolate(frame, [0, 15], [80, 0], { extrapolateRight: 'clamp' });\n\n  return (\n    <div style={{ transform: \`translateY(\${slideY}px)\` }} className="logo-indianapolis">\n      {text}\n    </div>\n  );\n};`,
    iconTag: "🏎️"
  },
  {
    id: "vancouver",
    name: "Vancouver Signature Swash",
    sourceImage: "Image 1: Vancouver",
    category: "heritage",
    fontFamily: "var(--font-cursive)",
    bgStr: "#04090C",
    primaryColor: "#22D3EE",
    secondaryColor: "#FAF7F2",
    description: "Free-flowing hand-drawn dynamic calligraphy featuring an extended underline swash baseline and warm retro brush strokes.",
    tailwindProps: "font-cursive text-6xl text-cyan-400 capitalize -rotate-3 tracking-wide drop-shadow-[0_4px_10px_rgba(34,211,238,0.2)]",
    cssRules: `.logo-vancouver {\n  font-family: 'Mrs Sheppards', cursive;\n  font-size: 5rem;\n  color: #22d3ee;\n  transform: rotate(-3deg);\n  text-shadow: 1px 1px 0px #04090c, 3px 3px 15px rgba(34, 211, 238, 0.35);\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const SignatureSwash = ({ text }) => {\n  const frame = useCurrentFrame();\n  const strokeDash = interpolate(frame, [0, 25], [1000, 0]);\n\n  return (\n    <div className="logo-vancouver">\n      <span>{text}</span>\n      {/* Draw swash under text using SVG stroke anim */}\n    </div>\n  );\n};`,
    iconTag: "🖋️"
  },
  {
    id: "palma",
    name: "Palma Outlined Bubble",
    sourceImage: "Image 2: PALMA",
    category: "cyberpunk",
    fontFamily: "var(--font-syne)",
    bgStr: "#07010C",
    primaryColor: "#EC4899",
    secondaryColor: "#10B981",
    description: "Fat bubble outlines coupled with offset neon dot matrices and glowing fluid pink cyber curves. Bubbly, playful, and hyper-modern.",
    tailwindProps: "font-syne text-5xl font-black uppercase text-transparent [-webkit-text-stroke:2px_#ec4899] filter drop-shadow-[0_0_12px_rgba(236,72,153,0.45)]",
    cssRules: `.logo-palma {\n  font-family: 'Syne', sans-serif;\n  font-weight: 800;\n  -webkit-text-stroke: 1.8px #ec4899;\n  color: transparent;\n  text-shadow: 0 0 15px rgba(236, 72, 153, 0.45);\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const PalmaBubble = ({ text }) => {\n  const frame = useCurrentFrame();\n  const scale = interpolate(frame, [0, 20], [0.7, 1], { extrapolateRight: 'clamp' });\n\n  return (\n    <h1 style={{ transform: \`scale(\${scale})\` }} className="logo-palma">\n      {text}\n    </h1>\n  );\n};`,
    iconTag: "🧼"
  },
  {
    id: "fuji",
    name: "Fuji Monospace Grid",
    sourceImage: "Image 1: FUJI",
    category: "cyberpunk",
    fontFamily: "var(--font-mono)",
    bgStr: "#02070A",
    primaryColor: "#38BDF8",
    secondaryColor: "#06B6D4",
    description: "Technical monospaced engineering letters layered above isometric blueprint patterns and glowing circuit matrix borders.",
    tailwindProps: "font-mono text-3xl font-bold tracking-widest text-sky-400 bg-sky-950/20 px-4 py-2 border border-sky-500/30 rounded-xl leading-none",
    cssRules: `.logo-fuji {\n  font-family: 'JetBrains Mono', monospace;\n  color: #38bdf8;\n  background: rgba(56, 189, 248, 0.08);\n  border: 1px solid rgba(56, 189, 248, 0.3);\n  padding: 0.5rem 1rem;\n  border-radius: 0.75rem;\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const FujiTechGrid = ({ text }) => {\n  const frame = useCurrentFrame();\n  const opacity = interpolate(frame, [0, 45], [0, 1]);\n\n  return (\n    <div className="logo-fuji" style={{ opacity }}>\n      {text}\n    </div>\n  );\n};`,
    iconTag: "🗻"
  },
  {
    id: "gimbel",
    name: "Gimbel Luxury Serif",
    sourceImage: "Image 2: Gimbel",
    category: "heritage",
    fontFamily: "var(--font-serif-lux)",
    bgStr: "#0A0D10",
    primaryColor: "#E2E8F0",
    secondaryColor: "#94A3B8",
    description: "Graceful premium serif editorial layout. Exudes 1920s high-commerce department store elegance with light foil stamp contours.",
    tailwindProps: "font-serif-lux text-5xl font-medium tracking-tight text-slate-200 drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]",
    cssRules: `.logo-gimbel {\n  font-family: 'Playfair Display', serif;\n  font-weight: 500;\n  letter-spacing: -0.01em;\n  color: #f1f5f9;\n  text-shadow: 0 4px 12px rgba(255,255,255,0.04);\n}`,
    remotionCode: `import { useCurrentFrame, spring } from 'remotion';\n\nexport const GimbelTextReveal = ({ text }) => {\n  const frame = useCurrentFrame();\n  const opacity = spring({ frame, fps: 30, config: { damping: 15 } });\n\n  return (\n    <h1 className="logo-gimbel" style={{ opacity }}>\n      {text}\n    </h1>\n  );\n};`,
    iconTag: "💼"
  },
  {
    id: "rose",
    name: "Tudor tavern Rose",
    sourceImage: "Image 2: ROSE",
    category: "heritage",
    fontFamily: "var(--font-serif-lux)",
    bgStr: "#1A050A",
    primaryColor: "#F43F5E",
    secondaryColor: "#FB7185",
    description: "Symmetrical heritage pub loops framing detailed floral crest templates and warm crimson lacquer finishes.",
    tailwindProps: "font-serif-lux text-3xl font-black uppercase tracking-wider text-rose-500 border-2 border-rose-500/20 rounded-full px-6 py-5",
    cssRules: `.logo-rose {\n  font-family: 'Playfair Display', serif;\n  color: #f43f5e;\n  border: 2px solid rgba(244, 63, 94, 0.25);\n  border-radius: 9999px;\n  padding: 1rem 1.5rem;\n  text-shadow: 0 0 8px rgba(244, 63, 94, 0.3);\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const RoseCrestAnim = ({ text }) => {\n  const frame = useCurrentFrame();\n  const angle = interpolate(frame, [0, 50], [0, 360]);\n\n  return (\n    <div className="logo-rose" style={{ transform: \`rotate(\${angle}deg)\` }}>\n      {text}\n    </div>\n  );\n};`,
    iconTag: "🌹"
  },
  {
    id: "space",
    name: "Stutz bear Orbit",
    sourceImage: "Image 1: SPACE",
    category: "cyberpunk",
    fontFamily: "var(--font-syne)",
    bgStr: "#040508",
    primaryColor: "#06B6D4",
    secondaryColor: "#F43F5E",
    description: "Sleek aerospace vector rings charting deep space coordinates around futuristic display sans headings.",
    tailwindProps: "font-syne text-4xl font-extrabold uppercase tracking-widest text-[#00F0FF] relative",
    cssRules: `.logo-space {\n  font-family: 'Syne', sans-serif;\n  font-weight: 800;\n  letter-spacing: 0.2em;\n  color: #00f0ff;\n  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const OrbitComps = ({ text }) => {\n  const frame = useCurrentFrame();\n  const spin = interpolate(frame, [0, 120], [0, 360]);\n\n  return (\n    <div className="logo-space">\n      <div style={{ transform: \`rotate(\${spin}deg)\` }} className="absolute w-32 h-32 border border-dashed rounded-full" />\n      <span>{text}</span>\n    </div>\n  );\n};`,
    iconTag: "🛰️"
  },
  {
    id: "reno",
    name: "Reno Arch Nevada",
    sourceImage: "Image 1: RENO",
    category: "heritage",
    fontFamily: "var(--font-impact)",
    bgStr: "#0E0803",
    primaryColor: "#F97316",
    secondaryColor: "#FBBF24",
    description: "Retro arched Americana casino stamp. Styled with beautiful curved baselines, copper hot offsets, and authentic ink bleed textures.",
    tailwindProps: "font-impact text-5xl uppercase text-amber-500 tracking-tight transform hover:scale-105 transition-all duration-300",
    cssRules: `.logo-reno {\n  font-family: 'Anton', sans-serif;\n  color: #f97316;\n  letter-spacing: -0.01em;\n  text-shadow: 2px 2px 0px #fbbf24, 4px 4px 0px #0e0803;\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const RenoArchedLogo = ({ text }) => {\n  const frame = useCurrentFrame();\n  const warpFactor = interpolate(frame, [0, 30], [2, 0]);\n\n  return (\n    <div className="logo-reno text-center">\n      {/* Dynamic arch rendering based on character warpFactor */}\n    </div>\n  );\n};`,
    iconTag: " Desert Oasis"
  },
  {
    id: "boise",
    name: "Boise Gothic Workshop",
    sourceImage: "Image 1: Boise",
    category: "heritage",
    fontFamily: "var(--font-grunge)",
    bgStr: "#FAF7F2",
    primaryColor: "#1E293B",
    secondaryColor: "#64748B",
    description: "Organic distressed splashing dry-brush letters. Deliver high-energy authentic carpenter, craft brewery, or motorcycle garage vibes.",
    tailwindProps: "font-grunge text-5xl text-slate-800 tracking-wide drop-shadow-[2px_2px_1px_rgba(0,0,0,0.15)]",
    cssRules: `.logo-boise {\n  font-family: 'Permanent Marker', sans-serif;\n  font-size: 4rem;\n  color: #1e293b;\n  letter-spacing: 0.05em;\n  filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.1));\n}`,
    remotionCode: `import { useCurrentFrame, interpolate } from 'remotion';\n\nexport const DistressedBrush = ({ text }) => {\n  const frame = useCurrentFrame();\n  const scatter = interpolate(frame, [0, 10], [10, 0]);\n\n  return (\n    <div className="logo-boise" style={{ filter: \`blur(\${scatter}px)\` }}>\n      {text}\n    </div>\n  );\n};`,
    iconTag: "🌲"
  }
];

export default function LogoMaker() {
  const [activeRotationIndex, setActiveRotationIndex] = useState(0);
  const [brandName, setBrandName] = useState(() => localStorage.getItem('brand_name_custom') || 'XENNIALS');
  const [brandTagline, setBrandTagline] = useState('INTELLIGENT REVENUE LOOPS');
  const [establishedYear, setEstablishedYear] = useState('25');
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Inspiration Stylesheet Hub states
  const [workspaceMode, setWorkspaceMode] = useState<'presets' | 'inspiration_sheet'>('inspiration_sheet');
  const [selectedInspirationId, setSelectedInspirationId] = useState('clairevoyant');
  const [inspirationCategory, setInspirationCategory] = useState<'all' | 'heritage' | 'cyberpunk'>('all');
  
  // Custom interactive sliders to modify the design
  const [customSlant, setCustomSlant] = useState(-6); // deg skew
  const [customGlow, setCustomGlow] = useState(15); // px neon shadow
  const [customTracking, setCustomTracking] = useState(4); // px letter-spacing
  const [customStrokeWidth, setCustomStrokeWidth] = useState(1.5); // stroke width
  const [customAnimationEnabled, setCustomAnimationEnabled] = useState(true);
  const [customAccentColor, setCustomAccentColor] = useState('#c084fc');
  
  // Tab for inspector
  const [activeInspectorTab, setActiveInspectorTab] = useState<'stylesheet' | 'tailwind' | 'remotion'>('stylesheet');
  const [copiedText, setCopiedText] = useState(false);

  // HeyGen Hyperframe simulation hooks
  const [avatarScript, setAvatarScript] = useState('System synchronized. All virtual hyperframes operating under premium Alibaba ModelScope configurations.');
  const [hageenVoice, setHageenVoice] = useState<'tony_tech' | 'lisa_editorial' | 'mark_vintage' | 'viki_cyber'>('viki_cyber');
  const [isHyperframeRendering, setIsHyperframeRendering] = useState(false);
  const [activeAvatarPhoto, setActiveAvatarPhoto] = useState<string | null>(null);
  const [hyperframeLog, setHyperframeLog] = useState<string[]>([]);

  // ModelScope / Hugging Face simulation
  const [modelScopeQuery, setModelScopeQuery] = useState('A highly polished vintage circular vector stamp logo with gears');
  const [activeAiEngine, setActiveAiEngine] = useState<'modelscope' | 'huggingface'>('modelscope');
  const [isGeneratingAiAsset, setIsGeneratingAiAsset] = useState(false);
  const [aiExecutionLogs, setAiExecutionLogs] = useState<string[]>([]);
  const [generatedResultImage, setGeneratedResultImage] = useState<string | null>(null);

  // Active variation showcase tab
  const [activePreviewVariation, setActivePreviewVariation] = useState<'primary' | 'secondary' | 'submark'>('primary');
  const [websiteVariationId, setWebsiteVariationId] = useState<'A' | 'B' | 'C'>('A');

  const activeStyle = TEMPLATE_ROTATIONS[activeRotationIndex];

  // Rotate styles timer
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveRotationIndex((prev) => (prev + 1) % TEMPLATE_ROTATIONS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Keep business info in sync with odoo invoices if updated
  useEffect(() => {
    localStorage.setItem('brand_name_custom', brandName);
  }, [brandName]);

  const handleNextRotation = () => {
    setActiveRotationIndex((prev) => (prev + 1) % TEMPLATE_ROTATIONS.length);
  };

  const handlePrevRotation = () => {
    setActiveRotationIndex((prev) => (prev - 1 + TEMPLATE_ROTATIONS.length) % TEMPLATE_ROTATIONS.length);
  };

  // Trigger HeyGen (Hageen) Hyperframe avatar synthesis
  const handleSynthesizeHyperframe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarScript.trim()) return;

    setIsHyperframeRendering(true);
    setHyperframeLog([
      `Initializing Hageen AI Lip-Sync Engine (HeyGen SDK v4.9)`,
      `Negotiating interactive WebRTC socket connection...`,
      `Synthesizing phonemes matching voice profile: [${hageenVoice.toUpperCase()}]`,
      `Applying RAG avatar template coordinates on canvas`
    ]);

    setTimeout(() => {
      setHyperframeLog(prev => [
        ...prev,
        `Mouth movement frames successfully generated!`,
        `Rendering custom Hageen Hyperframe container at 60 FPS`,
        `Autonomous Spokesperson is now LIVE and presenting.`
      ]);
      setIsHyperframeRendering(false);
    }, 2800);
  };

  // Trigger ModelScope Generator with Hugging Face Backup
  const handleGenerateModelScopeAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelScopeQuery.trim()) return;

    setIsGeneratingAiAsset(true);
    setAiExecutionLogs([
      `Targeting Primary Engine: Alibaba ModelScope (damo/cv_hist_logo_generation_v2)...`,
      `Piping input schema text prompt: "${modelScopeQuery}"`,
      `Verifying server-side cluster endpoints...`
    ]);

    // Stage 1: Try ModelScope
    setTimeout(() => {
      // Simulate error in ModelScope to highlight the robust Hugging Face backup system!
      setAiExecutionLogs(prev => [
        ...prev,
        `⚠️ WARNING: ModelScope cluster returned [503 Service Unavailable] (Quota Limit Exceeded)`,
        `Pivoting immediately to REDUNDANT BACKUP ENGINE: Hugging Face Hub (stabilityai/stable-diffusion-xl-base-1.0)...`,
        `Translating weights parameters...`,
        `Hugging Face API request dispatched successfully.`
      ]);

      // Stage 2: Hugging Face Backup executes
      setTimeout(() => {
        setAiExecutionLogs(prev => [
          ...prev,
          `Generating image diffusion latent frames (45/45 steps completed)`,
          `Slicing image artifacts into client-side asset repository`,
          `Success! Rendered high-fidelity logo asset from Hugging Face backup container.`
        ]);
        setIsGeneratingAiAsset(false);
        // Apply beautiful dynamic asset
        setGeneratedResultImage(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80`);
      }, 2000);

    }, 2000);
  };

  // Simulated avatar photo loader
  const handleAvatarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setActiveAvatarPhoto(url);
    }
  };

  const activeInspiration = INSPIRATION_STYLES.find(s => s.id === selectedInspirationId) || INSPIRATION_STYLES[0];

  const handleCopyInspirationCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden text-sm bg-[#07090D]" id="remotion-studio-root">
      
      {/* LEFT DESIGN SIDEBAR: Mode Toggles & Selected View Configurations */}
      <div className="w-full xl:w-[380px] border-r border-white/5 bg-[#0a0d13] p-5 overflow-y-auto space-y-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Main Title and Brand Header */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#c084fc]/10 rounded-lg border border-[#c084fc]/30">
              <Sparkles className="w-4 h-4 text-[#c084fc]" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-100 font-mono">CEO Design Engine Hub</h3>
              <p className="text-[10px] text-gray-400 font-mono">Inspiration layouts matching Indianapolis & Y2K sheets</p>
            </div>
          </div>

          {/* Mode Swapper Button Bar */}
          <div className="p-1 bg-black/45 rounded-lg border border-white/5 grid grid-cols-2 gap-1.5">
            <button 
              onClick={() => setWorkspaceMode('inspiration_sheet')}
              className={cn(
                "py-1.5 text-[10px] font-mono font-bold uppercase rounded-md transition-all duration-300",
                workspaceMode === 'inspiration_sheet' 
                  ? "bg-[#c084fc] text-[#07090D] shadow-md shadow-[#c084fc]/20" 
                  : "text-gray-400 hover:text-slate-100 hover:bg-white/5"
              )}
            >
              ✨ Style Sheets
            </button>
            <button 
              onClick={() => setWorkspaceMode('presets')}
              className={cn(
                "py-1.5 text-[10px] font-mono font-bold uppercase rounded-md transition-all duration-300",
                workspaceMode === 'presets' 
                  ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20" 
                  : "text-gray-400 hover:text-slate-100 hover:bg-white/5"
              )}
            >
              🎥 Video Reels
            </button>
          </div>

          {/* SHARED BRAND IDENTITY CONFIGURATOR */}
          <div className="space-y-3 p-4 bg-black/30 rounded-xl border border-white/5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c084fc] flex items-center gap-1.5">
              <Sliders className="w-3 h-3" />
              <span>Identity Configurator</span>
            </h4>
            
            <div className="space-y-2.5">
              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Brand Principal Line</label>
                <input 
                  type="text" 
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value.toUpperCase())}
                  className="w-full bg-[#040609] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white uppercase tracking-wider focus:border-purple-500 font-bold focus:outline-none"
                  placeholder="e.g. XENNIALS"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Company Tagline / Subtext</label>
                <input 
                  type="text" 
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value.toUpperCase())}
                  className="w-full bg-[#040609] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white uppercase tracking-wider focus:border-purple-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Est. Founding Label</label>
                <input 
                  type="text" 
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className="w-full bg-[#040609] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white uppercase tracking-wider focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SETTINGS COMPONENT BASED ON SELECTED MODE */}
          {workspaceMode === 'presets' ? (
            <div className="space-y-4">
              {/* Preset Specific controls */}
              <div className="p-3.5 bg-purple-950/20 border border-purple-900/35 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-gray-400">
                  <span>Selected Video Preset</span>
                  <span className="text-cyan-400 font-bold">{activeRotationIndex + 1} / {TEMPLATE_ROTATIONS.length}</span>
                </div>
                <ActiveStyleBadge>
                  <RotateCw className={cn("w-2.5 h-2.5", isAutoRotating && "animate-spin")} />
                  <span>{activeStyle.name}</span>
                </ActiveStyleBadge>
                <p className="text-[10px] text-gray-400 leading-snug">{activeStyle.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block">Manual Rotation Wheels</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handlePrevRotation}
                    className="bg-[#161a22] border border-white/5 hover:bg-[#1E2430] text-gray-200 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition"
                  >
                    ◀ Prev Preset
                  </button>
                  <button 
                    onClick={handleNextRotation}
                    className="bg-[#161a22] border border-white/5 hover:bg-[#1E2430] text-gray-200 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition"
                  >
                    Next Preset ▶
                  </button>
                </div>

                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={cn(
                    "w-full text-[10px] font-mono font-bold uppercase py-2 rounded border transition-all mt-1",
                    isAutoRotating 
                      ? "bg-fuchsia-600/25 text-fuchsia-400 border-fuchsia-500/40" 
                      : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
                  )}
                >
                  {isAutoRotating ? "⏸ Pause Automatic Wheel" : "🔄 Start Auto-Rotation Carousel"}
                </button>
              </div>
            </div>
          ) : (
            /* INSPIRATION SHEET: Active Design Tuning Panel */
            <div className="space-y-4 p-4 bg-black/25 rounded-xl border border-white/5">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-3 h-3" />
                <span>Micro Design Adjuster</span>
              </h4>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-gray-400">Slant / Skew Angle:</span>
                    <span className="text-[#c084fc] font-bold">{customSlant} deg</span>
                  </div>
                  <input 
                    type="range" 
                    min="-15" 
                    max="15" 
                    value={customSlant} 
                    onChange={(e) => setCustomSlant(Number(e.target.value))}
                    className="w-full accent-[#c084fc]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-gray-400">Letter Tracking Gaps:</span>
                    <span className="text-[#c084fc] font-bold">{customTracking} px</span>
                  </div>
                  <input 
                    type="range" 
                    min="-4" 
                    max="16" 
                    value={customTracking} 
                    onChange={(e) => setCustomTracking(Number(e.target.value))}
                    className="w-full accent-[#c084fc]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-gray-400">Neon Glow Aura Radius:</span>
                    <span className="text-[#c084fc] font-bold">{customGlow} px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="35" 
                    value={customGlow} 
                    onChange={(e) => setCustomGlow(Number(e.target.value))}
                    className="w-full accent-[#c084fc]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-gray-400">Stroke Outline Ring:</span>
                    <span className="text-[#c084fc] font-bold">{customStrokeWidth} px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="4" 
                    step="0.5" 
                    value={customStrokeWidth} 
                    onChange={(e) => setCustomStrokeWidth(Number(e.target.value))}
                    className="w-full accent-[#c084fc]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-gray-400">Aesthetics Accent Tint:</span>
                    <span className="text-white font-mono uppercase text-[9px]" style={{ color: customAccentColor }}>{customAccentColor}</span>
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    {['#c084fc', '#ef4444', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#ffffff'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setCustomAccentColor(c)}
                        className={cn(
                          "w-4 h-4 rounded-full border border-white/20 transition",
                          customAccentColor === c ? "ring-2 ring-purple-400 scale-110" : ""
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/5">
                  <span className="text-gray-400">Cinematic Glow Animations:</span>
                  <button 
                    onClick={() => setCustomAnimationEnabled(!customAnimationEnabled)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase border transition",
                      customAnimationEnabled 
                        ? "bg-emerald-500/25 border-emerald-400/40 text-emerald-400" 
                        : "bg-black/30 border-white/10 text-gray-500"
                    )}
                  >
                    {customAnimationEnabled ? "Animated ON" : "Static ONLY"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Meta Footer */}
        <div className="p-3 bg-[#11151F] rounded-lg text-[9.5px] font-mono text-gray-500 space-y-1 border border-white/5 mt-4">
          <div className="flex justify-between">
            <span>Core Active Pipeline:</span>
            <span className="text-slate-100">{workspaceMode === 'presets' ? activeStyle.fontFamily.split(',')[0] : activeInspiration.fontFamily.replace('var(--font-', '').replace(')', '')}</span>
          </div>
          <div className="flex justify-between">
            <span>Aesthetics Engine:</span>
            <span className="text-fuchsia-400 font-bold">{workspaceMode === 'presets' ? "Automated Reels" : "Inspiration Sheets v2"}</span>
          </div>
        </div>
      </div>

      {/* CENTER ZONE: Logo Compositors & Assets Boards depending on mode */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-start">
        {workspaceMode === 'presets' ? (
          /* PRESETS MODE MAIN INTERFACES */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E95A3] bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/35">Remotion Core Active</span>
              </div>
              <div className="flex-1 text-left sm:text-end">
                <h3 className="text-white text-sm font-bold uppercase font-mono tracking-tight flex items-center justify-start sm:justify-end gap-1.5" style={{ color: '#a855f7', textShadow: '0 0 10px rgba(168, 85, 247, 0.4)' }}>
                  <span>Remotion Video Timeline (remotion.dev)</span>
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Programmatic 60fps loops rendering on port 3000</p>
              </div>
              <div className="flex bg-[#12161A] p-0.5 rounded border border-white/5 self-start">
                {(['primary', 'secondary', 'submark'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setActivePreviewVariation(v)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded transition",
                      activePreviewVariation === v ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stage Grid Wrapper */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Compositions Video Canvas box */}
              <div className="bg-[#0b0c11] rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden group">
                <div className="absolute top-2.5 left-2.5 text-[8.5px] font-mono uppercase text-gray-600 border border-white/5 px-2 py-0.5 rounded bg-black/25">
                  Viewport: Remotion Canvas Renderer
                </div>
                {/* Dynamic compositions render based on variation tab */}
                <div className="text-center space-y-4">
                  {activePreviewVariation === 'primary' && (
                    <div className="space-y-3">
                      <h2 className="text-4xl font-black uppercase tracking-tight text-center transition-all duration-500"
                        style={{ 
                          fontFamily: activeStyle.fontFamily, 
                          color: activeStyle.themeColors.primary,
                          textShadow: `0 0 20px ${activeStyle.themeColors.glow || 'rgba(255,255,255,0.2)'}`
                        }}
                      >
                        {brandName}
                      </h2>
                      <div className="text-[10px] font-mono tracking-widest text-[#8E95A3]" style={{ color: activeStyle.themeColors.secondary }}>
                        {brandTagline}
                      </div>
                    </div>
                  )}

                  {activePreviewVariation === 'secondary' && (
                    <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center">
                      <span className="text-[9px] font-mono text-gray-500 mb-1">Established since 20{establishedYear}</span>
                      <h3 className="text-2xl font-bold tracking-widest uppercase text-center" style={{ fontFamily: activeStyle.fontFamily, color: activeStyle.themeColors.secondary }}>
                        {brandName}
                      </h3>
                      <div className="w-16 h-px my-2" style={{ backgroundColor: activeStyle.themeColors.primary }} />
                      <span className="text-[10px] font-mono" style={{ color: activeStyle.themeColors.primary }}>&bull; {brandTagline} &bull;</span>
                    </div>
                  )}

                  {activePreviewVariation === 'submark' && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-black" 
                        style={{ 
                          borderColor: activeStyle.themeColors.primary, 
                          color: activeStyle.themeColors.secondary,
                          textShadow: `0 0 10px ${activeStyle.themeColors.primary}`
                        }}
                      >
                        {brandName.substring(0, 1)}
                      </div>
                      <span className="text-[9px] font-mono font-bold mt-2 uppercase text-gray-400 tracking-widest">{brandName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic HeyGen (Hageen) spokesman video frame */}
              <div className="bg-[#0b0c11] rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-mono font-bold text-gray-300">Autonomous Hyperframe Spokesperson</span>
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">Hageen Live Synthesizer</span>
                  </div>

                  {/* Avatar Frame Box */}
                  <div className="h-44 bg-black rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                    {activeAvatarPhoto ? (
                      <div className="w-full h-full relative">
                        <img src={activeAvatarPhoto} alt="Custom Spokesperson" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-color" />
                        
                        {/* Audio graphic waves */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1 bg-black/60 rounded border border-white/10">
                          <span className={cn("inline-block w-1.5 h-3 bg-cyan-400 rounded-full", isHyperframeRendering && "animate-bounce")} />
                          <span className={cn("inline-block w-1.5 h-4 bg-cyan-400 rounded-full [animation-delay:0.1s]", isHyperframeRendering && "animate-bounce")} />
                          <span className={cn("inline-block w-1.5 h-6 bg-cyan-400 rounded-full [animation-delay:0.2s]", isHyperframeRendering && "animate-bounce")} />
                          <span className={cn("inline-block w-1.5 h-2.5 bg-cyan-400 rounded-full [animation-delay:0.3s]", isHyperframeRendering && "animate-bounce")} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <div className="text-4xl text-gray-600 mb-2">👤</div>
                        <p className="text-[10px] text-gray-500">No human-like avatar photo uploaded yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Avatar speech controls */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select 
                        value={hageenVoice} 
                        onChange={(e) => setHageenVoice(e.target.value as any)}
                        className="bg-[#12161A] border border-white/5 rounded text-[10px] text-gray-300 px-2 py-1 focus:outline-none"
                      >
                        <option value="tony_tech">🎙️ Tony (Tech Innovator)</option>
                        <option value="lisa_editorial">🎙️ Lisa (Luxury Editorial)</option>
                        <option value="mark_vintage">🎙️ Mark (Heritage Craftsman)</option>
                        <option value="viki_cyber">🎙️ Viki (Hot Y2K Cyber)</option>
                      </select>
                      <input 
                        type="text" 
                        value={avatarScript}
                        onChange={(e) => setAvatarScript(e.target.value)}
                        className="flex-grow bg-black/45 border border-white/5 rounded text-[10px] px-2.5 py-1 text-white focus:outline-none"
                        placeholder="Type script for Lip-sync sync..."
                      />
                      <button onClick={handleSynthesizeHyperframe} type="button" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-[10px] font-bold font-mono uppercase font-semibold">
                        Sync
                      </button>
                    </div>

                    {/* Heygen file upload form */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9.5px] text-gray-500 font-mono">Upload active real life portrait / avatar:</span>
                      <label className="bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-[9.5px] font-mono px-2 py-1 rounded cursor-pointer transition">
                        Browse Photo
                        <input type="file" onChange={handleAvatarPhotoUpload} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Hyperframe sync output logs */}
                <div className="mt-4 p-3 bg-black/60 rounded border border-white/5 space-y-1 max-h-24 overflow-y-auto">
                  {hyperframeLog.map((log, i) => (
                    <div key={i} className="text-[9px] font-mono text-cyan-400 select-none">
                      &bull;&bull;&bull; {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ModelScope & Redundant Hugging Face Studio Frame */}
            <div className="bg-[#0b0c11] p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white text-xs font-bold uppercase font-mono">Vector Stamp Generator (ModelScope AI Engine)</h4>
                  <p className="text-[9.5px] text-gray-500 font-mono">Simulated multi-tier redundant cascade pipeline (Alibaba cv cluster & SDXL cascade)</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveAiEngine('modelscope')}
                    className={cn(
                      "px-2 py-0.5 rounded text-[9.5px] font-semibold",
                      activeAiEngine === 'modelscope' ? "bg-[#c084fc] text-[#07090D]" : "bg-white/5 text-gray-400"
                    )}
                  >
                    Alibaba ModelScope
                  </button>
                  <button 
                    onClick={() => setActiveAiEngine('huggingface')}
                    className={cn(
                      "px-2 py-0.5 rounded text-[9.5px] font-semibold",
                      activeAiEngine === 'huggingface' ? "bg-[#c084fc] text-[#07090D]" : "bg-white/5 text-gray-400"
                    )}
                  >
                    Hugging Face Backup
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={modelScopeQuery}
                  onChange={(e) => setModelScopeQuery(e.target.value)}
                  className="flex-grow bg-black/45 border border-white/5 rounded text-xs px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Ask ModelScope to craft design vectors..."
                />
                <button onClick={handleGenerateModelScopeAsset} type="button" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-xs font-bold font-mono uppercase font-semibold">
                  Execute Cascade Run
                </button>
              </div>

              {/* Status Log list */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/80 rounded border border-white/5 p-3 min-h-[140px] max-h-[180px] overflow-y-auto space-y-1 font-mono text-[9px] text-[#8E95A3]">
                  <div className="text-yellow-500 uppercase font-bold text-[8px] tracking-wider mb-1">=== DEPLOYMENT EXECUTION TERMINAL ===</div>
                  {aiExecutionLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      &gt; {log}
                    </div>
                  ))}
                </div>

                <div className="h-[180px] bg-black/50 rounded border border-white/5 flex items-center justify-center relative overflow-hidden">
                  {generatedResultImage ? (
                    <img src={generatedResultImage} alt="Simulated vector result" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center text-gray-500 font-mono text-[10px]">
                      {isGeneratingAiAsset ? (
                        <div className="space-y-2">
                          <RotateCw className="w-5 h-5 mx-auto animate-spin text-purple-400" />
                          <p className="animate-pulse">Synthesizing latent weights, cascade failover ready...</p>
                        </div>
                      ) : (
                        "Diffusion output frame unallocated"
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STYLE SHEETS (INSPIRATION ENGINE HUB MODE) */
          <div className="space-y-6">
            {/* Header section with categories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
              <div>
                <h3 className="text-white text-base font-black uppercase tracking-tight flex items-center gap-2">
                  <span>Interactive Stylesheet Playground</span>
                  <span className="text-[10px] bg-[#c084fc]/15 text-[#c084fc] px-2 py-0.5 rounded border border-[#c084fc]/25 font-mono"> Indianapolis v2 & Cyberpunk Heritage Board</span>
                </h3>
                <p className="text-[11px] text-gray-400 font-mono">Click any style card below to test, edit, and export real design values.</p>
              </div>

              {/* Category selector pills */}
              <div className="flex bg-black/45 p-1 rounded-lg border border-white/5 gap-1 shadow-inner self-start">
                {(['all', 'heritage', 'cyberpunk'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setInspirationCategory(cat)}
                    className={cn(
                      "px-3 py-1 rounded text-[10px] font-mono font-bold uppercase transition",
                      inspirationCategory === cat 
                        ? "bg-[#1E2533] text-purple-300 border border-purple-500/20" 
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {cat === 'all' && "🌿 All Templates"}
                    {cat === 'heritage' && "🏛️ Vintage Heritage"}
                    {cat === 'cyberpunk' && "⚡ Y2K Cyber"}
                  </button>
                ))}
              </div>
            </div>

            {/* STAGE & PLAYGROUND ZONE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Dynamic Interactive Vector Logo Preview Stage */}
              <div className="lg:col-span-7 rounded-2xl border border-white/5 p-8 flex flex-col justify-between min-h-[350px] relative overflow-hidden transition-all duration-300 shadow-2xl"
                style={{ backgroundColor: activeInspiration.bgStr }}
              >
                {/* Simulated Blueprint drafting overlay grids */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/5 pointer-events-none" />
                
                {/* Decorative target markers */}
                <div className="absolute top-3 left-3 text-[9px] font-mono text-gray-600 uppercase border border-white/5 px-2 py-0.5 rounded bg-black/40">
                  REF: {activeInspiration.sourceImage}
                </div>
                <div className="absolute top-3 right-3 text-[9px] font-mono text-emerald-400 uppercase border border-emerald-500/10 px-2 py-0.5 rounded bg-black/40 animate-pulse">
                  SYSTEM ACTIVE
                </div>

                {/* Main Render block */}
                <div className="my-auto text-center relative py-12 flex flex-col items-center justify-center select-none">
                  
                  {/* Decorative orbital halo wrapper if appropriate */}
                  {activeInspiration.id === 'space' && (
                    <div className="absolute w-64 h-24 border-2 border-dashed rounded-full pointer-events-none animate-spin"
                      style={{ 
                        borderColor: customAccentColor, 
                        animationDuration: '10s'
                      }} 
                    />
                  )}

                  {/* Sparkling SVG Stars if popped pop-art selected */}
                  {activeInspiration.id === 'struck' && (
                    <>
                      <div className="absolute top-4 left-1/4 text-xl animate-bounce">✨</div>
                      <div className="absolute bottom-6 right-1/4 text-xl animate-pulse">⭐</div>
                    </>
                  )}

                  {/* Swash ribbon SVG curve simulated beneath Vancouver script */}
                  {activeInspiration.id === 'vancouver' && (
                    <div className="absolute bottom-6 w-52 h-4 rounded-full pointer-events-none" 
                      style={{ 
                        borderBottom: `3px solid ${customAccentColor}`, 
                        filter: 'blur(1px)',
                        transform: `skewX(${customSlant}deg)`
                      }} 
                    />
                  )}

                  {/* High contrast styled primary brand title */}
                  <h1 className="text-5xl font-black uppercase text-center transition-all duration-300 cursor-pointer"
                    style={{
                      fontFamily: activeInspiration.fontFamily,
                      transform: `skewX(${customSlant}deg) rotate(${customSlant / 2}deg)`,
                      letterSpacing: `${customTracking}px`,
                      color: activeInspiration.id === 'palma' ? 'transparent' : activeInspiration.primaryColor,
                      WebkitTextStroke: activeInspiration.id === 'palma' ? `${customStrokeWidth}px ${customAccentColor}` : 'none',
                      textShadow: `0 0 ${customGlow}px ${customAccentColor}`,
                      animation: (customAnimationEnabled && activeInspiration.id === 'clairevoyant') ? 'pulse 2.2s infinite' : 'none'
                    }}
                  >
                    {brandName || "XENNIALS"}
                  </h1>

                  {/* Styled Secondary tagline */}
                  <p className="mt-3 text-xs uppercase font-bold tracking-widest text-center"
                    style={{ 
                      color: activeInspiration.secondaryColor,
                      fontFamily: 'Space Grotesk, sans-serif',
                      textShadow: `0 0 ${customGlow / 2}px rgba(255,255,255,0.1)`
                    }}
                  >
                    {brandTagline || "INTELLIGENT REVENUE LOOPS"}
                  </p>
                </div>

                {/* Live values overlay bar */}
                <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] font-mono text-gray-500 bg-black/20 p-2.5 rounded-lg">
                  <div>CSS Slanted: <span className="text-white font-bold">{customSlant}°</span></div>
                  <div>Glow Density: <span className="text-white font-bold">{customGlow}px</span></div>
                  <div>Tracking Gaps: <span className="text-white font-bold">{customTracking}px</span></div>
                  <div className="capitalize text-purple-400 font-bold flex items-center gap-1">
                    <span>{activeInspiration.category} Engine</span>
                  </div>
                </div>
              </div>

              {/* Stylesheet Inspector, Code Copier Node */}
              <div className="lg:col-span-5 bg-[#0b0c11] rounded-2xl border border-white/5 p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1f2533] pb-2">
                    <span className="text-xs font-mono font-bold text-gray-300">Style Inspector Tools</span>
                    {copiedText ? (
                      <span className="text-[9.5px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25 animate-bounce">copied!</span>
                    ) : (
                      <span className="text-[8.5px] text-gray-500 font-mono">100% Client-side ready</span>
                    )}
                  </div>

                  {/* Inspector Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                    {(['stylesheet', 'tailwind', 'remotion'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveInspectorTab(tab)}
                        className={cn(
                          "py-1.5 text-[9.5px] font-mono font-bold uppercase rounded-md transition",
                          activeInspectorTab === tab ? "bg-purple-950/40 text-purple-300 border border-purple-800/30" : "text-gray-500 hover:text-white"
                        )}
                      >
                        {tab === 'stylesheet' && "CSS Custom"}
                        {tab === 'tailwind' && "Tailwind"}
                        {tab === 'remotion' && "Remotion Code"}
                      </button>
                    ))}
                  </div>

                  {/* Code Viewbox Container */}
                  <div className="relative">
                    <pre className="bg-[#040609] p-3.5 rounded-lg border border-white/5 text-[9px] font-mono text-cyan-400 max-h-[175px] overflow-y-auto block whitespace-pre-wrap select-all">
                      {activeInspectorTab === 'stylesheet' && `${activeInspiration.cssRules}`}
                      {activeInspectorTab === 'tailwind' && `<!-- Tailwind Class Name List for ${activeInspiration.name} -->\n<h1 className="${activeInspiration.tailwindProps}">\n  {brandName}\n</h1>`}
                      {activeInspectorTab === 'remotion' && `${activeInspiration.remotionCode}`}
                    </pre>

                    {/* Clipboard copy floating trigger */}
                    <button 
                      onClick={() => {
                        const txt = activeInspectorTab === 'stylesheet' 
                          ? activeInspiration.cssRules 
                          : activeInspectorTab === 'tailwind' 
                            ? activeInspiration.tailwindProps 
                            : activeInspiration.remotionCode;
                        handleCopyInspirationCode(txt);
                      }}
                      className="absolute top-2.5 right-2.5 bg-purple-950/80 text-purple-300 hover:text-white border border-purple-800/40 px-2 py-1 rounded text-[8.5px] font-mono uppercase tracking-wider transition"
                    >
                      Copy Snippet
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/20 border border-indigo-900/35 rounded-xl space-y-1 mt-4 text-[9px] font-mono text-gray-400">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold uppercase text-[9.5px]"> Indianapolis Auto-Warping</span>
                    <span className="text-cyan-400">Stable Build</span>
                  </div>
                  <p className="leading-snug font-sans">The typography and skew values correspond cleanly to Indianapolis motorsport cards. Use the copying snippet directly in your web production layouts!</p>
                </div>
              </div>
            </div>

            {/* HIGH FIDELITY STYLE GALLERY CARDS GRID */}
            <div className="space-y-3.5">
              <h4 className="text-white text-xs font-bold uppercase font-mono tracking-tight flex items-center gap-1.5 border-b border-white/5 pb-2">
                <span>Indianapolis & Y2K Inspiration Sheet Catalog</span>
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {INSPIRATION_STYLES
                  .filter(s => inspirationCategory === 'all' || s.category === inspirationCategory)
                  .map(style => (
                    <div 
                      key={style.id}
                      onClick={() => {
                        setSelectedInspirationId(style.id);
                        // Apply default colors of selected style to custom accents
                        setCustomAccentColor(style.primaryColor);
                        if (style.id === 'indianapolis') setCustomSlant(-4);
                        if (style.id === 'vancouver') setCustomSlant(-3);
                        if (style.id === 'clairevoyant') setCustomSlant(-6);
                        if (style.id === 'fuji') setCustomSlant(0);
                      }}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-102 hover:shadow-xl group min-h-[145px]",
                        selectedInspirationId === style.id 
                          ? "bg-[#181d27]/90 border-purple-500/50 shadow-purple-500/10" 
                          : "bg-[#0b0c11] border-white/5 hover:border-white/20 hover:bg-[#121622]"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-2xl select-none">{style.iconTag}</span>
                        <span className="text-[7.5px] font-mono text-gray-500 uppercase px-1.5 py-0.5 bg-black/60 rounded max-w-[90px] truncate">
                          {style.sourceImage.replace('Image ', '')}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-4">
                        <h5 className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight font-mono truncate">{style.name}</h5>
                        <p className="text-[9px] text-gray-500 leading-snug line-clamp-2">{style.description}</p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2.5 text-[8.5px] font-mono">
                        <span className="text-slate-400 capitalize">{style.category}</span>
                        <span className="text-[#c084fc] font-bold">Select &rarr;</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: Live Mini Website variation mockup with real-time style injection */}
      <div className="w-full xl:w-[280px] border-l border-white/5 bg-[#0a0d13] p-4 overflow-y-auto space-y-4 shrink-0 flex flex-col font-mono text-xs">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Live Website Injector</span>
          <span className="text-[8.5px] text-emerald-400 font-mono animate-pulse">● online</span>
        </div>

        <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-2 font-sans">
          <span className="text-[8.5px] text-gray-500 font-mono uppercase block">Inject Style into Variant Layout</span>
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/45 rounded-lg border border-white/5 font-mono">
            {(['A', 'B', 'C'] as const).map(varId => (
              <button
                key={varId}
                type="button"
                onClick={() => setWebsiteVariationId(varId)}
                className={cn(
                  "py-1 text-[10px] font-mono font-bold uppercase rounded-md transition",
                  websiteVariationId === varId ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
                )}
              >
                Mock {varId}
              </button>
            ))}
          </div>
        </div>

        {/* Live Mock Website Body Container */}
        <div className="flex-grow bg-black/20 rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between min-h-[360px] relative">
          
          {/* Mock Web Top Header */}
          <div className="p-3 bg-black/60 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-black border"
                style={{ 
                  color: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary,
                  borderColor: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary
                }}
              >
                {brandName.substring(0, 1)}
              </div>
              <span className="font-mono font-bold text-[9.5px] uppercase tracking-wider block max-w-[80px] truncate"
                style={{ color: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary }}
              >
                {brandName}
              </span>
            </div>

            <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded text-gray-400 font-semibold select-none">
              MOCK {websiteVariationId}
            </span>
          </div>

          {/* Website Mock Body Page render */}
          <div className="flex-grow p-4 flex flex-col justify-between text-center select-none font-sans">
            {websiteVariationId === 'A' && (
              <div className="text-center space-y-3.5 py-6">
                <span className="text-[8px] uppercase tracking-widest font-mono bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/25">
                  SECURE PLATFORM LIVE
                </span>
                <h2 className="text-md font-black uppercase tracking-tight" 
                  style={{ 
                    color: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary, 
                    fontFamily: workspaceMode === 'inspiration_sheet' ? activeInspiration.fontFamily : activeStyle.fontFamily 
                  }}
                >
                  INTELLIGENT INTEGRATION LOOPS
                </h2>
                <p className="text-[9px] text-gray-500 font-mono tracking-tight leading-relaxed max-w-[190px] mx-auto">
                  Automatically parse custom databases, hot-reload container instances, and orchestrate server pipelines on port 3000.
                </p>
                <div className="flex gap-1.5 justify-center pt-1.5 font-mono">
                  <button className="text-[8px] font-bold uppercase bg-cyan-600 text-white px-2.5 py-1 rounded transition select-none">
                    Launch
                  </button>
                  <button className="text-[8px] font-bold uppercase border border-white/10 hover:border-white text-gray-400 px-2.5 py-1 rounded transition select-none">
                    Logs
                  </button>
                </div>
              </div>
            )}

            {websiteVariationId === 'B' && (
              <div className="space-y-3 py-1 text-center font-sans">
                <span className="text-[8px] uppercase tracking-widest font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  METRIC MATRIX CONTROL
                </span>
                
                <h2 className="text-xs font-black uppercase font-sans"
                  style={{ 
                    color: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary,
                    fontFamily: workspaceMode === 'inspiration_sheet' ? activeInspiration.fontFamily : activeStyle.fontFamily
                  }}
                >
                  {brandTagline}
                </h2>

                <div className="grid grid-cols-2 gap-1.5 pt-1 text-left font-mono">
                  <div className="p-2 bg-black/40 rounded border border-white/5 space-y-1">
                    <span className="text-[7.5px] text-gray-500 block leading-none">SERVER BIND STATUS</span>
                    <span className="text-[9.5px] font-black text-emerald-400">PORT 3000</span>
                  </div>
                  <div className="p-2 bg-black/45 rounded border border-white/5 space-y-1">
                    <span className="text-[7.5px] text-gray-500 block leading-none">RED DISPATCH ACTIVE</span>
                    <span className="text-[9.5px] font-black text-indigo-400">STABLE</span>
                  </div>
                </div>
              </div>
            )}

            {websiteVariationId === 'C' && (
              <div className="text-center py-4 space-y-3.5">
                <div className="italic text-center text-[10.5px] leading-relaxed max-w-[190px] mx-auto text-gray-400 font-sans">
                  "Authentic heritage and quality, built collectively since 20{establishedYear}."
                </div>

                <div className="p-3.5 rounded-xl border border-dashed flex flex-col items-center justify-center space-y-1 max-w-[190px] mx-auto bg-black/30 animate-pulse font-sans"
                  style={{ borderColor: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary }}
                >
                  <span className="text-[9px] uppercase tracking-widest font-bold font-mono" style={{ color: workspaceMode === 'inspiration_sheet' ? customAccentColor : activeStyle.themeColors.primary }}>
                    ★ Catalog 20{establishedYear} ★
                  </span>
                  <div className="text-[8px] leading-relaxed text-gray-500 font-mono">
                    Premium heavy apparel catalogs, workshop instruments, and outdoor outfitters certified since founding.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Web Mock Footer */}
          <div className="p-2 bg-black/40 border-t border-white/5 text-[7.5px] text-gray-500 font-mono flex justify-between uppercase">
            <span>Server: local_3000</span>
            <span>Est. 20{establishedYear}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
