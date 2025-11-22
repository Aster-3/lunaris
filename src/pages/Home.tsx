import { View } from 'react-native';
import { HomeHead } from '@/features/Home/HomeHead';
import { RecentReadBooks } from '@/features/Home/RecentBooks';
import { RecentReadFolders } from '@/features/Home/RecentFolders';
import { GeneralInformation } from '@/features/Home/GeneralInformation';
import { BookMarkList } from '@/features/Home/BookMarkList';
import { ScrollView } from 'react-native-gesture-handler';

export const Home = () => {
  return (
    <ScrollView>
      <View className="gap-6 px-6 py-5 color-white">
        <HomeHead />
        <RecentReadBooks />
        <RecentReadFolders />
        <GeneralInformation />
        <BookMarkList />
      </View>
    </ScrollView>
  );
};
