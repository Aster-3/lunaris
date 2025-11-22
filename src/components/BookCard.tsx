import { useRef, useState } from 'react';
import { View, Text, Animated, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/Interfaces';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface BookCardProps {
  isNameActive?: boolean;
  id: number;
  title?: string;
  img: string;
  width?: number;
  pointerEventsNone?: boolean;
}
export const BoookCard = ({
  isNameActive = false,
  title = 'Name not Found',
  id,
  img,
  width,
  pointerEventsNone,
}: BookCardProps) => {
  const [pressed, setPressed] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('BookTemplate', { bookId: id })}
      onPressIn={() => {
        onPressIn();
        setPressed(true);
      }}
      pointerEvents={pointerEventsNone ? 'none' : 'auto'}
      onPressOut={() => {
        onPressOut();
        setPressed(false);
      }}
      style={{ width: width ?? '100%' }}
      className="items-center gap-2">
      <View
        style={{ width: width ?? '100%', transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }] }}
        className={`aspect-[3/4] rounded-xl bg-blue-950 ${pressed ? 'opacity-70' : ''}  `}>
        <Image
          source={{ uri: img as string }}
          style={{
            width: '100%',
            height: '100%',
          }}
          className="aspect-[3/4] rounded-xl "
        />
      </View>

      {isNameActive && (
        <Text
          className={`z-50 line-clamp-2 text-center text-sm font-semibold ${pressed ? ' text-white/70' : 'text-white/90'}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};
