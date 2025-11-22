import { useEffect, useState } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { useBookMarkStore } from '@/store/bookMarkStore';
import { confirm } from '@/utils/confirmGlobal';
import { useBookStore } from '@/store/booksStore';
import { useNavigation } from '@react-navigation/native';
export const BookButtons = ({
  bookId,
  navigateReader,
}: {
  bookId: number;
  navigateReader: () => void;
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { bookmarks, loadBookMarks, addBookMark, deleteBookMark } = useBookMarkStore();
  const [pressOne, setPressOne] = useState(false);
  const [pressTwo, setPressTwo] = useState(false);
  const [pressThree, setPressThree] = useState(false);

  const deleteBook = useBookStore((state) => state.deleteBook);
  const navigation = useNavigation();

  useEffect(() => {
    loadBookMarks();
    const isBookMarked = bookmarks.some((item) => item.book_id === bookId);
    setBookmarked(isBookMarked);
  }, [loadBookMarks, bookmarks, bookId]);

  const deleteBookFunction = async () => {
    const accepted = await confirm(
      'Delete Book',
      `"Are you sure you want to delete this book? This action cannot be undone.`
    );
    if (accepted) {
      const res = await deleteBook(bookId);
      if (!res) alert('Books is not Deleted!');
      else {
        navigation.goBack();
      }
    }
  };

  const executeAddBookmark = async (bookId: number) => {
    try {
      if (!bookmarked) {
        const result = await addBookMark(bookId);
        if (!result) {
          alert('Bookmark is not Added!');
        }
      } else {
        deleteBookMark(bookId);
      }
    } catch (err) {
      console.error('ERR, Bookmark is not addeed:', err);
    }
  };

  return (
    <View style={{ width: '100%' }} className="flex-row items-center justify-center gap-3 ">
      <Pressable
        onPressIn={() => {
          setPressThree(true);
        }}
        onPressOut={() => {
          setPressThree(false);
        }}
        className="items-center rounded-lg"
        style={
          {
            backgroundColor: 'rgba(255, 50, 50, 0.5)',
            width: '20%',
            padding: 8,
            opacity: pressThree ? 0.8 : 1,
          } as ViewStyle
        }
        onPress={() => {
          deleteBookFunction();
        }}>
        <Octicons name={'x'} size={22} color={'white'} />
      </Pressable>
      <Pressable
        onPressIn={() => {
          setPressOne(true);
        }}
        onPressOut={() => {
          setPressOne(false);
        }}
        onPress={navigateReader}
        className="items-center rounded-lg bg-white/40"
        style={{ width: '70%', padding: 8, opacity: pressOne ? 0.8 : 1 }}>
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-white">Read</Text>
          <Feather name="arrow-right" size={22} color="white" />
        </View>
      </Pressable>

      <Pressable
        onPressIn={() => {
          setPressTwo(true);
        }}
        onPressOut={() => {
          setPressTwo(false);
        }}
        className="items-center rounded-lg bg-white/40"
        style={{ width: '20%', padding: 8, opacity: pressTwo ? 0.8 : 1 }}
        onPress={() => {
          executeAddBookmark(bookId);
        }}>
        <Octicons
          name={bookmarked ? 'bookmark-filled' : 'bookmark'}
          size={22}
          color={bookmarked ? 'white' : 'white'}
        />
      </Pressable>
    </View>
  );
};
