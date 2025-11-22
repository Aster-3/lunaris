import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { BoookCard } from '@/components/BookCard';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Animated, { Layout, FadeOut } from 'react-native-reanimated';

import { BookModel } from '@/database/modelTypes';
interface BookListProps {
  data: BookModel[];
  addDeleteBook: (newItem: any) => void;
  selectedBooks: BookModel[];
}
export default function GridCardSectionForCC({
  data,
  addDeleteBook,
  selectedBooks,
}: BookListProps) {
  return (
    <Animated.View className="-mx-4 flex-1 flex-row flex-wrap ">
      {data.map((item) => {
        const isSelected = selectedBooks.some((b) => b.id === item.id);
        return (
          <Animated.View
            className={'mt-4 w-1/3 p-2'}
            layout={Layout.stiffness(0)}
            key={item.id}
            exiting={FadeOut.duration(20)}>
            <Pressable
              onPress={() => {
                addDeleteBook(item);
              }}
              key={item.id}>
              <BoookCard
                id={item.id!}
                img={item.img!}
                pointerEventsNone={true}
                title={item.title!}
                isNameActive
              />
              {isSelected && (
                <View
                  style={
                    {
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: 12,
                    } as ViewStyle
                  }>
                  <View style={{ position: 'absolute', top: 0, right: 0 }}>
                    <FontAwesome6 name="check-circle" size={24} color="#03C03C" />
                  </View>
                </View>
              )}
            </Pressable>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}
