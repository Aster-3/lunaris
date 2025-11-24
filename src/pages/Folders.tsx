import { View } from 'react-native';
import GridFolderLayout from '@/features/Folders/GridFolderLayout';
import { PageHeader } from '@/components/PageHeader';

export const Folders = () => {
  return (
    <View className="mb-12 mt-4 flex-col gap-4  px-4">
      <PageHeader name="Collections" />
      <GridFolderLayout />
    </View>
  );
};
