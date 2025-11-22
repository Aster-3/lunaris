import { ScrollView, View } from 'react-native';
import { Folder } from '@/components/Folder';

interface FoldersLayoutProps {
  data: { id: number; title: string; imgPath: string }[];
  cardWidth?: number;
  showNames?: boolean;
}

export const FoldersLayout = ({ data, cardWidth = 170, showNames = true }: FoldersLayoutProps) => {
  return (
    <View className="flex flex-col">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}>
        {data.map((item, idx) => (
          <Folder
            key={idx}
            id={item.id}
            img={item.imgPath}
            width={cardWidth}
            name={item.title}
            isNameActive={showNames}
          />
        ))}
      </ScrollView>
    </View>
  );
};
