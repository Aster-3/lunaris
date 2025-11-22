export type RootStackParamList = {
  FolderTemplate: { id: number; img: string; name: string };
  Search: undefined;
  BookTemplate: { bookId: number };
  BookRead: { fileUri: string; coverUrl: string | null; bookId: number };
  CreateCollection: { collectionId: number };
  MainTabs: undefined;
  EditProfile: undefined;
};
