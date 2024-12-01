import { createElement } from "react";
import { LandingPage } from "./render";

export const LandingSection = ({
  item,
  preview,
}: {
  item: LandingPage["landing_items"][number];
  preview: boolean;
}) => {
  const content = (
    <>
      <img
        src={img_url(item.img_file, preview)}
        draggable={false}
        className={cx(
          item.color &&
            css`
              background: ${item.color};
            `
        )}
      />
      {item.desc &&
        createElement(item.tag || "p", {
          children: item.desc,
          className: "desc",
        })}
    </>
  );

  if (item.link_to) {
    return (
      <a
        href={item.link_to}
        className={css`
          display: flex;
          img {
            width: 100%;
          }
        `}
      >
        {content}
      </a>
    );
  }
  return content;
};

const img_url = (src: string, preview: boolean) => {
  return (
    `https://beta.esensi.online/` +
    src.replace(`_file/`, `_img/`) +
    `?w=${preview ? 240 : 500}`
  );
};
