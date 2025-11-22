import { View } from 'react-native';
import GridFolderLayout from '@/features/Folders/GridFolderLayout';
import { PageHeader } from '@/components/PageHeader';

export const Folders = () => {
  return (
    <View className="flex-col gap-6 px-4 py-5">
      <PageHeader name="Folders" />
      <GridFolderLayout />
    </View>
  );
};
