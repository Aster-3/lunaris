import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const { height: windowHeight } = Dimensions.get('window');

export default function EpubSkeleton() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(1);

  const handleLoadEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setIsLoading(false));
  };

  useEffect(() => {
    let animation: any;
    if (isLoading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
    }
    return () => animation?.stop();
    // eslint-disable-next-line
  }, [isLoading]);

  const paragraphCount = 20;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {isLoading && (
          <Animated.View style={[styles.skeletonWrapper, { opacity: fadeAnim }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {Array.from({ length: paragraphCount }).map((_, i) => (
                <View key={i} style={styles.paragraphBlock} />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <WebView
          originWhitelist={['*']}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={handleLoadEnd}
          style={styles.webview}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  skeletonWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 10,
  },
  scrollContent: {
    padding: 20,
    minHeight: windowHeight,
  },
  paragraphBlock: {
    width: '100%',
    height: 24,
    backgroundColor: '#1e1e1e',
    borderRadius: 4,
    marginBottom: 16,
  },
  webview: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: 'transparent',
  },
});
