// import {
//   documentDirectory,
//   makeDirectoryAsync,
//   getInfoAsync,
//   writeAsStringAsync,
// } from 'expo-file-system/legacy';

// export const saveEpubCover = async (coverBase64: string, coverFileName: string) => {
//   const folderPath = `${documentDirectory}epub_imgs`;
//   const destPath = `${folderPath}/${Date.now()}-${coverFileName}`;

//   const folderInfo = await getInfoAsync(folderPath);
//   if (!folderInfo.exists) {
//     await makeDirectoryAsync(folderPath, { intermediates: true });
//     console.log('"epub_imgs" klasörü oluşturuldu.');
//   }

//   await writeAsStringAsync(destPath, coverBase64, { encoding: 'base64' });
//   console.log(`${coverFileName} başarıyla kaydedildi:`, destPath);

//   return destPath;
// };

import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';

export const copyEpubCover = async (fileData: Uint8Array, coverFullPath: string) => {
  const folderPath = `${FileSystem.documentDirectory}covers`;
  const coverFileName = coverFullPath.split('/').pop();
  const destPath = `${folderPath}/${Date.now()}-${coverFileName}`;

  const folderInfo = await FileSystem.getInfoAsync(folderPath);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
  }

  await FileSystem.writeAsStringAsync(destPath, Buffer.from(fileData).toString('base64'), {
    encoding: 'base64',
  });

  return destPath;
};
