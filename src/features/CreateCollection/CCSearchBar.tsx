import { useRef } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View } from 'react-native';

export const CCSearchBar = ({
  inputValue,
  setInputValue,
}: {
  inputValue: string;
  setInputValue: any;
}) => {
  const inputRef = useRef<TextInput>(null);
  return (
    <View className={`w-full rounded-full ${true ? 'bg-gray-700' : 'bg-white/10'}  px-4`}>
      <TextInput
        ref={inputRef}
        placeholder="Search..."
        value={inputValue}
        onChangeText={setInputValue}
        placeholderTextColor="rgba(255,255,255,0.6)"
        className="text-base font-normal text-white/80"
      />
    </View>
  );
};
