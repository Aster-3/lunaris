import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const loadFontBase64 = async (asset: Asset) => {
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
    encoding: 'base64',
  });
  return `data:font/ttf;base64,${base64}`;
};
