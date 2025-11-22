import { Text, View, ViewStyle } from 'react-native';
import { FoldersLayout } from '../FoldersLayout';
import { getCollectionsByBookId } from '@/database/repositories/book-CollectionRepository';
import { useEffect, useState } from 'react';

export const BelongsToFolders = ({ bookId }: { bookId: number }) => {
  const [data, setData] = useState<{ id: number; title: string; imgPath: string }[]>([]);
  useEffect(() => {
    const getData = async () => {
      const collections = await getCollectionsByBookId(bookId);
      setData(collections);
    };
    getData();
  }, [bookId]);

  return (
    <View style={{ marginHorizontal: 16 }} className="flex flex-col gap-4 ">
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#CFE3FF',
        }}>
        Belonging Folders
      </Text>
      {!data || data.length === 0 ? (
        <View
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' } as ViewStyle}
          className="rounded-lg bg-white/50 p-4">
          <Text className="text-white ">This book does not belong to any collection yet...</Text>
        </View>
      ) : (
        <FoldersLayout data={data} showNames={true} />
      )}
    </View>
  );
};
