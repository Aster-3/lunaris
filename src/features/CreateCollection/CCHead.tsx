import { Pressable, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
export const CCHead = ({
  executeAddBooksToCollection,
  selectedIds,
}: {
  executeAddBooksToCollection: any;
  selectedIds: Set<number | undefined>;
}) => {
  const navigation = useNavigation();

  return (
    <View style={{ gap: 28 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => navigation.goBack()}
          className="items-center justify-center rounded-full  p-2 active:scale-90 active:opacity-60">
          <Feather name="arrow-left" size={26} color="white" />
        </Pressable>

        <Text className="text-xl font-semibold text-white">Add Book to Collection</Text>

        <Pressable
          onPress={async () => {
            await executeAddBooksToCollection();
            navigation.goBack();
          }}
          className="items-center justify-center rounded-full bg-blue-900 p-2 active:scale-90 active:opacity-60">
          <Feather name="check" size={26} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
