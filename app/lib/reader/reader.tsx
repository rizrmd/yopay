import type { NavItem, Rendition } from "epubjs";
import { Popover } from "lib/comps/custom/Popover";
import { Spinner } from "lib/comps/ui/field-loading";
import { useLocal } from "lib/utils/use-local";
import { useEffect, useRef } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { validate } from "uuid";
import { product } from "../../../typings/prisma";
import { ReaderTop } from "./parts/reader-top";

const epub_link =
  location.pathname.indexOf("alice") > 0
    ? "https://raw.githubusercontent.com/altmshfkgudtjr/react-epub-viewer/refs/heads/main/public/files/Alices%20Adventures%20in%20Wonderland.epub"
    : `https://prasi.avolut.com/prod/bf706e40-2a3a-4148-9cdd-75d4483328d7/coba.epub`;

// const epub_link =  "https://raw.githubusercontent.com/altmshfkgudtjr/react-epub-viewer/refs/heads/main/public/files/Alices%20Adventures%20in%20Wonderland.epub"

export const Reader = () => {
  const rendition = useRef<Rendition | undefined>(undefined);
  const toc = useRef<NavItem[]>([]);
  const { displayed, href } = rendition.current?.location.start || {
    displayed: { page: 0, total: 0 },
    href: "",
  };

  const local = useLocal({
    book: null as null | Partial<product>,
    link: "",
    chapter: "",
    show_toc: false,
    page: <></>,
    location: 0 as string | number,
    slider: { value: 0, timeout: null as any },
    async reloadMeta() {
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
        local.slider.value = displayed.page;
        const chapter = toc.current.find((item) => item.href === href);
        local.page = (
          <>
            <sup className="c-whitespace-nowrap">{displayed.page}</sup>
            <div>/</div>
            <sub className="c-whitespace-nowrap">{displayed.total}</sub>
          </>
        );
        local.chapter = chapter ? chapter.label : "Alice in Wonderland";
        local.render();
      }
    },
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

          if (book) {
            try {
              const file = (JSON.parse(book.product_file) as string[]).find(
                (e) => e.includes(".epub")
              );
              if (file) {
                local.link = siteurl(file);
              }
            } catch (e) {}
          }
          if (!local.link) {
            local.link = epub_link;
          }

          local.render();
        });
    } else {
      if (!isEditor) {
        local.link = epub_link;

        local.render();
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (local.link) {
      const savedPage = localStorage.getItem(`readerPage_${local.link}`);
      if (savedPage) {
        local.location = savedPage;
        local.render();
        local.reloadMeta();
      }
    } else {
      local.reloadMeta();
    }
  }, [local.link]);

  if (!local.link)
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
      {local.show_toc && (
        <div className="absolute z-10 left-0 top-0 w-64 h-full bg-white border-r shadow-lg p-4 overflow-auto">
          {toc.current.map((item, idx) => (
            <div
              key={idx}
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                rendition.current?.display(item.href);
                local.show_toc = false;
                local.render();
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      <ReaderTop
        left={
          <div
            onClick={() => {
              local.show_toc = true;
              local.render();
            }}
            className="cursor-pointer flex items-center"
          >
            {local.show_toc ? "Daftar Isi" : local.chapter}
          </div>
        }
        right={
          <Popover
            content={
              <div className="flex flex-col gap-2 p-3">
                <div className="text-center mb-2">
                  Page {local.slider.value || 1} of{" "}
                  {rendition.current?.location.start.displayed.total || 1}
                </div>
                <input
                  type="range"
                  min={1}
                  max={displayed.total}
                  value={local.slider.value}
                  onChange={(e) => {
                    local.slider.value = parseInt(e.currentTarget.value);
                    local.render();

                    clearTimeout(local.slider.timeout);
                    local.slider.timeout = setTimeout(() => {
                      const direction =
                        local.slider.value > displayed.page ? "next" : "prev";

                      for (
                        let i = 0;
                        i < Math.abs(local.slider.value - displayed.page);
                        i++
                      ) {
                        if (direction === "next") {
                          rendition.current?.next();
                        } else {
                          rendition.current?.prev();
                        }
                      }
                    }, 500);
                  }}
                  className="w-full min-w-[200px]"
                />
              </div>
            }
          >
            <div className="px-2 cursor-pointer flex items-center">
              {local.page}
            </div>
          </Popover>
        }
      />
      <ReactReader
        url={local.link}
        location={local.location}
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
          local.location = loc;
          local.render();
          localStorage.setItem(`readerPage_${local.link}`, loc);
          local.reloadMeta();
        }}
      />
    </div>
  );
};
