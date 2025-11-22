import React, { useRef, useEffect } from 'react';
import { Text, Animated, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { CreateUser } from '@/features/CreateUser';
//@ts-ignore
import logo from '../../assets/lunaris.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const InitialPage = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  const finishIntro = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    navigation.replace('MainTabs');
  };

  useEffect(() => {
    const execute = async () => {
      const dateString = new Date().toISOString();
      await AsyncStorage.setItem('installDate', dateString);
    };
    execute();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-primary px-6">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: '100%',
          alignItems: 'center',
          top: '15%',
        }}>
        <Image
          source={logo}
          style={{ width: 200, height: 200, resizeMode: 'contain' }}
          className="aspect-video rounded-xl"
        />
        <Text className="mb-8 text-xl font-bold text-white">Welcome to Solaris</Text>
        <CreateUser updateIntro={finishIntro} />
      </Animated.View>
    </KeyboardAvoidingView>
  );
};
