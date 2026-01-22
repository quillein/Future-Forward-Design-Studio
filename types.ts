
export enum GenerationStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  category: 'poster' | 'social' | 'banner';
  paletteId: string;
  timestamp: number;
}

export interface CampaignSet {
  images: GeneratedImage[];
  caption: string;
  hashtags: string[];
}

export interface BrandPalette {
  id: string;
  name: string;
  description: string;
  gradient: string;
  colors: string[];
}

export interface MarketingContent {
  id: string;
  title: string;
  body: string;
  cta: string;
}
