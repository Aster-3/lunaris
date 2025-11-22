import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
};

type SearchBarNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export const SearchBarModel = ({ inSearchPage = false }: { inSearchPage?: boolean }) => {
  const navigation = useNavigation<SearchBarNavigationProp>();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Search')}
      className={`mx-2 my-4 rounded-full py-3 ${inSearchPage ? 'bg-gray-700' : 'bg-white/10'} px-4`}>
      <Text className="text-base font-normal text-white/80">Search...</Text>
    </TouchableOpacity>
  );
};
