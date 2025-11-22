import { View, Text } from 'react-native';
import { ProfileImage } from './ProfileImage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CreateBookService } from '@/services/CreateBookService';
import { useBookStore } from '@/store/booksStore';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';

export const HomeHead = () => {
  const addBook = useBookStore((state) => state.addBook);
  const { user, loadUser } = useUserStore();
  const [name, setName] = useState<string>('User');

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user.name) {
      setName(user.name);
    }
  }, [user.name]);

  return (
    <View className="w-full flex-row items-center justify-between  py-2">
      <View className="flex-1 flex-row items-center gap-3">
        <ProfileImage imgPath={user.imgPath} />

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ flexShrink: 1 }}
          className="text-lg font-semibold text-white">
          Hello, {name}!
        </Text>
      </View>

      <AntDesign
        onPress={() => CreateBookService(addBook)}
        name="plus"
        size={28}
        color="white"
        style={{ marginLeft: 12 }}
      />
    </View>
  );
};
