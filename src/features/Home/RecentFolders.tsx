import { LayoutTitle } from '@/components/LayoutTitle';
import { View } from 'react-native';
import { FoldersLayout } from '../FoldersLayout';
import { useCollectionStore } from '@/store/collectionStore';
import { useEffect, useState } from 'react';
import { sortArrays } from '@/utils/sortBooks';
import { AllEmptyFolders } from '../FolderTemplate/AllEmptyFolder';

export const RecentReadFolders = () => {
  const { collections, loadCollections } = useCollectionStore();
  const [colData, setColData] = useState<any[]>([]);

  useEffect(() => {
    loadCollections();
    let sortedData = sortArrays(collections, 'recent-read');
    setColData(sortedData);
  }, [collections, loadCollections]);

  return (
    <View className="flex flex-col gap-4 ">
      <LayoutTitle title="Recent Folders" />
      {collections && collections.length > 0 ? (
        <FoldersLayout data={colData} showNames={true} />
      ) : (
        <AllEmptyFolders />
      )}
    </View>
  );
};
