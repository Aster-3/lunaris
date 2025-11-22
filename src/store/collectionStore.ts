import { create } from 'zustand';
import {
  getAllCollections,
  addCollection,
  deleteCollection as deleteCollectionRepo,
} from '@/database/repositories/collectionRepository';

interface CollectionStore {
  collections: { id: number; title: string; imgPath: string }[];
  loadCollections: () => Promise<void>;
  addCollection: (title: string, imgPath: string) => Promise<true | false>;
  deleteCollection: (collectionId: number) => Promise<boolean>;
  isLoaded: boolean;
  updateCollectionLastReadingAt: (bookId: number, newTime: number) => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: [],
  isLoaded: false,

  loadCollections: async () => {
    if (get().isLoaded) return;
    const collections = await getAllCollections();
    set({ collections, isLoaded: true });
  },

  addCollection: async (title: string, imgPath: string) => {
    const result = await addCollection(title, imgPath);
    const addedCollection = result[0];
    if (addedCollection.length === 0 || !addedCollection) return false;
    set((state) => ({ collections: [...state.collections, addedCollection] }));
    return true;
  },

  deleteCollection: async (collectionId: number) => {
    const success = await deleteCollectionRepo(collectionId);
    if (success) {
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== collectionId),
      }));
    }
    return success;
  },

  updateCollectionLastReadingAt: (bookId: number, newTime: number) => {
    set((state) => ({
      collections: state.collections.map((b) =>
        b.id === bookId ? { ...b, lastReadingAt: newTime } : b
      ),
    }));
  },
}));
