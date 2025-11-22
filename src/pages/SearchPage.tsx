import { View, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SearchBar } from '@/components/Searchbar';
import { SearchBarLayout } from '@/layouts/SearchBarLayout';
import { SearchBookGroup } from '@/features/SearchPage/SearchBookGroup';
import { SearchFolderGroup } from '@/features/SearchPage/SearchFolderGroup';

const { height } = Dimensions.get('window');

export const SearchPage = () => {
  return (
    <SearchBarLayout>
      <View style={{ height: height }} className="flex-col items-center justify-between px-2 py-5">
        <ScrollView className="mb-8 w-full flex-col space-y-4 p-2">
          <View className="flex-col gap-8">
            <SearchBookGroup title="Books" />
            <SearchFolderGroup title="Folders" />
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={20}
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: 0,
            justifyContent: 'center',
            width: '100%',
            marginBottom: 50,
          }}>
          <SearchBar inSearchPage={true} />
        </KeyboardAvoidingView>
      </View>
    </SearchBarLayout>
  );
};
