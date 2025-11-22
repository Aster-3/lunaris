import './global.css';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MainTabs } from '@/MainTabs';
import { SearchPage } from './src/pages/SearchPage';
import { FolderTemplate } from '@/pages/FolderTemplate';
import { BookTemplate } from '@/pages/BookTemplate';
import { BookReadPage } from '@/pages/BookReadPage';
import { EditProfile } from '@/pages/EditProfile';
import { CreateCollection } from '@/pages/CreateCollection';
import { InitialPage } from '@/pages/InitialPage';
import { ConfirmProvider } from '@/ContextApi';
import { getUser } from '@/database/repositories/userRepository';
import { getDBConnection } from '@/database/connection';
import { resetDatabase } from '@/database/utils/resetDB';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    const checkIntro = async () => {
      // await AsyncStorage.clear();
      // const db = await getDBConnection();
      // await resetDatabase(db);
      // return;
      const hasSeen = await AsyncStorage.getItem('hasSeenIntro');
      if (!hasSeen) setShowIntro(true);
      setLoading(false);
    };
    checkIntro();
  }, []);

  useEffect(() => {
    const get = async () => {
      const u = await getUser();
      // console.log(u);
    };
    get();
  }, []);

  if (loading) return null; // AsyncStorage kontrolü bitene kadar boş render

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConfirmProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              presentation: 'containedTransparentModal',
            }}>
            {showIntro && (
              <Stack.Screen name="Initial" component={InitialPage} initialParams={{ showIntro }} />
            )}
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Search" component={SearchPage} />
            <Stack.Screen name="FolderTemplate" component={FolderTemplate} />
            <Stack.Screen name="BookTemplate" component={BookTemplate} />
            <Stack.Screen name="BookRead" component={BookReadPage} />
            <Stack.Screen name="CreateCollection" component={CreateCollection} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </ConfirmProvider>
    </GestureHandlerRootView>
  );
}
