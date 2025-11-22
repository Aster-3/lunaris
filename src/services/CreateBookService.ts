import { documentPicker } from '@/utils/documentPicker';
import { getBookMetaData } from '@/utils/getBookMetaData';
import { getBookByName } from '@/database/repositories/bookRepository';
import { addLanguage, getLanguageByName } from '@/database/repositories/languageRepository';
import { addBookLanguage } from '@/database/repositories/book-lngRepository';
import { addGenre, getGenreByName } from '@/database/repositories/genreRepository';
import { addBookGenre } from '@/database/repositories/book-genreRepository';
import { addItemsToBooks } from '@/utils/addItemsToBooks';
import { confirm } from '@/utils/confirmGlobal';
import { copyPickedFile } from '@/utils/copyPickedFile';

interface BookModel {
  id?: number;
  title: string | null;
  url?: string | null;
  img?: string | null;
  author?: string | null;
  type?: string | null;
  createdAt?: number | null;
  lastReadingAt?: number | null;
}

export const CreateBookService = async (addBook: (book: BookModel) => Promise<number | false>) => {
  try {
    const result = await documentPicker();
    if (!result) {
      return;
    }
    const copiedFileUrl = await copyPickedFile(result);

    const metadata = await getBookMetaData(result.uri, copiedFileUrl);
    console.log('Metadata:', metadata);
    if (!metadata) return console.error('Metadata verilerine ulaşılamadı!');

    const { author, cover, genres, languages, title } = metadata;
    if (title) {
      const isBookAvailable = await getBookByName(title);
      if (isBookAvailable) {
        const accepted = await confirm(
          'Book Already Exists',
          `"${title}" is already added. Do you want to add it anyway??`
        );

        if (!accepted) return console.log('User canceled');
      }
    }

    const type = 'E-Pub';

    const inserId = await addBook({ title, url: copiedFileUrl, img: cover, author, type });

    if (!inserId) {
      alert('Book could not be added!');
      return;
    }
    await Promise.all([
      addItemsToBooks(inserId, languages, getLanguageByName, addBookLanguage, addLanguage),
      addItemsToBooks(inserId, genres, getGenreByName, addBookGenre, addGenre),
    ]);
  } catch (error) {
    console.error('Hata:' + error);
  }
};
