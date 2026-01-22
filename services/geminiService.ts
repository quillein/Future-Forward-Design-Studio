
import { GoogleGenAI } from "@google/genai";
import { BRAND_PALETTES, SYSTEM_INSTRUCTION, STRATEGY_DAYS, StrategyDay } from '../constants';
import { GeneratedImage, CampaignSet } from '../types';

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateBrandGraphics = async (
  brandRefBase64: string | null,
  paletteId: string,
  message: string,
  mode: 'simple' | 'professional' = 'simple',
  selectedDay: StrategyDay = 'MONDAY',
  customPrompt?: string
): Promise<CampaignSet> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const palette = BRAND_PALETTES.find(p => p.id === paletteId) || BRAND_PALETTES[0];
  const strategy = STRATEGY_DAYS[selectedDay];

  let sharedCaption = "";
  let sharedHashtags: string[] = [];

  const promises = Array.from({ length: 4 }).map(async (_, index): Promise<GeneratedImage | null> => {
    try {
      const dayContext = `STRATEGY LOGIC: ${selectedDay} Energy (${strategy.goal}). VIBE: ${strategy.visualCue}`;
      
      const prompt = mode === 'simple' 
        ? `
        DESIGN TASK: Create a "Simple & Human" social graphic.
        TEXT TO DISPLAY: "${message}"
        ${dayContext}
        
        POSITIVE PROMPT: 
        - Perfectly spelled letters, clean sans-serif font, sharp letterforms, high contrast.
        - Minimalist white space, centered composition.
        
        NEGATIVE PROMPT:
        - DO NOT write the word "${selectedDay}" or "MONDAY" or "TUESDAY" or "WEDNESDAY" or "THURSDAY".
        - No merged letters, no gibberish text, no missing characters, no blurry artifacts.
        - No icons, no people, no logos.
        
        OUTPUT: Plain white background, dark charcoal text.
        `
        : `
        DESIGN TASK: Create a high-end "Future Forward" professional marketing poster.
        HEADER TO DISPLAY: "${message}"
        ${dayContext}
        
        TYPOGRAPHIC HIERARCHY:
        1. HEADER: "${message}" in HEAVY BOLD ITALIC Sans-Serif. Perfectly rendered slanted letters.
        2. ACCENTS: Add a small technical badge with text like "PHASE 01" or "ACCELERATOR" in MONOSPACE Typewriter font.
        
        BRAND GRAPHICS:
        - Include a retro-futuristic red/white rocket icon on the right side.
        - Add subtle velocity motion lines and a light dot-matrix grid in the background.
        - Use ${palette.id === 'executive_gradient' ? 'a signature yellow-to-red gradient' : palette.name + ' colors'}.
        
        POSITIVE PROMPT:
        - Sharp vector-style graphics, crisp typography, professional letter spacing, 100% accurate spelling.
        
        NEGATIVE PROMPT:
        - DO NOT write the word "${selectedDay}" on the poster. 
        - No merged letters, no garbled fonts, no missing characters, no stock photos of people, no hands.
        
        COMPOSITION: Split-view. Text block on Left, Rocket/Graphics on Right.
        `;

      const contents: any = {
        parts: [{ text: prompt }]
      };

      if (brandRefBase64) {
        contents.parts.push({ 
          inlineData: { mimeType: 'image/png', data: brandRefBase64 } 
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents,
        config: { 
          imageConfig: { aspectRatio: "1:1" }, 
          systemInstruction: SYSTEM_INSTRUCTION 
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      
      if (index === 0) {
        // Try to get text response for caption
        const textPart = response.candidates?.[0]?.content?.parts.find(p => p.text);
        if (textPart?.text) {
          sharedCaption = textPart.text.split('#')[0].trim();
          sharedHashtags = textPart.text.match(/#\w+/g) || [];
        }
      }

      if (!imagePart?.inlineData) return null;

      return {
        id: crypto.randomUUID(),
        url: `data:image/png;base64,${imagePart.inlineData.data}`,
        prompt: message,
        category: mode === 'simple' ? 'social' : 'poster',
        paletteId: paletteId,
        timestamp: Date.now()
      };
    } catch (error) { return null; }
  });

  const images = (await Promise.all(promises)).filter((img): img is GeneratedImage => img !== null);
  
  return {
    images,
    caption: sharedCaption,
    hashtags: sharedHashtags
  };
};
