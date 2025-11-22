import { Text, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useBookStore } from '@/store/booksStore';

export const TotalBook = () => {
  const count = useBookStore((state) => state.books.length);
  return (
    <View
      style={
        {
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(255, 255, 255, 0.17)',
          padding: 12,
          borderRadius: 16,
          alignItems: 'center',
          display: 'flex',
          gap: 12,
          flexDirection: 'row',
          justifyContent: 'center',
        } as ViewStyle
      }>
      <MaterialCommunityIcons name="book-multiple-outline" size={22} color="white" />
      <Text
        style={{
          color: 'white',
          fontWeight: 'semibold',
          fontSize: 14,
        }}>
        {`${count} books in your library.`}
      </Text>
    </View>
  );
};
