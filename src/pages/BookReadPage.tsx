import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/Interfaces';
import { Text, View, ViewStyle, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { OpenEpubService } from '@/services/OpenEpubService';
import { useFonts } from 'expo-font';
import WebView from 'react-native-webview';
import { htmlTemplate } from '@/utils/htmlTemplate';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ReaderBottomSheet } from '@/features/ReaderBottomSheet/ReaderBottomSheet';
import { useReaderSettings } from '@/store/readerSettingsStore';
import {
  getBookLastPage,
  updateBookLastPage,
  updateBookLastReading,
} from '@/database/repositories/bookRepository';

type FolderTemplateRouteProp = RouteProp<RootStackParamList, 'BookRead'>;

export const BookReadPage = () => {
  const route = useRoute<FolderTemplateRouteProp>();
  const { fileUri: uri, bookId } = route.params;

  const bottomSheetRef = useRef<any>(null);
  const { fontSize, fontType, paddingHorizontal, lineHeight, theme } = useReaderSettings();
  const epubRef = useRef<any>(null);
  const webviewRef = useRef<WebView>(null);
  const isMountedRef = useRef<boolean>(true);
  const indexRef = useRef<number>(2);
  const loadingPageRef = useRef<boolean>(false);
  const pageCache = useRef<Map<number, string>>(new Map());
  const initialPageLoadedRef = useRef<boolean>(false);

  const [chapter, setChapter] = useState<string | null>(null);
  const [index, setIndex] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  const [fontsLoaded] = useFonts({
    Tinos: require('../../assets/fonts/Tinos-Regular.ttf'),
    Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
    Merriweather: require('../../assets/fonts/Merriweather_96pt-Regular.ttf'),
    OpenSans: require('../../assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    isMountedRef.current = true;
    const cache = pageCache.current;

    const initializeBook = async () => {
      try {
        setInitializing(true);
        await updateBookLastReading(bookId);
        const pageData = await getBookLastPage(bookId);

        if (isMountedRef.current) {
          const targetIndex =
            pageData.lastReadPage && pageData.lastReadPage > 1 ? pageData.lastReadPage : 2;

          setIndex(targetIndex);
          indexRef.current = targetIndex;
          setInitializing(false);
        }
      } catch (error) {
        console.error('Error initializing book:', error);
        if (isMountedRef.current) {
          setIndex(2);
          indexRef.current = 2;
          setInitializing(false);
        }
      }
    };

    initializeBook();

    return () => {
      isMountedRef.current = false;
      updateBookLastPage(bookId, indexRef.current);
      cache.clear();
      console.log('Book Read Page Unmounted!');
    };
  }, [bookId]);

  useEffect(() => {
    indexRef.current = index;
    console.log('Index:', index);
  }, [index]);

  const toggleBottomSheet = useCallback(() => {
    if (bottomSheetRef.current) {
      if (isBottomSheetOpen) {
        bottomSheetRef.current.close();
        setIsBottomSheetOpen(false);
      } else {
        bottomSheetRef.current.expand();
        setIsBottomSheetOpen(true);
      }
    }
  }, [isBottomSheetOpen]);

  const preloadAdjacentPages = useCallback(async (currentIndex: number) => {
    if (!epubRef.current) return;

    const totalPages = epubRef.current.spineList.length;
    const pagesToPreload = [currentIndex - 1, currentIndex + 1].filter(
      (idx) => idx >= 1 && idx <= totalPages && !pageCache.current.has(idx)
    );

    pagesToPreload.forEach(async (pageIndex) => {
      try {
        const html = await epubRef.current.getPage(pageIndex - 1);
        if (html) {
          pageCache.current.set(pageIndex, html);
        }
      } catch (error) {
        console.error(`Error preloading page ${pageIndex}:`, error);
      }
    });
  }, []);

  const navigateToPage = useCallback((delta: number) => {
    if (!epubRef.current || loadingPageRef.current) return;

    const totalPages = epubRef.current.spineList.length;
    setIndex((prev) => {
      const newIndex = prev + delta;
      return Math.max(2, Math.min(newIndex, totalPages));
    });
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-50, 50])
        .failOffsetY([-20, 20])
        .onEnd((event) => {
          const threshold = 20;
          if (event.translationX > threshold) {
            navigateToPage(-1);
          } else if (event.translationX < -threshold) {
            navigateToPage(1);
          }
        }),
    [navigateToPage]
  );

  useEffect(() => {
    if (initializing) return;

    const loadEpub = async () => {
      try {
        setLoading(true);

        if (!epubRef.current || epubRef.current.uri !== uri) {
          epubRef.current = await OpenEpubService(uri);
          epubRef.current.uri = uri;
        }

        const totalPages = epubRef.current.spineList.length;
        const safeIndex = Math.max(1, Math.min(index, totalPages));

        let html = pageCache.current.get(safeIndex);
        if (!html) {
          html = await epubRef.current.getPage(safeIndex - 1);
          if (html) {
            pageCache.current.set(safeIndex, html);
          }
        }

        if (isMountedRef.current && html) {
          setChapter(html);
          setLoading(false);
          initialPageLoadedRef.current = true;
          preloadAdjacentPages(safeIndex);
        }
      } catch (error) {
        console.error('Error loading EPUB:', error);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadEpub();
  }, [uri, index, initializing, preloadAdjacentPages]);

  useEffect(() => {
    if (!initialPageLoadedRef.current || !epubRef.current || loading || loadingPageRef.current)
      return;

    const loadPage = async () => {
      try {
        loadingPageRef.current = true;
        const totalPages = epubRef.current.spineList.length;
        const safeIndex = Math.max(1, Math.min(index, totalPages));

        let html = pageCache.current.get(safeIndex);
        if (!html) {
          html = await epubRef.current.getPage(safeIndex - 1);
          if (html) {
            pageCache.current.set(safeIndex, html);
          }
        }

        if (isMountedRef.current && html) {
          setChapter(html);
          preloadAdjacentPages(safeIndex);
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        loadingPageRef.current = false;
      }
    };

    loadPage();
  }, [index, loading, preloadAdjacentPages]);

  const navigateToAnchor = useCallback((anchorId: string) => {
    webviewRef.current?.injectJavaScript(`
      (function() {
        try {
          const el = document.getElementById('${anchorId}');
          if (el) {
            const page = document.querySelector('.page');
            if (page) {
              page.scrollTo({
                top: el.offsetTop - 20,
                behavior: 'smooth'
              });
            }
          }
        } catch (e) {
          console.error('Anchor navigation error:', e);
        }
      })();
      true;
    `);
  }, []);

  const navigateToLink = useCallback(
    (href: string) => {
      if (!epubRef.current?.spineList) {
        console.warn('Epub data not ready for navigation.');
        return;
      }

      if (href.startsWith('#')) {
        const anchorId = href.substring(1);
        navigateToAnchor(anchorId);
      } else {
        const targetFilename = href.split('#')[0].split('/').pop();
        const foundIndex = epubRef.current.spineList.findIndex(
          (item: any) => item === targetFilename
        );

        if (foundIndex !== -1) {
          setIndex(foundIndex + 1);
        } else {
          console.warn('File not found in spine list:', targetFilename);
        }
      }
    },
    [navigateToAnchor]
  );

  const handleWebViewMessage = useCallback(
    (event: any) => {
      let data;

      try {
        data = JSON.parse(event.nativeEvent.data);
      } catch (e) {
        console.warn('JSON parse error:', event.nativeEvent.data, e);
        return;
      }

      try {
        if (data.type === 'bodyClick') {
          if (isBottomSheetOpen) {
            toggleBottomSheet();
            return;
          }

          const { x, width: webViewWidth } = data;
          const edgeThreshold = webViewWidth * 0.2;

          if (x < edgeThreshold) {
            navigateToPage(-1);
          } else if (x > webViewWidth - edgeThreshold) {
            navigateToPage(1);
          } else {
            toggleBottomSheet();
          }
        } else if (data.type === 'linkClick') {
          navigateToLink(data.href);
        }
      } catch (error) {
        console.error('Message handling error:', error);
      }
    },
    [isBottomSheetOpen, toggleBottomSheet, navigateToPage, navigateToLink]
  );

  const htmlContent = useMemo(() => {
    if (!chapter) return '';
    return htmlTemplate(chapter, fontSize, fontType, paddingHorizontal, lineHeight, theme);
  }, [chapter, fontSize, fontType, paddingHorizontal, lineHeight, theme]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white">Loading fonts...</Text>
      </View>
    );
  }

  if (initializing || loading || !chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121417]">
      <GestureDetector gesture={panGesture}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{
            html: htmlContent,
            baseUrl: epubRef.current?.basePath,
          }}
          style={{ flex: 1, backgroundColor: 'black' } as ViewStyle}
          onMessage={handleWebViewMessage}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.startsWith('file://') && request.url.includes('#')) {
              return false;
            }
            return true;
          }}
          androidLayerType="hardware"
          javaScriptEnabled={true}
          cacheEnabled={true}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          incognito={false}
          domStorageEnabled={true}
        />
      </GestureDetector>

      <ReaderBottomSheet ref={bottomSheetRef} />
    </View>
  );
};
