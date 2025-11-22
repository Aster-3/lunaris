import { loadZipFromUri, parseXml } from '@/utils/epub';

export const OpenEpubService = async (uri: string) => {
  const startTime = Date.now();

  const zip = await loadZipFromUri(uri);
  // console.log(`ZIP yükleme: ${Date.now() - startTime}ms`);

  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) return { status: 'error', errorMessage: '"container.xml" bulunamadı' };

  const containerXML = parseXml(await containerFile.async('text'));
  const contentPath = containerXML.container.rootfiles.rootfile['@_full-path'];

  const contentFile = zip.file(contentPath);
  if (!contentFile) return { status: 'error', errorMessage: '"content.opf" bulunamadı' };

  const content = parseXml(await contentFile.async('text'));
  // console.log(`Parse süresi: ${Date.now() - startTime}ms`);

  const manifestMap = new Map(
    content.package.manifest.item.map((i: any) => [i['@_id'], i['@_href']])
  );
  const spineList = content.package.spine.itemref.map((i: any) => i['@_idref']);
  const readList = spineList.map((id: any) => manifestMap.get(id)).filter(Boolean) as string[];
  const opfDir = contentPath.split('/').slice(0, -1).join('/');
  const pageCache = new Map<number, string>();

  for (let i = 0; i < Math.min(3, readList.length); i++) {
    const href = readList[i];
    const fullPath = opfDir ? `${opfDir}/${href}` : href;
    const content = await zip.file(fullPath)?.async('text');
    if (content) pageCache.set(i, content);
  }

  setTimeout(async () => {
    for (let i = 3; i < readList.length; i++) {
      if (pageCache.has(i)) continue;
      const href = readList[i];
      const fullPath = opfDir ? `${opfDir}/${href}` : href;

      try {
        const file = zip.file(fullPath);
        if (!file) continue;
        const content = await file.async('text');
        pageCache.set(i, content);
      } catch (err) {
        console.warn(`Sayfa ${i} yüklenemedi:`, err);
      }

      await new Promise((res) => setTimeout(res, 150));
    }
    // console.log('Tüm sayfalar cache’e alındı.');
  }, 1000);

  console.log(`Toplam başlangıç yükleme: ${Date.now() - startTime}ms`);

  return {
    spineList,
    getPage: async (index: number) => {
      // index'i 0 ile readList.length - 1 arasında sınırlıyoruz
      const safeIndex = Math.max(0, Math.min(index, readList.length - 1));

      if (pageCache.has(safeIndex)) {
        return pageCache.get(safeIndex)!;
      }

      const href = readList[safeIndex];
      const fullPath = opfDir ? `${opfDir}/${href}` : href;
      const file = zip.file(fullPath);
      if (!file) return pageCache.get(safeIndex - 1) || ''; // dosya yoksa önceki sayfayı döndür

      try {
        const content = await file.async('text');
        pageCache.set(safeIndex, content);
        return content;
      } catch (err) {
        console.warn(`Sayfa ${safeIndex} yüklenemedi:`, err);
        return pageCache.get(safeIndex - 1) || '';
      }
    },
  };
};
