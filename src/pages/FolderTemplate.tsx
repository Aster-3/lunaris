import { Image, Dimensions, View, Text, Pressable, ViewStyle } from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '@/Interfaces';
import GridCardSection from '@/components/GridCardSection';
import Feather from '@expo/vector-icons/Feather';
import { EmptyFolder } from '@/features/FolderTemplate/EmptyFolder';
import { useCallback, useState } from 'react';
import { getBooksByCollectionId } from '@/database/repositories/book-CollectionRepository';
import { BookModel } from '@/database/modelTypes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateCollectionLastReading } from '@/database/repositories/collectionRepository';
import { confirm } from '@/utils/confirmGlobal';
import { useCollectionStore } from '@/store/collectionStore';

type FolderTemplateRouteProp = RouteProp<RootStackParamList, 'FolderTemplate'>;

export const FolderTemplate = () => {
  const route = useRoute<FolderTemplateRouteProp>();
  const { id, img, name } = route.params;
  const [data, setData] = useState<BookModel[] | []>([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const deleteCollection = useCollectionStore((state) => state.deleteCollection);

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        const relatedBooks = await getBooksByCollectionId(id);
        if (relatedBooks) {
          setData(relatedBooks);
          setTimeout(async () => {
            await updateCollectionLastReading(id);
          }, 200);
        }
      };
      getData();
    }, [id])
  );

  const deleteCollectionFunction = async () => {
    const accepted = await confirm(
      'Delete Collection',
      `"Are you sure you want to delete this collection? This action cannot be undone.`
    );
    if (accepted) {
      const res = await deleteCollection(id);
      if (res) navigation.goBack();
      else alert('Collection is Not Deleted.');
    }
    console.log(accepted);
  };

  const { width } = Dimensions.get('window');

  return (
    <View className="flex-1 gap-10 bg-primary">
      <View style={{ opacity: 0.5 }}>
        <Image
          source={{ uri: img }}
          style={{
            width: width,
            position: 'absolute',
            height: undefined,
            aspectRatio: 16 / 9,
          }}
          resizeMode="cover"
        />
      </View>
      <View className="flex-row items-center  justify-between px-4 py-3 ">
        <Pressable
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 8 } as ViewStyle}
          className="rounded-full active:bg-gray-500"
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </Pressable>

        <Text style={{ fontSize: 20 }} className="pr-4 font-semibold text-white">
          {name}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          marginBottom: 8,
        }}>
        <View style={{ padding: 10, marginTop: -24 }}>
          {data.length > 0 ? <GridCardSection data={data} /> : <EmptyFolder collectionId={id} />}
        </View>
      </View>

      <View
        className=""
        style={{
          position: 'absolute',
          padding: 14,
          bottom: 0,
          right: 0,
          marginVertical: 20,
          marginBottom: 40,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => {
            deleteCollectionFunction();
          }}
          style={
            {
              backgroundColor: 'rgba(255, 0, 0, 0.19)',
              borderRadius: 30,
              padding: 16,
              justifyContent: 'center',
              alignItems: 'center',
            } as ViewStyle
          }>
          <MaterialCommunityIcons name="folder-remove" size={26} color="white" />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('CreateCollection', { collectionId: id })}
          style={
            {
              backgroundColor: 'rgba(0,20,80,0.9)',
              borderRadius: 30,
              padding: 16,
              justifyContent: 'center',
              alignItems: 'center',
            } as ViewStyle
          }>
          <MaterialCommunityIcons name="book-plus-multiple" size={26} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
