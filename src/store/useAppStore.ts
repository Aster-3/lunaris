import { create } from 'zustand';

export type Page = 'home' | 'folders' | 'library' | 'menu' | 'search';

interface AppState {
  selectedPage: Page;
  setSelectedPage: (page: Page) => void;
  inputValue: string;
  setInputValue: (text: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedPage: 'home',
  setSelectedPage: (page) => set({ selectedPage: page }),
  inputValue: '',
  setInputValue: (text) => set({ inputValue: text }),
}));
