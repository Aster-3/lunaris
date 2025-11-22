import GridCardSection from '@/components/GridCardSection';
import { useBookStore } from '@/store/booksStore';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { EmptyBooks } from '../BookTemplate/EmptyBooks';

export const LibraryCardLayout = () => {
  const { books, loadBooks } = useBookStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        loadBooks();
      } catch (error) {
        console.error('Kitaplar alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Text className="text-center">Loading books...</Text>;
  }

  if (!books || books.length === 0) {
    return (
      <View className="">
        <EmptyBooks />
      </View>
    );
  }

  return <GridCardSection data={books} />;
};
