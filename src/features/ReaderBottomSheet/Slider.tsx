import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, LayoutChangeEvent } from 'react-native';

export const Slider = ({
  isIncrement,
  items,
  selectedIndex,
  setSelectedIndex,
}: {
  isIncrement: boolean;
  items: any[];
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [index, setIndex] = useState(selectedIndex);

  const initialScrollDone = useRef(false);
  const prevIndexRef = useRef(index);

  useEffect(() => {
    if (selectedIndex !== index) {
      setIndex(selectedIndex);
    }

    // eslint-disable-next-line
  }, [selectedIndex, setSelectedIndex]);

  useEffect(() => {
    if (scrollViewWidth > 0 && initialScrollDone.current) {
      scrollViewRef.current?.scrollTo({
        x: index * scrollViewWidth,
        animated: false,
      });
    }

    if (prevIndexRef.current !== index) {
      setSelectedIndex(index);
      prevIndexRef.current = index;
    }
  }, [index, scrollViewWidth, setSelectedIndex]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;

    if (newWidth > 0 && newWidth !== scrollViewWidth) {
      setScrollViewWidth(newWidth);

      if (!initialScrollDone.current) {
        scrollViewRef.current?.scrollTo({
          x: selectedIndex * newWidth,
          animated: false,
        });
        initialScrollDone.current = true;
      }
    }
  };

  return (
    <View className="mt-2 flex-1 flex-row items-center justify-between pt-1">
      <TouchableOpacity
        onPress={() => {
          setIndex((prev) => {
            if (prev === 0) {
              return 0;
            } else {
              return prev - 1;
            }
          });
        }}
        className={`items-center justify-center rounded-xl px-4 py-2 ${
          index === 0 ? 'bg-gray-500/50' : 'bg-gray-500'
        }`}>
        <Text className="text-xl font-bold text-white"> {isIncrement ? '-' : '<'}</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        pagingEnabled={false}
        overScrollMode="never"
        onLayout={handleLayout}
        scrollEnabled
        style={{ overflow: 'hidden' }}
        className="flex-1 overflow-hidden">
        {items.map((item) => (
          <View key={item} style={{ width: scrollViewWidth }} className="items-center ">
            <Text className="text-base font-bold text-white">{item}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          setIndex((prev) => {
            if (prev === items.length - 1) {
              return items.length - 1;
            } else {
              return prev + 1;
            }
          });
        }}
        className={`rounded-xl px-4 py-2 ${index === items.length - 1 ? 'bg-gray-500/50' : 'bg-gray-500'}`}>
        <Text className="text-xl font-bold text-white">{isIncrement ? '+' : '>'}</Text>
      </TouchableOpacity>
    </View>
  );
};
