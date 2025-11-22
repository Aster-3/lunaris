import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CCHead } from '@/features/CreateCollection/CCHead';
import GridCardSectionForCC from '@/features/CreateCollection/GridCardSectionForCC';
import { useBookStore } from '@/store/booksStore';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { BookModel } from '@/database/modelTypes';
import { CCSearchBar } from '@/features/CreateCollection/CCSearchBar';
import {
  toggleBooksToCollection,
  getBooksByCollectionId,
} from '@/database/repositories/book-CollectionRepository';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/Interfaces';

export const CreateCollection = () => {
  type BookTemplateRouteProp = RouteProp<RootStackParamList, 'CreateCollection'>;
  const route = useRoute<BookTemplateRouteProp>();
  const { collectionId } = route.params;

  const books = useBookStore((state) => state.books);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedBooks, setSelectedBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addDeleteBook = useCallback((newItem: BookModel) => {
    setSelectedBooks((prev) =>
      prev.some((b) => b.id === newItem.id)
        ? prev.filter((b) => b.id !== newItem.id)
        : [newItem, ...prev]
    );
  }, []);

  const selectedIds = useMemo(() => new Set(selectedBooks.map((item) => item.id)), [selectedBooks]);

  const notSelectedBooks = useMemo(
    () => books.filter((item) => !selectedIds.has(item.id)),
    [books, selectedIds]
  );

  const filtredBooks = books.filter((item) =>
    item.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    const getData = async () => {
      const books = await getBooksByCollectionId(collectionId);
      if (books) {
        setSelectedBooks(books);
      }
      setIsLoading(true);
    };
    getData();
  }, [collectionId]);

  const merged = useMemo(
    () => [...selectedBooks, ...notSelectedBooks],
    [selectedBooks, notSelectedBooks]
  );

  const executeAddBooksToCollection = async () => {
    try {
      const arr = Array.from(selectedIds).filter((id): id is number => id !== undefined);
      await toggleBooksToCollection(collectionId, arr);
    } catch (error) {
      console.error('Error adding books to collection:', error);
      alert('Failed to add books. Please try again.');
    }
  };

  if (!isLoading) return;

  return (
    <SafeAreaView
      style={{ paddingTop: 20, paddingBottom: 12, paddingHorizontal: 8, flex: 1 }}
      className="flex-1 gap-8 bg-primary">
      <CCHead executeAddBooksToCollection={executeAddBooksToCollection} selectedIds={selectedIds} />
      <CCSearchBar inputValue={inputValue} setInputValue={setInputValue} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 12 }} style={{ flexGrow: 1 }}>
        <GridCardSectionForCC
          data={inputValue.trim() === '' ? merged : filtredBooks}
          selectedBooks={selectedBooks}
          addDeleteBook={addDeleteBook}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
