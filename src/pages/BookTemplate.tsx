import { Pressable, ScrollView, Text, View, ViewStyle } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/Interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookHead } from '@/features/BookTemplate/BookHead';
import { BookInformationLayout } from '@/features/BookTemplate/BookInformationLayout';
// import { ReadingStatus } from '@/features/BookTemplate/ReadingStatus';
import { BelongsToFolders } from '@/features/BookTemplate/BelongsToFolders';
import { useEffect, useState } from 'react';
import { getBookById } from '@/database/repositories/bookRepository';
import { getAllLanguagesToBookId } from '@/database/repositories/book-lngRepository';
import { getAllGenresToBookId } from '@/database/repositories/book-genreRepository';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BookTemplateRouteProp = RouteProp<RootStackParamList, 'BookTemplate'>;

interface Book {
  id: number;
  title: string | null;
  type: string | null;
  img: string | null;
  genres: string[];
  languages: string[];
  url: string;
  author: string;
  cover: string;
}

export const BookTemplate = () => {
  const route = useRoute<BookTemplateRouteProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [book, setBook] = useState<Book | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookId } = route.params;

  useEffect(() => {
    let isMount = true;

    const getData = async () => {
      try {
        const [bookData, languages, genres] = await Promise.all([
          getBookById(bookId),
          getAllLanguagesToBookId(bookId),
          getAllGenresToBookId(bookId),
        ]);
        // console.log('Book:', bookData);
        if (isMount) {
          setBook({
            ...bookData,
            languages: languages.map((l) => l.code),
            genres: genres.map((l) => l.name),
          });
        }
      } catch (error) {
        console.error('Kitaplar alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();

    return () => {
      isMount = false;
    };
  }, [bookId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-transparent">
        <View className="rounded-xl bg-black/70 p-4">
          <Text className="text-xl font-bold text-white">Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (!book) {
    return <Text>Kitap Bulunamadı!</Text>;
  }

  const navigateReader = () => {
    navigation.navigate('BookRead', { fileUri: book.url, coverUrl: book.img, bookId });
  };

  return (
    <LinearGradient
      colors={['#03071E', '#001B3A', '#000B1A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingTop: 24, gap: 16 }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={
            {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              padding: 8,
              alignSelf: 'stretch',
            } as ViewStyle
          }
          className="absolute ml-4 mt-12 rounded-full active:bg-gray-500">
          <Feather name="arrow-left" size={24} color="white" />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <BookHead
            img={book.img || ''}
            navigateReader={navigateReader}
            bookId={bookId}
            name={book.title || 'Başlık Yok'}
          />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 10, marginTop: 12 }}>
          <View style={{ gap: 24 }}>
            <BookInformationLayout
              book={{
                author: book.author,
                type: book.type,
                genres: book.genres,
                languages: book.languages,
              }}
            />

            {/* <ReadingStatus progress={41} /> */}

            <BelongsToFolders bookId={bookId} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
