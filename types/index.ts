export interface FileItem {
  id: string;
  name: string;
  size?: number;
  type?: string;
  lastModified?: number;
  previewSnippet?: string;
}

export interface OrganizedFile {
  originalName: string;
  suggestedName: string;
  category: string;
  subFolder?: string;
  summary: string;
  action: 'keep' | 'archive' | 'review' | 'trash';
  confidence: number;
  reasoning: string;
}

export interface SortPlan {
  totalFiles: number;
  categories: {
    name: string;
    description: string;
    count: number;
    files: OrganizedFile[];
  }[];
  slothAudioScript: string;
  bashOrganizeScript: string;
  estimatedLazyMinutesSaved: number;
}
