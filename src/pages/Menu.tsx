import { FlatList, View, Dimensions, ViewStyle, Text } from 'react-native';
import { MenuItem } from '@/features/Menu/MenuITem';

const items = [
  { title: 'Profile Settings', navName: 'EditProfile' },
  { title: 'Feedback', navName: 'FeedBack' },
];

const numColumns = 2;

export const Menu = () => {
  const screenWidth = Dimensions.get('window').width;
  const itemMargin = 8;
  const itemWidth = (screenWidth - (numColumns + 1) * itemMargin) / numColumns;

  return (
    <>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: itemMargin,
          marginTop: 12,
        }}
        contentContainerStyle={{ padding: itemMargin }}
        renderItem={({ item }) => (
          <View className="items-center" style={{ width: itemWidth, aspectRatio: 1 }}>
            <MenuItem title={item.title} navName={item.navName} />
          </View>
        )}
      />
      <View
        style={{ aspectRatio: '16/9', backgroundColor: 'red' } as ViewStyle}
        className="mx-3 rounded-xl">
        <Text>Deneme</Text>
      </View>
    </>
  );
};
