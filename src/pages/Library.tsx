import { View } from 'react-native';
import { PageHeader } from '@/components/PageHeader';
import { LibraryCardLayout } from '@/features/Library/LibraryCardLayout';

export const Library = () => {
  return (
    <View style={{}} className="mb-12 mt-4 flex-col gap-4  px-4">
      <PageHeader name="Library" />
      <LibraryCardLayout />
    </View>
  );
};
