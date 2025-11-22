import { Text, View, ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TotalDay = () => {
  const [day, setDay] = useState<number>(0);
  useEffect(() => {
    const execute = async () => {
      const storedDate = await AsyncStorage.getItem('installDate');

      if (!storedDate) {
        return;
      }

      const installDate = new Date(storedDate);
      const now = new Date();

      const diffMs = now.getTime() - installDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      setDay(diffDays);
    };

    execute();
  }, []);
  return (
    <View
      style={
        {
          backgroundColor: 'rgba(255, 255, 255, 0.17)',
          padding: 12,
          borderRadius: 16,
          alignItems: 'center',
          display: 'flex',
          flex: 1,
          gap: 12,
          flexDirection: 'row',
          justifyContent: 'center',
        } as ViewStyle
      }>
      <Feather name="calendar" size={20} color="white" />
      <Text
        style={{
          color: 'white',
          fontWeight: 'semibold',
          fontSize: 14,
        }}>
        Day {day}
      </Text>
    </View>
  );
};
