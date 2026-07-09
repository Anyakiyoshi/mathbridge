import { create } from 'zustand';
import type { ReactNode } from 'react';

// --- Chapter structure ---

export interface SectionContent {
  id: string;
  title: string;
  titleZh: string;
  content: () => ReactNode;
  visual?: () => ReactNode;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  titleZh: string;
  volume: 1 | 2;
  sections: SectionContent[];
}

// --- State ---

interface AppState {
  // Navigation
  activeChapterId: string | null;
  activeSectionId: string | null;
  expandedChapters: Set<string>;
  language: 'en' | 'zh';

  // Actions
  setActiveChapter: (chId: string) => void;
  setActiveSection: (chId: string, secId: string) => void;
  toggleChapter: (chId: string) => void;
  toggleLanguage: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeChapterId: null,
  activeSectionId: null,
  expandedChapters: new Set<string>(),
  language: 'zh',

  setActiveChapter: (chId) =>
    set((s) => ({
      activeChapterId: chId,
      activeSectionId: null,
      expandedChapters: new Set([...s.expandedChapters, chId]),
    })),

  setActiveSection: (chId, secId) =>
    set((s) => ({
      activeChapterId: chId,
      activeSectionId: secId,
      expandedChapters: new Set([...s.expandedChapters, chId]),
    })),

  toggleChapter: (chId) =>
    set((s) => {
      const next = new Set(s.expandedChapters);
      if (next.has(chId)) next.delete(chId);
      else next.add(chId);
      return { expandedChapters: next };
    }),

  toggleLanguage: () =>
    set((s) => ({ language: s.language === 'en' ? 'zh' : 'en' })),
}));
