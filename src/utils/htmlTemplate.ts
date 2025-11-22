export const htmlTemplate = (
  chapter: string,
  fontSize: number,
  fontType: string,
  paddingHorizontal: number,
  lineHeight: number,
  theme: string
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta charset="utf-8">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
        
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: ${theme === 'Night A' ? '#08090d' : '#f2f4f8'};
        color: ${theme === 'Night A' ? '#afafaf' : '#000000'};
        font-family: '${fontType}', serif !important;
        -webkit-user-select: none;
        user-select: none;
        margin: 0 0 20px 0;
        display: flex;
      }

      center {
        display: block;
        text-align: center;
        width: 100%;
        padding: 40px 20px 20px 20px;
        color: #afafaf;
      }

      #container {
        width: 100%;
        height: 100vh;
        margin-bottom: 50px;
        padding: 0 ${paddingHorizontal}px; /* move horizontal padding to container to avoid page width overflow */
        overflow-x: auto;
        scroll-snap-type: x mandatory;
      }

      #container::-webkit-scrollbar {
        display: none;
      }

      #content {
        display: flex;
        flex-direction: row;
        height: 100%;
        -webkit-overflow-scrolling: touch;
        width: 100%;
        align-items: stretch;
      }
      .page {
        flex: 0 0 100%;
        min-width: 100%;
        box-sizing: border-box;
        padding: 24px 0 32px 0; /* horizontal padding moved to container */
        scroll-snap-align: start;
        overflow-y: auto; 
      }

      p {
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        text-align: justify;
        margin-top: 12px;
        word-break: break-word;
        text-indent: 2em;
        padding-bottom: 20px;
        width: fit-content;
      }

      h1 {
        font-size: 18px;
        font-weight: bold;
        margin: 20px 0 12px;
        text-align: center;
      }

      h2 {
        font-size: 17px;
        font-weight: bold;
        text-align: center;
        margin: 24px 0;
        margin: 20px 0 12px;
        letter-spacing: 0.5px;
        line-height: 2.5;
        text-align: center;
      }

      a {
        color: #3caaff;
        font-size: ${fontSize * 0.8}px; /* Font boyutu ile orantılı olsun */
        vertical-align: super;
        line-height: 18px;
        text-decoration: underline;
        pointer-events: auto; /* Tıklanabilir olduğundan emin olalım */
      }
      center + hr {
      display: none;
      }
      br + br { display: none; }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="content">
        <div class="page">${chapter}</div>
      </div>
    </div>

    <script>
      const container = document.getElementById('container');
      
      // --- Link Tıklama Mantığı ---
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault(); // Sayfanın zıplamasını engelle
          e.stopPropagation(); // Bu tıklamanın body click'e gitmesini engelle

          const targetId = this.getAttribute('href').substring(1);
          const targetEl = document.getElementById(targetId);

          if (targetEl) {
             document.querySelector('.page').scrollTo({
              top: targetEl.offsetTop - 20,
              behavior: 'smooth'
            });
          }
        });
      });

      document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault(); // Tarayıcının gitmesini engelle
          e.stopPropagation(); // Body click'i tetikleme

          const href = this.getAttribute('href');
          
          if (href && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'linkClick',
              href: href
            }));
          }
        });
      });

      // Normal Body Tıklaması (Sayfa Değiştirme için)
      document.addEventListener('click', function(e) {
        // Linke tıklandıysa yukarıdaki listener çalışır, burası çalışmasın
        if (e.target.closest('a')) return;

        const clickData = {
          type: 'bodyClick',
          x: e.clientX,
          width: (container && container.clientWidth) ? container.clientWidth : window.innerWidth
        };
        
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(clickData));
        }
      });

      // Boş paragrafları gizle
      document.querySelectorAll('p').forEach(p => {
        const text = p.textContent.replace(/\\u00A0/g, '').trim();
        if (text === '') {
          p.style.display = 'none';
        }
      });
    </script>
  </body>
</html>
`;
