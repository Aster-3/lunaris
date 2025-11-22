import { Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Slider } from './Slider';
import { useMemo } from 'react';
import { useReaderSettings } from '@/store/readerSettingsStore';

export const ReaderBSMain = () => {
  const { setFontSize, setFontType, fontSize, fontType, fontSizes, fontTypes } =
    useReaderSettings();
  const fontTypeIndex = useMemo(() => fontTypes?.indexOf(fontType), [fontType, fontTypes]);
  const fontSizeIndex = useMemo(() => fontSizes?.indexOf(fontSize), [fontSize, fontSizes]);

  const updateFontSize = (value: any) => {
    setFontSize(fontSizes[value]);
  };

  const updateFontType = (value: any) => {
    setFontType(fontTypes[value]);
  };

  return (
    <View className="flex-col gap-8">
      <View className="flex-row items-start gap-8">
        <View className="flex flex-row items-end gap-2 ">
          <View className="flex-col gap-2">
            <AntDesign name="font-size" size={22} color="white" />
            <View />
          </View>
          <Text className="text-white ">font size</Text>
        </View>
        <Slider
          selectedIndex={fontSizeIndex}
          setSelectedIndex={updateFontSize}
          items={fontSizes}
          isIncrement={true}
        />
      </View>

      <View className="flex-row items-start gap-8">
        <View className="flex flex-row items-end gap-2 ">
          <View className="flex-col gap-2">
            <AntDesign name="font-colors" size={22} color="white" />
            <View />
          </View>
          <Text className="text-white ">font style</Text>
        </View>
        <Slider
          selectedIndex={fontTypeIndex}
          setSelectedIndex={updateFontType}
          items={fontTypes}
          isIncrement={false}
        />
      </View>
    </View>
  );
};
