import { UserData } from "app/lib/bizpro/session";
import { handleLanding, reloadLanding } from "app/server/landing";
import { fbPixelScript } from "app/server/landing/render";
import { router } from "app/server/router";
import { useServerRouter } from "lib/server/server-route";
import { g } from "lib/server/utils/dir";
import { join } from "path";
import {
  initSessionServer,
  SessionServerHandler,
} from "lib/session/server-session";
import { validate } from "uuid";

export const server: PrasiServer = {
  async init() {
    reloadLanding();
    initSessionServer<UserData>(this, {
      router: useServerRouter(router),
    });
    console.log("Esensi Online: Started", Date.now());
  },
  async http(arg) {
    const { req, url, } = arg;
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
            `https://beta.esensi.online/${files[0].replace(
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
          return html.replace("</head>", `${fbPixelScript()}</head>`);
        }
        return body;
      },
    });
  },
};
