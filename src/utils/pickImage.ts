import * as ImagePicker from 'expo-image-picker';

export const pickImage = async () => {
  return await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1,
  });
};

export const pickProfileImage = async () => {
  return await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
};
