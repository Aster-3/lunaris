import { getContainerXml, getContent, loadZipFromUri, parseXml } from './epub';
import { arrayControler } from './arrayControler';
import { copyEpubCover } from './saveEpubCover';

interface BookMetadata {
  title: string | null;
  author: string | null;
  cover: string | null;
  description: string | null;
  genres: string[] | null;
  languages: string[] | null;
}

interface ParsedMetadata {
  'dc:title'?: any;
  'dc:creator'?: any;
  'dc:description'?: string;
  'dc:subject'?: any;
  'dc:language'?: any;
  language?: any;
  meta?: any;
}

export const getBookMetaData = async (
  uri: string,
  copiedEpubFolder: string
): Promise<BookMetadata | null> => {
  try {
    // 1. ZIP yükleme ve container parse
    const zip = await loadZipFromUri(uri);
    const containerXML = await getContainerXml(zip);

    if (!containerXML) {
      console.error('Container XML bulunamadı');
      return null;
    }

    // 2. OPF path çıkarma
    const parsedContainer = parseXml(containerXML);
    const opfPath = parsedContainer?.container?.rootfiles?.rootfile?.['@_full-path'];

    if (!opfPath) {
      console.error('OPF path bulunamadı');
      return null;
    }

    const opfDir = opfPath.split('/').slice(0, -1).join('/');

    // 3. Content OPF parse - metadata ve manifest'i paralel al
    const contentOPF = await getContent(zip, opfPath);

    if (!contentOPF) {
      console.error('Content OPF bulunamadı');
      return null;
    }

    const parsedOPF = parseXml(contentOPF);
    const metadata: ParsedMetadata = parsedOPF?.package?.metadata;
    const manifest = parsedOPF?.package?.manifest?.item;

    if (!metadata) {
      console.error('Metadata bulunamadı');
      return null;
    }

    // 4. Metadata extraction - paralel işle
    const [title, author, description, coverPath, languages, genres] = await Promise.all([
      extractTitle(metadata),
      extractAuthor(metadata),
      extractDescription(metadata),
      extractCoverPath(metadata, manifest, opfDir),
      extractLanguages(metadata),
      extractGenres(metadata),
    ]);

    // 5. Cover image işleme - en son yap
    let coverDestPath: string | null = null;

    if (coverPath) {
      try {
        const coverData = await zip.file(coverPath)?.async('uint8array');
        if (coverData) {
          coverDestPath = await copyEpubCover(coverData, coverPath);
        }
      } catch (coverError) {
        console.warn('Cover yüklenemedi:', coverError);
      }
    }

    return {
      title,
      author,
      cover: coverDestPath,
      description,
      genres,
      languages,
    };
  } catch (error) {
    console.error('getBookMetaData hatası:', error);
    return null;
  }
};

// === HELPER FUNCTIONS ===

async function extractTitle(metadata: ParsedMetadata): Promise<string | null> {
  try {
    let title = metadata['dc:title'];

    if (!title) return null;

    if (Array.isArray(title)) {
      // Birden fazla title varsa, main title'ı bul veya ilkini al
      const mainTitle =
        title.find((t: any) => !t['@_refines'] || t['@_title-type'] === 'main') || title[0];

      return mainTitle['#text'] || mainTitle || null;
    }

    return typeof title === 'object' ? title['#text'] : title;
  } catch (error) {
    console.warn('Title çıkarılamadı:', error);
    return null;
  }
}

async function extractAuthor(metadata: ParsedMetadata): Promise<string | null> {
  try {
    const creator = metadata['dc:creator'];

    if (!creator) return null;

    if (Array.isArray(creator)) {
      // Birden fazla yazar varsa ilkini al veya 'aut' role'ü olanı
      const primaryAuthor =
        creator.find((c: any) => c['@_role'] === 'aut' || !c['@_role']) || creator[0];

      return primaryAuthor['#text'] || primaryAuthor || null;
    }

    return typeof creator === 'object' ? creator['#text'] : creator;
  } catch (error) {
    console.warn('Author çıkarılamadı:', error);
    return null;
  }
}

async function extractDescription(metadata: ParsedMetadata): Promise<string | null> {
  try {
    const descriptionHTML = metadata['dc:description'];

    if (!descriptionHTML) return null;

    // HTML etiketlerini temizle
    let cleanDescription = descriptionHTML;

    // XML parse etmeyi dene
    try {
      const parsed = parseXml(descriptionHTML);

      if (parsed?.div?.p) {
        cleanDescription = Array.isArray(parsed.div.p) ? parsed.div.p[0] : parsed.div.p;
      } else if (parsed?.p) {
        cleanDescription = Array.isArray(parsed.p) ? parsed.p[0] : parsed.p;
      }
    } catch {
      // Parse başarısız olursa, basit HTML tag temizliği yap
      cleanDescription = descriptionHTML
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Text içeriğini çıkar
    if (typeof cleanDescription === 'object' && cleanDescription['#text']) {
      cleanDescription = cleanDescription['#text'];
    }

    return cleanDescription?.trim() || null;
  } catch (error) {
    console.warn('Description çıkarılamadı:', error);
    return null;
  }
}

async function extractCoverPath(
  metadata: ParsedMetadata,
  manifest: any[],
  opfDir: string
): Promise<string | null> {
  try {
    if (!manifest || !Array.isArray(manifest)) {
      console.warn('Manifest geçersiz');
      return null;
    }

    // Yöntem 1: Meta tag'den cover ID bul
    const metaArray = arrayControler(metadata['meta']);
    const coverMeta = metaArray.find(
      (x: any) => x['@_name'] === 'cover' || x['@_property'] === 'cover-image'
    );

    let coverItem = null;

    if (coverMeta) {
      const coverId = coverMeta['@_content'] || coverMeta['@_href'];
      coverItem = manifest.find((item: any) => item['@_id'] === coverId);
    }

    // Yöntem 2: Manifest'te 'cover' içeren item bul
    if (!coverItem) {
      coverItem = manifest.find((item: any) => {
        const id = item['@_id']?.toLowerCase() || '';
        const href = item['@_href']?.toLowerCase() || '';
        return (
          id.includes('cover') ||
          href.includes('cover') ||
          item['@_properties']?.includes('cover-image')
        );
      });
    }

    // Yöntem 3: İlk image item'ı al
    if (!coverItem) {
      coverItem = manifest.find((item: any) => item['@_media-type']?.startsWith('image/'));
    }

    if (!coverItem || !coverItem['@_href']) {
      console.warn('Cover bulunamadı');
      return null;
    }

    // Path oluştur
    const coverPath = coverItem['@_href'];
    const fullPath = opfDir
      ? `${opfDir.replace(/\/$/, '')}/${coverPath.replace(/^\//, '')}`
      : coverPath;

    return fullPath;
  } catch (error) {
    console.warn('Cover path çıkarılamadı:', error);
    return null;
  }
}

async function extractLanguages(metadata: ParsedMetadata): Promise<string[] | null> {
  try {
    const languages = arrayControler(metadata['dc:language'] || metadata['language']);

    if (!languages || languages.length === 0) return null;

    // Language kodlarını normalize et
    return languages
      .map((lang: any) => {
        if (typeof lang === 'object' && lang['#text']) {
          return lang['#text'];
        }
        return lang;
      })
      .filter((lang: string) => lang && lang.length >= 2);
  } catch (error) {
    console.warn('Languages çıkarılamadı:', error);
    return null;
  }
}

async function extractGenres(metadata: ParsedMetadata): Promise<string[] | null> {
  try {
    const subjects = arrayControler(metadata['dc:subject']);

    if (!subjects || subjects.length === 0) return null;

    // Subject'leri temizle ve normalize et
    return subjects
      .map((subject: any) => {
        if (typeof subject === 'object' && subject['#text']) {
          return subject['#text'];
        }
        return subject;
      })
      .filter((subject: string) => subject && subject.trim().length > 0)
      .map((subject: string) => subject.trim());
  } catch (error) {
    console.warn('Genres çıkarılamadı:', error);
    return null;
  }
}
