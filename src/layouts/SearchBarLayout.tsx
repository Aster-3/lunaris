import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export const SearchBarLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SafeAreaView className="bg-primary">
      <View className="">{children}</View>
    </SafeAreaView>
  );
};
