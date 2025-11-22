import React from 'react';
import { Pressable, View } from 'react-native';
import { getIconComponent, bottomMenuElements } from './HeaderElements';
import { useAppStore } from '@/store/useAppStore';

export const BottomMenu = () => {
  const selectedPage = useAppStore((state) => state.selectedPage);
  const setSelectedPage = useAppStore((state) => state.setSelectedPage);
  return (
    <View className="p pt- w-full flex-row items-center justify-between bg-secondary pb-1 pt-4">
      {bottomMenuElements.map((element) => {
        const IconComponent = getIconComponent(element.type);
        if (!IconComponent) return null;

        const isSelected = selectedPage === element.name;

        return (
          <Pressable
            key={element.name}
            onPress={() => {
              setSelectedPage(element.name);
            }}
            className="relative flex flex-1 items-center">
            <IconComponent
              name={element.icon as any}
              className={`pb-1.5`}
              size={24}
              color={isSelected ? '#3CAAFF' : 'white'}
            />

            {isSelected && (
              <View className="absolute bottom-0 h-0.5 w-1/2 rounded-full bg-[#3CAAFF]" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
