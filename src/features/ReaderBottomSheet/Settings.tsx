// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Slider } from './Slider';
import { useReaderSettings } from '@/store/readerSettingsStore';
import { useMemo } from 'react';
export const Settings = () => {
  const {
    setPaddingHorizontal,
    setLineHeight,
    lineHeight,
    paddingHorizontal,
    paddingHorizontals,
    lineHeights,
  } = useReaderSettings();

  const paddingHorizontalIndex = useMemo(
    () => paddingHorizontals?.indexOf(paddingHorizontal),
    [paddingHorizontal, paddingHorizontals]
  );
  const lineHeightIndex = useMemo(
    () => lineHeights?.indexOf(lineHeight),
    [lineHeight, lineHeights]
  );

  const updatePaddingHorizontal = (value: any) => {
    setPaddingHorizontal(paddingHorizontals[value]);
  };

  const updateLineHeights = (value: any) => {
    setLineHeight(lineHeights[value]);
  };

  return (
    <View className="flex-col gap-8 ">
      <View className="flex-row items-start gap-8">
        <View className="flex flex-row items-start gap-2 ">
          <View className="flex-col gap-2">
            <MaterialCommunityIcons name="align-horizontal-distribute" size={22} color="white" />
            <View />
          </View>
          <View className="flex-col">
            <Text className="text-sm text-white">padding</Text>
            <Text className="text-white ">Horizontal</Text>
          </View>
        </View>
        <Slider
          selectedIndex={paddingHorizontalIndex}
          setSelectedIndex={updatePaddingHorizontal}
          items={paddingHorizontals}
          isIncrement={true}
        />
      </View>

      <View className="flex-row items-start gap-8">
        <View className="flex flex-row items-end gap-2 ">
          <View className="flex-col gap-2">
            <MaterialCommunityIcons name="land-rows-horizontal" size={22} color="white" />
            <View />
          </View>
          <Text className="text-white ">line Height</Text>
        </View>
        <Slider
          selectedIndex={lineHeightIndex}
          setSelectedIndex={updateLineHeights}
          items={lineHeights}
          isIncrement={true}
        />
      </View>
    </View>
  );
};
