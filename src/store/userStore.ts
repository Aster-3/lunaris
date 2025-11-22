import { createUser, getUser, updateUser } from '@/database/repositories/userRepository';
import { create } from 'zustand';

interface User {
  name: string | null;
  imgPath: string | null;
}

interface UserStore {
  user: User;
  isLoaded: boolean;
  addUser: (user: User) => Promise<boolean>;
  updateUser: (user: User) => Promise<boolean>;
  updateName: (name: string) => void;
  updateImgPath: (imgPath: string) => void;
  loadUser: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: {
    name: null,
    imgPath: null,
  },
  isLoaded: false,
  updateUser: async (user: User) => {
    const res = await updateUser(user.name, user.imgPath);
    console.log('res:', res);
    if (res) {
      set({ user, isLoaded: false });
      return true;
    } else {
      return false;
    }
  },
  addUser: async (user: User) => {
    const res = await createUser(user.name, user.imgPath);
    if (res) {
      set({ user, isLoaded: false });
      return true;
    } else {
      return false;
    }
  },
  updateName: (name: string) =>
    set((state) => ({
      user: { ...state.user, name },
    })),
  updateImgPath: (imgPath: string) =>
    set((state) => ({
      user: { ...state.user, imgPath },
    })),
  loadUser: async () => {
    if (get().isLoaded) return;
    const user = await getUser();
    if (user) {
      set({ user, isLoaded: true });
    }
  },
}));
