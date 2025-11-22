import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

export const loadZipFromUri = async (uri: string) => {
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  return await JSZip.loadAsync(arrayBuffer);
};

export const getContainerXml = async (zip: JSZip) => {
  const containerXML = await zip.file('META-INF/container.xml')?.async('text');

  if (!containerXML) {
    console.warn('Container.xml içeriğine ulaşılamadı!');
    return null;
  }
  return containerXML;
};

export const getContent = async (zip: JSZip, opfPath: string) => {
  const contentOPF = await zip.file(opfPath)?.async('text');
  if (!contentOPF) {
    console.warn('Content.opf içeriğine ulaşılamadı!');
    return null;
  }
  return contentOPF;
};

export const parseXml = (xml: string) => {
  const parser = new XMLParser({ ignoreAttributes: false, ignoreDeclaration: true });
  return parser.parse(xml);
};

export const getOpfPath = (containerDoc: any) => {
  const opfPath = containerDoc.container.rootfiles.rootfile['@_full-path'];
  if (!opfPath) throw new Error('container.xml içinden opf path bulunamadı!');
  return opfPath;
};

export const getSpineAndManifest = (contentDoc: any) => {
  const spineRefs = contentDoc.package.spine.itemref;
  const spineList = Array.isArray(spineRefs) ? spineRefs : [spineRefs];

  const spineOrder = spineList.map((item) => item['@_idref']);

  const manifest = contentDoc.package.manifest.item;
  const manifestList = Array.isArray(manifest) ? manifest : [manifest];
  const manifestItems: Record<string, string> = {};

  manifestList.forEach((item) => (manifestItems[item['@_id']] = item['@_href']));

  return { spineOrder, manifestItems };
};

export const loadChapters = async (
  zip: JSZip,
  opfPath: string,
  spineOrder: string[],
  manifestItems: Record<string, string>
) => {
  const loadedChapters = [];

  for (const id of spineOrder) {
    const basePath = opfPath.replace(/[^\/]+$/, '');
    const chapterPath = basePath + manifestItems[id];
    const chapterText = await zip.file(chapterPath)?.async('text');
    if (chapterText) {
      loadedChapters.push({ id, path: chapterPath, content: chapterText });
    }
  }
  return loadedChapters;
};
