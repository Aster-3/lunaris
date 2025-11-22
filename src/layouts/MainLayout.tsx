import React from 'react';
import { BottomMenu } from '@/components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientLayout } from '@/components/GradientComponent';
import { CollectionBottomSheet } from '@/features/CollectionBottomSheet';
export const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <GradientLayout>{children}</GradientLayout>
      <BottomMenu />
      <CollectionBottomSheet />
    </SafeAreaView>
  );
};
