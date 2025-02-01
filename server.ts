import { UserData } from "app/lib/bizpro/session";
import { handleLanding, reloadLanding } from "app/server/landing";
import { fbPixelScript } from "app/server/landing/render";
import { microTag, reloadSlugs, slugs } from "app/server/micro-tag";
import { router } from "app/server/router";
import { useServerRouter } from "lib/server/server-route";
import {
  initSessionServer,
  SessionServerHandler,
} from "lib/session/server-session";
import { basename } from "path";
import { validate } from "uuid";
import mime from "mime";
import snakeCase from "lodash.snakecase";

const links = new Set<string>();

export const server: PrasiServer = {
  async init() {
    reloadLanding();
    reloadSlugs();
    initSessionServer<UserData>(this, {
      router: useServerRouter(router),
    });
    console.log("Esensi Online: Started", Date.now());
  },
  async http(arg) {
    const { req, url } = arg;

    if (url.pathname.startsWith("/api/send-wa")) {
      const [{ uid, msg }] = await req.json();
      if (!links.has(msg)) {
        links.add(msg);
        const formData = new FormData();
        formData.append("target", uid);
        formData.append("message", msg);
        await fetch("https://api.fonnte.com/send", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "KTjWCiAsBZz8hKW8VZGm",
          },
        });
      }
      return new Response("OK");
    }

    const landing = handleLanding(arg);

    if (landing) {
      return landing;
    }

    if (url.pathname.startsWith(`/product-img/`)) {
      const id = url.pathname.substring("/product-img/".length);
      if (validate(id)) {
        const res = await db.product.findFirst({
          where: { id },
          select: { img_file: true },
        });

        const files = JSON.parse(res?.img_file || "[]");
        if (files[0]) {
          const search = req.url.split("?").pop();
          const res = await fetch(
            `https://esensi.online/${files[0].replace(
              `_file`,
              "_img"
            )}?${search}`
          );
          return new Response(await res.arrayBuffer(), {
            headers: { ...res.headers, "content-encoding": undefined },
          });
        }
        return new Response("", { status: 404 });
      }
    }

    if (url.pathname.startsWith("/dlp/")) {
      const id = url.pathname.substring("/dlp/".length);
      const dl = await db.t_sales_download.findFirst({
        where: { id },
        select: { product: { select: { product_file: true } } },
      });

      if (!dl) {
        
      }


      if (dl?.product.product_file) {
        const rpath = JSON.parse(dl.product.product_file)[0].replace(
          "_file/",
          ""
        );
        const g = global as any;
        const path = `${process.cwd()}/${g.datadir}/files/${rpath}`;
        const file = Bun.file(path);

        const ctype = mime.getType(path);
        return new Response(file, {
          headers: {
            "content-disposition": `inline; filename="${snakeCase(
              basename(rpath)
            )}"`,
            "content-type": ctype || "application/octet-stream",
          },
        });
      }

      return new Response(JSON.stringify(dl));
    }

    if (url.pathname.startsWith("/reload-landing/")) {
      const id = url.pathname.substring("/reload-landing/".length);
      if (validate(id)) {
        reloadLanding(id);
      }
      return new Response("ok");
    }

    const session_handler = this.session as SessionServerHandler;
    return await session_handler.handle(arg, {
      rewrite({ headers, body }) {
        if (headers?.["content-type"] === "text/html") {
          let html = body as string;

          if (
            url.pathname.startsWith("/product/") ||
            url.pathname.startsWith("/bundle/")
          ) {
            const pathname = url.pathname.split("/").pop();
            if (pathname && slugs[pathname]) {
              const { title, desc, price, category, cover, sku } =
                slugs[pathname];
              const meta = `
      <meta property="og:title" content="${title}"/> 
      <meta property="og:description" content="${desc}"/>
      <meta property="og:url" content="https://esensi.online${url.pathname}"/>
      <meta property="og:type" content="product"/>
      <meta property="product:brand" content="Esensi Online">
      <meta property="product:availability" content="in stock">
      <meta property="product:condition" content="new">
      <meta property="product:price:amount" content="${price}">
      <meta property="product:price:currency" content="IDR">
      <meta property="product:retailer_item_id" content="${sku}">
      <meta property="product:item_group_id" content="${category}">
      <meta property="og:image" content="https://esensi.online/${encodeURI(
        cover.replace("_file", "_img") + "?h=400"
      )}"/> 
      </head>`;
              html = html.replace("</head>", meta);
            }
          }

          return html.replace("</head>", `${fbPixelScript()}</head>`);
        }
        return body;
      },
    });
  },
};
