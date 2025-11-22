import React, { useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';
import { useAppStore } from '@/store/useAppStore';

export const SearchBar = ({ inSearchPage = false }: { inSearchPage?: boolean }) => {
  const inputValue = useAppStore((state) => state.inputValue);
  const setInputValue = useAppStore((state) => state.setInputValue);
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => {
      clearTimeout(timeout);
      setInputValue('');
    };
  }, [setInputValue]);
  return (
    <View
      className={`mx-2 my-4 rounded-full ${inSearchPage ? 'bg-gray-700 py-0.5' : 'bg-white/10'}  px-4`}>
      <TextInput
        ref={inputRef}
        placeholder="Search..."
        value={inputValue}
        onChangeText={setInputValue}
        placeholderTextColor="rgba(255,255,255,0.6)"
        className="text-base font-normal text-white/80"
      />
    </View>
  );
};
