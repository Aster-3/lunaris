import { ScrollView } from 'react-native';
import { BoookCard } from '@/components/BookCard';

interface ScrollableBooksProps {
  data: { id?: number; title?: string; img: any }[];
  cardWidth?: number;
  showNames?: boolean;
}

export const ScrollableBooks = ({
  data,
  cardWidth = 120,
  showNames = true,
}: ScrollableBooksProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16 }}>
      {data.map((item, idx) => (
        <BoookCard
          id={item.id!}
          key={item.id}
          img={item.img}
          width={cardWidth}
          title={item.title}
          isNameActive={showNames}
        />
      ))}
    </ScrollView>
  );
};
