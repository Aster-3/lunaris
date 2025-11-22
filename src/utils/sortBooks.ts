import { BookModel } from '@/database/modelTypes';

type SortType = 'title-asc' | 'date-asc' | 'date-desc' | 'recent-read';

export const sortArrays = (array: BookModel[], sortType: SortType) => {
  const sorted = [...array];

  switch (sortType) {
    case 'title-asc':
      return sorted.sort((a, b) =>
        a.title!.localeCompare(b.title!, undefined, { sensitivity: 'base' })
      );
    case 'date-asc':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    case 'recent-read':
      return sorted.sort((a, b) => {
        const timeA = a.lastReadingAt ?? (a.createdAt ? a.createdAt * 1000 : 0);
        const timeB = b.lastReadingAt ?? (b.createdAt ? b.createdAt * 1000 : 0);
        return Number(timeB) - Number(timeA);
      });

    case 'date-desc':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    default:
      return sorted;
  }
};
