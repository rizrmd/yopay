import { renderToString } from "react-dom/server";
import { LandingSection } from "./section";
import { extractCss } from "goober";

export const pixelId = "960408691867202";

export type LandingPage = {
  id: string;
  slug: string;
  status: string;
  title: string;
  landing_items: {
    desc: string;
    img_file: string;
    tag: string;
    color: string;
    link_to: string;
  }[];
};

export const renderLanding = (page: LandingPage, preview?: boolean) => {
  const content = renderToString(
    <body
      className={cx(
        css`
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          margin: 0;

          .desc {
            position: absolute;
            overflow: hidden;
            width: 0;
            height: 0;
            top: 0;
            left: 0;
          }
        `
      )}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;

          @media (min-width: 1280px) {
            width: ${preview ? 240 : 500}px;
            top: 0px;
            overflow-x: hidden;
            overflow-y: auto;
            bottom: 0px;
            contain: content;
          }
          @media (max-width: 1279px) {
            left: 0px;
            right: 0px;
            top: 0px;
            bottom: 0px;
            overflow-y: auto;
          }

          img {
            width: 100%;
            max-width: ${preview ? 240 : 500}px;
          }
        `}
      >
        {page.landing_items.map((e, idx) => {
          return (
            <LandingSection key={idx} item={e} preview={preview || false} />
          );
        })}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
let session = null;
try {
  session = JSON.parse(localStorage.getItem("esensi-ses"));
} catch (e) {};
`,
        }}
      ></script>
    </body>
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <style id="_goober">${extractCss()}</style>
  ${fbPixelScript()}
</head>
${content}
</html>`;
};

export const fbPixelScript = () => {
  return `
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${pixelId}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->`;
};
