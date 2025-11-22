import AntDesign from '@expo/vector-icons/AntDesign';
import { CreateBookService } from '@/services/CreateBookService';
import { useFolderBSStore } from '@/store/BottomSheets/useFolderSheetStore';
// import Octicons from '@expo/vector-icons/Octicons';

import { Pressable, Text, View } from 'react-native';
import { useBookStore } from '@/store/booksStore';
interface PageNameProps {
  name: string;
}

export const PageHeader = ({ name }: PageNameProps) => {
  const ref = useFolderBSStore((state) => state.ref);
  const addBook = useBookStore((state) => state.addBook);
  return (
    <View className="flex-row items-center justify-between ">
      <Text className="border-b-2 border-white px-2 text-2xl font-semibold text-white ">
        {name}
      </Text>
      <View className="flex-row items-center gap-2">
        <Pressable className="px-2">
          <AntDesign
            name="plus"
            onPress={() => {
              if (name === 'Library') {
                CreateBookService(addBook);
              } else {
                ref?.current.snapToIndex(0);
              }
            }}
            size={24}
            color="white"
          />
        </Pressable>
        {/* <Pressable className=" px-2">
          <Octicons name="sort-desc" size={24} color="white" />
        </Pressable> */}
      </View>
    </View>
  );
};
