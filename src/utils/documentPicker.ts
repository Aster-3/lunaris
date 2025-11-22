import * as DocumentPicker from 'expo-document-picker';

export const documentPicker = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/epub+zip', 'application/pdf'],
    });
    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
