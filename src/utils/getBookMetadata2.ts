import { getContainerXml, getContent, loadZipFromUri, parseXml } from './epub';
import { arrayControler } from './arrayControler';
import { copyEpubCover } from './saveEpubCover';
// import { copyPickedFile } from './copyPickedFile';

interface ReturnedProps {
  title: string | null;
  author: string | null;
  cover: string | null;
  description: string | null;
  genres: string[] | null;
  languages: string[] | null;
}

export const getBookMetaData2 = async (
  uri: string,
  copiedEpubFolder: string
): Promise<ReturnedProps | null> => {
  try {
    const zip = await loadZipFromUri(uri);
    const containerXML = await getContainerXml(zip);
    if (!containerXML) {
      return null;
    }

    const parsedXML = parseXml(containerXML);
    const opfPath = parsedXML.container.rootfiles.rootfile['@_full-path'];
    const opfDir = opfPath.split('/').slice(0, -1).join('/');

    const contentOPF = await getContent(zip, opfPath);
    if (!contentOPF) {
      return null;
    }
    const parsedOPF = await parseXml(contentOPF);
    const metadata = parsedOPF.package.metadata;

    if (!metadata) {
      console.warn('Metadata içeriğine ulaşılamadı!');
      return null;
    }

    const coverMeta = arrayControler(metadata['meta']);
    const coverItem = coverMeta.find((x: any) => x['@_name'] === 'cover');
    const coverContent = coverItem?.['@_content'] || null;

    const manifest = parsedOPF.package.manifest['item'];
    const manifestTtem = manifest.find((x: any) => x['@_id'] === coverContent);

    const coverPath = manifestTtem['@_href'];
    const coverFullPath = opfDir
      ? `${opfDir.replace(/\/$/, '')}/${coverPath.replace(/^\//, '')}`
      : coverPath;

    const cover = await zip.file(coverFullPath)?.async('uint8array');
    if (!cover) throw new Error('E-Pub içerisinde Cover Bulunamadı!');

    const coverDestPath = copyEpubCover(cover, coverFullPath);

    let title = metadata?.['dc:title'] || null;
    let author = metadata?.['dc:creator']?.['#text'] || null;

    const descriptionHTML = metadata['dc:description'];
    let description = null;
    if (descriptionHTML) {
      try {
        const parsedDescription = await parseXml(descriptionHTML);
        description = parsedDescription?.['div']?.['p'][0] || parsedDescription?.['p'] || '';
        if (!description?.trim()) description = null;
      } catch (descErr) {
        console.warn('Açıklama parse edilirken hata:', descErr);
        description = null;
      }
    }

    let languages = arrayControler(metadata['dc:language'] || metadata['language']);
    let genres = arrayControler(metadata['dc:subject']);

    return {
      title,
      author,
      cover: await coverDestPath,
      description,
      genres,
      languages,
    };
  } catch (error) {
    console.error('getBookMetaData() çalışırken hata oluştu:', error);
    return null;
  }
};
