import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

const Loader = ({
  size = 35,
  strokeWidth = 3,
  color = '#3b82f6',
  backgroundColor = '#0a1128',
}: {
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor } as ViewStyle]}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
            opacity: 0.95, // pürüzsüz görünüm
          },
        ]}
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
