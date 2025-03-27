import type { NavItem, Rendition } from "epubjs";
import { useRef } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";

type EpubReaderProps = {
  url: string;
  location: string | number;
  onLocationChanged: (loc: string) => void;
  onRendition: (rendition: Rendition) => void;
  onTocChanged: (toc: NavItem[]) => void;
  onChapterUpdate: (chapter: string) => void;
  onPageUpdate: (page: number, total: number) => void;
};

export const EpubReader = ({
  url,
  location,
  onLocationChanged,
  onRendition,
  onTocChanged,
  onChapterUpdate,
  onPageUpdate,
}: EpubReaderProps) => {
  const rendition = useRef<Rendition | undefined>(undefined);
  const toc = useRef<NavItem[]>([]);

  const reloadMeta = async () => {
    if (!rendition.current || !toc.current) {
      await new Promise<void>((done) => {
        const ival = setInterval(() => {
          if (rendition.current?.location && toc.current) {
            clearInterval(ival);
            done();
          }
        }, 100);
      });
    }
    if (rendition.current && toc.current) {
      const { displayed, href } = rendition.current.location.start || {
        displayed: { page: 0, total: 0 },
        href: "",
      };
      onPageUpdate(displayed.page, displayed.total);
      const chapter = toc.current.find((item) => item.href === href);
      onChapterUpdate(chapter ? chapter.label : "Alice in Wonderland");
    }
  };

  return (
    <ReactReader
      url={url}
      location={location}
      showToc={false}
      getRendition={(rend: Rendition) => {
        rendition.current = rend;
        onRendition(rend);
      }}
      epubOptions={{ allowScriptedContent: true, allowPopups: true }}
      readerStyles={{
        ...ReactReaderStyle,
        next: {
          right: 1,
          bottom: 0,
          top: 0,
          width: "50%",
          opacity: 0,
        },
        prev: {
          opacity: 0,
          left: 1,
          bottom: 0,
          top: 0,
          width: "50%",
        },
        reader: {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
      }}
      isRTL={false}
      tocChanged={(tocItems) => {
        toc.current = tocItems;
        onTocChanged(tocItems);
      }}
      locationChanged={(loc: string) => {
        onLocationChanged(loc);
        reloadMeta();
      }}
    />
  );
};
