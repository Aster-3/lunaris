import { Dispatch, SetStateAction } from 'react';
import { Pressable, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
export const NavMenuReader = ({
  page,
  setPage,
}: {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <View className="w-full flex-row justify-between gap-8">
      <Pressable
        onPress={() => setPage(0)}
        style={{ borderRadius: 8 }}
        className={`flex-1 items-center ${page === 0 ? 'bg-[#0055d5cb]' : 'bg-[#2A2A2A]'}  py-1.5`}>
        <FontAwesome6 name="palette" size={18} color="white" />
      </Pressable>
      <Pressable
        onPress={() => setPage(1)}
        style={{ borderRadius: 8 }}
        className={`flex-1 items-center justify-center ${page === 1 ? 'bg-[#0055d5cb]' : 'bg-[#2A2A2A]'}  py-1.5`}>
        <FontAwesome5 name="circle-notch" size={18} color="white" />
      </Pressable>
      <Pressable
        onPress={() => setPage(2)}
        style={{ borderRadius: 8 }}
        className={`flex-1 items-center ${page === 2 ? 'bg-[#0055d5cb]' : 'bg-[#2A2A2A]'} py-1.5`}>
        <Ionicons name="settings" size={18} color="white" />
      </Pressable>
    </View>
  );
};
