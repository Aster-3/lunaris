import { Image, Pressable, Text, View } from 'react-native';
import { BookButtons } from './BookButtons';

export const BookHead = ({
  img,
  name,
  bookId,
  navigateReader,
}: {
  img: string;
  name: string;
  bookId: number;
  navigateReader: () => void;
}) => {
  return (
    <View style={{ width: '70%', maxWidth: 300 }} className="w-fit items-center gap-6">
      <Pressable
        style={{ width: '70%', maxWidth: 300, aspectRatio: 3 / 4 }}
        className="items-center">
        <Image
          source={{ uri: img }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 16,
          }}
        />
      </Pressable>
      <Text className="items-center text-center text-xl font-semibold text-white">{name}</Text>
      <BookButtons navigateReader={navigateReader} bookId={bookId} />
    </View>
  );
};
