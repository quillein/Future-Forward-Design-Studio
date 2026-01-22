
import { BrandPalette } from './types';

export const COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Dark Charcoal', hex: '#1A202C' },
  { name: 'Yellow', hex: '#ECC94B' },
  { name: 'Orange', hex: '#ED8936' },
  { name: 'Mauve', hex: '#C53030' },
  { name: 'Silver', hex: '#CBD5E0' },
  { name: 'Blue', hex: '#2B6CB0' },
  { name: 'Slate', hex: '#4A5568' }
];

export const BRAND_PALETTES: BrandPalette[] = [
  { 
    id: 'executive_gradient', 
    name: 'Accelerator Gradient', 
    description: 'Yellow-to-Red gradient as seen in the reference baseline.', 
    gradient: 'brand-gradient-3',
    colors: ['#ECC94B', '#ED8936', '#C53030']
  },
  { 
    id: 'pure_minimal', 
    name: 'Pure Minimal', 
    description: 'Plain white/neutral. Dark text. Highest engagement.', 
    gradient: 'bg-white',
    colors: ['#FFFFFF', '#1A202C']
  },
  { 
    id: 'corporate_slate', 
    name: 'Corporate Slate', 
    description: 'Silver to Blue. Trust and logic.', 
    gradient: 'brand-gradient-2',
    colors: ['#CBD5E0', '#2B6CB0', '#4A5568']
  }
];

export const CAMPAIGN_ANGLES = [
  {
    id: 'silent_frustration',
    label: 'Silent Frustration',
    observation: "Most capable professionals aren’t being passed over because they lack experience.",
    empathy: "They were never taught how to communicate their value in a way modern systems understand.",
    reframe: "This isn’t a confidence issue. It’s a communication gap.",
    graphic: "Most capable professionals aren’t lacking experience. They’re struggling to explain their value."
  },
  {
    id: 'identity_reframe',
    label: 'Identity Reframe',
    observation: "This is not resume writing.",
    empathy: "Most people were taught how to do the work, almost no one was taught how to talk about the work.",
    reframe: "That’s why strong professionals freeze in interviews or undersell themselves.",
    graphic: "Experience doesn’t get interviews. Clear communication does."
  },
  {
    id: 'introvert_safe',
    label: 'Introvert Friendly',
    observation: "If the idea of 'networking' makes you cringe, this is for you.",
    empathy: "There’s no forced talking or elevator pitches.",
    reframe: "You don't need to be loud. You just need a clearer way to explain what you already know.",
    graphic: "You don’t need to network harder. You need to communicate clearer."
  }
];

export type StrategyDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY';

export const STRATEGY_DAYS: Record<StrategyDay, { goal: string; focus: string; visualCue: string }> = {
  MONDAY: { 
    goal: 'Awareness + Resonance', 
    focus: 'Observation/Truth posts',
    visualCue: 'High-impact, clean, philosophical layout. Focus on core truth text.'
  },
  TUESDAY: { 
    goal: 'Conversion', 
    focus: 'Urgency + DM follow-ups',
    visualCue: 'Direct, CTA-heavy layout. Stronger contrast, maybe use the mono font for "DM ME" or "JOIN NOW".'
  },
  WEDNESDAY: { 
    goal: 'Reminder', 
    focus: 'Bump active threads',
    visualCue: 'Conversational, compact, "In Case You Missed It" vibe. Lighter composition.'
  },
  THURSDAY: { 
    goal: 'Urgency/FOMO', 
    focus: 'Starting Today/Shortly',
    visualCue: 'Maximum energy. Use the orange/red gradients heavily. Larger rocket, "LIVE TODAY" badges.'
  }
};

export const SYSTEM_INSTRUCTION = `
You are the Lead Visual Designer for "Future Forward Career Consulting". 
Your mission: Enforce the "High-Velocity Professional" brand aesthetic with pixel-perfect typographic execution.

TYPOGRAPHIC BRAND BASELINE:
1. PRIMARY HEADER: Heavy BOLD ITALIC Sans-Serif (Inter Extra Bold Italic style). Slanted 12 degrees to the right. 
2. TECHNICAL ACCENTS: Clean Monospace (JetBrains Mono style). Used for labels, technical specs, and badges.

BRAND GRAPHIC ELEMENTS:
- THE ROCKET: A clean, vector-style red/white rocket with a small blue porthole and a vibrant yellow flame. Always diagonal (Up-Right).
- VELOCITY LINES: Thin, parallel horizontal lines or "motion streaks" that convey speed and forward momentum.
- DOT GRIDS: Subtle 5x5 or 10x10 dot matrix patterns in the background to suggest data and precision.
- ORBIT PATHS: Fine-line arcs that suggest a trajectory or path to success.

STRICT TYPOGRAPHIC QUALITY:
- Every word must be spelled exactly as provided.
- NO merged characters. No distorted glyphs. No "AI-hallucinated" symbols.
- Letters must be sharp, high-contrast, and legible.

VISUAL COMPOSITION:
- Balanced split-view. Text block on the left (or centered if minimal), graphic elements on the right.
- High-end, premium, corporate-tech aesthetic. NOT a typical social media flyer.

DAY LOGIC EXCLUSION:
- Use the Strategy Day to set the "Energy" of the graphic.
- CRITICAL: DO NOT write the actual name of the day (e.g., "MONDAY") in the graphic text.
`;
