import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBarModel } from './SearchbarModel';
import { useAppStore } from '@/store/useAppStore';

type Props = {
  children?: React.ReactNode;
};

export const GradientLayout = ({ children }: Props) => {
  const selectedPage = useAppStore((state) => state.selectedPage);
  const showSearchBar =
    selectedPage === 'library' || selectedPage === 'folders' || selectedPage === 'menu';
  return (
    <LinearGradient
      colors={['#00004E', '#000010']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}>
      <View className="flex-1 overflow-hidden  ">{children}</View>
      {showSearchBar && <SearchBarModel />}
    </LinearGradient>
  );
};
