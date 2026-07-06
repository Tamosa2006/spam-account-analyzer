export type AnalysisResult = {
  title: string;
  description: string;
  category: string;
  dominantColors: string[];
  labels: string[];
  possibleMisuse: boolean;
  misuseReason: string;
  usageRisk: "Low" | "Medium" | "High";
  detectedText: string;
};

export type SourceResult = {
  url: string;
  title?: string;
};

export type SocialResult = {
  platform: "Instagram" | "X" | "Facebook" | "Pinterest" | "Other";
  url: string;
  title: string;
  thumbnail?: string;
  snippet?: string;
  matchScore?: number;
  position?: number;
  isProfile?: boolean;
};

export type SocialScanResult = {
  found: SocialResult[];
  profiles: SocialResult[];
  posts: SocialResult[];
  allFound: SocialResult[];
  totalFound: number;
  totalProfiles: number;
  totalAll: number;
  scannedAt: string;
};