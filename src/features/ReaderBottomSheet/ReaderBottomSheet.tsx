import React, { useMemo, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { NavMenuReader } from './NavMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReaderBSMain } from './Main';
import { Themes } from './Themes';
import { Settings } from './Settings';

export const ReaderBottomSheet = forwardRef((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%'], []);
  const [page, setPage] = useState<number>(1);
  // const blockGesture = Gesture.Native();

  useImperativeHandle(ref, () => ({
    expand: () => bottomSheetRef.current?.expand(),
    collapse: () => bottomSheetRef.current?.collapse(),
    close: () => bottomSheetRef.current?.close(),
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
      backgroundStyle={{ backgroundColor: '#1A1A1A' } as ViewStyle}>
      <SafeAreaView edges={['bottom']} className="flex-1">
        <View
          style={{
            flex: 1,
            gap: 20,
            paddingHorizontal: 16,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: 'space-between',
          }}>
          <View style={{ flex: 1 }}>
            <View className="flex-1" style={{ display: page === 0 ? 'flex' : 'none' }}>
              <Themes />
            </View>
            <View className="flex-1" style={{ display: page === 1 ? 'flex' : 'none' }}>
              <ReaderBSMain />
            </View>
            <View className="flex-1" style={{ display: page === 2 ? 'flex' : 'none' }}>
              <Settings />
            </View>
          </View>
          <NavMenuReader page={page} setPage={setPage} />
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
});
