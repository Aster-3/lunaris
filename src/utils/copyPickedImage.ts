import {
  documentDirectory,
  copyAsync,
  makeDirectoryAsync,
  getInfoAsync,
} from 'expo-file-system/legacy';

export const copyPickedImage = async (fileName: string, fileUri: string) => {
  if (!fileName || !fileUri) {
    throw new Error('Seçilen dosya geçersiz. Dosya URI veya ismi eksik.');
  }

  const folderPath = `${documentDirectory}collections`;
  const destPath = `${folderPath}/${Date.now()}-${fileName}`;

  try {
    const folderInfo = await getInfoAsync(folderPath);

    if (!folderInfo.exists) {
      await makeDirectoryAsync(folderPath, { intermediates: true });
      console.log('"collections" klasörü oluşturuldu.');
    }

    await copyAsync({
      from: fileUri,
      to: destPath,
    });

    console.log(`✅ ${fileName} başarıyla kopyalandı!`);
    return destPath;
  } catch (error) {
    console.error('Dosya kopyalanamadı:', error);
    throw error;
  }
};
