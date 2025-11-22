import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReaderSettings } from '@/store/readerSettingsStore';

export const Themes = () => {
  const { setTheme, theme } = useReaderSettings();
  const borderColor = '#1E3A8A';
  const borderColor2 = '#ad0707';

  return (
    <View className="flex-1 gap-4">
      <Text className="text-base font-medium text-white">Themes</Text>
      <View className="flex-row justify-center gap-24">
        <Pressable
          onPress={() => setTheme('Night A')}
          className="flex-col items-center justify-center gap-4">
          <LinearGradient
            colors={['#AAAAAA', '#12141A', '#333333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 40,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: theme === 'Night A' ? borderColor : 'transparent',
            }}
          />
          <Text className="text-sm font-medium text-white">Night A</Text>
        </Pressable>

        <Pressable
          onPress={() => setTheme('Light A')}
          className="flex-col items-center justify-center gap-4">
          <LinearGradient
            colors={['#F7F7F4', '#AAAAAA', '#AAAAAA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 40,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: theme === 'Light A' ? borderColor2 : 'transparent',
            }}
          />
          <Text className="text-sm font-medium text-white">Light A</Text>
        </Pressable>
      </View>
    </View>
  );
};
