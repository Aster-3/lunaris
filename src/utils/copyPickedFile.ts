import * as DocumentPicker from 'expo-document-picker';
import {
  documentDirectory,
  copyAsync,
  makeDirectoryAsync,
  getInfoAsync,
} from 'expo-file-system/legacy';

export const copyPickedFile = async (pickedFile: DocumentPicker.DocumentPickerAsset) => {
  if (!pickedFile.uri || !pickedFile.name) {
    throw new Error('Seçilen dosya geçersiz. Dosya URI veya ismi eksik.');
  }

  const folderPath = `${documentDirectory}epubs`;
  const destPath = `${folderPath}/${Date.now()}-${pickedFile.name}`;

  try {
    const folderInfo = await getInfoAsync(folderPath);

    if (!folderInfo.exists) {
      await makeDirectoryAsync(folderPath, { intermediates: true });
      console.log('📂 "epubs" klasörü oluşturuldu.');
    }

    await copyAsync({
      from: pickedFile.uri,
      to: destPath,
    });

    console.log(`✅ ${pickedFile.name} başarıyla kopyalandı!`);
    return destPath;
  } catch (error) {
    console.error('Dosya kopyalanamadı:', error);
    throw error;
  }
};

// import {
//   documentDirectory,
//   makeDirectoryAsync,
//   getInfoAsync,
//   writeAsStringAsync,
// } from 'expo-file-system/legacy';
// import JSZip from 'jszip';

// export const copyPickedFile = async (zip: JSZip) => {
//   const folderPath = `${documentDirectory}epubs`;
//   const destFolder = `${folderPath}/${Date.now()}`;

//   const ensureDir = async (path: string) => {
//     const info = await getInfoAsync(path);
//     if (!info.exists) {
//       await makeDirectoryAsync(path, { intermediates: true });
//     }
//   };

//   try {
//     // Ana klasörü oluştur
//     await ensureDir(folderPath);
//     await ensureDir(destFolder);

//     const files = Object.keys(zip.files);

//     for (const filename of files) {
//       const entry = zip.files[filename];

//       if (entry.dir) {
//         await ensureDir(`${destFolder}/${filename}`);
//       } else {
//         const pathParts = filename.split('/');
//         pathParts.pop();
//         if (pathParts.length > 0) {
//           const parentDir = `${destFolder}/${pathParts.join('/')}`;
//           await ensureDir(parentDir);
//         }

//         const fileData = await entry.async('base64');
//         await writeAsStringAsync(`${destFolder}/${filename}`, fileData, {
//           encoding: 'base64',
//         });
//       }
//     }

//     console.log(`✅ EPUB başarıyla '${destFolder}' klasörüne açıldı.`);
//     return destFolder;
//   } catch (error) {
//     console.error('❌ EPUB klasör olarak kaydedilemedi:', error);
//     throw error;
//   }
// };
