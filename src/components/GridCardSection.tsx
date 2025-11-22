import React, { useCallback } from 'react';
import { View } from 'react-native';
import { BoookCard } from './BookCard';
import { BookModel } from '@/database/modelTypes';
import { FlatList } from 'react-native-gesture-handler';

interface BookListProps {
  data: BookModel[];
}

export default function GridCardSection({ data }: BookListProps) {
  const renderItem = useCallback(
    ({ item }: { item: BookModel }) => (
      <View className="mt-4 w-1/3 p-1.5">
        <BoookCard id={item.id!} img={item.img!} title={item.title!} isNameActive />
      </View>
    ),
    []
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id!.toString()}
      numColumns={3}
      renderItem={renderItem}
      removeClippedSubviews
      initialNumToRender={9}
      maxToRenderPerBatch={10}
      windowSize={5}
      showsVerticalScrollIndicator={false}
    />
  );
}
