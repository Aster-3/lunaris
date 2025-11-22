import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/Interfaces';

export const EmptyFolder = ({ collectionId }: { collectionId: number }) => {
  const [pressed, setPressed] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View
      className=" items-center justify-center gap-6 rounded-lg border border-white p-4"
      style={{ minHeight: 120 }}>
      <View className="gap-2">
        <Text className=" text-center text-xl font-medium text-white">No Result Found</Text>
        <Text className="text-center text-sm text-gray-300">Add new items.</Text>
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate('CreateCollection', { collectionId });
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{ opacity: pressed ? 0.5 : 1 }}
        className="flex-row items-center gap-2 rounded-sm border border-dashed border-white px-12 py-4">
        <Text className="font-semibold text-white">Add New Book</Text>
      </Pressable>
    </View>
  );
};
