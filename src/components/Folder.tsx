import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { RootStackParamList } from '@/Interfaces';

interface FolderProps {
  isNameActive: boolean;
  id: number;
  name?: string;
  img: string;
  width?: number;
}

export const Folder = ({ isNameActive, id, name = 'Name not Found', img, width }: FolderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={() => navigation.navigate('FolderTemplate', { id, img, name })}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => setPressed(false)}
      style={{ width, alignItems: 'center' }}
      className="group">
      <View
        style={{ width: width ?? '100%' }}
        className={`aspect-video rounded-xl ${pressed ? 'opacity-70' : ''}`}>
        <Image
          source={{ uri: img }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
          className={`aspect-video rounded-xl`}
        />
      </View>

      {isNameActive && (
        <Text
          numberOfLines={2}
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: '600',
            color: 'rgba(255,255,255,0.9)',
            marginTop: 4,
          }}>
          {name}
        </Text>
      )}
    </Pressable>
  );
};
