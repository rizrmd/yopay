import { FC } from "react";

export const ImgThumb: FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & { thumbWidth?: number; w?: number; h?: number; url?: string }
> = (arg) => {
  const w = arg.thumbWidth || arg.w;
  const h = arg.h;
  let src = arg.src || arg.url;
  if (w && typeof src === "string") {
    if (!src.startsWith("http")) {
      src = siteurl(src);
    }

    const url = new URL(src);
    if (url.pathname.startsWith("/_file")) {
      url.pathname = `/_img${url.pathname.substring(6)}`;
    }
    src = url.toString() + `?w=${w}`;
  }

  try {
    delete arg.src;
    delete arg.url;
    delete arg.w;
    delete arg.h;
    delete arg.thumbWidth;
  } catch (e) {}

  return <img {...arg} src={src} width={w} height={h} loading="lazy" />;
};
