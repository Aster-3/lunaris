import { useUserStore } from '@/store/userStore';
import { pickProfileImage } from '@/utils/pickImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, ViewStyle } from 'react-native';

export const CreateUser = ({ updateIntro }: { updateIntro: () => void }) => {
  const addUser = useUserStore((state) => state.addUser);

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

  const executeIntro = async () => {
    console.log(name, imgPath);
    const result = await addUser({ name: name, imgPath: imgPath });
    if (result) {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      updateIntro();
    }
  };
  return (
    <View style={{ marginBottom: 60 } as ViewStyle} className="w-full gap-6 rounded-xl  p-4 py-6 ">
      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium text-white">Name</Text>
          <TextInput
            style={
              {
                borderRadius: 6,
                backgroundColor: '#E5E7EB',
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 14,
                fontWeight: '500',
              } as any
            }
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
            placeholder="Enter User Name..."
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
              borderWidth: false ? 0 : 2,
            }}
            onPress={selectImage}
            className={` ${isFileSelected ? 'bg-secondary' : 'border-dashed border-[#1D4ED8] active:border-solid active:border-[#4e78ed] active:bg-[#4e78ed]'} `}>
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
        onPress={executeIntro}
        className="-mb-4 bg-blue-600 active:bg-blue-800">
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Continue</Text>
      </Pressable>
    </View>
  );
};
