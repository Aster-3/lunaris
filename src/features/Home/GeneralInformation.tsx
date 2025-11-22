import { TotalBook } from '@/components/TotalBook';
import { View } from 'react-native';
import { TotalDay } from '@/components/TotalDay';
export const GeneralInformation = () => {
  return (
    <View className="flex-row justify-between gap-4">
      <TotalBook />
      <TotalDay />
    </View>
  );
};
