import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Pressable, Text, View, ViewStyle, Keyboard } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { useFolderBSStore } from '@/store/BottomSheets/useFolderSheetStore';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { pickImage } from '@/utils/pickImage';
import { CreateCollectionService } from '@/services/CreateCollectionService';
import { useCollectionStore } from '@/store/collectionStore';

export const CollectionBottomSheet = () => {
  const addCollection = useCollectionStore((state) => state.addCollection);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  const [imgPath, setImgPath] = useState<string>('');
  const [imgName, setImgName] = useState<string>('');

  const setRef = useFolderBSStore((state) => state.setRef);
  const [collectionName, setCollectionName] = useState('');

  const keyboardListener = useRef<any>(null);

  useEffect(() => {
    setRef(bottomSheetRef);
  }, [setRef]);

  const snapPoints = useMemo(() => ['35%', '56%'], []);

  const handleSheetChanges = (index: number) => {
    if (index === 0 && !keyboardListener.current) {
      keyboardListener.current = Keyboard.addListener('keyboardDidHide', () => {
        bottomSheetRef.current?.snapToIndex(0);
      });
    } else if (index === -1) {
      clear();
    }
  };

  const selectImage = async () => {
    const result: any = await pickImage();

    if (!result || result.cancelled) {
      alert('File is not Selected!');
    } else {
      const imgPath = result.assets[0].uri;
      setImgPath(imgPath);
      const imgName = result.assets[0].fileName;
      setImgName(imgName);
      setIsFileSelected(true);
    }
  };

  const clear = () => {
    console.log('Girdi');
    if (keyboardListener.current) {
      keyboardListener.current.remove();
      keyboardListener.current = null;
    }
    Keyboard.dismiss();
    setCollectionName('');
    setIsFileSelected(false);
    setImgName('');
    setImgPath('');
  };

  const createCollection = async () => {
    const result = await CreateCollectionService(imgPath, imgName, collectionName, addCollection);
    if (result) {
      bottomSheetRef.current?.close();
      clear();
    }
  };

  return (
    <BottomSheet
      onChange={handleSheetChanges}
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
      backgroundStyle={{ backgroundColor: '#2F2F2F' } as ViewStyle}>
      <BottomSheetScrollView>
        <BottomSheetView style={{ flex: 1, paddingBottom: 20 }}>
          <View style={{ flex: 1, gap: 20, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'column', gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>
                Collection Name
              </Text>
              <BottomSheetTextInput
                style={
                  {
                    borderRadius: 12,
                    backgroundColor: '#E5E7EB',
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontWeight: 500,
                  } as any
                }
                value={collectionName}
                onChangeText={setCollectionName}
                placeholder="Enter collection name"
              />
            </View>
            <View style={{ flexDirection: 'column', gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>
                Collection Cover
              </Text>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-start',
                  borderRadius: 8,
                  borderWidth: isFileSelected ? 0 : 2,
                }}
                onPress={selectImage}
                className={` ${isFileSelected ? 'bg-secondary' : 'border-dashed border-[#1D4ED8] active:border-solid active:border-[#4e78ed] active:bg-[#4e78ed]'} `}>
                <Text style={{ fontWeight: '600', color: '#FFFFFF' }}>
                  {isFileSelected ? 'İmage Selected!' : 'Select Image'}
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={
                {
                  marginTop: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  padding: 12,
                } as any
              }
              onPress={createCollection}
              className="bg-blue-600 active:bg-blue-800">
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Create</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
