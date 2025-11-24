import { Text, View, ViewStyle } from 'react-native';

// ICONS
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';

interface BookData {
  book: {
    author: string | null;
    type: string | null;
    genres: string[] | null;
    languages: string[] | null;
  };
}

export const BookInformationLayout = ({ book }: BookData) => {
  return (
    <View
      style={
        {
          marginHorizontal: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginTop: 8,
        } as ViewStyle
      }
      className=" gap-4 rounded-xl p-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2">
          <Octicons name="flame" size={16} color="white" />
          <Text className="text-base text-white">Author:</Text>
        </View>
        <Text className="fond-bold text-base font-semibold text-white">
          {book.author ? book.author : 'No Create Found'}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2">
          <Feather name="layers" size={16} color="white" />
          <Text className="text-base text-white">Type:</Text>
        </View>
        <Text className="fond-bold text-base font-semibold text-white">
          {book.type ? book.type : 'E-Pub'}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="tag-multiple-outline" size={20} color="white" />
          <Text className="text-base text-white">Genres:</Text>
        </View>
        <Text className="fond-bold text-base font-semibold text-white">
          {book.genres && book.genres.length > 0 ? book.genres.join(', ') : 'No Genre Found'}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="language" size={18} color="white" />
          <Text className="text-base text-white">Languages:</Text>
        </View>
        <Text className="fond-bold text-base font-semibold text-white">
          {book.languages && book.languages.length > 0
            ? book.languages.join(', ')
            : 'No Language Found'}
        </Text>
      </View>
    </View>
  );
};
