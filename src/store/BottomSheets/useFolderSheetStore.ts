import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { RefObject } from 'react';
import { create } from 'zustand';

interface FolderBottomSheet {
  ref: RefObject<BottomSheetMethods> | null;
  setRef: (x: RefObject<BottomSheetMethods | null>) => void;
  inputValue: string;
  setInputValue: (text: string) => void;
}

export const useFolderBSStore = create<FolderBottomSheet>((set) => ({
  ref: null,
  setRef: (x: any) => set((state) => ({ ref: x })),
  inputValue: '',
  setInputValue: (text) => set({ inputValue: text }),
}));
