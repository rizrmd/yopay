import { css } from "goober";
import { ServerContext } from "lib/session/type";
import trim from "lodash.trim";
import { LandingPage, renderLanding } from "./landing/render";

const g = global as any;
g.css = css;

const landing = {} as Record<string, LandingPage>;
export const reloadLanding = async (id?: string) => {
  if (id) {
    const item = await db.landing.findFirst({
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        landing_items: {
          select: {
            img_file: true,
            desc: true,
            link_to: true,
            color: true,
            tag: true,
          },
          orderBy: { idx: "asc" },
        },
      },
      where: { id },
    });
    if (item) {
      landing[trim(item.slug, "/")] = item;
    }
    return;
  }

  const result = await db.landing.findMany({
    select: {
      id: true,
      slug: true,
      status: true,
      title: true,
      landing_items: {
        select: {
          img_file: true,
          desc: true,
          link_to: true,
          color: true,
          tag: true,
        },
        orderBy: { idx: "asc" },
      },
    },
  });
  for (const k of Object.keys(landing)) {
    delete landing[k];
  }
  for (const item of result) {
    landing[trim(item.slug, "/")] = item as any;
  }
};
export const handleLanding = ({
  url,
  req,
}: ServerContext): undefined | Response => {
  const pathname = trim(url.pathname, "/");

  if (landing[pathname]) {
    return new Response(
      renderLanding(landing[pathname], req.url.endsWith("-preview")),
      {
        headers: { "content-type": "text/html" },
      }
    );
  }

  return undefined;
};

g.cx = (...classNames: any[]) => {
  const result: string[] = [];

  classNames
    .filter((e) => {
      if (e) {
        if (typeof e === "string" && e.trim()) return true;
        else return true;
      }
      return false;
    })
    .forEach((e) => {
      if (Array.isArray(e)) {
        for (const f of e) {
          if (typeof f === "string") {
            const trimmed = f.trim();
            if (trimmed) result.push(f.trim());
          }
        }
      } else if (typeof e === "string") {
        const trimmed = e.trim();
        if (trimmed) result.push(e.trim());
      }
    });
  return result.join(" ");
};
