import { Text, View, ViewStyle } from 'react-native';
import { FoldersLayout } from '../FoldersLayout';
import { LayoutTitle } from '@/components/LayoutTitle';
import { useAppStore } from '@/store/useAppStore';
import { useCollectionStore } from '@/store/collectionStore';
import { useEffect } from 'react';

export const SearchFolderGroup = ({ title }: { title: string }) => {
  const inputValue = useAppStore((state) => state.inputValue);

  const { collections, loadCollections } = useCollectionStore();

  const filterData = collections.filter((item) =>
    item.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    loadCollections();
    // eslint-disable-next-line
  }, []);

  return (
    <View
      style={
        {
          // backgroundColor: 'rgba(255, 255, 255, 0.17)',
          paddingTop: 8,
          paddingBottom: 12,
          borderRadius: 12,
          display: 'flex',
          gap: 12,
          flexDirection: 'column',
          justifyContent: 'center',
          marginHorizontal: 5,
        } as ViewStyle
      }>
      <View className="flex-row items-center gap-2 ">
        <LayoutTitle size={18} title={title} />
      </View>

      {filterData.length > 0 ? (
        <FoldersLayout data={filterData} />
      ) : (
        <View
          style={
            {
              backgroundColor: 'rgba(255, 255, 255, 0.17)',
              padding: 12,
              borderRadius: 12,
            } as ViewStyle
          }>
          <Text style={{ color: 'white', fontWeight: 600 }}>No results found.</Text>
        </View>
      )}
    </View>
  );
};
