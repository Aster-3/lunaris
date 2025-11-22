import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function SnapSlider() {
  const barWidth = 300;
  const snaps = [0, barWidth * 0.33, barWidth * 0.66, barWidth];

  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX + translateX.value;

      if (translateX.value < 0) translateX.value = 0;
      if (translateX.value > barWidth) translateX.value = barWidth;
    })
    .onEnd(() => {
      const nearest = snaps.reduce((prev, curr) =>
        Math.abs(curr - translateX.value) < Math.abs(prev - translateX.value) ? curr : prev
      );

      translateX.value = withSpring(nearest, { damping: 15 });
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: barWidth }]} />

      {snaps.map((x, i) => (
        <View key={i} style={[styles.point, { left: x - 8 }]} />
      ))}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  bar: {
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
  },
  point: {
    position: 'absolute',
    top: -8,
    width: 16,
    height: 16,
    backgroundColor: '#aaa',
    borderRadius: 8,
  },
  knob: {
    position: 'absolute',
    top: -12,
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
