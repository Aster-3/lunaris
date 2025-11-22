import { Linking, View, Text, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/Interfaces';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const playStoreUrl = 'https://play.google.com/store/apps/details?id=org.readera&hl=tr';

export const MenuItem = ({
  title = 'First Menu Item',
  navName,
}: {
  title?: string;
  navName: any;
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      onPress={() => {
        if (navName === 'FeedBack') {
          Linking.openURL(playStoreUrl).catch((err) => console.error('Hata: ', err));
        } else {
          navigation.navigate(navName);
        }
      }}
      className="aspect-square w-4/5 overflow-hidden rounded-2xl"
      style={
        {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
        } as ViewStyle
      }>
      <View className="flex-1 items-center justify-center p-4">
        {navName === 'EditProfile' ? (
          <FontAwesome6 name="user-gear" size={20} color="white" />
        ) : (
          <MaterialIcons name="feedback" size={20} color="white" />
        )}

        <Text className="mt-2 text-balance font-medium text-white">{title}</Text>
      </View>
    </Pressable>
  );
};
