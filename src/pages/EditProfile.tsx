import { pickProfileImage } from '@/utils/pickImage';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useUserStore } from '@/store/userStore';

export const EditProfile = () => {
  const updateUser = useUserStore((state) => state.updateUser);
  const navigation = useNavigation();

  const [name, setName] = useState<string>('');
  const [imgPath, setImgPath] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

  const selectImage = async () => {
    const result: any = await pickProfileImage();

    if (!result || result.cancelled) {
      alert('File is not Selected!');
    } else {
      console.log(result.assets[0].uri);
      const imgPath = result.assets[0].uri;
      setImgPath(imgPath);
      setIsFileSelected(true);
    }
  };

  const patchUser = async () => {
    const result = await updateUser({ name: name, imgPath: imgPath });
    if (result) navigation.goBack();
    else alert('Profile is Not Updated!');
  };

  return (
    <View className="mx-4 flex-1 items-center justify-center bg-black/20">
      <View
        style={{ marginBottom: 60, backgroundColor: '#1F2937', paddingBottom: 40 } as ViewStyle}
        className="w-full gap-6 rounded-xl  p-4 py-6 ">
        <View className="flex-row items-center justify-between gap-4">
          <Pressable
            style={
              {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: 8,
                alignSelf: 'flex-start',
              } as ViewStyle
            }
            className="w-fit rounded-full active:bg-gray-500"
            onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </Pressable>
          <Text className="pr-4 text-2xl font-semibold text-white/90">Profile</Text>
          <View />
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-lg font-medium text-white">Name</Text>
            <TextInput
              style={
                {
                  borderRadius: 6,
                  backgroundColor: '#E5E7EB',
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontWeight: 500,
                } as any
              }
              value={name}
              onChangeText={setName}
              placeholder="User Name..."
            />
          </View>
          <View className="gap-2">
            <Pressable
              style={{
                paddingVertical: 10,
                paddingHorizontal: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                borderWidth: isFileSelected ? 2 : 2,
                borderColor: isFileSelected ? 'transparent' : '#1D4ED8',
              }}
              onPress={selectImage}
              className={` ${
                isFileSelected
                  ? 'border-solid border-transparent bg-secondary'
                  : 'border-dashed border-[#1D4ED8] active:border-solid active:border-[#4e78ed] active:bg-[#4e78ed]'
              } `}>
              <Text style={{ fontWeight: '600', color: '#FFFFFF' }}>
                {isFileSelected ? 'İmage Selected!' : 'Select Image'}
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={
            {
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              padding: 12,
            } as any
          }
          onPress={patchUser}
          className="-mb-4 bg-blue-600 active:bg-blue-800">
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Update</Text>
        </Pressable>
      </View>
    </View>
  );
};
