import { Spinner } from "lib/comps/ui/field-loading";
import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { validate } from "uuid";
import { product } from "../../../typings/prisma";
import { PDFReader } from "./parts/pdf-reader";
import { readerSettings } from "./parts/reader-settings";
import { ReaderTop } from "./parts/reader-top";

// const epub_link =  "https://raw.githubusercontent.com/altmshfkgudtjr/react-epub-viewer/refs/heads/main/public/files/Alices%20Adventures%20in%20Wonderland.epub"

type ChildFn = (arg: {
  font: { current: number; increase: () => void; decrease: () => void };
}) => ReactNode;

export const Reader: FC<{
  children: [ChildFn] | ChildFn;
}> = ({ children }) => {
  const local = useLocal({
    product: null as null | Partial<product>,
    link: {
      pdf: "",
      epub: "",
    },
    setting: false,
  });
  readerSettings.render = local.render;
  useEffect(() => {
    if (local.product?.id !== params.id && validate(params.id)) {
      db.product
        .findFirst({
          where: {
            id: params.id,
          },
        })
        .then((book) => {
          local.product = book;

          if (book) {
            try {
              const files = JSON.parse(book.product_file) as string[];
              const epub = files.find((e) => e.endsWith(".epub"));
              const pdf = files.find((e) => e.endsWith(".pdf"));
              if (epub) {
                local.link.epub = siteurl(epub);
              } else if (pdf) {
                local.link.pdf = siteurl(pdf);
              }
            } catch (e) {}
          }
          readerSettings.page.load(params.id);

          local.render();
        });
    }
  }, [params.id]);

  if (!local.link)
    return (
      <div className="c-flex c-items-center c-justify-center c-flex-1 w-full">
        <Spinner className="mr-1" />
        Loading Book
      </div>
    );

  return (
    <>
      {(readerSettings.show || isEditor) && (
        <>
          {Array.isArray(children)
            ? children[0](readerSettings)
            : children(readerSettings)}
        </>
      )}
      <div
        className={cx(
          "c-flex c-flex-col c-items-stretch c-w-full c-h-full c-relative"
        )}
      >
        <ReaderTop
          left={
            <div
              className={cx(
                "c-self-stretch c-flex c-items-center",
                css`
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `
              )}
            >
              {local.product?.name?.substring(0, 30)}...
            </div>
          }
          right={
            <div
              className="c-items-center c-flex c-justify-center c-self-stretch"
              onClick={() => {
                readerSettings.show = true;
                local.render();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="lucide lucide-list-todo-icon lucide-list-todo"
                viewBox="0 0 24 24"
              >
                <rect width="6" height="6" x="3" y="5" rx="1"></rect>
                <path d="m3 17 2 2 4-4M13 6h8M13 12h8M13 18h8"></path>
              </svg>
            </div>
          }
        />
        {local.link.pdf ? (
          <PDFReader
            scale={readerSettings.font.current}
            url={local.link.pdf}
            currentPage={readerSettings.page.current}
            onPageChanged={(page) => {
              readerSettings.page.current = page;
              local.render();
            }}
            mode={readerSettings.mode}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
