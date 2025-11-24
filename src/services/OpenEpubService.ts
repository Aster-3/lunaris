import { loadZipFromUri, parseXml } from '@/utils/epub';

export const OpenEpubService = async (uri: string) => {
  const startTime = Date.now();

  const zip = await loadZipFromUri(uri);

  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) return { status: 'error', errorMessage: '"container.xml" bulunamadı' };

  const [containerText] = await Promise.all([containerFile.async('text')]);

  const containerXML = parseXml(containerText);
  const contentPath = containerXML.container.rootfiles.rootfile['@_full-path'];

  const contentFile = zip.file(contentPath);
  if (!contentFile) return { status: 'error', errorMessage: '"content.opf" bulunamadı' };

  const contentText = await contentFile.async('text');
  const content = parseXml(contentText);

  const manifestMap = new Map(
    content.package.manifest.item.map((i: any) => [i['@_id'], i['@_href']])
  );
  const spineList = content.package.spine.itemref.map((i: any) => i['@_idref']);
  const readList = spineList.map((id: any) => manifestMap.get(id)).filter(Boolean) as string[];
  const opfDir = contentPath.split('/').slice(0, -1).join('/');
  const pageCache = new Map<number, string>();

  const loadingPages = new Set<number>();
  let backgroundLoadingActive = false;

  const initialPageCount = Math.min(5, readList.length);
  const initialLoadPromises = [];

  for (let i = 0; i < initialPageCount; i++) {
    const href = readList[i];
    const fullPath = opfDir ? `${opfDir}/${href}` : href;
    const file = zip.file(fullPath);

    if (file) {
      loadingPages.add(i);
      initialLoadPromises.push(
        file
          .async('text')
          .then((content) => {
            pageCache.set(i, content);
            loadingPages.delete(i);
          })
          .catch((err) => {
            console.warn(`Sayfa ${i} yüklenemedi:`, err);
            loadingPages.delete(i);
          })
      );
    }
  }

  await Promise.all(initialLoadPromises);

  // console.log(`başlangıç yüklemesi: ${Date.now() - startTime}ms`);

  const loadRemainingPages = async () => {
    if (backgroundLoadingActive) return;
    backgroundLoadingActive = true;

    const batchSize = 5;

    for (let start = initialPageCount; start < readList.length; start += batchSize) {
      const batchPromises = [];

      for (let i = start; i < Math.min(start + batchSize, readList.length); i++) {
        if (pageCache.has(i) || loadingPages.has(i)) continue;

        const href = readList[i];
        const fullPath = opfDir ? `${opfDir}/${href}` : href;
        const file = zip.file(fullPath);

        if (file) {
          loadingPages.add(i);
          batchPromises.push(
            file
              .async('text')
              .then((content) => {
                pageCache.set(i, content);
                loadingPages.delete(i);
              })
              .catch((err) => {
                console.warn(`Sayfa ${i} yüklenemedi:`, err);
                loadingPages.delete(i);
              })
          );
        }
      }

      await Promise.all(batchPromises);

      await new Promise((res) => setTimeout(res, 50));
    }
  };

  loadRemainingPages();

  return {
    spineList,
    getPage: async (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, readList.length - 1));

      if (pageCache.has(safeIndex)) {
        return pageCache.get(safeIndex)!;
      }

      if (loadingPages.has(safeIndex)) {
        const maxWait = 3000;
        const startWait = Date.now();

        while (loadingPages.has(safeIndex) && Date.now() - startWait < maxWait) {
          await new Promise((res) => setTimeout(res, 50));
        }

        if (pageCache.has(safeIndex)) {
          return pageCache.get(safeIndex)!;
        }
      }

      const href = readList[safeIndex];
      const fullPath = opfDir ? `${opfDir}/${href}` : href;
      const file = zip.file(fullPath);

      if (!file) {
        for (let i = safeIndex - 1; i >= 0; i--) {
          if (pageCache.has(i)) return pageCache.get(i)!;
        }
        return '';
      }

      try {
        loadingPages.add(safeIndex);
        const content = await file.async('text');
        pageCache.set(safeIndex, content);
        loadingPages.delete(safeIndex);

        const adjacentPages = [safeIndex - 1, safeIndex + 1, safeIndex + 2];
        adjacentPages.forEach(async (adjIndex) => {
          if (
            adjIndex >= 0 &&
            adjIndex < readList.length &&
            !pageCache.has(adjIndex) &&
            !loadingPages.has(adjIndex)
          ) {
            const adjHref = readList[adjIndex];
            const adjFullPath = opfDir ? `${opfDir}/${adjHref}` : adjHref;
            const adjFile = zip.file(adjFullPath);

            if (adjFile) {
              loadingPages.add(adjIndex);
              adjFile
                .async('text')
                .then((adjContent) => {
                  pageCache.set(adjIndex, adjContent);
                  loadingPages.delete(adjIndex);
                })
                .catch(() => {
                  loadingPages.delete(adjIndex);
                });
            }
          }
        });

        return content;
      } catch (err) {
        console.warn(`Sayfa ${safeIndex} yüklenemedi:`, err);
        loadingPages.delete(safeIndex);

        for (let i = safeIndex - 1; i >= 0; i--) {
          if (pageCache.has(i)) return pageCache.get(i)!;
        }
        return '';
      }
    },
  };
};
