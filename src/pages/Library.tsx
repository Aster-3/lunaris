import { View } from 'react-native';
import { PageHeader } from '@/components/PageHeader';
import { LibraryCardLayout } from '@/features/Library/LibraryCardLayout';

export const Library = () => {
  return (
    <View className="flex-col gap-6 px-4 py-5">
      <PageHeader name="Library" />
      <LibraryCardLayout />
    </View>
  );
};
