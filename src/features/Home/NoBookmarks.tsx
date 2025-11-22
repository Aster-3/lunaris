import { View, Text } from 'react-native';

const NoBookmarks = () => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
      borderRadius: 16,
    }}>
    <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>No available bookmarks</Text>
    <Text
      style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
      You haven’t added any bookmarks yet.
    </Text>
  </View>
);

export default NoBookmarks;
