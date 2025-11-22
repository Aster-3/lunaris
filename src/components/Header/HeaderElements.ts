import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Page } from '@/store/useAppStore';

export const getIconComponent = (type: string) => {
  switch (type) {
    case 'Feather':
      return Feather;
    case 'MaterialCommunityIcons':
      return MaterialCommunityIcons;
    case 'FontAwesome':
      return FontAwesome;
    case 'Ionicons':
      return Ionicons;
    default:
      return null;
  }
};

export const bottomMenuElements: { name: Page; type: string; icon: string }[] = [
  { name: 'home', type: 'Feather', icon: 'home' },
  { name: 'library', type: 'MaterialCommunityIcons', icon: 'bookshelf' },
  { name: 'folders', type: 'FontAwesome', icon: 'folder-open-o' },
  { name: 'menu', type: 'Ionicons', icon: 'menu' },
];
