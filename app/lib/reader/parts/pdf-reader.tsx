import { PDFDocumentProxy } from "pdfjs-dist";
import { FC, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { FixedSizeList } from "react-window";
import { Loading } from "../../../../internal";
import { readerSettings } from "./reader-settings";
import { useLocal } from "lib/utils/use-local";

// Configure PDF.js worker
if (
  location.hostname === "esensi.online" ||
  location.hostname === "localhost"
) {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
} else {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export const PDFSettings = () => {
  return <div className="c-w-[200px] c-h-[200px]">PDF Settings</div>;
};

export const PDFReader: FC<{
  url: string;
  mode?: "scroll" | "swipe";
  scale?: number;
  currentPage: number;
  onPageChanged: (page: number) => void;
}> = ({ url, mode, scale, currentPage, onPageChanged }) => {
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const { width, height, ref } = useResizeDetector<HTMLDivElement>();
  const local = useLocal({
    links: {} as Record<string, any>,
    pdf: null as unknown as PDFDocumentProxy,
  });
  const outerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Reset states when URL changes
    setError(null);
    setNumPages(null);
  }, [url]);

  const onDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
    const { numPages } = pdf;
    local.pdf = pdf;
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(`Failed to load PDF. Please check the URL and try again.`);
    console.error("PDF load error:", error);
  };
  const { bg, text } = readerSettings.bg.apply();

  const loading = (
    <div
      className={cx(
        `c-flex-1 c-flex c-flex-col c-items-center c-justify-center c-pointer-events-none`,
        css`
          font-family: ArialMT;
          background-color: ${bg};
          position: fixed;
          inset: 0;
          top: 80px;
          width: 100vw;
          height: calc(100vh - 80px);
        `
      )}
    >
      <Loading />
    </div>
  );

  return (
    <div
      ref={ref}
      className={cx(
        "c-flex c-flex-1 c-overflow-auto c-overflow-x-hidden c-relative",
        css`
          background-color: ${bg};
          > .pdf {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: stretch;
            flex-direction: column;
          }
        `
      )}
    >
      {error ? (
        <div className="c-text-red-500">{error}</div>
      ) : (
        <>
          {width && height && (
            <Document
              file={url}
              className={cx(
                css`
                  width: ${width}px;
                  height: ${height}px;
                `,
                "pdf"
              )}
              onLoadSuccess={onDocumentLoadSuccess as any}
              onLoadError={onDocumentLoadError}
              loading={loading}
            >
              {mode === "scroll" ? (
                <>
                  {width && height && numPages && (
                    <FixedSizeList
                      height={height}
                      itemCount={numPages}
                      width={width}
                      itemSize={height}
                      outerRef={outerRef}
                      initialScrollOffset={currentPage * height}
                      onScroll={(e) => {
                        readerSettings.page.current = e.scrollOffset / height;
                        readerSettings.page.save();
                      }}
                    >
                      {({ index, style }) => {
                        return (
                          <div
                            style={style}
                            className={css`
                              text-align: center;
                              position: relative;
                              overflow: hidden;
                              display: flex;
                              align-items: center;
                            `}
                            key={`page_${index + 1}`}
                          >
                            <Page
                              pageNumber={index + 1}
                              className={cx(
                                width &&
                                  css`
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100%;
                                    margin-left: ${((((scale || 100) / 100 -
                                      1) *
                                      width) /
                                      2) *
                                    -1}px;
                                  `
                              )}
                              canvasBackground={bg}
                              scale={scale ? scale / 100 : undefined}
                              loading={<></>}
                              onClick={async (e) => {
                                if (e.target instanceof HTMLAnchorElement) {
                                  const id =
                                    e.target.getAttribute("data-element-id");
                                  const dest = local.links[id];

                                  if (dest) {
                                    const ls = (window as any).pdfLinkService;
                                    const pageIndex =
                                      await local.pdf.getPageIndex(dest[0]);
                                    if (pageIndex) {
                                      outerRef.current?.scrollTo({
                                        top: pageIndex * height,
                                        behavior: "instant",
                                      });
                                    }
                                  }
                                }
                              }}
                              onGetAnnotationsSuccess={(ann) => {
                                if (ann?.length > 0) {
                                  for (const a of ann) {
                                    if (a.dest) {
                                      local.links[a.id] = a.dest;
                                    }
                                  }
                                }
                              }}
                            />
                          </div>
                        );
                      }}
                    </FixedSizeList>
                  )}
                </>
              ) : (
                <>
                  {typeof numPages !== "number" || typeof width !== "number" ? (
                    loading
                  ) : (
                    <div
                      className={cx(css`
                        width: ${width}px;
                        height: ${height}px;
                        .container {
                          scroll-snap-type: x mandatory;
                          box-sizing: border-box;
                          .item {
                            scroll-snap-align: center;
                            scroll-snap-stop: always;
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                            display: flex;
                            align-items: center;
                            margin-top: -30px;
                          }
                        }
                      `)}
                    >
                      {width && height && numPages && (
                        <FixedSizeList
                          height={height}
                          itemCount={numPages}
                          width={width}
                          itemSize={width}
                          layout="horizontal"
                          className="container"
                          initialScrollOffset={currentPage * width}
                          outerRef={outerRef}
                          onScroll={(e) => {
                            readerSettings.page.current =
                              e.scrollOffset / width;
                            readerSettings.page.save();
                          }}
                        >
                          {({ index, style }) => {
                            const widthAdd =
                              (((scale || 100) / 100 - 1) * width) / 2;
                            return (
                              <div
                                style={style}
                                key={`page_${index + 1}`}
                                className="item"
                              >
                                <Page
                                  pageNumber={index + 1}
                                  canvasBackground={bg}
                                  width={width}
                                  className={cx(css`
                                    margin-left: ${widthAdd * -1}px;
                                  `)}
                                  scale={scale ? scale / 100 : undefined}
                                  loading={<></>}
                                  onClick={async (e) => {
                                    if (e.target instanceof HTMLAnchorElement) {
                                      const id =
                                        e.target.getAttribute(
                                          "data-element-id"
                                        );
                                      const dest = local.links[id];

                                      if (dest) {
                                        const ls = (window as any)
                                          .pdfLinkService;
                                        const pageIndex =
                                          await local.pdf.getPageIndex(dest[0]);
                                        const el = outerRef.current;
                                        if (pageIndex && el) {
                                          el.style.scrollSnapType = "none";

                                          el.scrollTo({
                                            left: pageIndex * width,
                                            behavior: "instant",
                                          });
                                          setTimeout(() => {
                                            el.style.scrollSnapType = "";
                                          }, 300);
                                        }
                                      }
                                    }
                                  }}
                                  onGetAnnotationsSuccess={(ann) => {
                                    if (ann?.length > 0) {
                                      for (const a of ann) {
                                        if (a.dest) {
                                          local.links[a.id] = a.dest;
                                        }
                                      }
                                    }
                                  }}
                                />
                              </div>
                            );
                          }}
                        </FixedSizeList>
                      )}
                    </div>
                  )}
                </>
              )}
            </Document>
          )}
        </>
      )}
    </div>
  );
};
