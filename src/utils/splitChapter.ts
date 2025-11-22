import { Dimensions, PixelRatio, Platform } from 'react-native';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

/**
 * HTML'i mobil ekran yüksekliğine göre sayfalara böler.
 * ÇOK DAHA AGRESIF hesaplama ile doğru sayfalama yapar.
 */
export const splitChapterToPages = (
  chapterHtml: string,
  fontSize: number = 16,
  lineHeightMultiplier: number = 1.5,
  paddingVertical: number = 60, // Header, footer, padding toplamı
  paddingHorizontal: number = 40
) => {
  // Boş içerik kontrolü
  if (!chapterHtml || chapterHtml.trim().length === 0) {
    return [''];
  }

  // Gerçek satır yüksekliği
  const lineHeight = fontSize * lineHeightMultiplier;

  // Kullanılabilir ekran yüksekliği (çok daha güvenli margin)
  const usableHeight = windowHeight - paddingVertical - 100; // Ekstra 100px güvenlik payı

  // Bir sayfaya sığabilecek maksimum satır sayısı
  const maxLinesPerPage = Math.floor(usableHeight / lineHeight);

  // Karakter genişliği (HTML render çok daha geniş)
  const avgCharWidth = fontSize * 0.6; // 0.5'ten 0.6'ya çıkardım

  // Bir satıra sığabilecek karakter sayısı
  const charsPerLine = Math.floor((windowWidth - paddingHorizontal) / avgCharWidth);

  // HTML'i paragraflara böl - daha detaylı
  const parts = chapterHtml.split(/(<p[^>]*>|<\/p>|<br\s*\/?>|<h[1-6][^>]*>|<\/h[1-6]>)/gi);

  const pages: string[] = [];
  let currentPage = '';
  let currentLines = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (!part || part.trim().length === 0) continue;

    // HTML etiketlerini temizle
    const textContent = part.replace(/<[^>]*>/g, '').trim();

    // Etiket ise direkt ekle
    if (part.match(/^<[^>]*>$/)) {
      currentPage += part;

      // Başlık etiketleri ekstra satır kaplar
      if (part.match(/<h[1-6][^>]*>/i)) {
        currentLines += 2; // Başlık için ekstra boşluk
      }
      continue;
    }

    if (textContent.length === 0) {
      currentPage += part;
      continue;
    }

    // Paragraf için satır hesapla - DAHA AGRESIF
    let paragraphLines = Math.ceil(textContent.length / charsPerLine);

    // Paragraf aralığı ekle
    paragraphLines += 1; // Her paragraf arası boşluk

    // <br> etiketleri
    const brCount = (part.match(/<br\s*\/?>/gi) || []).length;
    paragraphLines += brCount;

    // KRITIK: Çok uzun paragrafları böl
    if (paragraphLines > maxLinesPerPage * 0.7) {
      // Bu paragraf çok uzun, kelime kelime böl
      const words = textContent.split(/\s+/);
      let tempText = '';
      let tempLines = 0;

      for (const word of words) {
        const testText = tempText + (tempText ? ' ' : '') + word;
        const testLines = Math.ceil(testText.length / charsPerLine);

        if (currentLines + testLines > maxLinesPerPage * 0.8 && currentPage.length > 0) {
          // Sayfa dolu, kaydet
          pages.push(currentPage.trim());
          currentPage = part.startsWith('<') ? part : '<p>' + tempText + '</p>';
          currentLines = testLines;
          tempText = word;
        } else {
          tempText = testText;
          tempLines = testLines;
        }
      }

      currentPage += part.replace(textContent, tempText);
      currentLines += tempLines + 1;
    } else {
      // Normal paragraf
      // Sayfa doluysa yeni sayfa aç - DAHA AGRESIF (0.8 yerine 0.75)
      if (currentLines + paragraphLines > maxLinesPerPage * 0.75 && currentPage.length > 0) {
        pages.push(currentPage.trim());
        currentPage = part;
        currentLines = paragraphLines;
      } else {
        currentPage += part;
        currentLines += paragraphLines;
      }
    }
  }

  if (currentPage.trim().length > 0) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [''];
};

/**
 */
export const getOptimizedPageSettings = (customFontSize?: number) => {
  const pixelRatio = PixelRatio.get();
  const isSmallScreen = windowHeight < 700;
  const pixelRations = 560 + windowHeight || isSmallScreen;
  const baseFontSize = customFontSize || (isSmallScreen ? 14 : 16);
  const fontSize = baseFontSize;

  return {
    fontSize,
    lineHeightMultiplier: 1.5,
    paddingVertical: isSmallScreen ? 80 : 100,
    paddingHorizontal: 40,
  };
};

/**
 * KULLANIM:
 *
 * const settings = getOptimizedPageSettings();
 * const pages = splitChapterToPages(
 *   chapterHtml,
 *   settings.fontSize,
 *   settings.lineHeightMultiplier,
 *   settings.paddingVertical,
 *   settings.paddingHorizontal
 * );
 */
