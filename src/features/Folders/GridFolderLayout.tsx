import React, { useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { Folder } from '@/components/Folder';
import { useCollectionStore } from '@/store/collectionStore';
import { AllEmptyFolders } from '../FolderTemplate/AllEmptyFolder';

export default function GridFolderLayout() {
  const { collections, loadCollections } = useCollectionStore();
  useEffect(() => {
    loadCollections();
    // eslint-disable-next-line
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View className="mt-4 w-1/2 px-2">
        <Folder id={item.id} img={item.imgPath} name={item.title} isNameActive />
      </View>
    ),
    []
  );

  if (!collections || collections.length === 0) {
    return (
      <View>
        <AllEmptyFolders />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ marginHorizontal: -8 }}
      data={collections}
      keyExtractor={(item: any) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      removeClippedSubviews={true}
      initialNumToRender={4}
      maxToRenderPerBatch={6}
      windowSize={5}
      showsVerticalScrollIndicator={false}
    />
  );
}
