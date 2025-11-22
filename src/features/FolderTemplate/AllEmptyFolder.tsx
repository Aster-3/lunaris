import { useFolderBSStore } from '@/store/BottomSheets/useFolderSheetStore';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
export const AllEmptyFolders = () => {
  const ref = useFolderBSStore((state) => state.ref);
  const [pressed, setPressed] = useState(false);
  return (
    <View className=" items-center justify-center gap-6 rounded-lg border border-white p-4">
      <Pressable
        onPress={() => {
          ref?.current.snapToIndex(0);
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{ opacity: pressed ? 0.5 : 1 }}
        className="flex-row items-center gap-2 rounded-sm border border-dashed border-white px-12 py-4">
        <Text className="font-semibold text-white">Add New Folder</Text>
      </Pressable>
    </View>
  );
};
