export interface BookModel {
  id?: number;
  title: string | null;
  url?: string | null;
  img?: string | null;
  author?: string | null;
  type?: string | null;
  createdAt?: number | null;
  lastReadingAt?: number | null;
}
