// import { create } from 'zustand';

// interface ReaderSettingsStore {
//   theme: string;
//   fontSize: number;
//   fontType: string;
//   paddingHorizontal: number;
//   lineHeight: number;
//   fontTypes: string[];
//   fontSizes: number[];
//   paddingHorizontals: number[];
//   lineHeights: number[];
//   themes: string[];
//   setTheme: (theme: string) => void;
//   setFontSize: (fontSize: number) => void;
//   setFontType: (fontType: string) => void;
//   setPaddingHorizontal: (padding: number) => void;
//   setLineHeight: (lineHeight: number) => void;
// }

// export const useReaderSettings = create<ReaderSettingsStore>((set) => ({
//   theme: 'Night A',
//   fontSize: 13,
//   fontType: 'Merriweather',
//   paddingHorizontal: 20,
//   lineHeight: 24,
//   fontTypes: ['Merriweather', 'Roboto', 'Tinos', 'Open Sans', 'Droid Serif'],
//   fontSizes: [12, 13, 14, 15, 16, 17, 18],
//   paddingHorizontals: [15, 20, 25, 30, 35],
//   lineHeights: [20, 22, 24, 28, 30],
//   themes: ['Night A', 'Light A'],
//   setTheme: (theme: string) => set({ theme: theme }),
//   setFontSize: (fontSize: number) => set({ fontSize: fontSize }),
//   setFontType: (fontType: string) => set({ fontType: fontType }),
//   setPaddingHorizontal: (padding: number) => set({ paddingHorizontal: padding }),
//   setLineHeight: (lineHeight: number) => set({ lineHeight: lineHeight }),
// }));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReaderSettingsStore {
  theme: string;
  fontSize: number;
  fontType: string;
  paddingHorizontal: number;
  lineHeight: number;
  fontTypes: string[];
  fontSizes: number[];
  paddingHorizontals: number[];
  lineHeights: number[];
  themes: string[];
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  setFontType: (fontType: string) => void;
  setPaddingHorizontal: (padding: number) => void;
  setLineHeight: (lineHeight: number) => void;
}

export const useReaderSettings = create<ReaderSettingsStore>()(
  persist(
    (set) => ({
      theme: 'Night A',
      fontSize: 13,
      fontType: 'Tinos',
      paddingHorizontal: 20,
      lineHeight: 24,
      fontTypes: ['Tinos'],
      fontSizes: [12, 13, 14, 15, 16, 17, 18],
      paddingHorizontals: [15, 20, 25, 30, 35],
      lineHeights: [20, 22, 24, 28, 30],
      themes: ['Night A', 'Light A'],

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontType: (fontType) => set({ fontType }),
      setPaddingHorizontal: (padding) => set({ paddingHorizontal: padding }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
    }),
    {
      name: 'reader-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
