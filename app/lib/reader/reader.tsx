import type { NavItem, Rendition } from "epubjs";
import { Spinner } from "lib/comps/ui/field-loading";
import { useLocal } from "lib/utils/use-local";
import { useEffect, useRef, useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { validate } from "uuid";
import { product } from "../../../typings/prisma";
import { ReaderTop } from "./parts/raeder-top";

export const Reader = () => {
  const [location, setLocation] = useState<string | number>(0);
  const rendition = useRef<Rendition | undefined>(undefined);
  const toc = useRef<NavItem[]>([]);
  const local = useLocal({
    book: null as null | Partial<product>,
    chapter: "",
    page: <></>,
  });
  useEffect(() => {
    if (local.book?.id !== params.id && validate(params.id)) {
      db.product
        .findFirst({
          where: {
            id: params.id,
          },
        })
        .then((book) => {
          local.book = book;
          local.render();
        });
    } else {
      alert("Invalid Book");
      navigate("/download/_");
    }
  }, [params.id]);

  if (!local.book)
    return (
      <div className="c-flex c-items-center c-justify-center c-flex-1 w-full">
        <Spinner className="mr-1" />
        Loading Book
      </div>
    );

  return (
    <div
      className={cx(
        "c-flex c-flex-col c-items-stretch c-w-full c-h-full c-relative"
      )}
    >
      <style
        dangerouslySetInnerHTML={{ __html: `body { overflow:hidden; }` }}
      ></style>
      <ReaderTop left={local.chapter} right={local.page} />
      <ReactReader
        url="https://raw.githubusercontent.com/altmshfkgudtjr/react-epub-viewer/refs/heads/main/public/files/Alices%20Adventures%20in%20Wonderland.epub"
        location={location}
        showToc={false}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition;
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
        tocChanged={(_toc) => (toc.current = _toc)}
        locationChanged={(loc: string) => {
          setLocation(loc);
          if (rendition.current && toc.current) {
            const { displayed, href } = rendition.current.location.start;
            const chapter = toc.current.find((item) => item.href === href);
            local.page = (
              <>
                <sup>{displayed.page}</sup>/<sub>{displayed.total}</sub>
              </>
            );
            local.chapter = chapter ? chapter.label : "Alice in Wonderland";
            local.render();
          }
        }}
      />
    </div>
  );
};
