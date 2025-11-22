export const addItemsToBooks = async (
  bookId: number,
  items: string[] | null | undefined,
  getItemsByCategoryName: (name: string) => Promise<{ id: number } | null>,
  addItemByCategory: (bookId: number, categoryId: number) => Promise<void>,
  addCategory: (name: string) => Promise<{ id: number }>
) => {
  if (items)
    for (const item of items) {
      const isAvailable = await getItemsByCategoryName(item);
      if (isAvailable) {
        await addItemByCategory(bookId, isAvailable.id);
      } else {
        const addedCategory = await addCategory(item);
        await addItemByCategory(bookId, addedCategory.id);
      }
    }
};
