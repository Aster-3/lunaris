export const htmlTemplate = (
  chapter: string,
  fontSize: number,
  fontType: string,
  paddingHorizontal: number,
  lineHeight: number,
  theme: string
) => {
  const isDark = theme === 'Night A';
  const bgColor = isDark ? '#0a0b0f' : '#faf8f5';
  const textColor = isDark ? '#d4d4d8' : '#1f2937';
  const linkColor = isDark ? '#60a5fa' : '#2563eb';
  const secondaryTextColor = isDark ? '#9ca3af' : '#6b7280';

  return `
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <style>
      :root {
        --bg-color: ${bgColor};
        --text-color: ${textColor};
        --link-color: ${linkColor};
        --secondary-text: ${secondaryTextColor};
        --font-size: ${fontSize}px;
        --line-height: ${lineHeight}px;
        --padding-h: ${paddingHorizontal}px;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
      }
        
      html {
        width: 100%;
        height: 100%;
        overflow: hidden;
        -webkit-text-size-adjust: 100%;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: '${fontType}', -apple-system, BlinkMacSystemFont, 'Segoe UI', serif;
        font-size: var(--font-size);
        line-height: var(--line-height);
        -webkit-user-select: none;
        user-select: none;
        margin: 0;
        padding: 0;
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      #container {
        width: 100%;
        height: 100vh;
        height: 100dvh;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        padding: 0 var(--padding-h);
      }

      #container::-webkit-scrollbar {
        display: none;
      }

      #content {
        max-width: 100%;
        min-height: 100%;
        padding: 32px 0 80px 0;
      }

      .page {
        width: 100%;
        max-width: 100%;
      }

      /* Typography */
      p {
        font-size: var(--font-size);
        line-height: var(--line-height);
        text-align: justify;
        text-justify: inter-word;
        margin: 0 0 1em 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        -webkit-hyphens: auto;
        text-indent: 2em;
        orphans: 3;
        widows: 3;
      }

      p:first-of-type,
      h1 + p,
      h2 + p,
      h3 + p,
      hr + p,
      center + p {
        text-indent: 0;
      }

      p:empty,
      p:has(br:only-child) {
        display: none;
      }

      /* Headings */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        margin: 2em 0 0.8em 0;
        line-height: 1.4;
        page-break-after: avoid;
        break-after: avoid;
        letter-spacing: -0.01em;
      }

      h1 {
        font-size: calc(var(--font-size) * 1.8);
        margin-top: 0;
        text-align: center;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      h2 {
        font-size: calc(var(--font-size) * 1.5);
        text-align: center;
      }

      h3 {
        font-size: calc(var(--font-size) * 1.3);
      }

      h4 {
        font-size: calc(var(--font-size) * 1.15);
      }

      h5, h6 {
        font-size: var(--font-size);
        font-weight: 600;
      }

      /* Links */
      a {
        color: var(--link-color);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s ease;
        pointer-events: auto;
        -webkit-tap-highlight-color: transparent;
      }

      a:active {
        opacity: 0.7;
      }

      a[href^="#"] {
        font-size: calc(var(--font-size) * 0.85);
        vertical-align: super;
        line-height: 0;
        border-bottom: 1px dotted var(--link-color);
      }

      /* Text formatting */
      strong, b {
        font-weight: 600;
      }

      em, i {
        font-style: italic;
      }

      u {
        text-decoration: underline;
      }

      small {
        font-size: calc(var(--font-size) * 0.875);
      }

      sub, sup {
        font-size: calc(var(--font-size) * 0.75);
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }

      sup {
        top: -0.5em;
      }

      sub {
        bottom: -0.25em;
      }

      /* Blockquote */
      blockquote {
        margin: 1.5em 1em;
        padding: 0.5em 1em;
        border-left: 3px solid var(--link-color);
        font-style: italic;
        opacity: 0.9;
      }

      /* Code */
      code {
        font-family: 'Courier New', monospace;
        font-size: calc(var(--font-size) * 0.9);
        background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
        padding: 0.2em 0.4em;
        border-radius: 3px;
      }

      pre {
        font-family: 'Courier New', monospace;
        font-size: calc(var(--font-size) * 0.85);
        background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
        padding: 1em;
        border-radius: 4px;
        overflow-x: auto;
        margin: 1em 0;
        line-height: 1.5;
      }

      pre code {
        background: none;
        padding: 0;
      }

      /* Lists */
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }

      li {
        margin: 0.5em 0;
        line-height: var(--line-height);
      }

      /* Horizontal rule */
      hr {
        border: none;
        height: 1px;
        background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        margin: 2em auto;
        width: 30%;
      }

      center + hr {
        display: none;
      }

      /* Center text */
      center {
        display: block;
        text-align: center;
        margin: 2em 0;
        color: var(--secondary-text);
        font-size: calc(var(--font-size) * 0.9);
      }

      .bodytext-center {
        text-align: center;
        text-indent: 0;
      }

      /* Images */
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1.5em auto;
        border-radius: 4px;
      }

      /* Tables */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        font-size: calc(var(--font-size) * 0.9);
      }

      th, td {
        padding: 0.75em;
        text-align: left;
        border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
      }

      th {
        font-weight: 600;
        background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
      }

      /* Remove extra line breaks */
      br + br,
      br + br + br {
        display: none;
      }

      /* Footnotes */
      .footnote {
        font-size: calc(var(--font-size) * 0.85);
        color: var(--secondary-text);
        border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
      }

      /* Performance optimizations */
      * {
        will-change: auto;
      }

      .page {
        contain: layout style paint;
      }

      /* Selection styling */
      ::selection {
        background: ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)'};
      }

      ::-moz-selection {
        background: ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)'};
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="content">
        <div class="page">${chapter}</div>
      </div>
    </div>

    <script>
      (function() {
        'use strict';

        const container = document.getElementById('container');
        const page = document.querySelector('.page');

        // Optimize images
        document.querySelectorAll('img').forEach(img => {
          img.loading = 'lazy';
          img.decoding = 'async';
        });

        // Handle anchor links (internal)
        document.querySelectorAll('a[href^="#"]').forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const targetId = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);

            if (targetEl && page) {
              const offsetTop = targetEl.offsetTop - 20;
              page.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
              });
            }
          });
        });

        // Handle all links (including cross-chapter)
        document.querySelectorAll('a:not([href^="#"])').forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const href = this.getAttribute('href');
            
            if (href && window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'linkClick',
                href: href
              }));
            }
          });
        });

        // Handle body clicks for navigation
        let clickTimeout = null;
        document.addEventListener('click', function(e) {
          // Ignore clicks on links
          if (e.target.closest('a')) return;

          // Debounce rapid clicks
          if (clickTimeout) return;
          
          clickTimeout = setTimeout(() => {
            clickTimeout = null;
          }, 100);

          const clickData = {
            type: 'bodyClick',
            x: e.clientX,
            width: container ? container.clientWidth : window.innerWidth
          };
          
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(clickData));
          }
        });

        // Clean empty elements
        function cleanEmptyElements() {
          document.querySelectorAll('p, div, span').forEach(el => {
            const text = el.textContent.replace(/\\u00A0/g, '').trim();
            if (text === '' && !el.querySelector('img, br')) {
              el.style.display = 'none';
            }
          });
        }

        // Run cleanup after DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', cleanEmptyElements);
        } else {
          cleanEmptyElements();
        }

        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        }, { passive: false });

        // Smooth scroll performance
        let ticking = false;
        container.addEventListener('scroll', function() {
          if (!ticking) {
            window.requestAnimationFrame(function() {
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });

      })();
    </script>
  </body>
</html>
`;
};
